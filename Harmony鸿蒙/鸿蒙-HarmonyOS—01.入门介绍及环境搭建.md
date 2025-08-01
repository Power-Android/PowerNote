title: 鸿蒙-HarmonyOS—01.入门介绍及环境搭建
date: 2020-12-17
comments: true
categories: 鸿蒙-HarmonyOS
tags:
- HarmonyOS
---

#### 前言

2020年12月16日，华为正式发布了HarmonyOS2.0手机开发者Beta版本。华为部分机型已经开放更新至鸿蒙系统，So，是时候来一波视觉及使用体验了！接下来我会用系列文章来详细介绍和使用HarmonyOS系统，尽量用通俗易懂的语言和视觉两方面来阐述我的所学所用，真正的能给大家带来一些帮助，是我写作的初衷。

今天的开篇章我们主要介绍一些基础的配置流程，它们包含：

1. **HarmontOS概述**
2. **开发工具DevEco Studio介绍及下载**
3. **搭建开发环境的流程,创建我们的第一个Project**
4. **工程目录介绍**

<!-- more -->

#### HarmonyOS概述

1. 系统定位

   HarmonyOS是一款“面向未来”、面向全场景（移动办公、运动健康、社交通信、媒体娱乐等）的分布式操作系统。在传统的单设备系统能力的基础上，HarmonyOS提出了基于同一套系统能力、适配多种终端形态的分布式理念，能够支持手机、平板、智能穿戴、智慧屏、车机等多种终端设备。

   - 对消费者而言，HarmonyOS能够将生活场景中的各类终端进行能力整合，可以实现不同的终端设备之间的快速连接、能力互助、资源共享，匹配合适的设备、提供流畅的全场景体验。
   - 对应用开发者而言，HarmonyOS采用了多种分布式技术，使得应用程序的开发实现与不同终端设备的形态差异无关。这能够让开发者聚焦上层业务逻辑，更加便捷、高效地开发应用。
   - 对设备开发者而言，HarmonyOS采用了组件化的设计方案，可以根据设备的资源能力和业务特征进行灵活裁剪，满足不同形态的终端设备对于操作系统的要求。

   HarmonyOS提供了支持多种开发语言的API，供开发者进行应用开发。支持的开发语言包括Java、XML（Extensible Markup Language）、C/C++ 、 JS（JavaScript）、CSS（Cascading Style Sheets）和HML（HarmonyOS Markup Language）。

