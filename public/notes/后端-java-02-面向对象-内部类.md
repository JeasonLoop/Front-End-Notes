---
title: 内部类
category: 后端
---
# 内部类

## 内部类概述

Java 支持四种内部类：

```
内部类类型
├── 成员内部类
│   └── 定义在类中，作为类的成员
├── 静态内部类
│   └── 使用 static 修饰
├── 局部内部类
│   └── 定义在方法或代码块中
└── 匿名内部类
    └── 没有名字的内部类，常用作一次性实现
```

## 成员内部类

```java
public class OuterClass {
    private String outerField = "外部类字段";
    private static int staticField = 100;

    // 成员内部类
    class InnerClass {
        private String innerField = "内部类字段";

        public void display() {
            // 访问外部类的成员
            System.out.println(outerField);
            System.out.println(staticField);
            System.out.println(innerField);

            // 使用 OuterClass.this 访问外部类实例
            System.out.println(OuterClass.this.outerField);
        }
    }

    public void createInner() {
        InnerClass inner = new InnerClass();
        inner.display();
    }

    // 创建内部类实例
    public InnerClass getInnerInstance() {
        return new InnerClass();
    }
}

// 测试
class TestInner {
    public static void main(String[] args) {
        // 方式1：通过外部类方法创建
        OuterClass outer = new OuterClass();
        outer.createInner();

        // 方式2：通过 new 关键字创建
        OuterClass.InnerClass inner = outer.new InnerClass();
        inner.display();
    }
}
```

## 静态内部类

```java
public class OuterClass {
    private String instanceField = "实例字段";
    private static String staticField = "静态字段";

    // 静态内部类
    static class StaticInnerClass {
        private String innerField = "内部类字段";

        public void display() {
            // 不能访问外部类的实例成员
            // System.out.println(instanceField);  // 编译错误

            // 可以访问外部类的静态成员
            System.out.println(staticField);
            System.out.println(innerField);
        }
    }

    // 创建静态内部类实例
    public StaticInnerClass getStaticInnerInstance() {
        return new StaticInnerClass();
    }
}

// 测试
class TestStaticInner {
    public static void main(String[] args) {
        // 静态内部类可以直接通过外部类名创建
        OuterClass.StaticInnerClass inner = new OuterClass.StaticInnerClass();
        inner.display();
    }
}

// 实际应用：链表节点
class MyLinkedList<T> {
    private Node<T> head;

    // 静态内部类表示节点
    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
        }
    }

    public void add(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> current = head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }
}
```

## 局部内部类

```java
public class LocalInnerClass {
    private String outerField = "外部类字段";

    public void methodWithLocalClass() {
        // 局部内部类（定义在方法内）
        class LocalClass {
            private String localField = "局部内部类字段";

            public void display() {
                System.out.println(outerField);
                System.out.println(localField);
            }
        }

        LocalClass local = new LocalClass();
        local.display();
    }

    // 使用局部变量
    public void methodWithEffectiveFinal() {
        final int x = 10;  // 或实际上 final 的变量（不修改）
        int y = 20;        // Java 8+，如果不修改相当于 final

        class LocalClass {
            public void display() {
                System.out.println("x = " + x);
                System.out.println("y = " + y);
                // y++;  // 编译错误：不能修改
            }
        }
    }

    // 实际应用：返回特定行为
    public Action createAction() {
        class MyAction implements Action {
            private String prefix = ">> ";

            @Override
            public void execute(String message) {
                System.out.println(prefix + message);
            }
        }
        return new MyAction();
    }
}

interface Action {
    void execute(String message);
}
```

## 匿名内部类

```java
import javax.swing.*;
import java.awt.event.*;
import java.util.*;

public class AnonymousInnerClass {

    // 1. 接口实现
    public void interfaceExample() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("匿名内部类执行任务");
            }
        };
        runnable.run();
    }

    // 2. 类继承
    public void classExample() {
        Thread thread = new Thread() {
            @Override
            public void run() {
                System.out.println("匿名 Thread 子类");
            }
        };
        thread.start();
    }

    // 3. 事件监听器（经典用法）
    public void eventListenerExample() {
        JButton button = new JButton("点击我");

        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println("按钮被点击");
            }
        });
    }

    // 4. 排序比较器
    public void comparatorExample() {
        List<String> names = Arrays.asList("张三", "李四", "王五");

        Collections.sort(names, new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                return s2.compareTo(s1);  // 降序
            }
        });

        System.out.println(names);
    }

    // 5. 一性使用
    public void oneTimeUse() {
        // 创建并立即使用
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("一次性任务");
            }
        }).start();
    }
}

// Lambda 等价写法（Java 8+）
class LambdaEquivalent {
    public void lambdaExamples() {
        // 接口匿名内部类 -> Lambda
        Runnable runnable = () -> System.out.println("Lambda 执行任务");

        // 比较器匿名内部类 -> Lambda
        List<String> names = Arrays.asList("张三", "李四", "王五");
        Collections.sort(names, (s1, s2) -> s2.compareTo(s1));

        // 事件监听器匿名内部类 -> Lambda
        ActionListener listener = e -> System.out.println("按钮被点击");
    }
}
```

## 双重检查锁（使用静态内部类）

```java
public class Singleton {
    private Singleton() {
        System.out.println("Singleton 创建");
    }

    // 静态内部类实现懒加载单例
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Holder.INSTANCE;
    }
}

// 测试
class SingletonTest {
    public static void main(String[] args) {
        Singleton s1 = Singleton.getInstance();
        Singleton s2 = Singleton.getInstance();
        System.out.println(s1 == s2);  // true
    }
}
```

## 内部类完整示例

```java
import java.util.ArrayList;
import java.util.List;

public class InnerClassExample {
    private static int staticCount = 0;
    private int instanceCount = 0;

    // 静态内部类：计数器
    public static class Counter {
        private int count = 0;

        public void increment() {
            count++;
            staticCount++;
        }

        public int getCount() {
            return count;
        }
    }

    // 成员内部类：任务
    public class Task implements Runnable {
        private String name;

        public Task(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            instanceCount++;
            System.out.println(name + " 执行，实例计数: " + instanceCount);
        }
    }

    // 方法内使用局部内部类
    public List<Runnable> createTasks(String[] taskNames) {
        List<Runnable> tasks = new ArrayList<>();

        for (String name : taskNames) {
            class NamedTask implements Runnable {
                private final String taskName;

                NamedTask(String taskName) {
                    this.taskName = taskName;
                }

                @Override
                public void run() {
                    System.out.println("执行: " + taskName);
                }
            }
            tasks.add(new NamedTask(name));
        }

        return tasks;
    }

    // 使用匿名内部类
    public Runnable createAnonymousTask(String message) {
        return new Runnable() {
            @Override
            public void run() {
                System.out.println("匿名任务: " + message);
            }
        };
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| 函数内部定义函数 | 方法内定义类 | 概念相似 |
| 无 inner class 概念 | 多种内部类 | Java 更完善 |
| 闭包捕获变量 | 内部类捕获外部变量 | 机制相似 |
| `() => {}` 箭头函数 | 匿名内部类/Lambda | Java 8+ 类似 |
| 没有静态内部类 | `static class` | Java 特有 |
| 没有嵌套访问限制 | `Outer.this` 访问 | Java 更明确 |

---

## 下一篇

[枚举](./枚举.md)
