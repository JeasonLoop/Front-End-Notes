---
title: 异常处理
category: 后端
---
# 异常处理

## 异常体系结构

```
Throwable（所有错误或异常的超类）
├── Error（严重错误，无法恢复）
│   ├── VirtualMachineError
│   │   ├── StackOverflowError
│   │   └── OutOfMemoryError
│   └── AWTError
│
└── Exception（可恢复的异常）
    ├── RuntimeException（运行时异常，未检查异常）
    │   ├── NullPointerException
    │   ├── IndexOutOfBoundsException
    │   ├── ArithmeticException
    │   ├── ClassCastException
    │   └── NumberFormatException
    │
    └── 非运行时异常（编译时异常，检查异常）
        ├── IOException
        │   ├── FileNotFoundException
        │   └── EOFException
        ├── SQLException
        └── ClassNotFoundException
```

## 常见异常

```java
public class CommonExceptions {
    public static void main(String[] args) {
        // NullPointerException
        String str = null;
        // System.out.println(str.length());  // 抛出 NullPointerException

        // IndexOutOfBoundsException
        int[] arr = {1, 2, 3};
        // System.out.println(arr[5]);  // 抛出 IndexOutOfBoundsException

        // ArithmeticException
        int a = 10, b = 0;
        // System.out.println(a / b);  // 抛出 ArithmeticException

        // ClassCastException
        Object obj = "Hello";
        // Integer num = (Integer) obj;  // 抛出 ClassCastException

        // NumberFormatException
        // int num = Integer.parseInt("abc");  // 抛出 NumberFormatException

        // 安全的字符串转整数
        int num = safeParseInt("123");
        System.out.println(num);
    }

    public static int safeParseInt(String str) {
        try {
            return Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return 0;  // 默认值
        }
    }
}
```

## try-catch-finally

```java
public class TryCatchFinally {
    public static void main(String[] args) {
        // 基本 try-catch
        try {
            int result = divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("捕获异常: " + e.getMessage());
        }

        // 多个 catch
        try {
            String[] arr = {"A", "B"};
            System.out.println(arr[2]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("数组索引越界");
        } catch (Exception e) {
            System.out.println("其他异常");
        }

        // 多异常捕获（Java 7+）
        try {
            // 可能抛出多个异常的代码
        } catch (NullPointerException | IllegalArgumentException e) {
            System.out.println("捕获到空指针或非法参数异常");
        }

        // finally（总是执行）
        try {
            int[] arr = {1, 2, 3};
            System.out.println(arr[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("捕获异常");
        } finally {
            System.out.println("finally 总是执行");
        }

        // finally 中 return 会覆盖 try/catch 中的 return
        System.out.println(testFinally());
    }

    public static int divide(int a, int b) {
        return a / b;
    }

    public static int testFinally() {
        try {
            return 1;
        } catch (Exception e) {
            return 2;
        } finally {
            return 3;  // 会覆盖前面的 return
        }
        // 返回 3
    }
}
```

## throw 和 throws

```java
import java.io.IOException;

public class ThrowAndThrows {
    // throws 声明可能抛出的异常
    public static void readFile() throws IOException {
        // 模拟可能抛出异常的代码
        throw new IOException("文件不存在");
    }

    // 抛出自定义异常
    public static void checkAge(int age) throws IllegalArgumentException {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("年龄必须在0-150之间");
        }
    }

    // 抛出运行时异常（无需声明）
    public static void divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("除数不能为0");
        }
        System.out.println(a / b);
    }

    public static void main(String[] args) {
        try {
            readFile();
        } catch (IOException e) {
            System.out.println("捕获IO异常: " + e.getMessage());
        }

        try {
            checkAge(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("捕获非法参数: " + e.getMessage());
        }

        try {
            divide(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("捕获算术异常: " + e.getMessage());
        }
    }
}
```

## 自定义异常

