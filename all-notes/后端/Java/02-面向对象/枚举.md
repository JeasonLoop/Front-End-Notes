# 枚举

## 枚举基础

枚举是一种特殊的类，用于定义一组有限的常量。

```java
// 定义枚举
enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}

public class EnumBasic {
    public static void main(String[] args) {
        // 使用枚举
        Season current = Season.SUMMER;
        System.out.println("当前季节: " + current);

        // 遍历所有枚举值
        System.out.println("\n所有季节:");
        for (Season season : Season.values()) {
            System.out.println(season);
        }

        // 枚举常用方法
        System.out.println("\n枚举方法:");
        System.out.println("名称: " + current.name());
        System.out.println("序号: " + current.ordinal());
        System.out.println("valueOf: " + Season.valueOf("SUMMER"));

        // 枚举比较
        Season s1 = Season.SPRING;
        Season s2 = Season.SPRING;
        System.out.println("\n比较: " + (s1 == s2));      // true
        System.out.println("equals: " + s1.equals(s2));   // true
        System.out.println("ordinal 比较: " + s1.compareTo(Season.WINTER)); // -3

        // switch 中使用枚举
        switch (current) {
            case SPRING:
                System.out.println("\n春暖花开");
                break;
            case SUMMER:
                System.out.println("\n夏日炎炎");
                break;
            case AUTUMN:
                System.out.println("\n秋高气爽");
                break;
            case WINTER:
                System.out.println("\n冬雪皑皑");
                break;
        }
    }
}
```

## 枚举带属性和方法

```java
enum DayOfWeek {
    MONDAY("星期一", "工作日"),
    TUESDAY("星期二", "工作日"),
    WEDNESDAY("星期三", "工作日"),
    THURSDAY("星期四", "工作日"),
    FRIDAY("星期五", "工作日"),
    SATURDAY("星期六", "周末"),
    SUNDAY("星期日", "周末");

    private final String chineseName;
    private final String type;

    // 枚举构造方法（自动调用）
    DayOfWeek(String chineseName, String type) {
        this.chineseName = chineseName;
        this.type = type;
    }

    public String getChineseName() {
        return chineseName;
    }

    public String getType() {
        return type;
    }

    public boolean isWeekend() {
        return "周末".equals(type);
    }

    // 枚举方法
    public void printInfo() {
        System.out.printf("%s (%s)\n", chineseName, type);
    }
}

public class EnumWithFields {
    public static void main(String[] args) {
        DayOfWeek today = DayOfWeek.FRIDAY;
        today.printInfo();

        System.out.println("今天是周末吗? " + today.isWeekend());

        System.out.println("\n工作日:");
        for (DayOfWeek day : DayOfWeek.values()) {
            if (!day.isWeekend()) {
                System.out.println("  " + day.getChineseName());
            }
        }
    }
}
```

## 枚举抽象方法

```java
enum Operation {
    ADD {
        @Override
        public int apply(int a, int b) {
            return a + b;
        }
    },
    SUBTRACT {
        @Override
        public int apply(int a, int b) {
            return a - b;
        }
    },
    MULTIPLY {
        @Override
        public int apply(int a, int b) {
            return a * b;
        }
    },
    DIVIDE {
        @Override
        public int apply(int a, int b) {
            if (b == 0) {
                throw new ArithmeticException("除数不能为零");
            }
            return a / b;
        }
    };

    // 抽象方法（每个枚举值必须实现）
    public abstract int apply(int a, int b);

    // 默认实现
    public int applySafe(int a, int b) {
        try {
            return apply(a, b);
        } catch (ArithmeticException e) {
            System.out.println("计算错误: " + e.getMessage());
            return 0;
        }
    }
}

public class EnumAbstractMethod {
    public static void main(String[] args) {
        int a = 10, b = 2;

        for (Operation op : Operation.values()) {
            System.out.printf("%d %s %d = %d\n",
                a, op, b, op.apply(a, b));
        }

        System.out.println("\n安全计算:");
        System.out.printf("%d %s %d = %d\n",
            a, Operation.DIVIDE, 0, Operation.DIVIDE.applySafe(a, 0));
    }
}
```

## 枚举实现接口

```java
// 定义接口
interface Drawable {
    void draw();
    double getArea();
}

// 枚举实现接口
enum Shape implements Drawable {
    CIRCLE(10) {
        @Override
        public void draw() {
            System.out.println("绘制圆形");
        }

        @Override
        public double getArea() {
            return Math.PI * size * size;
        }
    },
    SQUARE(5) {
        @Override
        public void draw() {
            System.out.println("绘制正方形");
        }

        @Override
        public double getArea() {
            return size * size;
        }
    },
    TRIANGLE(4) {
        @Override
        public void draw() {
            System.out.println("绘制三角形");
        }

        @Override
        public double getArea() {
            return 0.433 * size * size;  // 等边三角形
        }
    };

    protected double size;

    Shape(double size) {
        this.size = size;
    }
}

public class EnumInterface {
    public static void main(String[] args) {
        for (Shape shape : Shape.values()) {
            shape.draw();
            System.out.printf("面积: %.2f\n\n", shape.getArea());
        }
    }
}
```

