# 数据类型与变量

## Java 类型系统总览

```
Java 数据类型
├── 基本类型（Primitive Types）
│   ├── 数值类型
│   │   ├── 整型：byte, short, int, long
│   │   └── 浮点型：float, double
│   ├── 字符类型：char
│   └── 布尔类型：boolean
│
└── 引用类型（Reference Types）
    ├── 类（Class）
    ├── 接口（Interface）
    ├── 数组（Array）
    ├── 枚举（Enum）
    └── 字符串（String）
```

## 基本类型详解

### 整数类型

```java
public class IntegerTypes {
    public static void main(String[] args) {
        // byte: 8位，范围 -128 到 127
        byte byteVar = 100;
        // byte byteMax = 128;  // 编译错误：超出范围

        // short: 16位，范围 -32768 到 32767
        short shortVar = 10000;

        // int: 32位，范围约 ±21亿（默认整数类型）
        int intVar = 2_000_000_000;  // 支持下划线分隔提高可读性

        // long: 64位，范围极大（必须加 L 后缀）
        long longVar = 9_000_000_000_000_000_000L;

        // 进制表示
        int binary = 0b1010;      // 二进制：10
        int octal = 012;          // 八进制：10
        int hex = 0xA;            // 十六进制：10

        System.out.println("binary: " + binary);
        System.out.println("octal: " + octal);
        System.out.println("hex: " + hex);
    }
}
```

### 浮点类型

```java
public class FloatTypes {
    public static void main(String[] args) {
        // float: 32位单精度，约7位有效数字（必须加 f/F 后缀）
        float floatVar = 3.14f;
        float floatVar2 = 3.14F;

        // double: 64位双精度，约15位有效数字（默认浮点类型）
        double doubleVar = 3.14;
        double doubleVar2 = 3.14d;
        double doubleVar3 = 3.14D;

        // 科学计数法
        double large = 1.23e10;   // 1.23 × 10^10
        double small = 1.23e-5;   // 1.23 × 10^-5

        // 特殊值
        System.out.println(Double.POSITIVE_INFINITY); // 正无穷
        System.out.println(Double.NEGATIVE_INFINITY); // 负无穷
        System.out.println(Double.NaN);               // Not a Number

        // 浮点数比较（避免直接用 ==）
        double a = 0.1 + 0.2;
        System.out.println(a == 0.3);           // false
        System.out.println(Math.abs(a - 0.3) < 1e-10);  // true，推荐方式
    }
}
```

### 字符类型

```java
public class CharType {
    public static void main(String[] args) {
        // char: 16位 Unicode 字符
        char ch1 = 'A';           // 字符
        char ch2 = 65;            // ASCII 码
        char ch3 = '\u0041';      // Unicode 编码（十六进制）
        char ch4 = '\n';          // 转义字符：换行

        System.out.println(ch1);  // A
        System.out.println(ch2);  // A
        System.out.println(ch3);  // A

        // 常用转义字符
        System.out.println("换行\t制表符\\反斜杠\"双引号\'单引号");

        // 字符操作
        System.out.println((int)'a');  // 97，获取 ASCII 码
        System.out.println((char)97);  // a，获取字符
        System.out.println('a' - 'A');  // 32，大小写差值

        // 字符方法
        System.out.println(Character.isDigit('5'));   // true
        System.out.println(Character.isLetter('a'));  // true
        System.out.println(Character.isUpperCase('A')); // true
        System.out.println(Character.toLowerCase('A')); // a
    }
}
```

### 布尔类型

```java
public class BooleanType {
    public static void main(String[] args) {
        // boolean: 只有两个值 true 或 false
        boolean flag1 = true;
        boolean flag2 = false;

        // 不能用 0 或 1 表示（不同于 C/C++）
        // boolean flag3 = 1;  // 编译错误

        // 布尔运算
        boolean and = flag1 && flag2;  // false
        boolean or = flag1 || flag2;   // true
        boolean not = !flag1;          // false

        System.out.println(and);
        System.out.println(or);
        System.out.println(not);
    }
}
```

## 类型转换

### 自动类型转换（隐式）

```java
public class ImplicitConversion {
    public static void main(String[] args) {
        // 小类型自动转换为大类型
        byte b = 10;
        short s = b;        // byte → short
        int i = s;          // short → int
        long l = i;         // int → long
        float f = l;        // long → float（可能丢失精度）
        double d = f;       // float → double

        // 运算中的自动转换
        int a = 10;
        double b = 3.5;
        double result = a + b;  // int → double，结果是 double

        System.out.println(result);  // 13.5
    }
}
```

### 强制类型转换（显式）

```java
public class ExplicitConversion {
    public static void main(String[] args) {
        // 大类型强制转换为小类型（可能丢失数据）
        double d = 3.999;
        int i = (int) d;  // 直接截断小数部分，不是四舍五入
        System.out.println(i);  // 3

        // char 与 int 互转
        char ch = 'A';
        int ascii = (int) ch;   // 65
        char ch2 = (char) ascii; // 'A'

        // 数值溢出
        int big = 300;
        byte small = (byte) big;  // 溢出，结果为 44
        System.out.println(small);  // 44

        // 注意：大类型转小类型需要强制转换
        // long l = 100L;
        // int i2 = l;      // 编译错误
        // int i3 = (int)l; // 正确
    }
}
```

