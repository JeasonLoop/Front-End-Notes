---
title: 函数与方法
category: 后端
---
# 函数与方法

## 方法定义

### 基本语法

```java
public class MethodDefinition {
    // 访问修饰符 返回类型 方法名(参数列表) { 方法体 }

    // 无参无返回值
    public void sayHello() {
        System.out.println("Hello!");
    }

    // 有参无返回值
    public void sayHelloTo(String name) {
        System.out.println("Hello, " + name + "!");
    }

    // 有参有返回值
    public int add(int a, int b) {
        return a + b;
    }

    // 多个参数
    public double calculate(int a, int b, String operation) {
        return switch (operation) {
            case "add" -> a + b;
            case "sub" -> a - b;
            case "mul" -> a * b;
            case "div" -> (double) a / b;
            default -> 0;
        };
    }

    // 可变参数
    public int sum(int... numbers) {
        int total = 0;
        for (int num : numbers) {
            total += num;
        }
        return total;
    }

    public static void main(String[] args) {
        MethodDefinition obj = new MethodDefinition();

        obj.sayHello();
        obj.sayHelloTo("张三");

        int result = obj.add(5, 3);
        System.out.println("5 + 3 = " + result);

        double calcResult = obj.calculate(10, 2, "div");
        System.out.println("10 / 2 = " + calcResult);

        int sum = obj.sum(1, 2, 3, 4, 5);
        System.out.println("Sum = " + sum);
    }
}
```

### 参数传递

```java
public class ParameterPassing {
    // 基本类型是值传递
    public static void modifyPrimitive(int num) {
        num = 100;  // 不会影响调用者的变量
    }

    // 引用类型传递的是引用
    public static void modifyArray(int[] arr) {
        arr[0] = 100;  // 会影响原数组
    }

    // 引用类型重新赋值不会影响原引用
    public static void replaceArray(int[] arr) {
        arr = new int[]{100, 200, 300};  // 不会影响原引用
    }

    public static void main(String[] args) {
        // 基本类型
        int x = 10;
        modifyPrimitive(x);
        System.out.println("x = " + x);  // 10

        // 引用类型 - 修改内容
        int[] arr1 = {1, 2, 3};
        modifyArray(arr1);
        System.out.println("arr1[0] = " + arr1[0]);  // 100

        // 引用类型 - 重新赋值
        int[] arr2 = {1, 2, 3};
        replaceArray(arr2);
        System.out.println("arr2[0] = " + arr2[0]);  // 1
    }
}
```

## 方法重载

```java
public class MethodOverloading {
    // 相同方法名，不同参数列表

    public void print(int num) {
        System.out.println("整数: " + num);
    }

    public void print(double num) {
        System.out.println("浮点数: " + num);
    }

    public void print(String str) {
        System.out.println("字符串: " + str);
    }

    public void print(int a, int b) {
        System.out.println("两个整数: " + a + ", " + b);
    }

    public static void main(String[] args) {
        MethodOverloading obj = new MethodOverloading();

        obj.print(10);        // 调用 print(int)
        obj.print(3.14);      // 调用 print(double)
        obj.print("Hello");   // 调用 print(String)
        obj.print(1, 2);      // 调用 print(int, int)
    }
}
```

## 静态方法与实例方法

```java
public class StaticVsInstance {
    // 静态变量（类变量）
    private static int staticCount = 0;

    // 实例变量
    private int instanceCount = 0;

    // 静态方法（类方法）
    public static void staticMethod() {
        System.out.println("静态方法");
        staticCount++;  // 可以访问静态变量
        // instanceCount++;  // 不能直接访问实例变量
    }

    // 实例方法
    public void instanceMethod() {
        System.out.println("实例方法");
        staticCount++;    // 可以访问静态变量
        instanceCount++;  // 可以访问实例变量
    }

    // 工具方法通常用静态
    public static int max(int a, int b) {
        return a > b ? a : b;
    }

    public static void main(String[] args) {
        // 静态方法通过类名调用
        StaticVsInstance.staticMethod();

        // 实例方法通过对象调用
        StaticVsInstance obj = new StaticVsInstance();
        obj.instanceMethod();

        // 工具方法
        System.out.println("max(5, 3) = " + StaticVsInstance.max(5, 3));
    }
}
```

## 构造方法

```java
public class ConstructorExample {
    private String name;
    private int age;

    // 无参构造
    public ConstructorExample() {
        this.name = "Unknown";
        this.age = 0;
    }

    // 有参构造
    public ConstructorExample(String name) {
        this.name = name;
        this.age = 0;
    }

    // 全参构造
    public ConstructorExample(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 使用 this 调用其他构造方法
    public ConstructorExample(int age) {
        this("Unknown", age);  // 调用有参构造
    }

    public void display() {
        System.out.println("Name: " + name + ", Age: " + age);
    }

    public static void main(String[] args) {
        ConstructorExample obj1 = new ConstructorExample();
        obj1.display();  // Name: Unknown, Age: 0

        ConstructorExample obj2 = new ConstructorExample("张三");
        obj2.display();  // Name: 张三, Age: 0

        ConstructorExample obj3 = new ConstructorExample("李四", 25);
        obj3.display();  // Name: 李四, Age: 25
    }
}
```

## 递归

```java
public class Recursion {
    // 阶乘
    public static long factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    // 斐波那契数列
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    // 最大公约数
    public static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }

    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));    // 120
        System.out.println("fib(10) = " + fibonacci(10));  // 55
        System.out.println("gcd(12, 8) = " + gcd(12, 8));  // 4
    }
}
```

## Lambda 表达式（Java 8+）

```java
import java.util.function.*;

public class LambdaExpression {
    public static void main(String[] args) {
        // 传统方式
        Calculator add = new Calculator() {
            @Override
            public int calculate(int a, int b) {
                return a + b;
            }
        };

        // Lambda 方式
        Calculator addLambda = (a, b) -> a + b;
        Calculator multiplyLambda = (a, b) -> a * b;

        System.out.println(addLambda.calculate(5, 3));    // 8
        System.out.println(multiplyLambda.calculate(5, 3)); // 15

        // 常用函数式接口
        Predicate<Integer> isEven = n -> n % 2 == 0;
        System.out.println(isEven.test(4));   // true
        System.out.println(isEven.test(3));   // false

        Function<String, Integer> stringLength = s -> s.length();
        System.out.println(stringLength.apply("Hello"));  // 5

        Consumer<String> printer = s -> System.out.println(s);
        printer.accept("Lambda 示例");

        Supplier<Double> random = () -> Math.random();
        System.out.println(random.get());
    }

    @FunctionalInterface
    interface Calculator {
        int calculate(int a, int b);
    }
}
```

## 方法引用（Java 8+）

```java
import java.util.Arrays;
import java.util.List;

public class MethodReference {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("alice", "bob", "charlie");

        // Lambda 写法
        names.forEach(s -> System.out.println(s));

        // 方法引用写法（静态方法）
        names.forEach(System.out::println);

        // 方法引用（实例方法）
        names.forEach(new MethodReference()::printUpper);

        // 方法引用（构造方法）
        names.stream()
             .map(String::toUpperCase)
             .forEach(System.out::println);
    }

    private void printUpper(String s) {
        System.out.println(s.toUpperCase());
    }
}
```

---

## 下一篇

[数组与字符串](./数组与字符串.md)
