---
title: 类与对象
category: 后端
---
# 类与对象

## 面向对象基本概念

```
面向对象三大特性
├── 封装（Encapsulation）
│   └── 隐藏内部实现，暴露必要接口
├── 继承（Inheritance）
│   └── 子类继承父类的属性和方法
└── 多态（Polymorphism）
    └── 同一方法在不同对象上有不同行为
```

## 类的定义

```java
public class Person {
    // 成员变量（字段）
    private String name;      // 私有，封装
    private int age;
    public String address;     // 公开
    protected String phone;   // 受保护
    String email;             // 默认访问权限（包私有）

    // 静态变量（类变量）
    public static String species = "人类";

    // 常量
    private static final int MAX_AGE = 150;

    // 构造方法
    public Person() {
        this.name = "未知";
        this.age = 0;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 成员方法
    public void introduce() {
        System.out.println("我叫 " + name + "，今年 " + age + " 岁");
    }

    // getter 和 setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age >= 0 && age <= MAX_AGE) {
            this.age = age;
        }
    }

    // 静态方法
    public static String getSpecies() {
        return species;
    }
}
```

## 对象的创建与使用

```java
public class PersonDemo {
    public static void main(String[] args) {
        // 创建对象（实例化）
        Person p1 = new Person();
        Person p2 = new Person("张三", 25);

        // 使用对象
        p1.introduce();  // 我叫 未知，今年 0 岁
        p2.introduce();  // 我叫 张三，今年 25 岁

        // 使用 setter
        p1.setName("李四");
        p1.setAge(30);
        p1.introduce();  // 我叫 李四，今年 30 岁

        // 使用 getter
        System.out.println("名字: " + p1.getName());

        // 访问静态变量
        System.out.println("物种: " + Person.species);

        // 调用静态方法
        System.out.println("物种: " + Person.getSpecies());

        // 对象比较
        Person p3 = p1;
        System.out.println(p1 == p3);  // true（同一对象）
        System.out.println(p1 == p2);  // false（不同对象）
    }
}
```

## this 关键字

```java
public class ThisDemo {
    private String name;
    private int age;

    public ThisDemo(String name, int age) {
        // this 区分成员变量和局部变量
        this.name = name;
        this.age = age;
    }

    // this 调用其他构造方法
    public ThisDemo(String name) {
        this(name, 0);  // 调用有参构造
    }

    // this 调用当前对象的方法
    public void printInfo() {
        this.introduce();  // this 可以省略
    }

    private void introduce() {
        System.out.println("Name: " + this.name + ", Age: " + this.age);
    }

    // this 返回当前对象
    public ThisDemo setName(String name) {
        this.name = name;
        return this;  // 链式调用
    }

    public ThisDemo setAge(int age) {
        this.age = age;
        return this;
    }

    public static void main(String[] args) {
        ThisDemo demo = new ThisDemo("张三");
        demo.printInfo();

        // 链式调用
        demo.setName("李四").setAge(25).printInfo();
    }
}
```

## 静态成员

```java
public class StaticDemo {
    private int instanceVar = 0;     // 实例变量
    private static int staticVar = 0; // 静态变量

    // 实例方法
    public void instanceMethod() {
        instanceVar++;
        staticVar++;
    }

    // 静态方法
    public static void staticMethod() {
        // instanceVar++;  // 错误：不能访问实例变量
        staticVar++;
    }

    // 静态代码块（类加载时执行一次）
    static {
        System.out.println("静态代码块执行");
        staticVar = 100;
    }

    // 实例代码块（每次创建对象时执行）
    {
        System.out.println("实例代码块执行");
    }

    public static void main(String[] args) {
        System.out.println("staticVar: " + StaticDemo.staticVar);

        StaticDemo obj1 = new StaticDemo();
        obj1.instanceMethod();
        System.out.println("obj1调用后 staticVar: " + staticVar);

        StaticDemo obj2 = new StaticDemo();
        obj2.instanceMethod();
        System.out.println("obj2调用后 staticVar: " + staticVar);
    }
}
```

## 访问修饰符

| 修饰符 | 同一类 | 同一包 | 子类 | 其他包 |
|--------|--------|--------|------|--------|
| public | ✓ | ✓ | ✓ | ✓ |
| protected | ✓ | ✓ | ✓ | ✗ |
| 默认（无） | ✓ | ✓ | ✗ | ✗ |
| private | ✓ | ✗ | ✗ | ✗ |

```java
public class AccessModifierDemo {
    public String publicVar = "public";      // 任何地方可访问
    protected String protectedVar = "protected"; // 子类和同包可访问
    String defaultVar = "default";           // 同包可访问
    private String privateVar = "private";   // 仅本类可访问

    public void publicMethod() {}
    protected void protectedMethod() {}
    void defaultMethod() {}
    private void privateMethod() {}
}
```

## 内部类

```java
public class InnerClassDemo {
    private int outerVar = 10;

    // 成员内部类
    public class InnerClass {
        private int innerVar = 20;

        public void display() {
            System.out.println("外部变量: " + outerVar);  // 可访问外部类成员
            System.out.println("内部变量: " + innerVar);
        }
    }

    // 静态内部类
    public static class StaticInnerClass {
        private int staticInnerVar = 30;

        public void display() {
            // System.out.println(outerVar);  // 不能访问外部类实例成员
            System.out.println("内部变量: " + staticInnerVar);
        }
    }

    // 局部内部类
    public void methodWithLocalClass() {
        final int localVar = 40;

        class LocalClass {
            public void display() {
                System.out.println("外部变量: " + outerVar);
                System.out.println("局部变量: " + localVar);
            }
        }

        LocalClass local = new LocalClass();
        local.display();
    }

    // 匿名内部类
    public void methodWithAnonymousClass() {
        // 实现接口
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("匿名内部类实现Runnable");
            }
        };
        runnable.run();

        // 继承类
        Thread thread = new Thread("新线程") {
            @Override
            public void run() {
                System.out.println(getName() + " 运行中");
            }
        };
        thread.start();
    }

    public static void main(String[] args) {
        InnerClassDemo outer = new InnerClassDemo();

        // 使用成员内部类
        InnerClass inner = outer.new InnerClass();
        inner.display();

        // 使用静态内部类
        StaticInnerClass staticInner = new StaticInnerClass();
        staticInner.display();

        // 使用局部内部类
        outer.methodWithLocalClass();

        // 使用匿名内部类
        outer.methodWithAnonymousClass();
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `class Person {}` | `public class Person {}` | 相似 |
| `constructor() {}` | 构造方法名与类名相同 | 语法不同 |
| 无访问修饰符 | `public/private/protected` | Java更严格 |
| `this.name = name` | `this.name = name` | 相同 |
| `static count = 0` | `private static int count = 0;` | 声明方式不同 |
| 内部类支持有限 | 支持多种内部类 | Java更完整 |
| 无包概念 | 有包概念 | Java有模块化 |

---

## 下一篇

[继承与多态](./继承与多态.md)