2. 技术架构

   ![架构图](https://tva1.sinaimg.cn/large/0081Kckwly1glqwf5tvdoj31bw0nejvr.jpg)

   

   HarmonyOS整体遵从分层设计，从下向上依次为：内核层、系统服务层、框架层和应用层。系统功能按照“系统 > 子系统 > 功能/模块”逐级展开，在多设备部署场景下，支持根据实际需求裁剪某些非必要的子系统或功能/模块。

   - 内核层

     - 内核子系统：HarmonyOS采用多内核设计，支持针对不同资源受限设备选用适合的OS内核。内核抽象层（KAL，Kernel Abstract Layer）通过屏蔽多内核差异，对上层提供基础的内核能力，包括进程/线程管理、内存管理、文件系统、网络管理和外设管理等。
     - 驱动子系统：[硬件驱动框架（HDF）](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li1544183516475)是HarmonyOS硬件生态开放的基础，提供统一外设访问能力和驱动开发、管理框架。

   - 系统服务层

     系统服务层是HarmonyOS的核心能力集合，通过框架层对应用程序提供服务。该层包含以下几个部分：

     - 系统基本能力子系统集：为分布式应用在HarmonyOS多设备上的运行、调度、迁移等操作提供了基础能力，由分布式软总线、分布式数据管理、分布式任务调度、方舟多语言运行时、公共基础库、多模输入、图形、安全、AI等子系统组成。其中，方舟运行时提供了C/C++/JS多语言运行时和基础的系统类库，也为使用方舟编译器静态化的Java程序（即应用程序或框架层中使用Java语言开发的部分）提供运行时。
     - 基础软件服务子系统集：为HarmonyOS提供公共的、通用的软件服务，由事件通知、电话、多媒体、DFX（Design For X） 、[MSDP](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li1113671654618)&[DV](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li13399361415)等子系统组成。
     - 增强软件服务子系统集：为HarmonyOS提供针对不同设备的、差异化的能力增强型软件服务，由智慧屏专有业务、穿戴专有业务、IoT专有业务等子系统组成。
     - 硬件服务子系统集：为HarmonyOS提供硬件服务，由位置服务、生物特征识别、穿戴专有硬件服务、IoT专有硬件服务等子系统组成。

     根据不同设备形态的部署环境，基础软件服务子系统集、增强软件服务子系统集、硬件服务子系统集内部可以按子系统粒度裁剪，每个子系统内部又可以按功能粒度裁剪。

   - 框架层

     框架层为HarmonyOS应用开发提供了Java/C/C++/JS等多语言的用户程序框架和[Ability](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li1373094219463)框架，两种UI框架（包括适用于Java语言的Java UI框架、适用于JS语言的JS UI框架），以及各种软硬件服务对外开放的多语言框架API。根据系统的组件化裁剪程度，HarmonyOS设备支持的API也会有所不同。

   - 应用层

     应用层包括系统应用和第三方非系统应用。HarmonyOS的应用由一个或多个[FA（Feature Ability）](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li102311923104712)或[PA（Particle Ability）](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/glossary-0000000000029587#ZH-CN_TOPIC_0000001050749051__li11872193812460)组成。其中，FA有UI界面，提供与用户交互的能力；而PA无UI界面，提供后台运行任务的能力以及统一的数据访问抽象。基于FA/PA开发的应用，能够实现特定的业务功能，支持跨设备调度与分发，为用户提供一致、高效的应用体验。

     

#### 开发工具DevEco Studio介绍及下载

1. 我们第一步首先祭出大招：[DevEco Studio下载链接](https://developer.harmonyos.com/cn/develop/deveco-studio)

​       在下载之前我们需要去登录或者注册，成为华为HarmonOS的开发人员，这里大家自行去操作，不做过多赘述了。

2. DevEco Studio工具简介

   ​      DevEco Studio是基于IntelliJ IDEA的开源版本打造，面向华为终端全场景多设备的一站式集成开发环境。作为一款IDE，除了基本的代码开发，编辑构建及调测等功能外，它还具有以下的特点：

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/0000000000011111111.20201217104802.60693486441401230067618137357836.png" alt="功能图" style="zoom:50%;" />

- **多设备统一开发环境** ：支持多种HarmonyOS设备的应用开发，包括手机，平板，车技，智慧屏，智能穿戴和智慧视觉等设备。
- **支持多语言的代码开发和调试** ：包括Java、XML、C/C++。JS、CSS和HML（HarmonyOS Markup Language）
- **支持FA/PA快速开发** ：通过工程向导可快速创建FA/PA工程模板，一键式打包成HAP（HarmonyOS Ability Package）。
- **支持分布式多端应用开发** ：一个工程和一份代码可跨设备运行，支持不同设备界面的实时预览和差异化开发，实现代码的最大化重用。
- **支持多设备模拟器** ：提供多设备的模拟器资源，包括手机，平板，车技，智慧屏，只能穿戴设备的模拟器，方便开发者高效调试。
- **支持多设备预警器** ：提供JS和Java预览器功能，可以实时查看应用的布局效果，支持实时预览和动态预览；同时还支持多设备同时预览，查看同一个布局文件在不同设备上的呈现效果。

#### 配置开发环境

​	我们在安装studio的时候，请一路猛按Next按钮，不要犹豫，因为就是这个流程——简单暴力！

​	配置好之后如图：

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG1.png" alt="studio界面" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG2.png" alt="选择设备" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG3.png" alt="创建工程" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG4.png" alt="工程目录" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG8.png" alt="下载模拟器" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG9.png" alt="运行模拟器" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG10.png" alt="运行" style="zoom:50%;" />

<img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/WechatIMG12.png" alt="运行成功" style="zoom:50%;" />

#### 工程目录介绍

​	我们先来看下工程目录的结构图：

​	![目录结构](https://tva1.sinaimg.cn/large/0081Kckwly1glquqhwmbcj30dc0fzaag.jpg)

​	

- **.gradle**：Gradle配置文件，由系统自动生成，一般情况不需要进行修改

- **entry**：默认启动模块，开发者用于编写代码及开发资源文件的目录

  - entry>libs：用于存放entry模块的依赖文件

  - entry>src>main>java：用于存放java代码

  - entry>src>main>resources：用于存放应用用到的资源文件，如图片，多媒体，字符串，布局文件等

    关于资源文件的详细说明请参考**[资源文件的分类](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/basic-resource-file-categories-0000001052066099)。**

- **entry>src>main>config.json**：HAP清单文件，详细说明请参考**[config.json配置文件介绍](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/basic-config-file-elements-0000000000034463)。**
- **entry>src>test**：编写代码单元测试代码的目录，运行在本地Java虚拟机（JVM）上。
- **entry>.gitignore**：标识git版本管理需要忽略的文件。
- **entry>build.gradle**：entry模块的编译配置文件。

#### 总结

我们通过文章已经可以运行程序了，华为的鸿蒙系统开发IDE对于java和Android开发者来说应该是再熟悉不过的界面了，相信大家都可以很快上手；工程目录有细微的变化，不过通俗易懂。下篇文章我们开始进入正题，来介绍鸿蒙的开发流程。

