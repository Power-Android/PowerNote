title: Android三种动画详解
date: 2019-01-08
comments: true
categories: Android
tags:
- 动画(Animation)
---

### 前言
自尊，自律，自强，自爱。--Power

一直以来自己对Android的动画一知半解，所以决定写这篇文章来详细系统的学习Android的三种动画，即 

- View Animation（视图动画）
- Drawable Animation（帧动画）
- Property Animation（属性动画）

<!-- more -->

### 正文
### 1.View Animation（视图动画）
1.1 View动画的概述及种类
视图动画的作用对象是View，支持四种动画效果，分别是平移动画，缩放动画，旋转动画，透明度动画。譬如，我们可以对TextView设置其文本的移动，旋转，缩放，透明。

视图动画可以通过XML或通过代码动态创建，对于视图动画建议使用XML文件定义，因为它具有更高的可读性，可重用性。

下面我们来分别看一下View动画的四种效果：

- 平移动画（TranslateAnimation）
    <img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/translate_anim.gif" width="160" div align="center" />

- 缩放动画（ScaleAnimation）
    <img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/scale_anim.gif" width="160" div align="center" />

- 旋转动画（RotateAnimation）
    <img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/rotate_anim.gif" width="160" div align="center" />

- 透明度动画（AlphaAnimation）
    <img src="https://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/alhpa_anim.gif" width="160" div align="center" />

view动画的四种变换我们通过效果图已基本了解，下面我们通过表格系统的了解一下：

| 名称 | 标签 | 子类 | 效果 |
| :-: | :-: | :-: | :-: |
| 平移动画 |< translate > | TranslateAnimation | 移动View |
| 缩放动画 | < scale > | ScaleAnimation | 方法或缩小View |
| 旋转动画 | < rotate > | RotateAnimation | 旋转view |
| 透明度动画 | < alpha > | AlphaAnimation | 改变View的透明度 |

要使用View动画，首先要创建XML文件，我们需要在res下新建anim文件夹，接着在anim下创建animation resource file的xml文件，我们举例为view_anim.xml

我们通过xml文件来了解它们各自的语法：

```xml
<?xml version="1.0" encoding="utf-8"?>
<set
    xmlns:android="http://schemas.android.com/apk/res/android">
    <!--平移动画标签-->
    <translate
        android:fromXDelta="0%p"
        android:toXDelta="20%p"
        android:fromYDelta="0%p"
        android:toYDelta="20%p"
        android:duration="4000"/>
    <!--缩放动画标签-->
    <scale
        android:fromXScale="1.0"
        android:toXScale="0.2"
        android:fromYScale="1.0"
        android:toYScale="0.2"
        android:pivotX="50%"
        android:pivotY="50%"
        android:duration="4000"/>
    <!--旋转动画标签-->
    <rotate
        android:fromDegrees="0"
        android:toDegrees="360"
        android:pivotX="50%"
        android:pivotY="50%"
        android:duration="4000"/>
    <!--透明度动画标签-->
    <alpha
        android:fromAlpha="1.0"
        android:toAlpha="0.2"
        android:duration="4000"/>
</set>
```
从上面的代码我们知道，View动画既可以是单个动画，也可以有一系列动画组成。
这是因为View动画的四种种类分别对应着Animation的四个子类（TranslateAnimation，ScaleAnimation，RotateAnimation，AlphaAnimation），除了以上四个子类它还有一个AnimationSet类，对应xml标签为`<set>`，它是一个容器，可以包含若干个动画，并且内部也可以继续嵌套`<set>`集合的。
我们在activity对TextView设置动画：

```java
/**
 * @author power
 * @date 2018-08-08 20:28:58
 * @description: MainActivity
 */
public class MainActivity extends AppCompatActivity {

    private TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = findViewById(R.id.textview);
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Animation animation = AnimationUtils.loadAnimation(MainActivity.this,R.anim.viewanimation);
                textView.startAnimation(animation);
            }
        });

    }
}
```
我们来看下动画集合的运行效果：
<img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/set_anim.gif" width="160" div align="center" />

1.2 View动画的属性详解

- Animation属性详解：

| xml属性 | java方法 | 解释 |
| :-: | :-: | :-: |
| android:duration | setDuration(long) | 动画持续时间，毫秒为单位 |
| android:ShareInterpolator | setInterpolator(Interpolator) | 设定插值器（指定的动画效果，譬如回弹等） |
| android:fillAfter | setFillAfter(boolean) | 控件动画结束时是否保持动画最后的状态 |
| android:fillBefore | setFillBefore(boolean) | 控件动画结束时是否还原到开始动画前的状态 |
| android:repeatMode | setRepeatMode(int) | 重复类型有两个值，reverse表示倒序回放，restart表示从头播放 |
| android:startOffset | setStartOffset(long)<span class="Apple-tab-span" style="white-space:pre"></span> | 调用start函数之后等待开始运行的时间，单位为毫秒 |

- TranslateAnimation属性详解：

