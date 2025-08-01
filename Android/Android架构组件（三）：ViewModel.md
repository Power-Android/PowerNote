title: Android架构组件（三）：Viewmodel
date: 2019-10-24
comments: true
categories: Android
tags:

- android架构组件
---

#### 前言
上篇我们分析了Livedata的使用及原理，相信我们已经学会了使用Livedata来存储数据，并在观察者组件中实现回调方法，来动态更新UI数据。这里奉上（双膝已经跪烂了...）上两篇的地址：
[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)
[Android架构组件（二）：LiveData](https://www.jianshu.com/p/c13e240c9989)
方便大家进行查阅和回顾。

那么，接下来我们要学习我们的第三个架构组件——**Viewmodel**，我们从字面上理解，它肯定和view，model有关联，它是负责准备和管理UI组件（activity/fragment）相关的数据类，也就是说**Viewmodel**是用来**管理UI相关数据**的，同时**Viewmodel**还可以负责UI间**组件的通讯**。

<!-- more -->

#### Viewmodel是什么？
我们已经知道，**Viewmodel**有以下两点作用：
1. 用来管理数据（model）和UI组件（view）的数据类
2. 负责UI组件之间的通讯

- ***管理数据（model）和UI组件（view）的数据***
我们先来看一下它的基本使用：
```java
public class MyViewModel extends ViewModel {
    //如果不熟悉Livedata用法可以阅读上一篇博客
    private MutableLiveData<List<User>> users;
    public LiveData<List<User>> getUsers() {
        if (users == null) {
            users = new MutableLiveData<List<Users>>();
            loadUsers();
        }
        return users;
    }

    private void loadUsers() {
        // 异步调用获取用户列表
        ...
        users.setValue(data);
    }
}

public class MyActivity extends AppCompatActivity {
    public void onCreate(Bundle savedInstanceState) {
        MyViewModel model = ViewModelProviders.of(this).get(MyViewModel.class);
        model.getUsers().observe(this, users -> {
            // 更新 UI
        });
    }
}
```
用法很简单,
我们在**viewmodel**中定义一个livedata的集合，通过网络获取数据后，调用setValue方法通知观察者(UI)在活跃状态下时更新数据。
在activity中，我们**初始化viewmodel**拿到livedata并在他的onchanged()方法里做UI相关操作。
这里我们发现viewmodel做了一个中间人的角色，它管理着model与view之间相互关联的数据，这样我们就可以把数据相关（model）操作放到viewmodel中，把UI操作放到view中，完全由viewmodel管理，使model与view层完全解耦。

- ***负责UI间组件之间的通讯***
一个activity中的多个Fragment互相间通讯时很常见的需求，我们可以使用activity中的viewmodel来实现fragment之间数据的共享。
下面这个例子也很简单：
```java
//我们定义viewmodel并设置set，get方法
public class CommunicateViewModel extends ViewModel {
    private MutableLiveData<String> mNameLiveData;

    public LiveData<String> getName(){
        if (mNameLiveData == null) {
            mNameLiveData = new MutableLiveData<>();
        }
        return mNameLiveData;
    }

    public void setName(String name){
        if (mNameLiveData != null) {
            mNameLiveData.setValue(name);
        }
    }
}

//我们通过fragment1设置name的值
public class FragmentOne extends Fragment {
    private CommunicateViewModel mCommunicateViewModel;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mCommunicateViewModel = ViewModelProviders.of(getActivity()).get(CommunicateViewModel.class);
    }

    @OnClick(R.id.btn_set_name)
    void onViewClicked(View v){
        switch (v.getId()){
            case R.id.btn_set_name:
                mCommunicateViewModel.setName("Jane");
                break;
        }
    }
}

//在fragment2中我们通过同一个viewmodel拿到livedata并更新UI
public class FragmentTwo extends Fragment {
    private CommunicateViewModel mCommunicateViewModel;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mCommunicateViewModel = ViewModelProviders.of(getActivity()).get(CommunicateViewModel.class);
        mCommunicateViewModel.getName().observe(this, name -> mTvName.setText(name));
    }
}
```
上述代码我们知道了，两个fragment的是通过**同一个viewmodel**进行组件之间的通讯，这里值得注意的是两个fragment中初始化**viewmodel**时传入的都是**getActivity()** 这也就意味着他们传入的是同一个对象，如果不同，那么得到的将是两个viewmodel对象，也不会收到通知进行更新了。

这种组件间通讯的好处在于

- *activity不需要做任何事情*
- *fragment不需要知道彼此，而是通过viewmodel进行联系*

#### Viewmodel分析
我们先来看下它的声明周期图：
![viewmodel生命周期](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/viewmodel%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.png)
从上图我们分析得出，左侧表示Activity的生命周期状态，右侧绿色部分表示ViewModel的生命周期范围。当屏幕旋转的时候，Activity会被recreate，Activity会经过几个生命周期方法，但是这个时候ViewModel还是之前的对象，并没有被重新创建，只有当Activity的finish()方法被调用时，ViewModel.onCleared()方法会被调用，对象才会被销毁。这张图很好的描述了当Activity被recreate时，ViewModel的生命周期。

另外，有个注意的地方：**在ViewModel中不要持有Activity的引用**。为什么要注意这一点呢？从上面的图我们看到，当Activity被recreate时，ViewModel对象并没有被销毁，**如果Model持有Activity的引用时就可能会导致内存泄漏**。那如果你要使用到Context对象怎么办呢，ViewModel的子类AndroidViewModel为我们很好的解决了这一问题，我们稍后会分析。

我们再来看一下**viewmodel**的类图：
![viewmodel类图](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/viewmodel%E7%B1%BB%E5%9B%BE.png)
根据这张类图，我们来分析一下：

- **ViewModelProviders**是ViewModel工具类，该类提供了通过Fragment和Activity得到ViewModel的方法，而具体实现又是由ViewModelProvider实现的。
```java
@NonNull
@MainThread
public static ViewModelProvider of(@NonNull FragmentActivity activity,@Nullable Factory factory) {
    Application application = checkApplication(activity);
    if (factory == null) {
        factory = ViewModelProvider.AndroidViewModelFactory.getInstance(application);
    }
    //param1是ViewModelStore，param2是工厂类
    return new ViewModelProvider(ViewModelStores.of(activity), factory);
    }
//他在of()方法里初始化了ViewModelProvider里的工厂类AndroidViewModelFactory，并renturn了ViewModelProvider对象
//内部还有一些check方法用于检查Fragment是否Attached to Activity，Activity的Application对象是否为空等
```

- **ViewModelStores**是ViewModelStore的工厂方法类，它会关联Fragment，activity
上个代码片段我们看见它在of()方法里renturn时new了一个provider对象并通过ViewModelStores.of()得到stroe对象
```java

//ViewModelStores.of(activity)方法返回了ViewModelStore对象
return new ViewModelProvider(ViewModelStores.of(activity), factory);

public static ViewModelStore of(@NonNull FragmentActivity activity) {
    if (activity instanceof ViewModelStoreOwner) {
        return ((ViewModelStoreOwner) activity).getViewModelStore();
    }
    //我们看见这里有一个holderFragmentFor对象（HolderFragment）
    return holderFragmentFor(activity).getViewModelStore();
}

public HolderFragment() {
    //将这个方法设置为true就可以使当前Fragment在Activity重建时存活下来,如果不设置或者设置为false,当前Fragment会在Activity重建时同样发生重建,以至于被新建的对象所替代。
    setRetainInstance(true);
    //这样就解决了旋转屏幕时因为重建导致数据丢失的问题
}
//在HoldFragment中初始化了ViewModelStore用于在销毁时clear，释放掉viewmodel
private ViewModelStore mViewModelStore = new ViewModelStore();
@Override
    public void onDestroy() {
        super.onDestroy();
        mViewModelStore.clear();
    }

    @NonNull
    @Override
    public ViewModelStore getViewModelStore() {
        return mViewModelStore;
    }
```
- **ViewModelStore**是存储ViewModel的类，具体实现是通过HashMap来保存ViewModle对象。
```java

//viewmodelStroe用户存储Viewmodel，并提供set，get方法和clear方法
public class ViewModelStore {
    private final HashMap<String, ViewModel> mMap = new HashMap<>();

    final void put(String key, ViewModel viewModel) {
        ViewModel oldViewModel = mMap.put(key, viewModel);
        if (oldViewModel != null) {
            oldViewModel.onCleared();
        }
    }

    final ViewModel get(String key) {
        return mMap.get(key);
    }

    public final void clear() {
        for (ViewModel vm : mMap.values()) {
            //这里调用了viewmodel的onCleared()方法
            vm.onCleared();
        }
        mMap.clear();
    }
}
```
- **ViewModelProvider**是实现ViewModel创建、获取的工具类。在ViewModelProvider中定义了一个创建ViewModel的接口类——Factory。ViewModelProvider中有个ViewModelStore对象，用于存储ViewModel对象。
```java

//构造方法中我们传入了stroe和工厂类
public ViewModelProvider(@NonNull ViewModelStore store, @NonNull Factory factory) {
    mFactory = factory;
    this.mViewModelStore = store;
}
//我们使用的.get(modele.class)方法最终会调用这个get方法
public <T extends ViewModel> T get(@NonNull String key, @NonNull Class<T> modelClass) {
    //从map中获取model对象
    ViewModel viewModel = mViewModelStore.get(key);
    //判断是否是同一个对象？如果是return此viewmode
    if (modelClass.isInstance(viewModel)) {
        return (T) viewModel;
    } else {
        if (viewModel != null) {
            // TODO: log a warning.
        }
    }
    //如果不是则通过工厂类创建，然后缓存进stroe，并return
    viewModel = mFactory.create(modelClass);
    mViewModelStore.put(key, viewModel);
    return (T) viewModel;
}
```
好了，至此我们通过阅读源码，已经对viewmodel的工作原理有了一定的了解，那么们就来总结一下它如何通过一系列操作，来做到对view和model进行管理的。
```java
//1. 首先我们会在继承viewmodel的类中，做一些数据操作（初始化livedata），并提供set,get方法返回livedata对象。（代码省略...查看开头基本用法的代码块）
//2. 我们在view组件（activity/fragment）中拿到viewmodel对象
MyViewModel model = ViewModelProviders.of(this).get(MyViewModel.class);
//3. of()方法返回viewmodelprodiver对象
 public static ViewModelProvider of(@NonNull FragmentActivity activity,@Nullable Factory factory) {
    Application application = checkApplication(activity);
    if (factory == null) {
    //4. 在of方法里初始化ViewModelProvider中AndroidViewModelFactory对象
        factory = ViewModelProvider.AndroidViewModelFactory.getInstance(application);
    }
    //5. ViewModelProvider中传入ViewModelstore和factory对象
    return new ViewModelProvider(ViewModelStores.of(activity), factory);
    }
//6. 工厂类 ViewModelStores.of(activity)方法返回ViewModelStore对象
public static ViewModelStore of(@NonNull FragmentActivity activity) {
    if (activity instanceof ViewModelStoreOwner) {
        return ((ViewModelStoreOwner) activity).getViewModelStore();
    }
    //7.holderFragmentFor对象（HolderFragment）解决了屏幕旋转时数据保存。setRetainInstance(true);在里面初始化了ViewModelStore对象
    return holderFragmentFor(activity).getViewModelStore();
}
//8. 这时我们拿到了ViewModelProviders.of(this)返回的provider对象，然后调用get方法.get(MyViewModel.class);最终走到此get()方法
public <T extends ViewModel> T get(@NonNull String key, @NonNull Class<T> modelClass) {
    //从map中获取model对象
    ViewModel viewModel = mViewModelStore.get(key);
    //判断是否是同一个对象？如果是return此viewmode
    if (modelClass.isInstance(viewModel)) {
        return (T) viewModel;
    } else {
        if (viewModel != null) {
            // TODO: log a warning.
        }
    }
    //如果不是则通过工厂类创建，然后缓存进stroe，并return
    viewModel = mFactory.create(modelClass);
    mViewModelStore.put(key, viewModel);
    return (T) viewModel;
}
//9. 返回了viewmodel对象，通过viewmodel的get方法拿到livedata对象，并在ui组件处于活跃状态时更新UI
model.getUsers().observe(this, users -> {
            // 更新 UI
        });
```

#### 参考&感谢
[Android架构组件——ViewModel](https://www.jianshu.com/p/c729a086bd08)

[玩Android](https://www.wanandroid.com/)

#### 总结
**Viewmodel**的职责是为UI组件管理数据。规范化viewmodel的使用方式，不要在viewmodel层中持有UI层的引用，避免因viewmodel超长的生命周期，导致内存泄漏。实现UI组件和数据间的管理和解耦，才是这个框架带给我们的理解。
通过我们对源码的分析，它的功能并不复杂，但设计的十分巧妙，背后掺杂的思想和理念才是值得去反复揣度的。它可以更好的实现把业务代码下沉到viewmodel中实现，既保证了UI组件中代码的清爽，又可以实现对数据的管理。

**Viewmodel**可以用于activity中不同fragment之间的通信，也可以用作Fragment之间一种解耦方式。

接下来我们会讲到Android架构的另一个组件**Room**，来看下这个数据库能带给我们哪些惊艳？
当学习完所有的组件后，我们就开始尝试着去搭一款适合自己的MVVM框架，用于加深我们对Android架构组件的学习，从而做到学以致用。

#### Android架构组件系列文章
[我的博客（Power）](https://powerofandroid.com/)
[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)
[Android架构组件（二）：LiveData](https://www.jianshu.com/p/c13e240c9989)
[Android架构组件（三）：Viewmodel](https://www.jianshu.com/p/be3f7b4b9974)
[Android架构组件（四）：Room](https://www.jianshu.com/p/cf05150335df)

**感谢您的阅读和支持！**