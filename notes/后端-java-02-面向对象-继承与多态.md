---
title: 继承与多态
category: 后端
---
# 继承与多态

## 继承

Java 使用 `extends` 关键字实现继承，单继承机制。

```java
// 父类
class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " 在吃东西");
    }

    public void sleep() {
        System.out.println(name + " 在睡觉");
    }

    public void introduce() {
        System.out.println("我叫 " + name + "，今年 " + age + " 岁");
    }
}

// 子类
class Dog extends Animal {
    private String breed; // 品种

    public Dog(String name, int age, String breed) {
        super(name, age);  // 调用父类构造方法
        this.breed = breed;
    }

    // 重写父类方法
    @Override
    public void eat() {
        System.out.println(name + " (" + breed + ") 在吃狗粮");
    }

    // 新增方法
    public void bark() {
        System.out.println(name + " 汪汪叫");
    }

    // 调用父类方法
    public void superEat() {
        super.eat();  // 调用父类的 eat 方法
    }
}

// 另一个子类
class Cat extends Animal {
    private String color;

    public Cat(String name, int age, String color) {
        super(name, age);
        this.color = color;
    }

    @Override
    public void eat() {
        System.out.println(name + " (" + color + ") 在吃猫粮");
    }

    public void meow() {
        System.out.println(name + " 喵喵叫");
    }
}
```

## super 关键字

```java
class Vehicle {
    protected String brand;

    public Vehicle(String brand) {
        this.brand = brand;
        System.out.println("Vehicle 构造方法");
    }

    public void start() {
        System.out.println("Vehicle 启动");
    }
}

class Car extends Vehicle {
    private String model;

    public Car(String brand, String model) {
        super(brand);  // 必须是第一行
        this.model = model;
        System.out.println("Car 构造方法");
    }

    @Override
    public void start() {
        super.start();  // 调用父类方法
        System.out.println(brand + " " + model + " 启动引擎");
    }

    public void showInfo() {
        System.out.println("品牌: " + super.brand);  // 访问父类成员
    }
}
```

## 方法重写（Override）

```java
class Shape {
    protected String name;

    public Shape(String name) {
        this.name = name;
    }

    public double area() {
        return 0;
    }

    public double perimeter() {
        return 0;
    }
}

class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        super("圆形");
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * radius;
    }
}

class Rectangle extends Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        super("矩形");
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }

    @Override
    public double perimeter() {
        return 2 * (width + height);
    }
}

// 重写规则
class OverrideRules {
    /*
    1. 方法名、参数列表必须相同
    2. 返回类型可以相同或为父类返回类型的子类
    3. 访问权限不能更严格
    4. 不能抛出新的或更宽泛的检查异常
    5. 使用 @Override 注解（推荐）
    */
}
```

## 多态

```java
public class PolymorphismDemo {
    public static void main(String[] args) {
        // 多态：父类引用指向子类对象
        Animal animal1 = new Dog("旺财", 3, "金毛");
        Animal animal2 = new Cat("咪咪", 2, "白色");

        // 调用重写的方法
        animal1.eat();  // 调用 Dog 的 eat
        animal2.eat();  // 调用 Cat 的 eat

        // 调用非重写的方法
        animal1.sleep();  // 继承自 Animal
        animal2.sleep();  // 继承自 Animal

        // 类型判断和转换
        if (animal1 instanceof Dog) {
            Dog dog = (Dog) animal1;
            dog.bark();
        }

        if (animal2 instanceof Cat cat) {  // Java 16+ 模式匹配
            cat.meow();
        }

        // 多态数组
        Animal[] animals = {
            new Dog("大黄", 2, "哈士奇"),
            new Cat("小白", 1, "黑色"),
            new Dog("小黑", 4, "拉布拉多")
        };

        for (Animal animal : animals) {
            animal.eat();  // 根据实际类型调用对应方法
            animal.introduce();
        }

        // 多态参数
        feedAnimal(animal1);
        feedAnimal(animal2);
    }

    public static void feedAnimal(Animal animal) {
        animal.eat();
    }
}
```

## 动态绑定

