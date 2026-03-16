---
title: 集合 List
category: 后端
---
# 集合 List

## List 概述

List 是有序集合，允许重复元素。

```
List 实现类
├── ArrayList
│   └── 基于数组，随机访问快，增删慢
├── LinkedList
│   └── 基于链表，增删快，随机访问慢
└── Vector
    └── 线程安全，性能较低（已过时）
```

## ArrayList

```java
import java.util.*;

public class ArrayListDemo {
    public static void main(String[] args) {
        // 创建 ArrayList
        List<String> list = new ArrayList<>();

        // 添加元素
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");
        list.add("Banana");  // 允许重复
        list.add(2, "Date"); // 在指定位置插入

        System.out.println("列表: " + list);
        // 输出: [Apple, Banana, Date, Cherry, Banana]

        // 访问元素
        System.out.println("第一个: " + list.get(0));
        System.out.println("最后一个: " + list.get(list.size() - 1));

        // 修改元素
        list.set(1, "Blueberry");
        System.out.println("修改后: " + list);

        // 删除元素
        list.remove(0);          // 按索引删除
        list.remove("Banana");    // 按对象删除（删除第一个匹配的）
        System.out.println("删除后: " + list);

        // 检查
        System.out.println("大小: " + list.size());
        System.out.println("是否为空: " + list.isEmpty());
        System.out.println("包含 Cherry: " + list.contains("Cherry"));
        System.out.println("Apple 的索引: " + list.indexOf("Apple"));

        // 遍历
        System.out.println("\n遍历方式:");

        // for 循环
        for (int i = 0; i < list.size(); i++) {
            System.out.println("  [" + i + "] " + list.get(i));
        }

        // 增强 for 循环
        for (String item : list) {
            System.out.println("  " + item);
        }

        // Iterator
        Iterator<String> it = list.iterator();
        while (it.hasNext()) {
            System.out.println("  " + it.next());
        }

        // ListIterator（双向遍历）
        ListIterator<String> lit = list.listIterator();
        while (lit.hasNext()) {
            lit.next();
        }
        while (lit.hasPrevious()) {
            System.out.println("  " + lit.previous());
        }

        // 转换为数组
        String[] array = list.toArray(new String[0]);
        System.out.println("\n数组: " + Arrays.toString(array));

        // 列表切片（subList）
        List<String> subList = list.subList(0, 2);
        System.out.println("子列表: " + subList);

        // 清空
        list.clear();
        System.out.println("清空后: " + list);
    }
}
```

## LinkedList

```java
import java.util.*;

public class LinkedListDemo {
    public static void main(String[] args) {
        // LinkedList 实现 List 接口
        List<String> list = new LinkedList<>();
        list.add("A");
        list.add("B");
        list.add("C");

        // LinkedList 特有方法（作为 Queue 和 Deque）
        LinkedList<String> queue = new LinkedList<>();

        // 队列操作
        queue.offer("任务1");  // 添加到队尾
        queue.offer("任务2");
        queue.offer("任务3");

        System.out.println("队列: " + queue);
        System.out.println("取出: " + queue.poll());  // 取出队首
        System.out.println("队首: " + queue.peek());   // 查看队首

        // 栈操作
        LinkedList<String> stack = new LinkedList<>();
        stack.push("第一层");  // 压栈
        stack.push("第二层");
        stack.push("第三层");

        System.out.println("\n栈: " + stack);
        System.out.println("出栈: " + stack.pop());  // 出栈
        System.out.println("栈顶: " + stack.peek()); // 查看栈顶
    }
}

// ArrayList vs LinkedList 性能对比
class ListPerformance {
    public static void main(String[] args) {
        int size = 100000;

        // 测试 ArrayList
        List<Integer> arrayList = new ArrayList<>();
        long start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            arrayList.add(i);
        }
        long end = System.nanoTime();
        System.out.printf("ArrayList 添加 %d 个元素: %.3f ms\n",
            size, (end - start) / 1_000_000.0);

        // 测试 LinkedList
        List<Integer> linkedList = new LinkedList<>();
        start = System.nanoTime();
        for (int i = 0; i < size; i++) {
            linkedList.add(i);
        }
        end = System.nanoTime();
        System.out.printf("LinkedList 添加 %d 个元素: %.3f ms\n",
            size, (end - start) / 1_000_000.0);

        // 测试随机访问
        start = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            arrayList.get((int) (Math.random() * size));
        }
        end = System.nanoTime();
        System.out.printf("ArrayList 随机访问 1000 次: %.3f ms\n",
            (end - start) / 1_000_000.0);

        start = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            linkedList.get((int) (Math.random() * size));
        }
        end = System.nanoTime();
        System.out.printf("LinkedList 随机访问 1000 次: %.3f ms\n",
            (end - start) / 1_000_000.0);
    }
}
```

