title: Android架构组件（二）：LiveData
date: 2019-10-22
comments: true
categories: Android
tags:
- android架构组件
---

#### 前言
上篇文章我们分析了Lifecycle的使用和原理，相信我们已经学会了用**Lifecycle**将你所需的类添加声明周期管理，如果只是寥寥阅读也没关系，这里奉上（双膝跪地）上篇地址，[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)，方便大家进行回顾。

那么接下来我们就要学习第二个架构组件——**LiveData**，它是一个可观察的数据处理类，通过观察者模式，感知与其共生的其它组件的生命周期（例如：Activity，Fragment等），进而确保Livedata仅更新处于活跃状态下组件的观察者。

接下来我将和大家一起了解和使用这些组件。
系列文章也会收录到[我的博客（Power）](https://powerofandroid.com/)里，方便大家查阅。

<!-- more -->

#### LiveData是什么？
我们已经知道**Livedata**是一个可观察的数据处理类，它拥有以下几个特点：

* *数据可以被观察者订阅*
* *能够感知组件（activity，fragment，service）的生命周期*
* *只有观察者处于（STRATED、RESUMED）状态，Livedata才会认为其处于活跃状态*
下面我们来看下它的用法：
```java
public class MainActivity extends AppCompatActivity {
    private MutableLiveData<String> mLiveData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mLiveData = new MutableLiveData<>();
        mLiveData.observe(this, new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                Toast.makeText(MainActivity.this, "数据已更新：" + s, Toast.LENGTH_SHORT);
            }
        });
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        mLiveData.setValue("欢迎学习Livedata！");
    }
}
```
如你所见，Livedata其实就是一个存储数据的容器，每当容器里的数据发生变化，我们就可以从回调函数进行数据的操作。这很像我们控件的点击监听方法setOnclickListener();，其实点击事件的监听方法也是观察者模式，对于观察者来说，他并不关心数据是怎么来的，而是关心数据过来后如何处理。

#### LiveData优势有哪些？

1. **确保数据和UI保持统一。**
    Livedata遵循观察者模式，其相当于被观察者。当生命周期或数据发生变化时，Livedata会通知Observer对象，并更新UI。
2. **不会发生内存泄漏。**
    这要得益于我们上篇讲的架构组件——**Lifecycle**，观察者Livedata会绑定Lifecycle，并在其关联的组件生周期遭到销毁后进行自我处理。
    我们来观察下它的源码：
```java
@MainThread
public void observe(@NonNull LifecycleOwner owner, @NonNull     Observer<T> observer) {
    //LifecycleBoundObserver对象本质实现了lifecycle的LifecycleObserver接口，监听被观察者的状态改变
    LifecycleBoundObserver wrapper = new LifecycleBoundObserver(owner, observer);
    //下行代码的mObservers是Livedata为了管理每一个观察者对象创建的Map集合，并把每个观察者对象存进了集合
    ObserverWrapper existing = mObservers.putIfAbsent(observer, wrapper);
    ...
    //绑定生命周期
    owner.getLifecycle().addObserver(wrapper);
    }
```
首先，我们看到注解@MainThread知道，这个方法**必须运行在主线程中**。两个参数中第一个参数其实是Activity/Fragment被抽象成了**LifecycleOwner**，学过上篇文章的可以很好理解，第二个参数**Observer**其实就是观察后的回调。
其次，我们看内部的实现方法。**LifecycleBoundObserver**对象就是传入了这两个参数，它被包装成了另一个对象，在它的内部实现了**Lifecycle**组件中的**LifecycleObserver**接口，和activity的生命周期进行绑定，在发生改变时及时**更新Livedata**的状态变化。
```java
class LifecycleBoundObserver extends ObserverWrapper implements GenericLifecycleObserver {
    @NonNull final LifecycleOwner mOwner;

    LifecycleBoundObserver(@NonNull LifecycleOwner owner, Observer<T> observer) {
        super(observer);
        mOwner = owner;
    }
        
    //每当activity的生命周期发生变化时都会回调该方法
    @Override
    public void onStateChanged(LifecycleOwner source, Lifecycle.Event event) {
        if (mOwner.getLifecycle().getCurrentState() == DESTROYED) {
            removeObserver(mObserver);
            return;
        }
        //更新Livedata的活跃状态 shouldBeactive方法里会判断状态是否是START并返回boolean值
        activeStateChanged(shouldBeActive());
    }
    ...
}
```
这就解释了为什么**Livedata**为什么不会发生内存泄漏问题，因为它和activity/fragment绑定了生命周期，在页面销毁时及时释放了内存。

3. **数据始终保持最新状态。**
    如果activity的状态再次从非活跃状态转换到活跃状态时会接收最新的数据。例如，曾经在后台的activity再返回前台后立刻更新数据。

4. **适当的配置修改。** 例如旋转设备时activity重建后会立即更新数据。
#### 数据更新后如何通知到回调方法？
***Livedata*** 提供了两种方式供开发者更新数据，分别是 ***setvalue()*** 和 ***postValue()*** ；官方文档明确说明：***setValue()*** 方法必须在主线程调用，而 ***postValue()*** 更适合在子线程中进行调用（比如网络请求等）。
我们先来看下**setValue()** 方法的实现原理：
```java
@MainThread
protected void setValue(T value) {
    //如果在子线程中调用会抛出异常
    assertMainThread("setValue");
    //更新内容器中的数据，自增version，赋值data
    mVersion++;
    mData = value;
    //循环调度容器中的值
    dispatchingValue(null);
}

private void dispatchingValue(@Nullable ObserverWrapper initiator) {
    for (Iterator<Map.Entry<Observer<T>, ObserverWrapper>> iterator =
                        mObservers.iteratorWithAdditions(); iterator.hasNext(); ) {
         //逐一让容器里的所有观察者执行这个通知方法
         considerNotify(iterator.next().getValue());
    ...
}

//上文的代码块我们知道这个considerNotify方法的参数就是LifecycleBoundObserver对象，内部实现了状态的监听。（记忆不深刻的可以翻上去看一眼）
private void considerNotify(ObserverWrapper observer) {
    //如果观察者不处于活跃状态，直接return
    if (!observer.mActive) {
       return;
    }
    //再次检查状态，防止状态改变了但未收到通知
    if (!observer.shouldBeActive()) {
        observer.activeStateChanged(false);
        return;
    }
    //如果version小于之前的version，直接return
    if (observer.mLastVersion >= mVersion) {
        return;
    }
    observer.mLastVersion = mVersion;
    /*
     * 处于活跃状态时调用livedata.observe()的第二个参数Observer里的onchanged方法，
     * 把新赋值的data传过去，实现回调
     */
    observer.mObserver.onChanged((T) mData);
    }
```
通过setValue()的核心方法我们知道它是如何通知并进行回调的了。但通常情况下Android是不允许在子线程中更新UI的，但是**postValue()** 方法却可以在**子线程**中更新livedata的数据，并通知UI进行更新，这是如何实现的呢？
我们来看一下**postValue()** 的源码：
```java
protected void postValue(T value) {
    ArchTaskExecutor.getInstance().postToMainThread(mPostValueRunnable);
}

public void postToMainThread(Runnable runnable) {
    //获取主线程的looper，通过handle发送事件
    if (mMainHandler == null) {
        synchronized (mLock) {
            if (mMainHandler == null) {
                mMainHandler = new Handler(Looper.getMainLooper());
            }
        }
    }
    //发送事件后在Livedata中回调run方法
    mMainHandler.post(runnable);
}

private final Runnable mPostValueRunnable = new Runnable() {
    @Override
    public void run() {
        //其实post方法最终还是调用的set方法
        setValue((T) newValue);
    }
};
```
我们分析到这里，想必我们对Livedata的工作原理有了一些了解，那么我们继续来探索它更细节的地方和用法吧。
#### 更多探索
1. 我们知道**Livedata只有观察者处于STARTED和RESUMED状态**时，才会被认为是活跃状态，并更新相应数据和UI，这里我贴出大神[<却把青梅嗅>](https://juejin.im/post/5c25753af265da61561f5335)的图片
![livedata状态图解](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/livedata%E7%8A%B6%E6%80%81%E5%9B%BE1.png)
![](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/livedata%E7%8A%B6%E6%80%81%E5%9B%BE2.png)
从上述代码我们知道，livedata只收到了onStart，onResume，onPause这三个生命周期的回调，这是因为我们上述代码中有一个经常遇见的方法**shouldBeActive()** ，他的内部会进行比较compareTo，只有大于等于START状态才返回true，源码里我们发现只有STARTED和RESUME，否则直接return掉。
当然我们有时候碰见的需求要求**activity在后台时依然能够响应数据的变更**，那怎么办呢？不要慌，Livedata还提供了**observerForever()** 方法，在这种情况下，它能够响应到任何生命周期中数据的变更事件：
![observerForever回调周期](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/livedata%E7%8A%B6%E6%80%81%E5%9B%BE3.png)
observerForever()方法的源码也很巧妙，他的AlwaysActiveObserver继承自ObserverWrapper并重写了shoudlbeActive方法，并直接返回true，有兴趣的可以去源码里体验一下livedata的巧妙之处。

2. **将Livedata与Room一起使用**。其实Room数据存储库支持返回Livedata对象的可观察查询，毕竟是一个老父亲嘛，想象这几个架构组件相互之间的关联与合作可以更加高效的为我们提供更稳定，安全的环境。
当数据库更新时，Room 会生成更新 LiveData 对象所需的所有代码。在需要时，生成的代码会在后台线程上异步运行查询。此模式有助于使界面中显示的数据与存储在数据库中的数据保持同步。后续的文章中我们会详细介绍这两个组件之间的协作。

3. Livedata还有**更多的用法扩展**，我将会在后续的学习中不断的补充，把更好更优秀的方案和数据处理方式分享给大家。

#### 参考&感谢
[Android官方架构组件LiveData](https://juejin.im/post/5c53beaf51882562e27e5ad9#heading-1)

[玩Android](https://www.wanandroid.com/)

#### 总结
我们通过文章已经基本了解了Livedata的工作原理，通过观察者模式和生命周期的绑定，我们可以更高效便捷的对数据进行处理并在适当的时候更新UI。当然，Livedata还有许多的用法我还没有接触到，也希望和各位同学一起学习进步。
接下来我们会讲到Android架构的另一个组件**Viewmodel**，我相信学习完viewmodel以后，我们可以尝试把这三个组件串联起来，体会它们所带给我们极佳的代码体验。
当学习完所有的组件后，我们就开始尝试着去搭一款适合自己的MVVM框架，用于加深我们对Android架构组件的学习，从而做到学以致用。

#### Android架构组件系列文章
[我的博客（Power）](https://powerofandroid.com/)
[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)
[Android架构组件（二）：LiveData](https://www.jianshu.com/p/c13e240c9989)
[Android架构组件（三）：Viewmodel](https://www.jianshu.com/p/be3f7b4b9974)
[Android架构组件（四）：Room](https://www.jianshu.com/p/cf05150335df)

**感谢您的阅读和支持！**