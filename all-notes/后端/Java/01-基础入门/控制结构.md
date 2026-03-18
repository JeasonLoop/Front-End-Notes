# 控制结构

## 条件语句

### if-else 语句

```java
public class IfElse {
    public static void main(String[] args) {
        int score = 85;

        // 基础 if
        if (score >= 60) {
            System.out.println("及格");
        }

        // if-else
        if (score >= 90) {
            System.out.println("优秀");
        } else {
            System.out.println("普通");
        }

        // if-else if-else
        if (score >= 90) {
            System.out.println("优秀");
        } else if (score >= 80) {
            System.out.println("良好");
        } else if (score >= 60) {
            System.out.println("及格");
        } else {
            System.out.println("不及格");
        }

        // 嵌套 if
        int age = 25;
        if (age >= 18) {
            if (age < 60) {
                System.out.println("成年人");
            } else {
                System.out.println("老年人");
            }
        }
    }
}
```

### switch 语句

```java
public class SwitchStatement {
    public static void main(String[] args) {
        // 传统 switch（Java 14 之前）
        int day = 3;
        String dayName;

        switch (day) {
            case 1:
                dayName = "周一";
                break;
            case 2:
                dayName = "周二";
                break;
            case 3:
                dayName = "周三";
                break;
            default:
                dayName = "未知";
        }
        System.out.println(dayName);  // 周三

        // switch 表达式（Java 14+）
        String month = switch (day) {
            case 1 -> "一月";
            case 2 -> "二月";
            case 3 -> "三月";
            case 4 -> "四月";
            case 5 -> "五月";
            case 6 -> "六月";
            case 7 -> "七月";
            case 8 -> "八月";
            case 9 -> "九月";
            case 10 -> "十月";
            case 11 -> "十一月";
            case 12 -> "十二月";
            default -> "未知";
        };
        System.out.println(month);  // 三月

        // 多个 case 共享代码
        int score = 85;
        switch (score / 10) {
            case 9, 10:
                System.out.println("优秀");
                break;
            case 8:
                System.out.println("良好");
                break;
            case 7, 6:
                System.out.println("及格");
                break;
            default:
                System.out.println("不及格");
        }

        // switch 支持 String
        String color = "red";
        switch (color) {
            case "red":
                System.out.println("红色");
                break;
            case "blue":
                System.out.println("蓝色");
                break;
            default:
                System.out.println("其他颜色");
        }
    }
}
```

## 循环语句

### for 循环

```java
public class ForLoop {
    public static void main(String[] args) {
        // 传统 for 循环
        for (int i = 0; i < 5; i++) {
            System.out.println("i = " + i);
        }

        // 多个初始化/更新
        for (int i = 0, j = 10; i < j; i++, j--) {
            System.out.println("i = " + i + ", j = " + j);
        }

        // 无限循环
        // for (;;) {
        //     System.out.println("无限循环");
        // }

        // 增强型 for 循环（forEach）
        int[] arr = {1, 2, 3, 4, 5};
        for (int num : arr) {
            System.out.println(num);
        }

        // 遍历字符串
        String str = "Hello";
        for (char ch : str.toCharArray()) {
            System.out.println(ch);
        }
    }
}
```

### while 循环

```java
public class WhileLoop {
    public static void main(String[] args) {
        // while 循环
        int i = 0;
        while (i < 5) {
            System.out.println("while i = " + i);
            i++;
        }

        // do-while 循环（至少执行一次）
        int j = 5;
        do {
            System.out.println("do-while j = " + j);
            j++;
        } while (j < 3);

        // 使用 break 跳出循环
        int k = 0;
        while (true) {
            if (k >= 3) {
                break;
            }
            System.out.println("break 示例 k = " + k);
            k++;
        }

        // 使用 continue 跳过本次循环
        for (int m = 0; m < 5; m++) {
            if (m == 2) {
                continue;
            }
            System.out.println("continue 示例 m = " + m);
        }
    }
}
```

### 标签跳转（Label）

```java
public class LabelBreak {
    public static void main(String[] args) {
        // 带标签的 break
        outer:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    break outer;  // 跳出外层循环
                }
                System.out.println("i = " + i + ", j = " + j);
            }
        }

        // 带标签的 continue
        outer2:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (i == 1 && j == 1) {
                    continue outer2;  // 跳到外层循环的下一次迭代
                }
                System.out.println("continue i = " + i + ", j = " + j);
            }
        }
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `if (condition) {}` | `if (condition) {}` | 相同 |
| `switch (value) {}` | `switch (value) {}` | 相同 |
| `for (let i = 0; i < 5; i++) {}` | `for (int i = 0; i < 5; i++) {}` | 需要声明类型 |
| `for (const item of arr) {}` | `for (int item : arr) {}` | 语法不同 |
| `while (condition) {}` | `while (condition) {}` | 相同 |
| `do {} while (condition)` | `do {} while (condition);` | 注意分号 |
| `break` / `continue` | `break` / `continue` | 相同 |
| `break labelName` | `break labelName;` | 相同 |

---

## 下一篇

[函数与方法](./函数与方法.md)
