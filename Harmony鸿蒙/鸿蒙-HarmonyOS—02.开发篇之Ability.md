title: 鸿蒙-HarmonyOS—02.开发篇之Ability
date: 2020-12-21
comments: true
categories: 鸿蒙-HarmonyOS
tags:

- HarmonyOS

---

#### 前言

上一篇我们学习了Harmony的搭建及运行，这篇我们就进入开发知识阶段，编写代码前，我们需要了解HarmonyOS所涉及的新知识。

今天的文章我们主要介绍基础中的核心Ability，其中包含：

1. **应用基础知识**
2. **Ability概述**
3. **PageAbility**
4. **ServiceAbility**
5. **DataAbility**
6. **Intent**
7. **分布式任务调度**
8. **公共事件与通知**
9. **剪贴板**

文章篇幅略长，请耐心阅读，定会收益满满~~~

（PS：写到80%没存档，苦逼从头开始写，Ctrl+S要常按...）

<!-- more -->

#### 1.应用基础知识

- [x] APP
- [x] Ability
- [x] 库文件 libs
- [x] 资源文件 resources
- [x] 配置文件 config.json
- [x] pack.info
- [x] HAR

- **APP**

  HarmonyOS的应用软件包以**APP** **Pack**（Application Package）形式发布，它是由一个或多个**HAP**（HarmonyOS Ability Package）以及描述每个HAP属性的pack.info组成。HAP是[Ability](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/basic-fundamentals-0000000000041611#ZH-CN_TOPIC_0000001063248002__section121002188527)的部署包，HarmonyOS应用代码围绕Ability组件展开。

  我们可以把HAP理解为Android的module模块。

  ![APP组成](https://tva1.sinaimg.cn/large/0081Kckwly1glvmd2mzaqj30g809yt8u.jpg)

  一个HAP是由代码、资源、第三方库及应用配置文件组成的模块包，可分为entry和feature两种模块类型。

  - **entry**：应用的主模块。一个APP中，对于同一设备类型必须有且只有一个entry类型的HAP，可独立安装运行。
  - **feature**：应用的动态特性模块。一个APP可以包含一个或多个feature类型的HAP，也可以不含。只有包含Ability的HAP才能够独立运行。

- **Ability**

  Ability是应用所具备的能力的抽象，一个应用可以包含一个或多个Ability。

  Ability分为两种类型：FA（Feature Ability）和PA（Particle Ability）。

  FA/PA是应用的**基本组成单元**，能够实现特定的业务功能。

  **FA有UI界面，而PA无UI界面**。

  我们可以把它理解为一个**装有各种功能的能量罐**。例如PageAbility里边可以放入一个或多个AbilitySlice，而AbilitySlice就是所谓的能量碎片，它是Ability组成的单元，用于显示UI界面。这个稍后我们就会学习到。

- **库文件**

  库文件是应用依赖的第三方代码（例如so、jar、bin、har等二进制文件），存放在libs目录。

- **资源文件**

  应用的资源文件（字符串、图片、音频等）存放于resources目录下，便于开发者使用和维护。

- **配置文件**

  配置文件 (config.json) 是应用的Ability信息，用于声明应用的Ability，以及应用所需权限等信息。

- **pack.info**

  描述应用软件包中每个HAP的属性，由IDE编译生成，应用市场根据该文件进行拆包和HAP的分类存储。HAP的具体属性包括：

  - delivery-with-install: 表示该HAP是否支持随应用安装。“true”表示支持随应用安装；“false”表示不支持随应用安装。
  - name：HAP文件名。
  - module-type：模块类型，entry或feature。
  - device-type：表示支持该HAP运行的设备类型。

- **HAR**

  HAR（HarmonyOS Ability Resources）可以提供构建应用所需的所有内容，包括源代码、资源文件和config.json文件。HAR不同于HAP，HAR不能独立安装运行在设备上，只能作为应用模块的依赖项被引用。

#### 2. **Ability概述**

- [x] FA与PA
- [x] Page，Service，Data

Ability是应用所具备能力的抽象，也是应用程序的重要组成部分。我将它理解为一个**能量罐**，我们可以通过继承来获得不同的能力，也可以存储不同的**能量碎片（AbilitySlice）**。（在PageAbility中我们会详细讲到AbilitySlice）

一个应用可以具备多种能力（即可以包含多个Ability），HarmonyOS支持应用以Ability为单位进行部署。

Ability可以分为**FA（Feature Ability）和PA（Particle Ability）**两种类型，每种类型为开发者提供了不同的模板，以便实现不同的业务功能。

- FA支持

  **Page Ability**：

  Page模板是FA唯一支持的模板，用于提供与用户交互的能力。一个Page实例可以包含一组相关页面，每个页面用一个AbilitySlice实例表示。

- PA支持

  **Service Ability**和**Data Ability**：

  - Service模板：用于提供后台运行任务的能力。
  - Data模板：用于对外部提供统一的数据访问抽象。

在配置文件config.json中注册Ability时，可以通过配置Ability元素中的“type”属性来指定Ability模板类型，示例如下：

```java
{
    "module": {
        ...
        "abilities": [
            {
                ...
                "type": "page"
                ...
            }
        ]
        ...
    }
    ...
}
```

其中，“type”的取值可以为“page”、“service”或“data”，分别代表Page模板、Service模板、Data模板。为了便于表述，后文中我们将基于Page模板、Service模板、Data模板实现的Ability分别简称为**Page、Service、Data**。

#### 3.PageAbility

- [x] 基本概念

- [x] 声明周期

- [x] AbilitySlice间的导航

- [x] 跨设备迁移

- **基本概述**

  - [x] Page与AbilitySlice
  - [x] AbilitySlice路由的配置

  - **Page与AbilitySlice**

    PageAbility（以下简称“Page”）是FA唯一支持的模板，用于提供与用户交互的能力。

    一个Page可以由一个或多个**AbilitySlice**构成

    AbilitySlice是指应用的单个页面及其控制逻辑的总和。

    我将Ability理解为Page**能量罐**中的**能量碎片**（AbilitySlice）。

    当一个Page由多个AbilitySlice共同构成时，这些AbilitySlice页面提供的业务能力应具有高度相关性。

    例如我们在开发中常见的列表页和详情页，我们可以把这些具有关联性和逻辑密切的能量碎片放入同一个能量罐中，具体如下：

    ![Page与AbilitySlice](https://tva1.sinaimg.cn/large/0081Kckwly1glvndpo7qqj304x0623yb.jpg)

  - **AbilitySlice的路由配置**

    我们知道Page能量罐可以存放多个能量碎片（AbilitySlice），但是Page进入前台时界面默认只展示一个AbilitySlice，我们通过**setMainRoute()**方法来设置默认路由，其余的AbilitySlice我们可以通过**addActionRoute()**方法来配置。通过addActionRoute方法设置路由时，需要在config.json中注册其他路由。

    当然不同的Page之间也可以进行导航，我们会在下面内容详细介绍。

    那么了解了PageAbility，我们来看下代码吧：

    ```java
    public class MainAbility extends Ability {
        @Override
        public void onStart(Intent intent) {
            super.onStart(intent);
          	//设置默认路由
            super.setMainRoute(MainAbilitySlice.class.getName());
          	//设置其他路由，需要在config.json中注册
          	addActionRoute("action.pay", PaySlice.class.getName());
            addActionRoute("action.scan", ScanSlice.class.getName());
        }
    }
    // config.json中注册路由
    {
        "module": {
            "abilities": [
                {
                    "skills":[
                        {
                            "actions":[
                                "action.pay",
                                "action.scan"
                            ]
                        }
        ...
    }
    //AbilitySlice
    public class MainAbilitySlice extends AbilitySlice {
        @Override
        public void onStart(Intent intent) {
            super.onStart(intent);
          	//设置UI界面
            super.setUIContent(ResourceTable.Layout_ability_main);
        }
    }
    
    ```

  #### 4.生命周期

  - [x] Page声明周期回调
  - [x] AbilitySlice生命周期回调
  - [x] Page与Ability声明周期关联

  - **Page生命周期**

    我们先祭图，然后再详细了解：

    ![Page声明周期](https://tva1.sinaimg.cn/large/0081Kckwly1glvp8z1yg5j30q60jm3zl.jpg)

    - **onStart**

      当系统首次创建Page实例时，触发该方法。对于一个Page而言，该回调在其声明周期过程中仅触发一次。

      Page在该回调后会进入INACTIVE状态（不活跃状态），开发者必须重写此方法，并在此配置默认展示的AbilitySlice，就是setMainRoute()

      ```java
          @Override
          public void onStart(Intent intent) {
              super.onStart(intent);
              super.setMainRoute(FooSlice.class.getName());
          }
      ```

    - **onActive**

      Page在进入INACTIVE状态后来到前台，调用此方法。此后Page进入ACTIVE状态，该状态是应用与用户交互的状态。

      此后Page将保持在此状态，除非某类事件发生导致Page失去焦点，比如用户点击返回键或导航到其他Page。当此类事件发生时，会触发INACTIVE状态，系统会回调onInactive()方法，此后Page进入INACTIVE状态。

      Page可能重新回到ACTIVE状态，系统将再次回调onActive()方法。

      因此，我们可以实现onActive和onInactive方法，并在onActive中获取onInactive中被释放的资源。

    - **onInactive()**

      当Page失去焦点时，系统将调用此方法，伺候Page进入INACTIVE状态。

      我们可以在此方法中做相对应的逻辑操作

    - **onBackground()**

      如果Page不再对用户可见，系统将调用此方法通知开发者进行相应的资源释放，此后Page进入BACKGROUND状态，我们可以在此方法内释放不可见时无用的资源，或者执行较为耗时的状态保存操作。

    - **onStop**

      系统将要销毁Page时，将会触发此回调，通知用户进行系统资源的释放。

      销毁Page的可能原因包括：

      1. 用户通过系统管理能力关闭指定Page，例如使用任务管理器关闭Page。
      2. 用户行为触发Page的terminateAbility()方法调用，例如使用应用的退出功能。
      3. 配置变更导致系统暂时销毁Page并重建。
      4. 系统出于资源管理目的，自动触发对处于BACKGROUND状态Page的销毁。

  - **AbilitySlice生命周期**

    AbilitySlice作为Page的组成单元，其生命周期是依托于其所属Page生命周期的。AbilitySlice和Page具有相同的生命周期状态和同名的回调，当Page生命周期发生变化时，它的AbilitySlice也会发生相同的生命周期变化。此外，AbilitySlice还具有独立于Page的生命周期变化，这发生在同一Page中的AbilitySlice之间导航时，此时Page的生命周期状态不会改变。

    因为AbilitySlice是PageAbility的组成单元，他负责承载具体的页面UI，所以我们必须实现它的onstart回调，并在此方法中通过setUIContent()方法设置页面：

    ```java
    @Override
        protected void onStart(Intent intent) {
            super.onStart(intent);
     
            setUIContent(ResourceTable.Layout_main_layout);
        }
    ```

    AbilitySlice实例创建和管理通常由应用负责，系统仅在特定情况下会创建AbilitySlice实例。例如，通过导航启动某个AbilitySlice时，是由系统负责实例化；但是在同一个Page中不同的AbilitySlice间导航时则由应用负责实例化。

  - **Page与AbilitySlice生命周期关联**

    当AbilitySlice处于前台且具有焦点时，其生命周期状态随着所属Page的生命周期状态的变化而变化。

    当一个Page拥有多个AbilitySlice时，例如：MyAbility下有FooAbilitySlice和BarAbilitySlice，当前FooAbilitySlice处于前台并获得焦点，并即将导航到BarAbilitySlice，在此期间的生命周期状态变化顺序为：

    	1. FooAbilitySlice从ACTIVE状态变为INACTIVE状态
    	2. BarAbilitySlice则从INITIAL状态首先变为INACTIVE状态，然后变为ACTIVE状态（假定此前BarAbilitySlice未曾启动）。
    	3. FooAbilitySlice从INACTIVE状态变为BACKGROUND状态。

    对应两个slice的生命周期方法回调顺序为：

    **FooAbilitySlice.onInactive() --> BarAbilitySlice.onStart() --> BarAbilitySlice.onActive() --> FooAbilitySlice.onBackground()**

    在整个流程中，MyAbility始终处于ACTIVE状态。但是，当Page被系统销毁时，其**所有已实例化**的AbilitySlice将联动销毁，而不仅是处于前台的AbilitySlice。

    

- **AbilitySlice间的导航**

  - [x] 同一Page内的导航

  - [x] 不同Page间的导航

  - [ ] 跨设备迁移（后续有机会尝试后会回来更新）

  - **同一Page内的导航**

    1. 通过present()方法实现导航

       ```java
       @Override
       protected void onStart(Intent intent) {
           ...
           Button button = ...;
           button.setClickedListener(listener -> present(new TargetSlice(), new Intent()));
           ...
        
       }
       ```

    2. 如果我们想获得目标AbilitySlice返回时的结果，可以用presentForResult()实现导航，用户从目标导航返回时，系统会回调onResult()来接收和处理返回结果，开发者需要重写该方法。返回结果由导航目标AbilitySlice在其生命周期内通过setResult()进行设置。

       ```java
       //原Slice
       @Override
       protected void onStart(Intent intent) {
        
           ...
           Button button = ...;
         	//通过presentForResult跳转
           button.setClickedListener(listener -> presentForResult(new TargetSlice(), new Intent(), 0));
           ...
        
       }
        
       //重写onResult方法来接收
       @Override
       protected void onResult(int requestCode, Intent resultIntent) {
           if (requestCode == 0) {
               // Process resultIntent here.
           }
       }
       //目标Slice通过setResult方法传递数据
       @Override
           protected void onBackPressed() {
               super.onBackPressed();
               setResult(resultCode, new Intent());
           }
       ```

       系统为每个Page维护了一个AbilitySlice实例的栈，每个进入前台的AbilitySlice实例均会入栈。当开发者在调用present()或presentForResult()时指定的AbilitySlice实例已经在栈中存在时，则栈中位于此实例之上的AbilitySlice均会出栈并终止其生命周期。

  - **不同Page间的导航**

    不同Page中的AbilitySlice相互不可见，因此无法通过present()或presentForResult()方法直接导航到其他Page的AbilitySlice。

    AbilitySlice作为Page的内部单元，以Action的形式对外暴露，因此可以通过配置Intent的Action导航到目标AbilitySlice。

    Page间的导航可以使用startAbility()或startAbilityForResult()方法，获得返回结果的回调为onAbilityResult()。在Ability中调用setResult()可以设置返回结果。

  

  #### 4.ServiceAbility

  - [x] 基本概念
  - [x] 创建Service
  - [x] 启动Service
  - [x] 链接Service
  - [x] 生命周期
  - [x] 前台Service

  - **基本概念**

    基于Service模板的Ability，我们可以简称为Service，它主要用于后台运行任务（如音乐播放，文件下载等），Service并**不提供与用户交互的界面**。

    Service可由其他应用或Ability启动，即使用户切换到其他应用，Service仍将在后台继续运行。

    Service是**单实例**的，在一个设备上，相同的Service只会存在一个实例。

    如果多个Ability共用这个实例，那么只有当与Service绑定的所有Ability都退出后，Service才能退出。

    由于Service是在**主线程运行**的，如果有较为耗时的操作，我们须在Service里创建新的线程来处理，防止造成主线程阻塞，应用程序无响应。

  - 创建Service

    创建Service的步骤，我们直接看代码+注释更清晰明了：

    ```java
    //1，创建ServiceAbility继承Ability
    public class ServiceAbility extends Ability {
        private static final HiLogLabel LABEL_LOG = new HiLogLabel(3, 0xD001100, "Demo");
    		//onStart方法在生命周期中只会调用一次，用于Service的初始化
        @Override
        public void onStart(Intent intent) {
            HiLog.error(LABEL_LOG, "ServiceAbility::onStart");
            super.onStart(intent);
        }
      	/*
      	 * onCommand方法在Service创建完成后调用，该方法在每次启动Service时都会调用，
      	 * 我们可以在此方法里做一些统计功能或初始化功能
      	 */
      	@Override
        public void onCommand(Intent intent, boolean restart, int startId) {
        }
      	/*
      	 * onConnect方法在Abillity与Service连接时调用，我们可以看到该方法返回一个
      	 * IRemoteObject对象，用户可以在该回调函数中生成对应Service的IPC通信通道，以便Ability与
         * Service交互。Ability可以多次连接同一个Service，系统会缓存该Service的IPC通信对象，
         * 只有第一个客户端连接Service时，系统才会调用Service的onConnect方法来生成IRemoteObject对象，
         * 而后系统会将同一个RemoteObject对象传递至其他连接同一个Service的所有客户端，
         * 而无需再次调用onConnect方法。
      	 */
      	@Override
        public IRemoteObject onConnect(Intent intent) {
            return null;
        }
      	//断开连接时调用此方法
      	@Override
        public void onDisconnect(Intent intent) {
        }
    		//Service销毁时调用，可以在此方法里释放资源
        @Override
        public void onStop() {
            super.onStop();
            HiLog.info(LABEL_LOG, "ServiceAbility::onStop");
        }
    }
    
    //2.创建完Service后，我们需要去config.json配置文件中注册
    //如果我们直接在包上右键，新建Ability选择Service，系统会帮我们注册好的
    			{
            "name": "com.example.demo1.ServiceAbility",
            "icon": "$media:icon",
            "description": "$string:serviceability_description",
            "type": "service"
          }
    
    ```

  - **启动Service**

    我们知道Service也是Ability的一种，系统为我们提供了startAbility()方法来启动另外一个Ability，所以我们可以通过Intent传递的方法来启动Service。它不仅支持启动本地Service，还支持启动远程Service。

    我们通过构造包含：**DeviceId**、**BundleName**和**AbilityName**的Operation对象，来设置目标Service信息

    - DeviceId：设备ID，如果是本地设备，可直接留空，远程设备可通过DeviceManager提供的getDeviceList获取设备列表。
    - BundleName：包名称
    - AbilityName：表示待启动的ServiceAbility名称

    我们来看代码：

    ```java
    public class MainAbilitySlice extends AbilitySlice {
        @Override
        public void onStart(Intent intent) {
            super.onStart(intent);
            super.setUIContent(ResourceTable.Layout_ability_main);
            findComponentById(ResourceTable.Id_text_helloworld)
                    .setClickedListener(component -> startService());
        }
    
        private void startService() {
            Intent intent = new Intent();
            Operation operation = new Intent.OperationBuilder()
                    .withDeviceId("")
                    .withBundleName("com.example.demo1")
                    .withAbilityName("com.example.demo1.entry.ServiceAbility")
                    .build();
            intent.setOperation(operation);
            startAbility(intent);
        }
    }
    //如果Service尚未运行，则系统会回调Service的onStart方法进行初始化，然后回调onCommand
    //如果Service已经启动，那么直接回调Service的onCommand方法
    
    public class ServiceAbility extends Ability {
    
        @Override
        public void onStart(Intent intent) {
            System.out.println("服务已启动");
            super.onStart(intent);
        }
    
        @Override
        public void onBackground() {
            super.onBackground();
        }
    
        @Override
        public void onStop() {
            super.onStop();
        }
    
        @Override
        public void onCommand(Intent intent, boolean restart, int startId) {
            System.out.println(intent.getOperation().getAbilityName());;
        }
    
        @Override
        public IRemoteObject onConnect(Intent intent) {
            return null;
        }
    
        @Override
        public void onDisconnect(Intent intent) {
        }
    }
    //Logcat打印日志：第一次初始化回调onStart，然后回调onCommand，再次点击按钮只会回调onCommand
    2020-12-22 16:55:24.017 9507-9507/com.example.demo1 I/System.out: 服务已启动
    2020-12-22 16:55:24.018 9507-9507/com.example.demo1 I/System.out: com.example.demo1.entry.ServiceAbility
    ...
    2020-12-22 17:00:11.524 9507-9507/com.example.demo1 I/System.out: com.example.demo1.entry.ServiceAbility
    
    
    ```

    关于停止Service运行，我们可以在Service中调用**terminateAbility()**方法，

    或者在其他Ability调用**stopAbility()**来停止Service。

    

  - **连接Service**

    我们开启Service后，如果需要与Ability进行交互，则需要在Service和交互的Ability中进行信息传递。

    首先，我们在Service中创建IRemoteObject对象用于通信；

    然后，在Ability中我们要接收Service发来的信息，可以通过**ConnectionAbility()**方法进行连接，这个方法需要传两个参数，一个是Service的Intent，一个是IAbilityConnection连接回调的实例。我们直接来看代码：

    ```java
    //1. Service中创建IRemoteObject实现类，并在onConnect方法中new出来
    public class ServiceAbility extends Ability {
    		//创建IRemoteObject实现类，用于onConnect()方法renturn
      	private class MyIRemoteObject extends RemoteObject {
            public MyIRemoteObject(String descriptor) {
                super(descriptor);
            }
        }
      
        @Override
        public IRemoteObject onConnect(Intent intent) {
          	//return我们创建的实现类并向Ability传递信息，这里用了实现的String构造器
            return new MyIRemoteObject("Service在向你招手~");
        }
    }
    //2. Ability中进行连接，并在Service回调中拿到IRemoteObject信息
    public class MainAbilitySlice extends AbilitySlice {
        @Override
        public void onStart(Intent intent) {
            super.onStart(intent);
            super.setUIContent(ResourceTable.Layout_ability_main);
            findComponentById(ResourceTable.Id_text_helloworld)
                    .setClickedListener(component -> startService());
        }
    
        private void startService() {
            Intent intent = new Intent();
            Operation operation = new Intent.OperationBuilder()
                    .withDeviceId("")
                    .withBundleName("com.example.demo1")
                    .withAbilityName("com.example.demo1.entry.ServiceAbility")
                    .build();
            intent.setOperation(operation);
    //        startAbility(intent);
            connectAbility(intent, connection);
        }
    
        private IAbilityConnection connection = new IAbilityConnection() {
            // 连接到Service的回调
            @Override
            public void onAbilityConnectDone(ElementName elementName, IRemoteObject iRemoteObject, int resultCode) {
                //连接成功后我们会拿到Service传过来的IRemoteObject对象，进而解析数据
            }
            // 断开与连接的回调
            @Override
            public void onAbilityDisconnectDone(ElementName elementName, int resultCode) {
    
            }
        };
    }
    
    ```

    

    

