title: Android架构组件（四）：Room
date: 2019-10-25
comments: true
categories: Android
tags:
- android架构组件
---

#### 前言
上篇我们分析了对于Android架构体系最终要的Viewmodel组件，它可以实现数据和view之间的管理，并且能提供组件间的通讯（注意fragment获取viewmodel时传入的对象要一致）。
那么，接下来我们就学习一下和Livedata完美兼容的数据库——**Room**

**Room**是Google推出的Android架构组件库中的**数据持久化组件库**, 也可以说是在SQLite上实现的一套ORM解决方案。
**Room**数据存储库**支持返回Livedata对象**的可观察查询，当数据库更新时，Room 会生成更新 LiveData 对象所需的所有代码。在需要时，生成的代码会在后台线程上异步运行查询。此模式有助于使界面中显示的数据与存储在数据库中的数据保持同步。

#### Room是什么？
Room主要包含四个步骤：

- **Entity**：表示持有数据库行的类（即数据表结构）。对于每个实体，将会创建一个数据库表来持有他们。你必须通过Database类的entities数组来引用实体类。实体类的中的每个字段除了添加有 **@Ignore注解**外的，都会存放到数据库中。

- **Dao**：表示作为数据访问对象（DAO）的类或接口。DAO是Room的主要组件，负责定义访问数据库的方法。由 **@Database注解**标注的类必须包含一个无参数且返回使用 **@Dao注解**的类的抽象方法。当在编译生成代码时，Room创建该类的实现。

- **Database** ：用来创建一个数据库持有者。注解定义一系列实体，类的内容定义一系列DAO。它也是底层连接的主入口点。

- **Room** ：数据库的创建者 & 负责数据库版本更新的具体实现者

<!-- more -->

