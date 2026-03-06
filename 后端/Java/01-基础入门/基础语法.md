# 基础语法

## 变量声明

### 基本数据类型

| 类型 | 大小 | 默认值 | 范围 | 说明 |
|------|------|--------|------|------|
| byte | 8位 | 0 | -128 ~ 127 | 字节型 |
| short | 16位 | 0 | -32768 ~ 32767 | 短整型 |
| int | 32位 | 0 | 约 ±21亿 | 整型（默认） |
| long | 64位 | 0L | 极大 | 长整型 |
| float | 32位 | 0.0f | 单精度浮点 | 单精度浮点数 |
| double | 64位 | 0.0d | 双精度浮点 | 双精度浮点数（默认） |
| char | 16位 | '\u0000' | 0 ~ 65535 | 字符 |
| boolean | - | false | true/false | 布尔值 |

```java
public class DataTypes {
    public static void main(String[] args) {
        // 整数类型
        int age = 25;
        long bigNumber = 123456789L;  // L 后缀表示 long

        // 浮点类型
        float price = 19.99f;         // f 后缀表示 float
        double pi = 3.14159;

        // 字符类型
        char grade = 'A';

        // 布尔类型
        boolean isActive = true;
        boolean isDeleted = false;

        // 字符串（引用类型）
        String name = "张三";
        String message = "Hello, " + name + "!";

        System.out.println(age);
        System.out.println(name);
        System.out.println(message);
    }
}
```

### 变量命名规范

```java
// 驼峰命名法
String firstName;           // 小驼峰：变量和方法
String lastName;

// 常量全大写，下划线分隔
static final int MAX_COUNT = 100;
static final String API_KEY = "abc123";

// 类名大驼峰
class UserService { }

// 包名全小写，点分隔
package com.example.demo;
```

## 运算符

### 算术运算符

```java
public class ArithmeticOperators {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        System.out.println(a + b);  // 13  加法
        System.out.println(a - b);  // 7   减法
        System.out.println(a * b);  // 30  乘法
        System.out.println(a / b);  // 3   整除
        System.out.println(a % b);  // 1   取余

        // 自增自减
        int x = 5;
        x++;  // x = 6
        x--;  // x = 5
        ++x;  // x = 6
        --x;  // x = 5

        // 前缀和后缀的区别
        int m = 5;
        int n = m++;  // n = 5, m = 6（先赋值后自增）

        int p = 5;
        int q = ++p;  // q = 6, p = 6（先自增后赋值）
    }
}
```

### 比较运算符

```java
public class ComparisonOperators {
    public static void main(String[] args) {
        int a = 5;
        int b = 10;

        System.out.println(a == b);  // false  等于
        System.out.println(a != b);  // true   不等于
        System.out.println(a > b);   // false  大于
        System.out.println(a < b);   // true   小于
        System.out.println(a >= b);  // false  大于等于
        System.out.println(a <= b);  // true   小于等于
    }
}
```

### 逻辑运算符

```java
public class LogicalOperators {
    public static void main(String[] args) {
        boolean a = true;
        boolean b = false;

        System.out.println(a && b);  // false  逻辑与（短路）
        System.out.println(a || b);  // true   逻辑或（短路）
        System.out.println(!a);     // false  逻辑非

        // 短路求值
        int x = 5;
        boolean result = (x > 10) && (x++ > 0); // x++ 不会执行
        System.out.println(result); // false
        System.out.println(x);      // 5

        // 位运算符
        System.out.println(5 & 3);   // 1  按位与
        System.out.println(5 | 3);   // 7  按位或
        System.out.println(5 ^ 3);   // 6  按位异或
        System.out.println(~5);      // -6 按位取反
        System.out.println(5 << 1);  // 10 左移
        System.out.println(5 >> 1);  // 2  右移
    }
}
```

### 三元运算符

```java
public class TernaryOperator {
    public static void main(String[] args) {
        int score = 85;

        // 条件 ? 值1 : 值2
        String result = score >= 60 ? "及格" : "不及格";
        System.out.println(result); // 及格

        // 等价于 if-else
        String result2;
        if (score >= 60) {
            result2 = "及格";
        } else {
            result2 = "不及格";
        }
    }
}
```

## 字符串操作

```java
public class StringOperations {
    public static void main(String[] args) {
        String s1 = "Hello";
        String s2 = "World";
        String s3 = new String("Hello");

        // 字符串拼接
        String concat = s1 + " " + s2;           // Hello World
        String concat2 = s1.concat(s2);          // HelloWorld

        // 长度
        System.out.println(s1.length());        // 5

        // 大小写转换
        System.out.println(s1.toUpperCase());  // HELLO
        System.out.println(s1.toLowerCase());  // hello

        // 字符串比较（重要！）
        System.out.println(s1 == s3);           // false（比较引用）
        System.out.println(s1.equals(s3));      // true（比较内容）
        System.out.println("abc".equals("Abc")); // false
        System.out.println("abc".equalsIgnoreCase("ABC")); // true

        // 包含
        System.out.println(s1.contains("ell"));  // true

        // 开始和结束
        System.out.println(s1.startsWith("He")); // true
        System.out.println(s1.endsWith("lo"));   // true

        // 索引和截取
        System.out.println(s1.indexOf('l'));    // 2
        System.out.println(s1.substring(1, 3));  // el

        // 替换
        System.out.println(s1.replace('l', 'L')); // HeLLo

        // 去除空格
        String s4 = "  Hello  ";
        System.out.println(s4.trim());           // Hello

        // 分割
        String s5 = "a,b,c";
        String[] parts = s5.split(",");
        for (String part : parts) {
            System.out.println(part); // a, b, c
        }

        // String Builder（高效拼接）
        StringBuilder sb = new StringBuilder();
        sb.append("Hello");
        sb.append(" ");
        sb.append("World");
        System.out.println(sb.toString()); // Hello World

        // String.format（格式化）
        String formatted = String.format("姓名: %s, 年龄: %d", "张三", 25);
        System.out.println(formatted); // 姓名: 张三, 年龄: 25
    }
}
```

## 输入输出

```java
import java.util.Scanner;

public class InputOutput {
    public static void main(String[] args) {
        // 输出
        System.out.println("换行输出");
        System.out.print("不换行输出");
        System.out.printf("格式化输出: %s, %d\n", "Hello", 100);

        // 输入
        Scanner scanner = new Scanner(System.in);

        System.out.print("请输入你的名字: ");
        String name = scanner.nextLine();

        System.out.print("请输入你的年龄: ");
        int age = scanner.nextInt();

        System.out.printf("你好, %s! 你今年 %d 岁\n", name, age);

        scanner.close();
    }
}
```

## 前端开发者对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `let x = 10` | `int x = 10` | 需要声明类型 |
| `const` | `final` | 常量 |
| `===` | `equals()` | 字符串比较 |
| `${}` 模板字符串 | `String.format()` | 字符串格式化 |
| `console.log()` | `System.out.println()` | 输出 |
| `typeOf` | `instanceof` | 类型检查 |

---

## 下一篇

[数据类型与变量](./数据类型与变量.md)
