# IO流

## Java IO 体系

```
IO 流体系
├── 字节流（Byte Stream，8位）
│   ├── InputStream
│   │   ├── FileInputStream
│   │   ├── BufferedInputStream
│   │   └── ByteArrayInputStream
│   └── OutputStream
│       ├── FileOutputStream
│       ├── BufferedOutputStream
│       └── ByteArrayOutputStream
│
├── 字符流（Character Stream，16位Unicode）
│   ├── Reader
│   │   ├── FileReader
│   │   ├── BufferedReader
│   │   └── StringReader
│   └── Writer
│       ├── FileWriter
│       ├── BufferedWriter
│       └── StringWriter
│
└── 缓冲流
    ├── BufferedReader
    ├── BufferedWriter
    ├── BufferedInputStream
    └── BufferedOutputStream
```

## 字节流

### InputStream 和 OutputStream

```java
import java.io.*;

public class ByteStreamDemo {
    public static void main(String[] args) {
        String filename = "test.txt";
        String content = "Hello, Java IO!";

        // 写入文件
        try (FileOutputStream fos = new FileOutputStream(filename)) {
            fos.write(content.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 读取文件（单字节）
        try (FileInputStream fis = new FileInputStream(filename)) {
            int data;
            while ((data = fis.read()) != -1) {
                System.out.print((char) data);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println();

        // 读取文件（字节数组）
        try (FileInputStream fis = new FileInputStream(filename)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, bytesRead));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### BufferedInputStream 和 BufferedOutputStream

```java
import java.io.*;

public class BufferedByteStream {
    public static void main(String[] args) {
        String sourceFile = "source.txt";
        String targetFile = "target.txt";

        // 缓冲流复制文件（性能更好）
        try (
            BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream(sourceFile)
            );
            BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream(targetFile)
            );
        ) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 字符流

### Reader 和 Writer

```java
import java.io.*;

public class CharacterStreamDemo {
    public static void main(String[] args) {
        String filename = "test.txt";
        String content = "你好，Java字符流！";

        // 写入文件
        try (FileWriter writer = new FileWriter(filename)) {
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 读取文件
        try (FileReader reader = new FileReader(filename)) {
            int data;
            while ((data = reader.read()) != -1) {
                System.out.print((char) data);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println();

        // 使用字符数组读取
        try (FileReader reader = new FileReader(filename)) {
            char[] buffer = new char[1024];
            int charsRead;
            while ((charsRead = reader.read(buffer)) != -1) {
                System.out.print(new String(buffer, 0, charsRead));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### BufferedReader 和 BufferedWriter

```java
import java.io.*;