其关系图如下所示：
![Room关系图](https://power-blog-resources.oss-cn-beijing.aliyuncs.com/pic/room%E5%85%B3%E7%B3%BB%E5%9B%BE.png)

#### Room的基本使用

##### **1. 创建Entity实体（Entity）**
```java
@Entity
public class User {
    // 主键-设置自增长 默认false
    @PrimaryKey(autoGenerate = true)
    private int uid;
    // 数据表中的名字 默认字段名
    @ColumnInfo(name = "name")
    private String name;

    private int age;
    //注解该字段不加入数据表中
    @Ignore
    private String sex;
    //引用其它实体类
    @Embedded
    private Education mEducation;
    
    // ...省略getter and setter

    public class Education{
        private String HighSchool;
        private String University；
    }
}
```
我们先来介绍下实体类中的注解及其含义：

- `@Entity` ：数据表的实体类
- `@PrimaryKey` ：每一个实体类都需要一个唯一的标识即主键。
- `@ColumnInfo` ：数据表中字段的名字
- `@Ignore` ：标注不需要加入数据表中的属性
- `@Embedded` ：实体类中引用其它实体类
- `@ForeignKey` ：外键约束

**1.1 @Entity——实体类**

**1.1.1 指定表名**
用@Entity标注的类，**默认表示当前的类名即为表名**，当然我们也可以指定表名：
`@Entity(tableName = "other")`
**1.1.2 设置主键或复合主键**
我们也可以在@Entity中设置主键、复合主键：
这里注意：
***主键的字段不能为null，也不允许有重复值***
***复合主键的字段不能为null，所以需要加上@Nullable注解***
***复合主键只有主键都一致，才会覆盖，相当于&&***
```java
@Entity(primaryKeys = "uid")
public class User {...}

@Entity(primaryKeys = {"uid", "name"})
public class User {
    @Nullable //复合主键时需注意，不能为null
    private String name;
}
```
**1.1.3 设置索引**
数据库添加索引，可以提高数据库访问速度。
索引可以有**单列索引，组合索引及索引的唯一性**
**索引的唯一性unique = true，表示数据不可重复，但在组合索引中不作为条件依据**
```java
//单列索引          @Entity(indices = {@Index(value = "name")})
//单列索引唯一性      @Entity(indices = {@Index(value = "name", unique = true)})

//组合索引           @Entity(indices ={@Index(value = {"name","age"})})
//组合索引唯一性      @Entity(indices ={@Index(value = {"name","age"},unique = true)})

//当然可以混起来用 如下：
@Entity(indices ={@Index(value = "name"),@Index(value = {"name","age"},unique = true)})
public class User {...}
```
**1.1.4 外键约束**
我们再创建一个实体类Book
```java
@Entity(foreignKeys = @ForeignKey(entity = User.class,parentColumns = "uid",childColumns = "fatherId"))
public class Book{
    private int bookId;
    private String bookName;
    private int fatherId;
}
```
我们看下这段注解的含义：
它表示Book实体类**依附**于User实体类`entity = User.class`
并且注明父类User的列uid字段`parentColumns = "uid"`
子类Book的列fatherId字段`childColumns = "fatherId"`
表明了**子类的fatherId相当于父类uid（fatherId == uid）**
`@ForeignKey`还有两个属性`onDelete`和`onUpdate`
```java
@Entity(foreignKeys = @ForeignKey(onDelete = CASCADE,onUpdate = CASCADE,entity = User.class,parentColumns = "uid",childColumns = "fatherId"))
public class Book {...}
```
这里属性值有以下几种：
- **NO_ACTION**：当User中的uid有变化的时候Book中的father_id不做任何动作
- **RESTRICT**：当User中的uid在Book里有依赖的时候禁止对User做动作，做动作就会报错。
- **SET_NULL**：当User中的uid有变化的时候Book的fatherId会设置为NULL。
- **SET_DEFAULT**：当User中的uid有变化的时候Book的fatherId会设置为默认值，我这里是int型，那么会设置为0
- **CASCADE**：当User中的uid有变化的时候Book的fatherId跟着变化，假如我把uid = 1的数据删除，那么Book表里，fatherId = 1的都会被删除。

**1.2 @PrimaryKey——主键**
```java
public class User {
    //我们可以直接在字段上设置uid为主键
    @PrimaryKey
    private int uid;
    //想要自增长那么这样
    @PrimaryKey(autoGenerate = true)
    private int uid;
}
```

**1.3 @ColumnInfo——表中字段名**
```java
public class User {
    //默认实体类字段名为表中字段名
    private int uid;
    //指定后表里的key就是uid_
    @ColumnInfo(name = "uid_")
    private int uid;
}
```

**1.4 @Ignore——忽略字段，不添加进表中**
```java
public class User{
    //注解标记后 sex字段不会添加进数据表中
    @Ingore
    private String sex;
}
```

**1.5 @Embedded——引用其它实体类**
```java
public class User{
    @Embedded
    private Book book;
}
```
假如实体类中包含了多个同一类型的嵌入字段（比如一个人User拥有两本Book），我们可以通过设置`prefix`属性来保持每列的唯一性。`Room`会将提供的值添加到嵌入对象的每个列名的开头。
```java
//@Embedded(prefix = "one"),这个是区分唯一性的，
//比如说一这个人有2本书并添加了tag，那么在数据表中就会以prefix+属性值命名
@Embedded(prefix = "one")
private Book address;
@Embedded(prefix = "two")
private Book address;
```

##### **2. 创建数据访问对象（DAO）**
**Dao**以简洁的方式抽象了我们对数据库的访问。
**Dao**可以定义为接口或者抽象类。如果它是抽象类，它可以有一个`RoomDatabase`作为唯一参数的构造函数。
>**注意：**`Room`不允许在主线程中访问数据库，除非你可以builder上调用`allowMainThreadQueries()`，因为它可能会长时间锁住UI。
>异步查询（返回`LiveData`或`RxJava Flowable`的查询）则不受此影响，因为它们可以异步运行在后台线程上。

**Dao**的相关注解很简单，我们来看一下：
- `@Dao` ： 标注数据库操作的类。
- `@Query` ： 包含所有Sqlite语句操作。
- `@Insert` ： 标注数据库的插入操作。
- `@Delete` ： 标注数据库的删除操作。
- `@Update` ： 标注数据库的更新操作。
>这里不用过多叙述了，除了一个标注操作类的`@Dao`，其余就是增删改查了。

我们直接上代码：
```java
@Dao
public interface UserDao {
    //查询所有数据
    @Query("Select * from user")
    List<User> getAll();

    //删除全部数据
    @Query("DELETE FROM user")
    void deleteAll();

    //一次插入单条数据 或 多条
    //@Insert(onConflict = OnConflictStrategy.REPLACE),这个是干嘛的呢，下面有详细教程
    @Insert
    void insert(User... users);

    //一次删除单条数据 或 多条
    @Delete
    void delete(User... users);

    //一次更新单条数据 或 多条
    @Update
    void update(User... users);

    //根据字段去查找数据
    @Query("SELECT * FROM user WHERE uid= :uid")
    Person getUserByUid(int uid);

    //一次查找多个数据
    @Query("SELECT * FROM user WHERE uid IN (:userIds)")
    List<User> loadAllByIds(List<Integer> userIds);

    //多个条件查找
    @Query("SELECT * FROM user WHERE name = :name AND age = :age")
    Person getUserByNameage(String name, int age);
}
```
这里唯一特殊的就是`@Insert`。其有一段介绍：对数据库设计时，不允许重复数据的出现。否则，必然造成大量的冗余数据。实际上，难免会碰到这个问题：冲突。当我们像数据库插入数据时，该数据已经存在了，必然造成了冲突。该冲突该怎么处理呢？在`@Insert`注解中有`conflict`用于解决插入数据冲突的问题，其默认值为`OnConflictStrategy.ABORT`。对于`OnConflictStrategy`而言，它封装了Room解决冲突的相关策略。

- `OnConflictStrategy.REPLACE`：冲突策略是取代旧数据同时继续事务
- `OnConflictStrategy.ROLLBACK`：冲突策略是回滚事务
- `OnConflictStrategy.ABORT`：冲突策略是终止事务
- `OnConflictStrategy.FAIL`：冲突策略是事务失败
- `OnConflictStrategy.IGNORE`：冲突策略是忽略冲突

这里比如在插入的时候我们加上了`OnConflictStrategy.REPLACE`，那么往已经有uid=1的person表里再插入uid =1的person数据，那么**新数据会覆盖旧数据**。如果我们什么都不加，那么久是默认的OnConflictStrategy.ABORT，重复上面的动作，你会发现，**程序崩溃**了。也就是上面说的终止事务。

##### **3. 数据库持有者（Database）**
我们下来看下代码：
```java
//注解指定了database的表映射实体数据以及版本等信息(后面会详细讲解版本升级)
@Database(entities = {User.class, Book.class}, version = 1)
public abstract class AppDataBase extends RoomDatabase {
    public abstract UserDao getUserDao();
    
    public abstract BookDao getBookDao();
}
```
如果后期我们需要往已建的数据表中加入新的字段，或者增加新的索引，这时候就需要我们 
***对数据库版本进行升级***。
在`Room`中，我们需要在`Database`中修改版本信息，并添加`Migration`类，告诉`Room`是哪张表？改了什么内容？
```java

//修改version = 2
@Database(entities = {User.class, Book.class}, version = 2)
public abstract class AppDataBase extends RoomDatabase {
    public abstract UserDao getUserDao();
    public abstract BookDao getBookDao();
    //数据库变动添加Migration，简白的而说就是版本1到版本2改了什么东西
    public static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            //告诉user表，增添一个String类型的字段 job
            database.execSQL("ALTER TABLE user ADD COLUMN job TEXT");
        }
    };
}
//我们添加完了migration后，根据Room.builder把我们版本更新的信息add进去
//我们稍后会讲到
Room.databaseBuilder(...)
    //加上版本升级信息
    .addMigrations(AppDataBase.MIGRATION_1_2)
    .build();
```

##### **4. 数据库的创建者（Room）**
`Room`是数据库的创建者，在创建Database实例的时候，我们需要遵循单例模式，避免操作时创建多个Database实例，所以我们把它封装成单例：
```java
public class DBInstance {
    private static final String DB_NAME = "room_test";
    public static AppDataBase appDataBase;
    public static AppDataBase getInstance(){
        if(appDataBase==null){
            synchronized (DBInstance.class){
                if(appDataBase==null){
                    appDataBase = Room.databaseBuilder(App.getContext(), AppDataBase.class, DB_NAME)
                        //下面注释表示允许主线程进行数据库操作，但是不推荐这样做。
                        //我这里是为了Demo展示，稍后会介绍和LiveData、RxJava的使用
                        .allowMainThreadQueries()
                        .build();
                }
            }
        }
        return appDataBase;
    }
}
```

##### **5. 举个完整栗子~**
上面我们四个部分已经分析完毕了，我们接下来举一个完整栗子来贯穿一下`Room`的用法：
```java
// 1.首先我们创建实体类 Entity
@Entity
public class User {
    ...
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// 2.创建数据访问对象 UserDao ——提供增删改查接口
@Dao
public interface UserDao {
    //查询所有数据
    @Query("Select * from user")
    List<User> getAll();
    ...
    //多个条件查找
    @Query("SELECT * FROM user WHERE name = :name AND age = :age")
    Person getUserByNameage(String name, int age);
}

// 3.创建数据库持有者 Database
@Database(entities = {User.class, Book.class}, version = 2)
public abstract class AppDataBase extends RoomDatabase {
    public abstract UserDao getUserDao();
    public abstract BookDao getBookDao();
    //数据库变动添加Migration，简白的而说就是版本1到版本2改了什么东西
    public static final Migration MIGRATION_1_2 = new Migration(1, 2) {
        @Override
        public void migrate(SupportSQLiteDatabase database) {
            //告诉user表，增添一个String类型的字段 job
            database.execSQL("ALTER TABLE user ADD COLUMN job TEXT");
        }
    };
}

//4. 实例化并操作数据库
public class MainActivity extends AppCompatActivity {
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_insert:
                User user = new User("Room", 18);
                DBInstance.getInstance().getUserDao().insert(user);
                break;
            ...
        }
    }
}
```

#### Room结合LiveData使用
上文之中我们在单例模式中提到了
```java 
Room.databaseBuilder(...)
    //允许在主线程中查询
    .allowMainThreadQueries()
    .build();
```
如果数据库中数据庞大，会导致阻塞UI，进而带来不好的用户体验，那么我们选择用`Livedata`就可以解决这一问题。
我们以上一篇Viewmodel中的栗子来说（省略以上Room四个步骤）：
```java
public class MyViewModel extends ViewModel {
    //如果不熟悉Livedata用法可以阅读我关于Livedata的博客
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
            //存进数据库
            DBInstance.getInstance().getUserDao().insert(users);
            //数据库中查询所有
            query();
        });
    }
    public void query(){
        //getAll()返回Livedata对象
        DBInstance.getInstance().getUserDao().getAll()
            .observe(this, new Observer<List<User>>() {
                    @Override
                    public void onChanged(List<User> users) {
                        //查询到所有user用户
                    }
                });
    }
}
```

#### 参考&感谢
[Android从零开始搭建MVVM架构（4）————Room（从入门到进阶）](https://juejin.im/post/5d9fdacaf265da5bb86ac12c#heading-18)

[玩Android](https://www.wanandroid.com/)

#### 总结
以上就是我们最新学习的系统架构组件之一的——`Room`，相信我们通过文章的四部过程，完美诠释了数据库从创建，操作，版本更新，及配合`Livedata`的使用步骤，我也相信各位小伙伴已经掌握了它的大部分使用原理，当然了`Room`还有更多的细节等待着我们去探索。
至此，我的**Android架构组件系列**主体部分均已讲解完毕了，或许有人会问到为什么没有和**MVVM**架构完美匹配的`Databinding`的讲解呢?
其实，关于`Databinding`我也已经学习及了解过了，它可以将数据和`xml`进行绑定，当数据发生变化时会自动更新UI，这确实帮助我们有效的减少了`view`组件中不少的亢余代码，然而也带了一些缺点，比如复杂页面`xml`会很沉重，以及代码阅读性、单元测试及定位bug起到了负面作用。
所以我这次决定搭建的MVVM框架剔除了对`databinding`的依赖。那么下来我们就开始搭建**MVVM**之旅吧~

#### Android架构组件系列文章
[我的博客（Power）](https://powerofandroid.com/)
[Android架构组件（一）：Lifecycle](https://www.jianshu.com/p/6a6086ee1c07)
[Android架构组件（二）：LiveData](https://www.jianshu.com/p/c13e240c9989)
[Android架构组件（三）：Viewmodel](https://www.jianshu.com/p/be3f7b4b9974)
[Android架构组件（四）：Room](https://www.jianshu.com/p/cf05150335df)

**感谢您的阅读和支持！**