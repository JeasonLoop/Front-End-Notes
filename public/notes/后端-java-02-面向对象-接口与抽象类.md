---
title: 接口与抽象类
category: 后端
---
# 接口与抽象类

## 接口基础

接口是 Java 中定义行为契约的方式，一个类可以实现多个接口。

```java
// 定义接口
public interface Animal {
    // 接口中的变量默认是 public static final
    String SPECIES = "动物";

    // 接口中的方法默认是 public abstract（Java 8 之前）
    void eat();

    void sleep();

    // 默认方法（Java 8+）
    default void move() {
        System.out.println("动物在移动");
    }

    // 静态方法（Java 8+）
    static void showInfo() {
        System.out.println("这是 Animal 接口");
    }

    // 私有方法（Java 9+）
    private void helper() {
        System.out.println("辅助方法");
    }
}

// 实现接口
class Dog implements Animal {
    @Override
    public void eat() {
        System.out.println("狗在吃东西");
    }

    @Override
    public void sleep() {
        System.out.println("狗在睡觉");
    }

    @Override
    public void move() {
        System.out.println("狗在跑");
        // 可以调用接口默认方法
        // Animal.super.move();  // 调用接口默认方法
    }
}

class Cat implements Animal {
    @Override
    public void eat() {
        System.out.println("猫在吃东西");
    }

    @Override
    public void sleep() {
        System.out.println("猫在睡觉");
    }
}
```

## 多接口实现

```java
// 可游泳接口
interface Swimmer {
    void swim();
}

// 可飞行接口
interface Flyer {
    void fly();
}

// 潜水器类（可游泳）
class Submarine implements Swimmer {
    @Override
    public void swim() {
        System.out.println("潜水器在水下航行");
    }
}

// 鸭子类（既可游泳也可飞行）
class Duck implements Swimmer, Flyer {
    @Override
    public void swim() {
        System.out.println("鸭子在游泳");
    }

    @Override
    public void fly() {
        System.out.println("鸭子在飞行");
    }
}

// 测试多接口实现
class MultiInterfaceDemo {
    public static void main(String[] args) {
        Submarine sub = new Submarine();
        sub.swim();

        Duck duck = new Duck();
        duck.swim();
        duck.fly();

        // 接口类型引用
        Swimmer swimmer = new Duck();
        swimmer.swim();
        // swimmer.fly();  // 编译错误：Swimmer 接口没有 fly 方法

        Flyer flyer = new Duck();
        flyer.fly();
    }
}
```

## 接口继承

```java
// 基础接口
interface Vehicle {
    void start();
    void stop();
}

// 扩展接口
interface Car extends Vehicle {
    void honk();

    // 可以添加默认方法
    default void playMusic() {
        System.out.println("播放音乐");
    }
}

interface Electric {
    void charge();
}

// 多重继承接口
interface ElectricCar extends Car, Electric {
    void autoPilot();
}

// 实现扩展接口
class Tesla implements ElectricCar {
    @Override
    public void start() {
        System.out.println("特斯拉启动");
    }

    @Override
    public void stop() {
        System.out.println("特斯拉停止");
    }

    @Override
    public void honk() {
        System.out.println("特斯拉鸣笛");
    }

    @Override
    public void charge() {
        System.out.println("特斯拉充电中");
    }

    @Override
    public void autoPilot() {
        System.out.println("自动驾驶启动");
    }
}
```

## 函数式接口

```java
import java.util.function.*;

// 自定义函数式接口
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

class FunctionalInterfaceDemo {
    public static void main(String[] args) {
        // 使用 Lambda 表达式实现函数式接口
        Calculator add = (a, b) -> a + b;
        Calculator multiply = (a, b) -> a * b;

        System.out.println("10 + 20 = " + add.calculate(10, 20));
        System.out.println("10 * 20 = " + multiply.calculate(10, 20));

        // 常用内置函数式接口

        // Predicate: 接收参数，返回 boolean
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println("4 是偶数: " + isEven.test(4));

        // Function: 接收参数，返回结果
        Function<String, Integer> stringLength = s -> s.length();
        System.out.println("Hello 长度: " + stringLength.apply("Hello"));

        // Consumer: 接收参数，无返回值
        Consumer<String> printer = s -> System.out.println("打印: " + s);
        printer.accept("测试");

        // Supplier: 无参数，返回结果
        Supplier<Double> random = () -> Math.random();
        System.out.println("随机数: " + random.get());

        // BiFunction: 两个参数，一个结果
        BiFunction<Integer, Integer, Integer> power = (base, exp) -> (int) Math.pow(base, exp);
        System.out.println("2^10 = " + power.apply(2, 10));

        // 方法引用
        Function<String, Integer> lengthRef = String::length;
        System.out.println("方法引用: " + lengthRef.apply("测试"));
    }
}
```

