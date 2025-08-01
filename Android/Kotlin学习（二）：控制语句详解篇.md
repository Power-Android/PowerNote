title: Kotlin学习（二）：控制语句详解篇
date: 2019-08-14
comments: true
categories: Android
tags:
- Kotlin
---

#### 前言
通过上一篇的学习，我们对kotlin已经掌握了函数的定义，基本数据类型，null安全设计，类型检测及自动转换和Kotlin的区间表达式，如果您还有任何不明白的地方，请跳转至我的上一篇博客：
[《Kotlin学习（一）：我TM谢谢你！(基础语法篇)》](https://www.jianshu.com/p/090535b596c1)
对于kotlin，这只是最基础的入门讲解，也希望大家能够跟我一样逐渐适应kotlin的美，我们一起进步，我相信通过一段时间的学习，我也可以像大家分享一些kotlin的语法糖以及更深入的使用。[我的博客（Power）](https://powerofandroid.com/)
#### kotlin控制语句详解
- 条件控制语句：if 语句、when 语句
- 循环控制语句：for 循环、while与do...while 循环
- 返回和跳转语句：return、 break、 continue

<!-- more -->

#### 1. if语句
kotlin的if表达式其实和java是非常类似的，唯一不同的地方在于kotlin可以把表达式的结果赋值给变量，类似于java的三元运算符，我们可以直接实现。
```kotlin
// 传统用法
var max = a 
if (a < b) max = b

// 使用 else 
var max: Int
if (a > b) {
    max = a
} else {
    max = b
}
 
// 作为表达式
val max = if (a > b) a else b
```
举例：
```kotlin
fun main(args: Array<String>) {
    var x = 0
    if(x>0){
        println("x 大于 0")
    }else if(x==0){
        println("x 等于 0")
    }else{
        println("x 小于 0")
    }

    var a = 1
    var b = 2
    val c = if (a>=b) a else b
    println("c 的值为 $c")
}
//输出结果为：
x 等于 0
c 的值为 2
```
#### 2. when表达式
when 将它的参数和所有的分支条件顺序比较，直到某个分支满足条件。
when 既可以被当做表达式使用也可以被当做语句使用。如果它被当做表达式，符合条件的分支的值就是整个表达式的值，如果当做语句使用， 则忽略个别分支的值。
我们看下例子：
```kotlin
//在 when 中，else 同 switch 的 default。如果其他分支都不满足条件将会求值 else 分支
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // 注意这个块,else 相当于 switch 的 default
        print("x 不是 1 ，也不是 2")
    }
}

//如果很多分支需要用相同的方式处理，则可以把多个分支条件放在一起，用逗号分隔
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}

//我们也可以检测一个值在（in）或者不在（!in）一个区间或者集合中
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}

//另一种可能性是检测一个值是（is）或者不是（!is）一个特定类型的值。注意： 由于智能转换，你可以访问该类型的方法和属性而无需 任何额外的检测
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}

//when 也可以用来取代 if-else if链。 如果不提供参数，所有的分支条件都是简单的布尔表达式，而当一个分支的条件为真时则执行该分支
when {
    x.isOdd() -> print("x is odd")
    x.isEven() -> print("x is even")
    else -> print("x is funny")
}

//when 中使用 in 运算符来判断集合内是否包含某实例
fun main(args: Array<String>) {
    val items = setOf("apple", "banana", "kiwi")
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
}
```
举例：
```kotlin
fun main(args: Array<String>) {
    var x = 0
    when (x) {
        0, 1 -> println("x == 0 or x == 1")
        else -> println("otherwise")
    }

    when (x) {
        1 -> println("x == 1")
        2 -> println("x == 2")
        else -> { // 注意这个块
            println("x 不是 1 ，也不是 2")
        }
    }

    when (x) {
        in 0..10 -> println("x 在该区间范围内")
        else -> println("x 不在该区间范围内")
    }
}
//输出结果：
x == 0 or x == 1
x 不是 1 ，也不是 2
x 在该区间范围内
```
#### 3. for循环
- for 循环可以对任何提供迭代器（iterator）的对象进行遍历
- kotlin 废除了 java 的 `for(int i = 0; i < list.size(); i++)`规则，新增了其他的规则，来满足对数组或集合的遍历
- 循环数组会编译成优化的实现而不会创建额外对象，或者你可以用库函数 withIndex：
```kotlin
//for循环可以对任何提供迭代器（iterator）的对象进行遍历
for (item in collection) print(item)
for (item: Int in ints) {
    // ……
}

//如果你想要通过索引遍历一个数组或者一个 list
for (i in array.indices) {
    print(array[i])
}

//循环数组会编译成优化的实现而不会创建额外对象，或者你可以用库函数 withIndex：
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```
举例：
```kotlin
// 循环5次，且步长为1的递增
for (i in 0 until 5){
  print("i => $i \t")
}

// 循环5次，且步长为1的递减
for (i in 15 downTo 11){
    print("i => $i \t")
}

print("使用 符号`..`的打印结果\n")
for (i in 20 .. 25){
    print("i => $i \t")
}

print("使用until的打印结果\n")
for (i in 20 until 25){
    print("i => $i \t")
}
//输出结果：
使用 符号`..`的打印结果
i => 20  i => 21  i => 22  i => 23  i => 24  i => 25     
使用until的打印结果
i => 20  i => 21  i => 22  i => 23  i => 24 

//使用数组的indices属性遍历
var arrayListTwo = arrayOf(1,3,5,7,9)
for (i in arrayListTwo.indices){
    println("arrayListTwo[$i] => " + arrayListTwo[i])
}
//输出结果：
arrayListTwo[0] => 1
arrayListTwo[1] => 3
arrayListTwo[2] => 5
arrayListTwo[3] => 7
arrayListTwo[4] => 9

//使用数组的withIndex()方法遍历
var arrayListTwo = arrayOf(1,3,5,7,9)
for ((index,value) in arrayListTwo.withIndex()){
    println("index => $index \t value => $value")
}
//输出结果：
index => 0   value => 1
index => 1   value => 3
index => 2   value => 5
index => 3   value => 7
index => 4   value => 9
```
#### 4. while， do...while语句
kotlin的while语句和java的while语句一样，下面我们直接举栗：
```kotlin
var num = 5
var count = 1
while (num < 10){
    println("num => $num")
    println("循环了$count 次")
    count++
    num++
}
//输出结果：
num => 5
循环了1 次
num => 6
循环了2 次
num => 7
循环了3 次
num => 8
循环了4 次
num => 9
循环了5 次

//do...while语句
var num = 5
var count = 1
do {
    println("num => $num")
    println("循环了$count 次")
    count++
    num++
}while (num < 10)
//输出结果：
num => 5
循环了1 次
num => 6
循环了2 次
num => 7
循环了3 次
num => 8
循环了4 次
num => 9
循环了5 次

// *注* : do{...}while(exp)与while(exp){...}最大的区别是do{...}while(exp)最少执行一次，这点也是和Java相同的
```
#### 5. 返回和跳转语句
return、break、continue的用法和java是一样的，
- eturn。默认从最直接包围它的函数或者匿名函数返回
- break。终止最直接包围它的循环
- continue。继续下一次最直接包围它的循环
我们直接看代码吧：
```kotlin
fun main(args: Array<String>) {
    for (i in 1..10) {
        if (i==3) continue  // i 为 3 时跳过当前循环，继续下一次循环
        println(i)
        if (i>5) break   // i 为 6 时 跳出循环
    }
}
//输出结果为：1 2 4 5 6

fun returnExample(){
    var str: String = ""
    if (str.isBlank()){
        println("我退出了该方法")
        return
    }
}
//输出结果为：我退出了该方法
```
- Break 和 Continue 标签
在 Kotlin 中任何表达式都可以用标签（label）来标记。 标签的格式为标识符后跟 @ 符号，例如：abc@、fooBar@都是有效的标签。 要为一个表达式加标签，我们只要在其前加标签即可
```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (……) break@loop
    }
}
```