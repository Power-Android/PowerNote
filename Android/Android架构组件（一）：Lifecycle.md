title: Android架构组件（一）：Lifecycle
date: 2019-10-18
comments: true
categories: Android
tags:
- android架构组件
---

#### 前言
谷歌在17年发布了Android架构组件1.0稳定版，用来帮助开发者们简化开发流程，并为App的开发架构提供指南。这次发布的架构包含了声明周期管理，数据持久性等提供了一系列库，并且该架构相互之间完美的融合到了一起，有助于我们使用更少的样板代码写出模块化的App。
他们包含：
1. **Lifecycle**（生命周期管理）
2. **LiviData**（基于观察者模式的可感知生命周期的数据持有类）
3. **Viewmodel**（将view和model分开的组件）
4. **Room**（简单强大的数据存储组件）

接下来我会用一系列文章和大家一起了解和使用这些组件。
系列文章也会收录到[我的博客（Power）](https://powerofandroid.com/)里，方便大家查阅。

<!-- more -->

好了，首先我们先来学习下基础组件：**Lifecycle**
#### 什么是Lifecycle？

在讲解之前，我们先来分析下没用该组件之前我们常用的MVP模式中，Presenter是如何绑定activity/Fragment的生命周期？
```java
//presenter
Public class Presenter{
    public void attachView(T view) {
        //do something
    }
    
    public void detachView() {
        //do something
    }
}
//activity
public class Activity extends AppCompatActivity{
    private Presenter presenter;

    public void onCreate(...) {
        presenter= new Presenter();
        presenter.attachView(this);
    }

    public void onDestroy() {
        super.onDestroy();
        presenter.detachView();
    }
}
```
相信大多数开发者对上述代码很清楚了，我们常把activity和prsenter的绑定和分离都写在了base基类里用于同步两者的生命周期。上述的代码并没有什么逻辑错误，不过接下来的Lifecycle会让生命周期管理变得更加丝滑~
```java
/*
 * presenter继承LifecycleObserver
 * 1.通过注解的方式实现Lifecycle的观察者方法
 */
Public class Presenter extends LifecycleObserver{
    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    void onAny(LifecycleOwner owner, Lifecycle.Event event) {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    void onCreate() {
        
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    void onDestroy() {

    }
}
/*
 * 在activity里添加Observer
 */
 public class Activity extends AppCompatActivity{
    private Presenter presenter;

    public void onCreate(...) {
        presenter= new Presenter();
        //2.添加LifecycleObserver实现同步
        getLifecycle().addObserver(presenter);
    }

    public void onDestroy() {
        super.onDestroy();
    }
}
```
通过上述代码我们了解到，presenter通过继承LifecycleObserver实现生命周期方法，并在activity/Fragment中addObserver()中传入presenter对象就可以绑定两者的生命周期了。而且Lifecycle提供了所有的生命周期事件，选择你所需要的生命周期并通过注解进行声明就可以了。
```java
    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    void onAny(LifecycleOwner owner, Lifecycle.Event event) {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    void onCreate() {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    void onDestroy() {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    void onStart() {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    void onStop() {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    void onResume() {

    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    void onPause() {

    }
```
那么，Lifecycle的工作原理是什么？我们继续分析。
#### Lifecycle的工作原理
我们先祭出一张整体架构图：
![lifecycle原理图](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/lifecycle%E5%8E%9F%E7%90%86%E5%9B%BE.png)

我们来看下大致的工作原理：

* **Lifecycle（生命周期）**：该抽象类提供了addOberserver，removeObser，getCurrentState抽象方法，生命周期的事件和状态的枚举类。
```java
public abstract class Lifecycle {
    @MainThread
    public abstract void addObserver(@NonNull LifecycleObserver observer);
    
    @MainThread
    public abstract void removeObserver(@NonNull LifecycleObserver observer);
    
    @MainThread
    @NonNull
    public abstract State getCurrentState();

    @SuppressWarnings("WeakerAccess")
    public enum Event {
        ON_CREATE,
        ON_START,
        ON_RESUME,
        ON_PAUSE,
        ON_STOP,
        ON_DESTROY,
        ON_ANY
    }

    @SuppressWarnings("WeakerAccess")
    public enum State {
        DESTROYED,
        INITIALIZED,
        CREATED,
        STARTED,
        RESUMED;

        public boolean isAtLeast(@NonNull State state) {
            return compareTo(state) >= 0;
        }
    }
}
```
* **LifecycleObserver接口（Lifecycle观察者）**：实现该接口的类，通过注解的方式，可以通过被LifecycleOwner类的addObserver(LifecycleObserver o)方法注册,被注册后，LifecycleObserver便可以观察到LifecycleOwner的生命周期事件。

* **LifecycleOwner接口（Lifecycle持有者）**：实现该接口的类持有生命周期(Lifecycle对象)，该接口的生命周期(Lifecycle对象)的改变会被其注册的观察者LifecycleObserver观察到并触发其对应的事件。
该接口提供了getLifecycle()方法返回Lifecycle对象
```java
@SuppressWarnings({"WeakerAccess", "unused"})
public interface LifecycleOwner {
    @NonNull
    Lifecycle getLifecycle();
}
```
activity继承的AppCompatActivity父类v4包里的FragmentActivity已经实现了该接口，
v4包里的fragment同理也替我们实现了LifecycleObserver接口。
```java
//AppCompatActivity继承自FragmentActivity继承自SupportActivity，该类里的getLifecycle()方法返回了lifecycle对象
public class FragmentActivity extends SupportActivity implements ViewModelStoreOwner, OnRequestPermissionsResultCallback, RequestPermissionsRequestCodeValidator {
    ...
    public Lifecycle getLifecycle() {
        return super.getLifecycle();
    }
}

public class SupportActivity extends Activity implements LifecycleOwner, Component {
    ...
    private LifecycleRegistry mLifecycleRegistry = new LifecycleRegistry(this);
    
    public Lifecycle getLifecycle() {
        return this.mLifecycleRegistry;
    }
}
//fragment同理，就不贴代码了，大家可以去源码里查看。
```
从上述的代码我们不难发现，**实现的getLifecycle()方法，实际上返回的是 LifecycleRegistry对象，LifecycleRegistry对象实际上继承了Lifecycle**
```java
public class LifecycleRegistry extends Lifecycle {
    ...
}
```
那么持有Lifecycle对象有什么作用呢？实际上Fragment已经给出了答案。在fragment的生命周期方法中LifecycleRegistry都会发送对应的生命周期事件给内部的handleLifecycleEvent()方法；
```java
public class Fragment implements xxx, LifecycleOwner {
    //...
    void performCreate(Bundle savedInstanceState) {
        onCreate(savedInstanceState);  //1.先执行生命周期方法
        //...
        //2.生命周期事件分发
                                   mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE);
    }

    void performStart() {
        onStart();
        //...
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START);
    }

    void performResume() {
         onResume();
        //...
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME);
    }

    void performPause() {
        //3.注意，调用顺序变了
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE);
        //...
        onPause();
    }

    void performStop() {
       mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP);
        //...
        onStop();
    }

    void performDestroy() {
        mLifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY);
        //...
        onDestroy();
    }
}
```
fragment把事件发送出去后，都做了什么事情？接下来我们来看下LifecycleRegistry内部的实现
```java
public class LifecycleRegistry extends Lifecycle {
    ...
    public void handleLifecycleEvent(@NonNull Lifecycle.Event event) {
        State next = getStateAfter(event);
        moveToState(next);
    }
    
    private void moveToState(State next) {
        ...
        sync();
    }
    
    private void sync() {
        ...
        //通过里边的backwardPass()和forwardPass()方法循环遍历
    }
    
    private void forwardPass(LifecycleOwner lifecycleOwner) {
        ...
        while (...) {
            ...
            ObserverWithState observer = entry.getValue();
            while (...) {
                //通知状态变化
                pushParentState(observer.mState);
                observer.dispatchEvent(lifecycleOwner,    upEvent(observer.mState));
                popParentState();
            }
        }
    }
}
```
通过代码我们了解到**handleLifecycleEvent**里通过getStateAfter()方法获取当前的状态，并且通过**moveToState()** 方法修改Lifecycle的状态值，紧接着遍历所有LifecycleObserver 并同步且通知其状态发生变化，因此就能触发已经实现LifecycleObserver接口的类中对应的生命周期事件。

现在是时候祭出  **Lifecycle时序图**  来更好的理解工作原理
![Lifecycle时序图](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/lifecycle%E6%97%B6%E5%BA%8F%E5%9B%BE.png)

***以上就是Lifecycle的基本工作原理，为缩短文章篇幅和可读性，文章里涉及的代码是源码的精简版，如若原理不详细，请移步源码阅读。***
![lifecycle目录结构](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/lifecycle%E6%BA%90%E7%A0%81%E7%9B%AE%E5%BD%95.png)

#### 参考&感谢
[Android官方架构组件Lifecycle:生命周期组件详解&原理分析](https://juejin.im/post/5c53beaf51882562e27e5ad9#heading-1)

[玩Android](https://www.wanandroid.com/)

#### 总结
我们通过文章已经基本了解了lifecycle的工作原理，并且利用lifecycle可以更好对一些事件进行生命周期的管理。其实lifecycle原生支持livedata（顾名思义，动态数据容器），所以我们下一篇的重点就是学习和分析livedata的用法和构造。
这几年在开发过程中一直使用MVP架构，并且项目结构变大以后非常多的接口类出现了，导致项目中很臃肿。也在不少博客中看到MMVM的架构的应用，但是对于许多架构了解不深刻，导致代码阅读很吃力，才有了系统学习Android架构的想法，并且计划学习完Android架构系列以后，试着搭建自己的MVVM框架，并逐渐延伸到组件化开发，从而做到真正的学以致用。

#### Android架构组件系列文章
[我的博客（Power）](https://powerofandroid.com/)
[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)
[Android架构组件（二）：LiveData](https://www.jianshu.com/p/c13e240c9989)
[Android架构组件（三）：Viewmodel](https://www.jianshu.com/p/be3f7b4b9974)
[Android架构组件（四）：Room](https://www.jianshu.com/p/cf05150335df)

**感谢您的阅读和支持！**