---
title: 数组与字符串
category: 后端
---
# 数组与字符串

## 数组详解

### 一维数组

```java
public class OneDimensionalArray {
    public static void main(String[] args) {
        // 声明方式
        int[] arr1;          // 推荐方式
        int arr2[];          // C 风格（不推荐）

        // 创建方式
        arr1 = new int[5];           // 创建长度为5的数组，默认值为0
        int[] arr3 = {1, 2, 3, 4, 5}; // 声明并初始化
        int[] arr4 = new int[]{1, 2, 3, 4, 5}; // 匿名数组

        // 访问和修改
        arr1[0] = 10;
        arr1[4] = 50;
        System.out.println(arr3[2]);  // 3

        // 数组长度
        System.out.println(arr1.length);  // 5（注意：不是 length()）

        // 遍历
        for (int i = 0; i < arr3.length; i++) {
            System.out.println("arr3[" + i + "] = " + arr3[i]);
        }

        // 增强for循环
        for (int num : arr3) {
            System.out.println(num);
        }

        // 动态数组初始化
        int[] arr5;
        arr5 = new int[10];
        for (int i = 0; i < arr5.length; i++) {
            arr5[i] = i * 2;
        }
    }
}
```

### 数组操作工具类

```java
import java.util.Arrays;

public class ArrayUtils {
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};

        // 转换为字符串
        System.out.println(Arrays.toString(arr));
        // 输出: [3, 1, 4, 1, 5, 9, 2, 6]

        // 排序
        Arrays.sort(arr);
        System.out.println(Arrays.toString(arr));
        // 输出: [1, 1, 2, 3, 4, 5, 6, 9]

        // 二分查找（先排序）
        int index = Arrays.binarySearch(arr, 5);
        System.out.println("5 的索引: " + index);

        // 填充
        int[] fillArr = new int[5];
        Arrays.fill(fillArr, 10);
        System.out.println(Arrays.toString(fillArr));
        // 输出: [10, 10, 10, 10, 10]

        // 复制
        int[] copyArr = Arrays.copyOf(arr, arr.length);
        System.out.println(Arrays.toString(copyArr));

        // 比较数组
        int[] arr2 = {1, 1, 2, 3, 4, 5, 6, 9};
        System.out.println(Arrays.equals(arr, arr2));  // true

        // 比较数组（部分）
        System.out.println(Arrays.equals(arr, 0, 3, arr2, 0, 3));  // true
    }
}
```

### 二维数组

```java
public class TwoDimensionalArray {
    public static void main(String[] args) {
        // 声明和初始化
        int[][] matrix1 = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        // 创建并初始化
        int[][] matrix2 = new int[3][4];  // 3行4列

        // 遍历二维数组
        for (int i = 0; i < matrix1.length; i++) {
            for (int j = 0; j < matrix1[i].length; j++) {
                System.out.print(matrix1[i][j] + " ");
            }
            System.out.println();
        }

        // 增强for循环
        for (int[] row : matrix1) {
            for (int num : row) {
                System.out.print(num + " ");
            }
            System.out.println();
        }

        // 不规则二维数组（锯齿数组）
        int[][] jagged = {
            {1, 2},
            {3, 4, 5},
            {6, 7, 8, 9}
        };

        for (int[] row : jagged) {
            System.out.println(row.length);  // 2, 3, 4
        }
    }
}
```

### 数组排序算法

```java
public class SortingAlgorithms {
    // 冒泡排序
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // 快速排序
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};

        bubbleSort(arr);
        System.out.println("冒泡排序: " + java.util.Arrays.toString(arr));

        int[] arr2 = {64, 34, 25, 12, 22, 11, 90};
        quickSort(arr2, 0, arr2.length - 1);
        System.out.println("快速排序: " + java.util.Arrays.toString(arr2));
    }
}
```

## String 详解

### String 基础操作

```java
public class StringBasics {
    public static void main(String[] args) {
        // 创建字符串
        String s1 = "Hello";              // 字符串常量池
        String s2 = new String("Hello");  // 堆内存
        String s3 = "Hello";              // 指向常量池同一对象

        System.out.println(s1 == s2);     // false
        System.out.println(s1 == s3);     // true
        System.out.println(s1.equals(s2)); // true

        // 字符串连接
        String hello = "Hello";
        String world = "World";
        String result = hello + " " + world;
        System.out.println(result);  // Hello World

        // 使用 concat
        String result2 = hello.concat(" ").concat(world);
        System.out.println(result2);

        // StringBuilder 高效拼接
        StringBuilder sb = new StringBuilder();
        sb.append("Hello").append(" ").append("World");
        System.out.println(sb.toString());
    }
}
```