## Vector 和 Stack

```java
import java.util.*;

public class VectorDemo {
    public static void main(String[] args) {
        // Vector（线程安全，不推荐使用）
        Vector<String> vector = new Vector<>();
        vector.add("A");
        vector.add("B");
        vector.add("C");

        // Stack（继承自 Vector，栈结构）
        Stack<String> stack = new Stack<>();
        stack.push("第一层");
        stack.push("第二层");
        stack.push("第三层");

        System.out.println("栈: " + stack);
        System.out.println("弹出: " + stack.pop());
        System.out.println("栈顶: " + stack.peek());
        System.out.println("位置: " + stack.search("第一层"));

        // 推荐使用 Deque 代替 Stack
        Deque<String> deque = new ArrayDeque<>();
        deque.push("A");
        deque.push("B");
        System.out.println("\nDeque: " + deque);
    }
}
```

## List 工具类

```java
import java.util.*;

public class ListUtils {
    public static void main(String[] args) {
        List<Integer> list1 = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);
        List<Integer> list2 = new ArrayList<>(list1);

        // 排序
        Collections.sort(list2);
        System.out.println("排序后: " + list2);

        // 反序
        Collections.reverse(list2);
        System.out.println("反序后: " + list2);

        // 洗牌
        Collections.shuffle(list2);
        System.out.println("洗牌后: " + list2);

        // 查找（需要先排序）
        Collections.sort(list2);
        int index = Collections.binarySearch(list2, 5);
        System.out.println("5 的索引: " + index);

        // 交换元素
        Collections.swap(list2, 0, list2.size() - 1);
        System.out.println("交换首尾后: " + list2);

        // 填充
        Collections.fill(list2, 0);
        System.out.println("填充后: " + list2);

        // 不可修改列表
        List<String> unmodifiable = Collections.unmodifiableList(
            Arrays.asList("A", "B", "C")
        );
        // unmodifiable.add("D");  // 抛出 UnsupportedOperationException

        // 同步列表（线程安全）
        List<String> syncList = Collections.synchronizedList(
            new ArrayList<>()
        );

        // 空列表
        List<String> emptyList = Collections.emptyList();

        // 单元素列表
        List<String> singleList = Collections.singletonList("A");

        // 列表转换
        String[] array = {"X", "Y", "Z"};
        List<String> fromArray = Arrays.asList(array);
        // 注意：返回的是固定大小的列表，不能增删
    }
}
```

## List 与数组互转

```java
import java.util.*;

public class ListArrayConversion {
    public static void main(String[] args) {
        // 数组转 List
        String[] array = {"A", "B", "C"};

        // 方式1: Arrays.asList（固定大小，不能增删）
        List<String> list1 = Arrays.asList(array);
        // list1.add("D");  // 抛出 UnsupportedOperationException

        // 方式2: 创建新的 ArrayList（可变）
        List<String> list2 = new ArrayList<>(Arrays.asList(array));
        list2.add("D");
        System.out.println("可变列表: " + list2);

        // 方式3: 遍历添加
        List<String> list3 = new ArrayList<>();
        Collections.addAll(list3, array);
        System.out.println("Collections.addAll: " + list3);

        // List 转数组
        // 方式1: toArray(new String[0])
        String[] newArray1 = list2.toArray(new String[0]);
        System.out.println("数组1: " + Arrays.toString(newArray1));

        // 方式2: toArray(new String[size])
        String[] newArray2 = list2.toArray(new String[list2.size()]);
        System.out.println("数组2: " + Arrays.toString(newArray2));

        // 方式3: 转为 Integer[] 再转为 int[]
        List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5);
        Integer[] intArray = intList.toArray(new Integer[0]);
        int[] intPrimitiveArray = Arrays.stream(intArray).mapToInt(Integer::intValue).toArray();
        System.out.println("基本类型数组: " + Arrays.toString(intPrimitiveArray));
    }
}
```

## 与 JavaScript 对比

| JavaScript | Java | 说明 |
|------------|------|------|
| `[]` 数组 | `ArrayList` | JS 数组可变大小 |
| `.push()` | `.add()` | 添加元素 |
| `.pop()` | `.remove(size-1)` | 删除末尾 |
| `[index]` | `.get(index)` | 访问元素 |
| `length` | `.size()` | 获取大小 |
| `.includes()` | `.contains()` | 包含检查 |
| `.indexOf()` | `.indexOf()` | 查找索引 |
| `.splice()` | 无直接对应 | JS 功能更强 |
| `.slice()` | `.subList()` | 子列表 |

---

## 下一篇

[集合 Set](./集合-Set.md)