## 引用类型

### String（字符串）

```java
public class StringType {
    public static void main(String[] args) {
        // 字符串字面量（存储在字符串常量池）
        String s1 = "Hello";
        String s2 = "Hello";  // s1 和 s2 指向同一个对象

        System.out.println(s1 == s2);     // true（比较引用）
        System.out.println(s1.equals(s2)); // true（比较内容）

        // new 创建（存储在堆内存）
        String s3 = new String("Hello");
        String s4 = new String("Hello");

        System.out.println(s3 == s4);     // false
        System.out.println(s3.equals(s4)); // true

        // 不可变性
        String s5 = "Hello";
        s5 = s5 + " World";  // 创建新对象，原对象不变

        // 常用方法
        String text = "  Hello World  ";
        System.out.println(text.trim());           // "Hello World"
        System.out.println(text.substring(2, 7));   // "Hello"
        System.out.println(text.replace("l", "L")); // "  HeLLo WorLd  "
        System.out.println(text.split(" ").length); // 3

        // 空判断
        String empty = "";
        System.out.println(empty.isEmpty());        // true
        System.out.println(empty.isBlank());        // true（JDK 11+）

        String blank = "   ";
        System.out.println(blank.isEmpty());        // false
        System.out.println(blank.isBlank());        // true
    }
}
```

### 数组

```java
public class ArrayType {
    public static void main(String[] args) {
        // 基本类型数组
        int[] arr1 = new int[5];           // 声明并创建长度为5的数组
        int[] arr2 = {1, 2, 3, 4, 5};      // 声明并初始化

        // 访问和修改
        arr1[0] = 10;
        System.out.println(arr2[2]);       // 3

        // 数组长度
        System.out.println(arr2.length);   // 5（注意：不是 length()）

        // 遍历
        for (int i = 0; i < arr2.length; i++) {
            System.out.println(arr2[i]);
        }

        // 增强for循环（forEach）
        for (int num : arr2) {
            System.out.println(num);
        }

        // 引用类型数组
        String[] names = {"Alice", "Bob", "Charlie"};
        for (String name : names) {
            System.out.println(name);
        }

        // 多维数组
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        System.out.println(matrix[1][2]);  // 6

        // 数组工具类 Arrays
        import java.util.Arrays;

        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};
        Arrays.sort(arr);                  // 排序
        System.out.println(Arrays.toString(arr)); // [1, 1, 2, 3, 4, 5, 6, 9]
        System.out.println(Arrays.binarySearch(arr, 5)); // 4（查找）
    }
}
```

## 变量的作用域

```java
public class VariableScope {
    // 成员变量（实例变量）
    private String instanceVar = "实例变量";

    // 静态变量（类变量）
    private static String staticVar = "静态变量";

    public void method() {
        // 局部变量
        String localVar = "局部变量";

        // 代码块变量
        {
            int blockVar = 100;
            System.out.println(blockVar);
        }
        // System.out.println(blockVar);  // 编译错误：超出作用域

        System.out.println(instanceVar);  // 可以访问实例变量
        System.out.println(staticVar);    // 可以访问静态变量
        System.out.println(localVar);     // 可以访问局部变量
    }
}
```

## 包装类

```java
public class WrapperClass {
    public static void main(String[] args) {
        // 基本类型对应的包装类
        Integer intObj = Integer.valueOf(100);
        Double doubleObj = Double.valueOf(3.14);
        Boolean boolObj = Boolean.TRUE;

        // 自动装箱（Autoboxing）
        Integer autoBox = 100;  // 自动转换为 Integer

        // 自动拆箱（Unboxing）
        int autoUnbox = autoBox;  // 自动转换为 int

        // 字符串转换
        String numStr = "123";
        int num = Integer.parseInt(numStr);   // 字符串转int
        String str = Integer.toString(123);  // int转字符串

        // 常用方法
        System.out.println(Integer.MAX_VALUE);  // 2147483647
        System.out.println(Integer.MIN_VALUE);  // -2147483648
        System.out.println(Integer.toBinaryString(10)); // 1010
        System.out.println(Integer.toHexString(255));   // ff
    }
}
```

## 常用 API 类

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;

public class CommonAPIs {
    public static void main(String[] args) {
        // 日期时间（Java 8+）
        LocalDate today = LocalDate.now();
        System.out.println(today);  // 2025-03-06

        LocalDateTime now = LocalDateTime.now();
        System.out.println(now);  // 2025-03-06T14:30:00.123

        // 日期格式化
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formatted = now.format(formatter);
        System.out.println(formatted);  // 2025-03-06 14:30:00

        // 精确计算（BigDecimal，避免浮点精度问题）
        BigDecimal a = new BigDecimal("0.1");
        BigDecimal b = new BigDecimal("0.2");
        BigDecimal sum = a.add(b);
        System.out.println(sum);  // 0.3（精确）
    }
}
```

---

## 下一篇

[控制结构](./控制结构.md)