```java
class Parent {
    public void method1() {
        System.out.println("Parent.method1()");
        method2();  // 调用子类的 method2（动态绑定）
    }

    public void method2() {
        System.out.println("Parent.method2()");
    }
}

class Child extends Parent {
    @Override
    public void method1() {
        System.out.println("Child.method1()");
        super.method1();  // 调用父类 method1
    }

    @Override
    public void method2() {
        System.out.println("Child.method2()");
    }
}

// 动态绑定示例
class DynamicBinding {
    public static void main(String[] args) {
        Parent p = new Child();
        p.method1();
        /*
        输出:
        Child.method1()
        Parent.method1()
        Child.method2()  <- 动态绑定，调用子类方法
        */
    }
}
```

## Object 类

```java
class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 重写 equals
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Person person = (Person) obj;
        return age == person.age && name.equals(person.name);
    }

    // 重写 hashCode（与 equals 一致）
    @Override
    public int hashCode() {
        return 31 * name.hashCode() + age;
    }

    // 重写 toString
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }

    // 重写 clone（需要实现 Cloneable）
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

## final 关键字

```java
// final 类不能被继承
final class FinalClass {
    // final 变量不能被修改
    private final int CONSTANT = 100;

    // final 方法不能被重写
    public final void finalMethod() {
        System.out.println("不能被重写的方法");
    }
}

// 编译错误：不能继承 final 类
// class SubClass extends FinalClass { }

class FinalDemo {
    // final 成员变量必须初始化
    private final int value = 10;

    // 或者通过构造方法初始化
    private final int value2;

    public FinalDemo(int value2) {
        this.value2 = value2;
    }

    // final 方法
    public final void cannotOverride() {
        System.out.println("final 方法");
    }
}

// final 参数
class FinalParam {
    public void method(final int x) {
        // x = 10;  // 编译错误：final 参数不能修改
        System.out.println(x);
    }
}
```

## 抽象类

```java
// 抽象类
abstract class GraphicObject {
    protected int x, y;

    public GraphicObject(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // 抽象方法（没有实现）
    public abstract void draw();

    // 具体方法
    public void moveTo(int newX, int newY) {
        this.x = newX;
        this.y = newY;
    }
}

class Circle extends GraphicObject {
    private int radius;

    public Circle(int x, int y, int radius) {
        super(x, y);
        this.radius = radius;
    }

    @Override
    public void draw() {
        System.out.println("在 (" + x + ", " + y + ") 绘制半径为 " + radius + " 的圆形");
    }
}

class Rectangle extends GraphicObject {
    private int width, height;

    public Rectangle(int x, int y, int width, int height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    @Override
    public void draw() {
        System.out.println("在 (" + x + ", " + y + ") 绘制 " + width + "x" + height + " 的矩形");
    }
}
```

## 模板方法模式

```java
abstract class DataProcessor {
    // 模板方法（定义算法骨架）
    public final void process() {
        loadData();
        processData();
        if (needSave()) {
            saveData();
        }
    }

    protected abstract void loadData();

    protected abstract void processData();

    protected abstract void saveData();

    // 钩子方法（子类可以选择性重写）
    protected boolean needSave() {
        return true;
    }
}

class CSVProcessor extends DataProcessor {
    @Override
    protected void loadData() {
        System.out.println("加载 CSV 数据");
    }

    @Override
    protected void processData() {
        System.out.println("处理 CSV 数据");
    }

    @Override
    protected void saveData() {
        System.out.println("保存 CSV 数据");
    }

    @Override
    protected boolean needSave() {
        return false;  // CSV 不需要保存
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `class Dog extends Animal` | `class Dog extends Animal` | 语法相似 |
| `super()` | `super()` | 调用父类构造 |
| `super.method()` | `super.method()` | 调用父类方法 |
| 多重继承（通过 prototype） | 单继承 | Java 更严格 |
| 无抽象类概念 | `abstract class` | Java 有抽象类 |
| 无 final 关键字 | `final` | Java 有不可变 |
| `instanceof` | `instanceof` | 类型检查相同 |
| 无重写注解 | `@Override` | Java 有注解检查 |

---

## 下一篇

[接口与抽象类](./接口与抽象类.md)