## 抽象类与接口对比

```java
// 抽象类：可以有实现的方法、成员变量
abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // 抽象方法
    public abstract double area();

    // 具体方法
    public void setColor(String color) {
        this.color = color;
    }

    public String getColor() {
        return color;
    }
}

// 接口：只有方法签名（除了 default 方法）
interface Drawable {
    void draw();
}

// 圆形类继承抽象类，实现接口
class Circle extends Shape implements Drawable {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {
        System.out.println("绘制 " + color + " 的圆形");
    }
}

// 对比总结
/*
┌─────────────┬─────────────────┬─────────────────┐
│    特性      │     抽象类       │      接口        │
├─────────────┼─────────────────┼─────────────────┤
│    继承      │    单继承        │   多实现          │
│   成员变量    │   可以有各种类型  │   常量          │
│   方法实现    │   可以有具体方法  │   default 方法   │
│   构造方法    │   可以有构造方法  │   无构造方法      │
│    修饰符     │   可以用各种修饰符│   默认 public    │
│   设计目的    │   是一种"是什么" │   是一种"能做什么"│
└─────────────┴─────────────────┴─────────────────┘
*/
```

## 常用接口示例

```java
import java.util.*;

class CommonInterfacesDemo {
    public static void main(String[] args) {
        // 1. Comparable：自然排序接口
        List<Student> students = new ArrayList<>();
        students.add(new Student("张三", 25));
        students.add(new Student("李四", 20));
        students.add(new Student("王五", 23));

        Collections.sort(students);
        System.out.println("按年龄排序: " + students);

        // 2. Comparator：自定义排序
        students.sort((s1, s2) -> s1.name.compareTo(s2.name));
        System.out.println("按姓名排序: " + students);

        // 3. Runnable：线程任务
        Runnable task = () -> System.out.println("执行任务");
        Thread thread = new Thread(task);
        thread.start();

        // 4. Serializable：序列化接口（标记接口）
        SerializableClass obj = new SerializableClass();
        // 可以进行序列化操作

        // 5. Cloneable：克隆接口（标记接口）
        // 实现 Cloneable 后可以调用 clone() 方法

        // 6. Iterable：可迭代接口
        MyContainer<String> container = new MyContainer<>();
        container.add("A");
        container.add("B");
        for (String item : container) {
            System.out.println(item);
        }
    }
}

class Student implements Comparable<Student> {
    String name;
    int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Student other) {
        return this.age - other.age;  // 按年龄升序
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
}

class SerializableClass implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    // 可序列化的内容
}

class MyContainer<T> implements Iterable<T> {
    private List<T> items = new ArrayList<>();

    public void add(T item) {
        items.add(item);
    }

    @Override
    public Iterator<T> iterator() {
        return items.iterator();
    }
}
```

## 接口最佳实践

```java
// 1. 接口命名通常是动词或能力描述
interface Drawable { }      // 可绘制
interface Flyable { }       // 可飞行
interface Comparable<T> { } // 可比较

// 2. 接口应该简洁专注
// 好的接口
interface Readable {
    String read();
}

interface Writable {
    void write(String content);
}

// 不好的接口（职责太多）
interface FileOperations {
    String read();
    void write(String content);
    void copy();
    void delete();
    void move();
}

// 3. 接口隔离原则
interface Animal {
    void eat();
    void sleep();
}

interface Flyable {
    void fly();
}

// 只给需要的接口
class Bird implements Animal, Flyable {
    // ...
}

class Fish implements Animal {
    // 不需要实现 Flyable
}

// 4. 默认方法谨慎使用
interface Logger {
    void log(String message);

    default void info(String message) {
        log("[INFO] " + message);
    }

    default void error(String message) {
        log("[ERROR] " + message);
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| 无接口概念 | `interface` | Java 有接口 |
| 通过 prototype 继承 | `implements` | 实现方式不同 |
| 无抽象类 | `abstract class` | Java 有抽象类 |
| 默认多继承 | 单继承多实现 | Java 更严格 |
| 无默认方法（ES6+） | `default` 方法 | Java 8+ 支持 |
| 函数式接口 | 类似函数类型 | Java 8+ 支持 |

---

## 下一篇

[内部类](./内部类.md)