## 枚举工具类

```java
import java.util.Arrays;
import java.util.EnumSet;
import java.util.EnumMap;
import java.util.Set;
import java.util.Map;

public class EnumUtils {
    public static void main(String[] args) {
        // 1. EnumSet：专门用于枚举的 Set
        System.out.println("=== EnumSet ===");

        // 创建包含所有枚举的 Set
        EnumSet<Season> allSeasons = EnumSet.allOf(Season.class);
        System.out.println("所有季节: " + allSeasons);

        // 创建空 Set
        EnumSet<Season> emptySet = EnumSet.noneOf(Season.class);
        emptySet.add(Season.SPRING);
        emptySet.add(Season.SUMMER);
        System.out.println("部分季节: " + emptySet);

        // 创建范围
        EnumSet<Season> range = EnumSet.range(Season.SUMMER, Season.WINTER);
        System.out.println("季节范围: " + range);

        // 2. EnumMap：专门用于枚举的 Map
        System.out.println("\n=== EnumMap ===");

        EnumMap<Season, String> seasonDesc = new EnumMap<>(Season.class);
        seasonDesc.put(Season.SPRING, "春暖花开");
        seasonDesc.put(Season.SUMMER, "夏日炎炎");
        seasonDesc.put(Season.AUTUMN, "秋高气爽");
        seasonDesc.put(Season.WINTER, "冬雪皑皑");

        for (Map.Entry<Season, String> entry : seasonDesc.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }

    enum Season {
        SPRING, SUMMER, AUTUMN, WINTER
    }
}
```

## 策略模式枚举

```java
enum DiscountStrategy {
    NONE(0) {
        @Override
        public double calculate(double price) {
            return price;
        }

        @Override
        public String getDescription() {
            return "无折扣";
        }
    },
    TEN_PERCENT(10) {
        @Override
        public double calculate(double price) {
            return price * 0.9;
        }

        @Override
        public String getDescription() {
            return "九折优惠";
        }
    },
    TWENTY_PERCENT(20) {
        @Override
        public double calculate(double price) {
            return price * 0.8;
        }

        @Override
        public String getDescription() {
            return "八折优惠";
        }
    },
    HALF_PRICE(50) {
        @Override
        public double calculate(double price) {
            return price * 0.5;
        }

        @Override
        public String getDescription() {
            return "半价优惠";
        }
    };

    private final int percentage;

    DiscountStrategy(int percentage) {
        this.percentage = percentage;
    }

    public abstract double calculate(double price);
    public abstract String getDescription();

    public int getPercentage() {
        return percentage;
    }
}

// 使用策略枚举
class PriceCalculator {
    public static void printAllPrices(double originalPrice) {
        System.out.printf("原价: ¥%.2f\n\n", originalPrice);

        for (DiscountStrategy strategy : DiscountStrategy.values()) {
            double discounted = strategy.calculate(originalPrice);
            System.out.printf("%s: ¥%.2f (省 ¥%.2f)\n",
                strategy.getDescription(),
                discounted,
                originalPrice - discounted);
        }
    }

    public static void main(String[] args) {
        printAllPrices(100);
    }
}
```

## 单例枚举（推荐方式）

```java
// 枚举实现单例（线程安全，防止反射攻击）
enum Singleton {
    INSTANCE;  // 唯一实例

    private String data;

    // 枚举构造方法（私有）
    Singleton() {
        System.out.println("Singleton 初始化");
        this.data = "初始数据";
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getData() {
        return data;
    }

    public void doSomething() {
        System.out.println("执行操作: " + data);
    }
}

// 测试
class SingletonTest {
    public static void main(String[] args) {
        // 获取单例实例
        Singleton s1 = Singleton.INSTANCE;
        Singleton s2 = Singleton.INSTANCE;

        System.out.println("s1 == s2: " + (s1 == s2));  // true

        s1.setData("新数据");
        System.out.println("s2 数据: " + s2.getData());  // 新数据

        s1.doSomething();
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| 对象常量 | `enum` | Java 是类型 |
| `const SEASONS = {...}` | `enum Season {}` | 语法不同 |
| 无类型安全 | 类型安全 | Java 更严格 |
| 无序号概念 | `ordinal()` | Java 有序号 |
| 需要手动检查完整性 | 编译时检查 | Java 更安全 |
| 动态可扩展 | 编译后固定 | Java 不可变 |

---

## 面向对象完成

继续学习：[集合](../03-高级特性/集合-List.md)