public class BufferedCharStream {
    public static void main(String[] args) {
        String filename = "lines.txt";

        // 写入多行
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            writer.write("第一行");
            writer.newLine();  // 换行
            writer.write("第二行");
            writer.newLine();
            writer.write("第三行");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 逐行读取
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println(lineNumber + ": " + line);
                lineNumber++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 标准输入输出

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Scanner;

public class StandardIO {
    public static void main(String[] args) {
        // 方式1: 使用 Scanner（推荐）
        Scanner scanner = new Scanner(System.in);

        System.out.print("请输入你的名字: ");
        String name = scanner.nextLine();

        System.out.print("请输入你的年龄: ");
        int age = scanner.nextInt();

        System.out.printf("你好，%s！你今年 %d 岁\n", name, age);

        // 方式2: 使用 BufferedReader
        BufferedReader br = new BufferedReader(
            new InputStreamReader(System.in)
        );

        try {
            System.out.print("请输入一句话: ");
            String line = br.readLine();
            System.out.println("你输入的是: " + line);
        } catch (IOException e) {
            e.printStackTrace();
        }

        scanner.close();
    }
}
```

## File 类

```java
import java.io.File;
import java.io.IOException;

public class FileClassDemo {
    public static void main(String[] args) {
        // 创建 File 对象
        File file = new File("test.txt");

        // 文件信息
        System.out.println("文件名: " + file.getName());
        System.out.println("绝对路径: " + file.getAbsolutePath());
        System.out.println("文件大小: " + file.length() + " 字节");
        System.out.println("是否可读: " + file.canRead());
        System.out.println("是否可写: " + file.canWrite());

        // 文件操作
        try {
            if (!file.exists()) {
                boolean created = file.createNewFile();
                System.out.println("文件创建" + (created ? "成功" : "失败"));
            }

            // 删除文件
            // boolean deleted = file.delete();
            // System.out.println("文件删除" + (deleted ? "成功" : "失败"));

        } catch (IOException e) {
            e.printStackTrace();
        }

        // 目录操作
        File dir = new File("testdir");
        if (!dir.exists()) {
            dir.mkdir();  // 创建单级目录
            // dir.mkdirs();  // 创建多级目录
        }

        // 列出目录内容
        File currentDir = new File(".");
        File[] files = currentDir.listFiles();
        if (files != null) {
            for (File f : files) {
                System.out.println(f.getName() +
                    (f.isDirectory() ? " [目录]" : " [文件]"));
            }
        }
    }
}
```

## NIO 文件操作（Java 7+）

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

public class NIOFilesDemo {
    public static void main(String[] args) {
        Path path = Paths.get("nio_test.txt");

        // 写入文件
        try {
            List<String> lines = List.of("第一行", "第二行", "第三行");
            Files.write(path, lines);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 读取所有行
        try {
            List<String> content = Files.readAllLines(path);
            content.forEach(System.out::println);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 读取为字符串
        try {
            String content = Files.readString(path);
            System.out.println("文件内容:\n" + content);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 复制文件
        Path target = Paths.get("nio_copy.txt");
        try {
            Files.copy(path, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 删除文件
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 文件信息
        try {
            BasicFileAttributes attrs = Files.readAttributes(
                path, BasicFileAttributes.class
            );
            System.out.println("创建时间: " + attrs.creationTime());
            System.out.println("文件大小: " + attrs.size() + " 字节");
            System.out.println("是否为目录: " + attrs.isDirectory());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 对象序列化

```java
import java.io.*;

// 实现 Serializable 接口
class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private int age;
    private transient String password;  // 不序列化

    public User(String name, int age, String password) {
        this.name = name;
        this.age = age;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + "}";
    }
}

public class SerializationDemo {
    public static void main(String[] args) {
        User user = new User("张三", 25, "password123");
        String filename = "user.ser";

        // 序列化（保存对象）
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream(filename))) {
            oos.writeObject(user);
            System.out.println("对象序列化成功");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 反序列化（恢复对象）
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream(filename))) {
            User restoredUser = (User) ois.readObject();
            System.out.println("对象反序列化: " + restoredUser);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

## IO 最佳实践

```java
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

public class IOBestPractices {

    // 1. 使用 try-with-resources 自动关闭资源
    public void readFile(String filename) {
        try (BufferedReader reader = new BufferedReader(
                new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 2. 使用 NIO API（推荐）
    public void readFileNIO(String filename) {
        try {
            List<String> lines = Files.readAllLines(
                Paths.get(filename), StandardCharsets.UTF_8
            );
            lines.forEach(System.out::println);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 3. 使用 Stream API 处理大文件
    public void processLargeFile(String filename) {
        Path path = Paths.get(filename);
        try (Stream<String> stream = Files.lines(path)) {
            stream.filter(line -> line.contains("Java"))
                  .map(String::toUpperCase)
                  .forEach(System.out::println);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 4. 使用缓冲流提高性能
    public void copyFile(String source, String target) {
        try (
            BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream(source)
            );
            BufferedOutputStream bos = new BufferedOutputStream(
                new FileOutputStream(target)
            );
        ) {
            byte[] buffer = new byte[8192];  // 8KB 缓冲区
            int bytesRead;
            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `fs.readFile()` | `Files.readAllLines()` | JS是异步，Java同步 |
| `fs.writeFile()` | `Files.write()` | API设计不同 |
| `fs.createReadStream()` | `BufferedInputStream` | 流式处理概念相似 |
| 无字符流区分 | 字节流/字符流分开 | Java更细粒度 |
| 自动关闭 | 需要try-with-resources | Java显式资源管理 |
| 异步为主 | 同步为主 | Java NIO有异步API |

---

## 第一阶段完成

Java 基础入门部分已完成，继续学习：[面向对象](../02-面向对象/类与对象.md)
