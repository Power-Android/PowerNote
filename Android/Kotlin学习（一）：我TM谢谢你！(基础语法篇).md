title: Kotlin学习（一）：我TM谢谢你！(基础语法篇)
date: 2019-07-30
comments: true
categories: Android
tags:
- Kotlin
---

### 前言
自从2017年Google定义Kotlin为Android开发的官方语言，瞬间掀起了学习大潮，各种学习博客如雨后春笋般攻击我这颗弱小而又无助的小心脏！是你们，是的，就是因为你们使我变得越来越强大，我TM替我日益稀疏的头发谢谢各位学霸！！！所以，搞起来吧！开启我们从乌黑亮丽到寸草不生的kotlin学习之旅！
[我的博客（Power）](https://powerofandroid.com/)

<!-- more -->

![](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/gif/%E7%BB%99%E5%AD%A6%E9%9C%B8%E8%B7%AA%E4%BA%86.gif)
作为Android开发水军中的一员，其实很早就简单看了语法，其中的优缺点这里就不再过多陈述，不清楚或想详细了解的请自行[社会你度十三娘](https://www.baidu.com/)，鉴于大家如果能有幸看见这边文章，想必对我们吃饭的家伙熟悉程度应该不亚于我了，所以对于Android studio的环境配置这里小弟就不再卖弄风骚了，毕竟在座的各位都是学霸，VIP中P...
这里在开头也为大家分享一些大牛关于学习Kotlin的链接，有助于大家在吃百家饭的时候，不容易养成挑食的小毛病。
![](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/%E8%90%BD%E9%AD%84%E7%9A%84Android%E5%BC%80%E5%8F%91.jpeg)
本系列均踩在各位巨人的肩膀上总结而成！请各位看官轻喷...
[Kotlin语言中国](https://www.kotlincn.net/)
[Kotlin-菜鸟教程](https://www.runoob.com/kotlin/kotlin-tutorial.html)
[Kotlin入门到进阶](https://www.jianshu.com/p/f98dcd2da323)
[玩Android-kotlin文章](https://www.wanandroid.com/article/query?k=kotlin)
### Kotlin基础语法
1. 函数的定义
    函数使用关键字 fun，参数格式为：参数 : 类型
    
    ```kotlin
    //  sum:函数名 a,b参数名，Int参数类型
    fun sum(a: Int, b: Int): Int {// :后边Int为返回值类型
        return a + b
    }
    ```
    - 这里需要注意如果是public则必须声明返回值类型，如果是无返回值的函数（:Unit）则可以省略。
    
    ```kotlin
    fun unitFun() : Unit{
        println("我是返回值为Unit的函数，Unit可省略")
        return
        // return Unit 可省略
        // 或者 return  可省略
    }
    //等价于
    fun unitFun(){
        println("我是返回值为Unit的函数，Unit可省略")
    }
    ```
    - 可变长参数函数，用 vararg 关键字进行标识
    
    ```kotlin
    fun vars(vararg v:Int){
        for(vt in v){
            print(vt)
        }
    }

    // 测试
    fun main(args: Array<String>) {
        vars(1,2,3,4,5)  // 输出12345
    }
    ```
2. 常量与变量
    变量：var <标识符> : <类型> = <初始化值>
    
    ```kotlin
    var x: Int = 5        // 系统自动推断变量类型为Int
    x += 1                // 变量可修改
    ```
    常量：val <标识符> : <类型> = <初始化值>
    
    ```kotlin
    val a: Int = 1
    val b = 1       // 系统自动推断变量类型为Int
    val c: Int      // 如果不在声明时初始化则必须提供变量类型
    c = 1           // 明确赋值
    ```

### Kotlin基本数据类型
基础数据类型包含有：
- 数值类型
- 字符类型
- 字符串类型
- 布尔类型
- 数组类型

1. 数值类型（Numbers）
    Kotlin 的基本数值类型包括 Byte、Short、Int、Long、Float、Double 等
    不同于 Java 的是，字符不属于数值类型，是一个独立的数据类型。

| 类型 | 位宽度 |
| :-: | :-: |
| Byte | 8 |
| Short | 16 |
| Int | 32 |
| Long | 64 |
| Float | 32 |
| Double | 64 |

2. 字符类型（Characters）
    和 Java 不一样，Kotlin 中的 Char 不能直接和数字操作，Char 必需是单引号 ' 包含起来的。比如普通字符 '0'，'a'

    ```kotlin
    val ch :Char = 1; // 错误示范
    val ch :Char = '1'; // 正确示范
    
    // 将字符类型转换成数字
    val ch :Char = '8';
    val a :Int = ch.toInt()
    ```

3. 字符串类型（Strings）
    和 Java 一样，String 是不可变的。
    
    ```kotlin
    //1.方括号 [] 语法可以很方便的获取字符串中的某个字符，也可以通过 for 循环来遍历：
    for (c in str) {
        println(c)
    }
    //2.支持三个引号 """ 扩起来的字符串，支持多行字符串，比如：
    fun main(args: Array<String>) {
        val text = """
        多行字符串
        多行字符串
        """
        println(text)   // 输出有一些前置空格
    }
    //3.String 可以通过 trimMargin() 方法来删除多余的空白:
    fun main(args: Array<String>) {
        val text = """
        |多行字符串
        |菜鸟教程
        |多行字符串
        |Runoob
        """.trimMargin()
        println(text)    // 前置空格删除了
    }
    ```
    字符串模板：即在字符串内通过一些小段代码求值并把结果合并到字符串中。模板表达式以美元符（$）开头
    
    ```kotlin
    fun main(args: Array<String>) {
        val i = 10
        val s = "i = $i" 
        println(s) // 求值结果为 "i = 10"
    }
    //用花括号扩起来的任意表达式:
    fun main(args: Array<String>) {
        val s = "runoob"
        val str = "$s.length is ${s.length}" 
        println(str) // 求值结果为 "runoob.length is 6"
    }
    ```
4. 布尔类型（Boolean）
    布尔用 Boolean 类型表示，它有两个值：true 和 false。
    内置的布尔运算有：
    
    ```kotlin
    || – 短路逻辑或
    && – 短路逻辑与
    ! - 逻辑非
    ```
1. 数组类型（Arrays）
    数组用类 Array 实现，并且还有一个 size 属性及 get 和 set 方法，由于使用 [] 重载了 get 和 set 方法，所以我们可以通过下标很方便的获取或者设置数组对应位置的值。
数组的创建两种方式：一种是使用函数arrayOf()；另外一种是使用工厂函数。

    ```kotlin
    fun main(args: Array<String>) {
        //[1,2,3]
        val a = arrayOf(1, 2, 3)
        //[0,2,4]
        val b = Array(3, { i -> (i * 2) })
        //读取数组内容
        println(a[0])    // 输出结果：1
        println(b[1])    // 输出结果：2
    }
    ```
    注意: 与 Java 不同的是，Kotlin 中数组是不型变的（invariant）
    除了类Array，还有ByteArray, ShortArray, IntArray等等，用来表示各个类型的数组，省去了装箱操作，因此效率更高，其用法同Array一样：
    
    ```kotlin
    val x: IntArray = intArrayOf(1, 2, 3)
    x[0] = x[1] + x[2]
    ```
    
### Kotlin的Null安全设计
1. 声明可为null参数及null判断处理
    类型后面加 ？ 即表示可为null
    进行判null处理时有两种方式：
    第一种就是字段后加 !!    表示像java一样抛出null异常
    第二种就是字段后加 ?     表示不作处理，可以返回null
    第三种就是字段后加 ?:    表示字段为null时返回的值
    当然， if/else也是可以的，在使用if判null后，可自动转换为非null变量
    
    ```kotlin
    //类型后面加?表示可为空
    var age: String? = "23" 
    //抛出空指针异常
    val ages = age!!.toInt()
    //不做处理返回 null
    val ages1 = age?.toInt()
    //age为空返回-1
    val ages2 = age?.toInt() ?: -1
    ```
2. 函数中使用可null类型
    当一个函数/方法有返回值时，如果方法中的代码使用?.去返回一个值，那么方法的返回值的类型后面也要加上 ? 符号
    
    ```kotlin
    fun funNullMethod() : Int? {
        val str : String? = "123456"
        return str?.length
    }
    //输出：6
    ```
    
### Kotlin的类型检测及自动类型转换
- 我们可以使用 is 运算符检测一个表达式是否某类型的一个实例(类似于Java中的instanceof关键字)

    ```kotlin
    fun getStringLength(obj: Any): Int? {
      if (obj is String) {
        // 做过类型判断以后，obj会被系统自动转换为String类型
        return obj.length 
      }
    
      //在这里还有一种方法，与Java中instanceof不同，使用!is
      // if (obj !is String){
      //   // XXX
      // }
    
      // 这里的obj仍然是Any类型的引用
      return null
    }
    //或者
    fun getStringLength(obj: Any): Int? {
      if (obj !is String)
        return null
      // 在这个分支中, `obj` 的类型会被自动转换为 `String`
      return obj.length
    }
    //甚至还可以
    fun getStringLength(obj: Any): Int? {
      // 在 `&&` 运算符的右侧, `obj` 的类型会被自动转换为 `String`
      if (obj is String && obj.length > 0)
        return obj.length
      return null
    }
    ```
    
### Kotlin的区间表达式
- 区间表达式由具有操作符形式 .. 的 rangeTo 函数辅以 in 和 !in 形成。
- 区间是为任何可比较类型定义的，但对于整型原生类型，它有一个优化的实现。以下是使用区间的一些示例:

    ```kotlin
    for (i in 1..4) print(i) // 输出“1234”

    for (i in 4..1) print(i) // 什么都不输出

    if (i in 1..10) { // 等同于 1 <= i && i <= 10
        println(i)
    }
    
    // 使用 step 指定步长
    for (i in 1..4 step 2) print(i) // 输出“13”
    
    for (i in 4 downTo 1 step 2) print(i) // 输出“42”
    
    // 使用 until 函数排除结束元素
    for (i in 1 until 10) {   // i in [1, 10) 排除了 10
        println(i)
    }
    
    //实测示例
    fun main(args: Array<String>) {
        print("循环输出：")
        for (i in 1..4) print(i) // 输出“1234”
        println("\n----------------")
        print("设置步长：")
        for (i in 1..4 step 2) print(i) // 输出“13”
        println("\n----------------")
        print("使用 downTo：")
        for (i in 4 downTo 1 step 2) print(i) // 输出“42”
        println("\n----------------")
        print("使用 until：")
        // 使用 until 函数排除结束元素
        for (i in 1 until 4) {   // i in [1, 4) 排除了 4
        print(i)
        }
        println("\n----------------")
    }
        /*
        输出结果：
        循环输出：1234
        ----------------
        设置步长：13
        ----------------
        使用 downTo：42
        ----------------
        使用 until：123
        ----------------
        */
```

