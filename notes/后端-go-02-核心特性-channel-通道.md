---
title: Channel 通道
category: 后端
---
# Channel 通道

## Channel 概述

Channel 是 Go 语言中 goroutine 之间通信的主要方式，遵循 "不要通过共享内存来通信，而要通过通信来共享内存" 的设计理念。

```
Channel 类型
├── 无缓冲通道
│   └── 同步通信，发送和接收必须同时准备好
├── 有缓冲通道
│   └── 异步通信，有缓冲区，可以存一定数量的值
└── 单向通道
    ├── 只读 channel（<-chan）
    └── 只写 channel（chan<-）
```

## 创建和基本使用

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	// 创建无缓冲通道
	ch := make(chan int)

	// 发送和接收
	go func() {
		ch <- 10 // 发送数据
		fmt.Println("已发送: 10")
	}()

	time.Sleep(100 * time.Millisecond) // 确保发送前 goroutine 已启动

	value := <-ch // 接收数据
	fmt.Println("已接收:", value)

	// 创建有缓冲通道
	bufferedCh := make(chan string, 3)

	// 向有缓冲通道发送数据
	bufferedCh <- "Hello"
	bufferedCh <- "Go"
	fmt.Println("缓冲区剩余容量:", cap(bufferedCh)-len(bufferedCh))

	// 接收数据
	fmt.Println(<-bufferedCh)
	fmt.Println(<-bufferedCh)
}
```

## 无缓冲通道

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)

	// 模拟同步通信
	go func() {
		fmt.Println("发送方准备发送...")
		ch <- "消息1"
		fmt.Println("发送方发送完成")
	}()

	time.Sleep(1 * time.Second) // 模拟处理

	fmt.Println("接收方准备接收...")
	msg := <-ch
	fmt.Println("接收方收到:", msg)

	// 双向同步示例
	done := make(chan bool)

	go worker(done, "任务1")
	go worker(done, "任务2")
	go worker(done, "任务3")

	// 等待3个任务完成
	for i := 0; i < 3; i++ {
		<-done
	}
	fmt.Println("所有任务完成")
}

func worker(done chan bool, task string) {
	fmt.Println("开始执行:", task)
	time.Sleep(500 * time.Millisecond)
	fmt.Println("完成:", task)
	done <- true
}
```

## 有缓冲通道

```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	// 有缓冲通道
	ch := make(chan int, 5)
	var wg sync.WaitGroup

	// 生产者
	producer := func(id int) {
		defer wg.Done()
		for i := 1; i <= 5; i++ {
			ch <- id*10 + i
			fmt.Printf("生产者%d 生产: %d\n", id, id*10+i)
		}
	}

	// 消费者
	consumer := func() {
		defer wg.Done()
		for value := range ch {
			fmt.Printf("消费者 消费: %d\n", value)
		}
	}

	// 启动2个生产者
	wg.Add(2)
	go producer(1)
	go producer(2)

	// 启动1个消费者
	wg.Add(1)
	go consumer()

	// 等待生产者完成
	wg.Wait()
	close(ch) // 关闭通道

	// 等待消费者完成
	wg.Wait()
}
```

## 通道关闭

```go
package main

import "fmt"

func main() {
	ch := make(chan int, 3)

	// 发送数据
	go func() {
		for i := 1; i <= 5; i++ {
			ch <- i
			fmt.Printf("发送: %d\n", i)
		}
		close(ch) // 关闭通道
	}()

	// 接收数据（使用 range）
	fmt.Println("开始接收:")
	for value := range ch {
		fmt.Printf("接收: %d\n", value)
	}

	fmt.Println("通道已关闭")

	// 检查通道是否关闭
	ch2 := make(chan string, 2)
	ch2 <- "hello"
	close(ch2)

	value, ok := <-ch2
	fmt.Printf("值: %s, 通道是否打开: %v\n", value, ok)

	value, ok = <-ch2
	fmt.Printf("值: %s, 通道是否打开: %v\n", value, ok)

	// 尝试从已关闭的空通道接收
	value, ok = <-ch2
	fmt.Printf("值: %q, 通道是否打开: %v\n", value, ok)
}
```

## 单向通道

```go
package main

import "fmt"

// 只写通道参数
func sender(ch chan<- int) {
	for i := 1; i <= 5; i++ {
		ch <- i
		fmt.Printf("发送: %d\n", i)
	}
	close(ch)
}

// 只读通道参数
func receiver(ch <-chan int) {
	for value := range ch {
		fmt.Printf("接收: %d\n", value)
	}
}

// 返回单向通道
func channelGenerator() <-chan int {
	ch := make(chan int)
	go func() {
		defer close(ch)
		for i := 1; i <= 3; i++ {
			ch <- i
		}
	}()
	return ch
}

func main() {
	ch := make(chan int, 5)

	// 使用只写通道
	go sender(ch)

	// 使用只读通道
	receiver(ch)

	// 使用返回的单向通道
	fmt.Println("\n使用单向通道返回值:")
	for value := range channelGenerator() {
		fmt.Println("值:", value)
	}
}
```