| xml属性 | java方法 | 解释 |
| :-: | :-: | :-: |
| android:fromXDelta | TranslateAnimation(float fromXDelta, …) | 起始点X轴坐标，数值，百分比，百分比p，*注①*|
| android:fromYDelta | TranslateAnimation(…, float fromYDelta, …) | 起始点Y轴从标，同上规律 |
| android:toXDelta | TranslateAnimation(…, float toXDelta, …) | 结束点X轴坐标，同上规律 |
| android:toYDelta | TranslateAnimation(…, float toYDelta) | 结束点Y轴坐标，同上规律 |

> **注①：** 数值、百分数、百分数p，譬如50表示以当前View左上角坐标加50px为初始点、50%表示以当前View的左上角加上当前View宽高的50%做为初始点、50%p表示以当前View的左上角加上父控件宽高的50%做为初始点

- ScaleAnimation属性详解：

| xml属性 | java方法 | 解释 |
| :-: | :-: | :-: |
| android:fromXScale | ScaleAnimation(float fromX, …) | 初始X轴缩放比例，1.0表示无变化 |
| android:toXScale | ScaleAnimation(…, float toX, …) | 结束X轴缩放比例 |
| android:fromYScale | ScaleAnimation(…, float fromY, …) | 初始Y轴缩放比例 |
| android:toYScale | ScaleAnimation(…, float toY, …) | 结束Y轴缩放比例 |
| android:pivotX | ScaleAnimation(…, float pivotX, …) | 缩放起点X轴坐标，数值，百分比，百分比p，*注①*     |
| android:pivotY | ScaleAnimation(…, float pivotY) | 缩放起点Y轴坐标，同上规律 |

- RotateAnimation属性详解：

| xml属性 | Java方法 | 解释 |
| :-: | :-: | :-: |
| android:fromDegrees | RotateAnimation(float fromDegrees, …) | 旋转开始角度，正代表顺时针度数，负代表逆时针度数 |
| android:toDegrees | RotateAnimation(…, float toDegrees, …) | 旋转结束角度，正代表顺时针度数，负代表逆时针度数 |
| android:pivotX | RotateAnimation(…, float pivotX, …) | 缩放起点X坐标，数值，百分比，百分比p，**注①** |
| android:pivotY | RotateAnimation(…, float pivotY) | 缩放起点Y坐标，同上规律 |

- AlphaAnimation属性详解：

| xml属性 | java方法 | 解释 |
| :-: | :-: | :-: |
| android:fromAlpha | AlphaAnimation(float fromAlpha, …) | 动画开始的透明度（0.0到1.0，0.0是全透明，1.0是不透明） |
| android:toAlpha | AlphaAnimation(…, float toAlpha) | 动画结束的透明度，同上 |

- AnimationSet属性详解：
    AnimationSet继承自Animation，是上面四种的组合容器管理类，没有自己特有的属性，他的属性继承自Animation，所以特别注意，***当我们对set标签使用Animation的属性时会对该标签下的所有子控件都产生影响。***譬如我们在set标签下加入duration=“1000”，子控件的duration属性会失效。

1.3 View动画的使用方法及注意事项

- 上述的使用方法已经非常详细了，也并没有什么难以理解的地方，我们只需要创建相应的xml文件，然后在activity里startAnimation就可以完成动画了。当然了，Animation类和View操作Animation还有一些如下的实用方法：

| Animation类的方法 | 解释 |
| :-: | :-: |
| reset() | 重置Animation的初始化 |
| cancel() | 取消Animation动画 |
| start() | 开始Animation动画 |
| setAnimationListener() | 给当前Animation设置动画监听 |
| hasStarted() | 判断当前Animation是否开始 |
| hasEnded() | 判断当前Animation是否结束 |
| ---------------------------- | ---------------------------- |
| **View类对Animation的操作方法** | **解释** |
| startAnimation(Animation animation)<span class="Apple-tab-span" style="white-space:pre"></span> | 对当前View开始设置的Animation动画 |
| clearAnimation() | 取消当View在执行的Animation动画 |

- 注意事项
    - ***特别特别注意：补间动画执行之后并未改变View的真实布局属性值。切记这一点，譬如我们在Activity中有一个 Button在屏幕上方，我们设置了平移动画移动到屏幕下方然后保持动画最后执行状态呆在屏幕下方，这时如果点击屏幕下方动画执行之后的Button是没 有任何反应的，而点击原来屏幕上方没有Button的地方却响应的是点击Button的事件。***
    - ***在进行动画的时候，尽量使用dp，因为px会导致适配问题。***
    
1.4 View动画Interpolator插值器详解