```java
// 自定义检查异常
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

// 自定义运行时异常
class InsufficientFundsRuntimeException extends RuntimeException {
    public InsufficientFundsRuntimeException(String message) {
        super(message);
    }
}

public class CustomException {
    private double balance;

    public CustomException(double balance) {
        this.balance = balance;
    }

    // 使用检查异常
    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(
                "余额不足! 需要: " + amount + ", 当前: " + balance
            );
        }
        balance -= amount;
        System.out.println("取款成功, 剩余余额: " + balance);
    }

    // 使用运行时异常
    public void withdrawRuntime(double amount) {
        if (amount > balance) {
            throw new InsufficientFundsRuntimeException(
                "余额不足! 需要: " + amount + ", 当前: " + balance
            );
        }
        balance -= amount;
        System.out.println("取款成功, 剩余余额: " + balance);
    }

    public static void main(String[] args) {
        CustomException account = new CustomException(100);

        // 检查异常必须处理
        try {
            account.withdraw(150);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
        }

        // 运行时异常可以选择处理或不处理
        account.withdrawRuntime(200);  // 会抛出异常
    }
}
```

## try-with-resources（Java 7+）

```java
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TryWithResources {
    // 传统方式（Java 7 之前）
    public static void readFileOldWay(String filename) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(filename));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("读取失败: " + e.getMessage());
        } finally {
            if (reader != null) {
                try {
                    reader.close();  // 必须手动关闭
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // try-with-resources（Java 7+）
    public static void readFileNewWay(String filename) {
        // 实现了 AutoCloseable 接口的资源会自动关闭
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("读取失败: " + e.getMessage());
        }
        // reader 自动关闭
    }

    // 多个资源
    public static void copyFile(String source, String target) {
        try (
            InputStream in = new FileInputStream(source);
            OutputStream out = new FileOutputStream(target)
        ) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = in.read(buffer)) > 0) {
                out.write(buffer, 0, length);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // 使用 Files API（更简洁）
        try {
            List<String> lines = Files.readAllLines(Paths.get("test.txt"));
            lines.forEach(System.out::println);
        } catch (IOException e) {
            System.out.println("文件读取失败");
        }
    }
}
```

## 异常链

```java
public class ExceptionChaining {
    public static void methodA() throws Exception {
        try {
            methodB();
        } catch (Exception e) {
            // 包装原始异常并抛出
            throw new Exception("A方法执行失败", e);
        }
    }

    public static void methodB() throws Exception {
        try {
            methodC();
        } catch (Exception e) {
            throw new Exception("B方法执行失败", e);
        }
    }

    public static void methodC() throws Exception {
        throw new Exception("C方法执行失败");
    }

    public static void main(String[] args) {
        try {
            methodA();
        } catch (Exception e) {
            System.out.println("捕获异常: " + e.getMessage());
            System.out.println("\n异常链:");
            printExceptionChain(e);
        }
    }

    private static void printExceptionChain(Throwable e) {
        Throwable cause = e;
        int level = 0;
        while (cause != null) {
            System.out.println("  ".repeat(level) + "└─ " + cause.getMessage());
            cause = cause.getCause();
            level++;
        }
    }
}
```

## 异常最佳实践

```java
public class ExceptionBestPractices {
    // 1. 尽早失败
    public void processData(String data) {
        if (data == null) {
            throw new IllegalArgumentException("数据不能为空");
        }
        // 继续处理
    }

    // 2. 使用具体异常而非通用异常
    // public void method() throws Exception { }  // 不推荐
    public void method() throws IOException, SQLException { }  // 推荐

    // 3. 异常信息应包含足够的上下文
    public void transfer(String from, String to, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException(
                String.format("转账金额必须大于0。转账金额: %.2f", amount)
            );
        }
    }

    // 4. 不要忽略异常
    // try { ... } catch (Exception e) { }  // 不推荐

    // 5. 不要捕获顶级异常
    // try { ... } catch (Exception e) { }  // 不推荐
    try { ... } catch (IOException e) { }  // 推荐

    // 6. 记录并重新抛出
    public void logAndRethrow() throws IOException {
        try {
            // 可能抛出IO异常的代码
        } catch (IOException e) {
            logger.error("操作失败", e);
            throw e;
        }
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `try {} catch {}` | `try {} catch {}` | 相同 |
| `try {} finally {}` | `try {} finally {}` | 相同 |
| `throw new Error()` | `throw new Exception()` | Java异常更结构化 |
| 无 `throws` | `throws 声明` | Java有编译时检查 |
| 无 `try-with-resources` | `try-with-resources` | Java自动资源管理 |
| 没有异常类型层次 | 丰富的异常类型体系 | Java更规范 |

---

## 下一篇

[IO流](./IO流.md)