## Select 语句

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	// 模拟多个 channel
	go func() {
		time.Sleep(2 * time.Second)
		ch1 <- "来自 channel 1 的消息"
	}()

	go func() {
		time.Sleep(1 * time.Second)
		ch2 <- "来自 channel 2 的消息"
	}()

	// select 等待多个 channel
	for i := 0; i < 2; i++ {
		select {
		case msg := <-ch1:
			fmt.Println(msg)
		case msg := <-ch2:
			fmt.Println(msg)
		case <-time.After(3 * time.Second):
			fmt.Println("超时了")
		}
	}

	// 非阻塞 select
	ch3 := make(chan int, 1)
	ch3 <- 1

	select {
	case val := <-ch3:
		fmt.Println("非阻塞接收:", val)
	default:
		fmt.Println("没有数据可接收")
	}

	select {
	case ch3 <- 2:
		fmt.Println("非阻塞发送: 2")
	default:
		fmt.Println("无法发送（缓冲区满）")
	}

	// 带超时的 select
	timeoutCh := make(chan int, 1)

	go func() {
		time.Sleep(2 * time.Second)
		timeoutCh <- 1
	}()

	select {
	case val := <-timeoutCh:
		fmt.Println("收到:", val)
	case <-time.After(1 * time.Second):
		fmt.Println("1秒内未收到数据")
	}
}
```

## 生产者-消费者模式

```go
package main

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

func main() {
	taskCh := make(chan int, 10)
	resultCh := make(chan string, 10)
	var wg sync.WaitGroup

	// 生产者
	producer := func(id int) {
		defer wg.Done()
		for i := 0; i < 5; i++ {
			task := rand.Intn(100)
			taskCh <- task
			fmt.Printf("生产者%d 生产任务: %d\n", id, task)
			time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)
		}
	}

	// 消费者
	consumer := func(id int) {
		defer wg.Done()
		for task := range taskCh {
			result := task * 2
			resultCh <- fmt.Sprintf("消费者%d 处理任务 %d -> 结果 %d",
				id, task, result)
			time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)
		}
	}

	// 启动生产者
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go producer(i)
	}

	// 启动消费者
	for i := 1; i <= 2; i++ {
		wg.Add(1)
		go consumer(i)
	}

	// 等待生产者完成
	go func() {
		wg.Wait()
		close(taskCh)
	}()

	// 收集结果
	go func() {
		wg.Wait()
		close(resultCh)
	}()

	// 输出结果
	for result := range resultCh {
		fmt.Println(result)
	}

	fmt.Println("所有任务完成")
}
```

## Worker Pool 模式

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

type Task struct {
	ID   int
	Data string
}

type Result struct {
	TaskID int
	Output string
}

func worker(id int, tasks <-chan Task, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for task := range tasks {
		fmt.Printf("Worker %d 开始处理任务 %d\n", id, task.ID)
		time.Sleep(500 * time.Millisecond)

		result := Result{
			TaskID: task.ID,
			Output: fmt.Sprintf("任务%d处理完成: %s", task.ID, task.Data),
		}
		results <- result
		fmt.Printf("Worker %d 完成任务 %d\n", id, task.ID)
	}
}

func main() {
	numWorkers := 3
	numTasks := 10

	tasks := make(chan Task, numTasks)
	results := make(chan Result, numTasks)
	var wg sync.WaitGroup

	// 创建 worker pool
	for i := 1; i <= numWorkers; i++ {
		wg.Add(1)
		go worker(i, tasks, results, &wg)
	}

	// 提交任务
	go func() {
		for i := 1; i <= numTasks; i++ {
			tasks <- Task{
				ID:   i,
				Data: fmt.Sprintf("数据-%d", i),
			}
		}
		close(tasks)
	}()

	// 等待所有 worker 完成
	go func() {
		wg.Wait()
		close(results)
	}()

	// 收集结果
	for result := range results {
		fmt.Println(result.Output)
	}

	fmt.Println("所有任务处理完成")
}
```

## Channel 最佳实践

```go
package main

import (
	"fmt"
	"time"
)

// 1. 不要在接收方关闭 channel
func goodClose() {
	ch := make(chan int, 3)
	for i := 1; i <= 3; i++ {
		ch <- i
	}
	close(ch) // 由发送方关闭
}

// 2. 检查 channel 是否关闭
func checkChannelClosed(ch <-chan int) {
	value, ok := <-ch
	if ok {
		fmt.Printf("收到: %d\n", value)
	} else {
		fmt.Println("Channel 已关闭")
	}
}

// 3. 避免向已关闭的 channel 发送数据
func safeSend(ch chan<- int, value int) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("恢复 panic:", r)
		}
	}()
	ch <- value
}

// 4. 使用 select 实现 timeout
func withTimeout() {
	result := make(chan string, 1)

	go func() {
		time.Sleep(2 * time.Second)
		result <- "完成"
	}()

	select {
	case res := <-result:
		fmt.Println(res)
	case <-time.After(1 * time.Second):
		fmt.Println("超时")
	}
}

// 5. 使用空 struct channel 实现信号
type Signal struct{}

func signalExample() {
	done := make(chan Signal{} // 使用空 struct，不占内存

	go func() {
		time.Sleep(1 * time.Second)
		close(done)
	}()

	<-done // 等待信号
	fmt.Println("收到信号")
}

func main() {
	goodClose()

	ch := make(chan int, 2)
	ch <- 1
	close(ch)
	checkChannelClosed(ch)
	checkChannelClosed(ch)

	withTimeout()
	signalExample()
}
```

## 与 Java 对比

| Go | Java | 说明 |
|----|------|------|
| `ch := make(chan int)` | `new LinkedBlockingQueue<>()` | Go channel 更简洁 |
| `ch <- value` | `queue.put(value)` | 语法不同 |
| `<-ch` | `queue.take()` | Go 支持阻塞 |
| `select { case <-ch: }` | 无直接对应 | Go select 更强大 |
| `close(ch)` | 无直接对应 | Go 可以关闭 channel |
| 轻量级 | 基于 Lock/Condition | Go 实现更高效 |
| 支持缓冲 | 需要阻塞队列实现 | Go 原生支持 |

---

## 下一篇

[Select 语句](./Select-语句.md)