- 插值器简介
    首先，我们先看一下源码的解释：
    ![interpolato](http://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/interpolator.jpg)
注释说明：插值器定义了动画的变化，使一些基础的动画如（平移，缩放，旋转，透明）可以被加速，减速，重复等
通过上图可以看见其实系统提供给我们的各类型插值器都是实现了Interpolator接口，具体如下：

| java类 | xml | 描述 |
| :-: | :-: | :-: |
| AccelerateDecelerateInterpolator | @android:anim/accelerate_decelerate_interpolator |  动画始末速率较慢，中间加速 |
| AccelerateInterpolator | @android:anim/accelerate_interpolator | 动画开始速率较慢，之后慢慢加速 |
| AnticipateInterpolator | @android:anim/anticipate_interpolator | 开始的时候从后向前甩 |
| AnticipateOvershootInterpolator | @android:anim/anticipate_overshoot_interpolator | 类似上面AnticipateInterpolator |
| BounceInterpolator | @android:anim/bounce_interpolator | 动画结束时弹起 |
| CycleInterpolator | @android:anim/cycle_interpolator | 循环播放速率改变为正弦曲线 |
| DecelerateInterpolator | @android:anim/decelerate_interpolator | 动画开始快然后慢 |
| LinearInterpolator | @android:anim/linear_interpolator | 动画匀速改变 |
| OvershootInterpolator | @android:anim/overshoot_interpolator | 向前弹出一定值之后回到原来位置 |

- 插值器的使用
    插值器的使用比较简答，如下：
    
    ```xml
    <set
    xmlns:android="http://schemas.android.com/apk/res/android"
    <!--运动结束时弹起-->
    android:interpolator="@android:anim/bounce_interpolator">
    <!--平移动画标签-->
    <translate
        android:fromXDelta="0%p"
        android:toXDelta="20%p"
        android:fromYDelta="0%p"
        android:toYDelta="20%p"
        android:duration="4000"/>
    <!--缩放动画标签-->
    </set>
    ```
    我们看一下设置插值器后的效果：
    <img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/interpolator.gif" width="160" div align="center" />

- 插值器的自定义
    当系统提供给我们的插值器不能满足开发需求时，就需要我们自定义，而插值器的自定义有两种方式，一种xml实现，一种java实现。
    - xml实现方式
    在anim文件下创建xml文件
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <accelerateInterpolator
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:factor="0.8">
    </accelerateInterpolator>
    ```
    通过代码我们发现，这种方式只能修改现有插值器的一些属性，但有些插值器不具备修改属性，那么我们就通过java代码实现进一步需求
    
    - java代码实现方式
    通过上面的学习我们知道，所有的插值器都是继承自Interpolator接口，它则继承TimeInterpolator接口，而这个接口定义了float getInterpolation(float input);方法
    
    ```java
    public class AccelerateDecelerateInterpolator extends BaseInterpolator
        implements NativeInterpolatorFactory {
        
    public float getInterpolation(float input) {
        return (float)(Math.cos((input + 1) * Math.PI) / 2.0f) + 0.5f;
        }
    }
    ```
    ```java
    public interface TimeInterpolator {

    /**
     * Maps a value representing the elapsed fraction of an animation to a value that represents
     * the interpolated fraction. This interpolated value is then multiplied by the change in
     * value of an animation to derive the animated value at the current elapsed animation time.
     *
     * @param input A value between 0 and 1.0 indicating our current point
     *        in the animation where 0 represents the start and 1.0 represents
     *        the end
     * @return The interpolation value. This value can be more than 1.0 for
     *         interpolators which overshoot their targets, or less than 0 for
     *         interpolators that undershoot their targets.
     */
    float getInterpolation(float input);
    }
    ```
我们需要继承Interpolator接口并实现getInterpolation();，在方法里处理业务逻辑即可。

### 2.Drawable Animation（帧动画）
2.1帧动画概述
帧动画是顺序播放一组预先定义好的图片，不同于View动画，系统提供了另外一个类AnimationDrawable来使用帧动画。

2.2帧动画的使用
首先我们找一组帧动画的图片放入drawable-xhdpi文件夹下，其次在drawable文件夹下创建xml文件，如下所示：

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="false">
    <item android:drawable="@drawable/refresh1" android:duration="180"/>
    <item android:drawable="@drawable/refresh2" android:duration="180"/>
    ...
    <item android:drawable="@drawable/refresh25" android:duration="180"/>
</animation-list>
```

```java
view = findViewById(R.id.view);
        view.setBackgroundResource(R.drawable.drawable_anim);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AnimationDrawable animationDrawable = (AnimationDrawable) view.getBackground();
                animationDrawable.start();
            }
        });
```
通过上述代码，帧动画已经完成了，我们来看下效果图：
<img src="http://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/drawable_anim.gif" width="160" div align="center" />

`<animation-list>` 必须是根节点，包含一个或者多个`<item>`元素，属性有：
`android:oneshot true`代表只执行一次，false循环执行。
`<item>` 类似一帧的动画资源。

`<item>` animation-list的子项，包含属性如下：
`android:drawable` 一个frame的Drawable资源。
`android:duration` 一个frame显示多长时间。

***帧动画很简单，但容易引起OOM，我在这里也就不多赘述。***

### 3.Property Animation（属性动画）
3.1 未完待续...