### String 常用方法

```java
public class StringMethods {
    public static void main(String[] args) {
        String s = "  Hello World Java  ";

        // 长度
        System.out.println("长度: " + s.length());  // 19

        // 去除首尾空格
        System.out.println("trim: [" + s.trim() + "]");

        // 大小写转换
        System.out.println("大写: " + s.toUpperCase());
        System.out.println("小写: " + s.toLowerCase());

        // 获取字符
        System.out.println("第6个字符: " + s.charAt(5));  // W

        // 查找
        System.out.println("World 索引: " + s.indexOf("World"));  // 8
        System.out.println("Java 索引: " + s.indexOf("Java"));    // 14
        System.out.println("Python 索引: " + s.indexOf("Python")); // -1

        // 判断
        System.out.println("包含 World: " + s.contains("World"));
        System.out.println("以 Hello 开头: " + s.startsWith("Hello"));
        System.out.println("以 Java 结尾: " + s.endsWith("Java"));

        // 截取
        System.out.println("截取(6-11): " + s.substring(6, 11));  // World
        System.out.println("截取(6开始): " + s.substring(6));     // World Java

        // 分割
        String[] parts = s.trim().split(" ");
        System.out.println("分割结果: " + java.util.Arrays.toString(parts));

        // 替换
        System.out.println("替换 o -> O: " + s.replace('o', 'O'));
        System.out.println("替换 World -> Go: " + s.replace("World", "Go"));

        // 重复（Java 11+）
        System.out.println("重复3次: " + "Hi ".repeat(3));  // Hi Hi Hi

        // 比较
        String a = "Apple";
        String b = "Banana";
        System.out.println("compareTo: " + a.compareTo(b));  // 负数（a < b）

        // 格式化
        String formatted = String.format("姓名: %s, 年龄: %d, 分数: %.2f",
                                         "张三", 25, 95.5);
        System.out.println(formatted);
    }
}
```

### StringBuilder 和 StringBuffer

```java
public class StringBuilderDemo {
    public static void main(String[] args) {
        // StringBuilder（线程不安全，效率高）
        StringBuilder sb = new StringBuilder();

        // 添加
        sb.append("Hello");
        sb.append(" ");
        sb.append("World");

        // 插入
        sb.insert(5, " Beautiful");

        // 删除
        sb.delete(5, 16);  // 删除 " Beautiful"

        // 反转
        sb.reverse();

        System.out.println(sb);  // dlroW olleH

        // 容量
        StringBuilder sb2 = new StringBuilder(100);  // 初始容量100
        System.out.println("容量: " + sb2.capacity());

        // StringBuffer（线程安全，效率略低）
        StringBuffer stringBuffer = new StringBuffer("线程安全");
        stringBuffer.append("的字符串");
        System.out.println(stringBuffer);
    }
}
```

### 正则表达式

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexDemo {
    public static void main(String[] args) {
        String text = "联系方式：手机13812345678，座机010-12345678";

        // 匹配手机号
        Pattern pattern = Pattern.compile("1[3-9]\\d{9}");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            System.out.println("找到手机号: " + matcher.group());
        }

        // 简单匹配
        System.out.println("abc123".matches("[a-z]+\\d+"));  // true

        // 替换
        String result = text.replaceAll("\\d{3}\\d{4}\\d{4}", "****");
        System.out.println(result);

        // 分割
        String[] parts = "a,b,c,d".split(",");
        System.out.println(java.util.Arrays.toString(parts));
    }
}
```

## 前端开发者对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `arr.length` | `arr.length` | 相同 |
| `arr.push(1)` | `需要手动扩容` | Java数组固定长度 |
| `arr.map()` | `Arrays.stream().map()` | Java用Stream API |
| `arr.includes()` | `Arrays.asList(arr).contains()` | 方法不同 |
| `str.length` | `str.length()` | Java是方法 |
| `str.trim()` | `str.trim()` | 相同 |
| `str.split()` | `str.split()` | 相同 |
| `str.includes()` | `str.contains()` | 方法名不同 |
| `str.toUpperCase()` | `str.toUpperCase()` | 相同 |
| `` `${x}` `` | `String.format("%s", x)` | 语法不同 |

---

## 下一篇

[异常处理](./异常处理.md)
