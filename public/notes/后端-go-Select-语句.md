# Select 语句

## Select 概述

Select 是 Go 语言中用于处理多个 channel 操作的控制结构，类似于 switch 但专门用于 channel 通信。

```
Select 语句
├── case 语句
│   ├── <-chan  接收操作
│   └── chan<-  发送操作
├── default 分支
│   └── 非阻塞操作
└── 超时控制
    └── 配合 time.After 使用
```

## 基本 Select 用法

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan string)
	ch2 := make(chan string)

	// 启动两个 goroutine
	go func() {
		time.Sleep(1 * time.Second)
		ch1 <- "来自 channel 1"
	}()

	go func() {
		time.Sleep(2 * time.Second)
		ch2 <- "来自 channel 2"
	}()

	// select 等待多个 channel
	for i := 0; i < 2; i++ {
		select {
		case msg := <-ch1:
			fmt.Println("收到 ch1:", msg)
		case msg := <-ch2:
			fmt.Println("收到 ch2:", msg)
		}
	}
}
```

## 随机选择

```go
package main

import (
	"fmt"
	"time"
)

// 当多个 case 同时准备好时，select 会随机选择一个
func main() {
	ch1 := make(chan int, 1)
	ch2 := make(chan int, 1)

	// 两个 channel 都准备好
	ch1 <- 1
	ch2 <- 2

	select {
	case val := <-ch1:
		fmt.Println("从 ch1 读取:", val)
	case val := <-ch2:
		fmt.Println("从 ch2 读取:", val)
	}
}

// 生产者-消费者示例
func producer(ch chan<- int) {
	for i := 1; i <= 5; i++ {
		ch <- i
		fmt.Printf("生产: %d\n", i)
	}
	close(ch)
}

func consumer(id int, ch <-chan int, done chan<- bool) {
	for val := range ch {
		fmt.Printf("消费者%d 消费: %d\n", id, val)
	}
	done <- true
}

func multipleConsumers() {
	ch := make(chan int, 10)
	done := make(chan bool)

	go producer(ch)

	// 启动多个消费者
	for i := 1; i <= 3; i++ {
		go consumer(i, ch, done)
	}

	// 等待所有消费者完成
	for i := 0; i < 3; i++ {
		<-done
	}
}
```

## Default 分支（非阻塞）

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	// 1. 非阻塞发送
	ch := make(chan int, 1)

	select {
	case ch <- 1:
		fmt.Println("发送成功")
	default:
		fmt.Println("发送失败（缓冲区满或无接收者）")
	}

	// 2. 非阻塞接收
	select {
	case val := <-ch:
		fmt.Println("接收:", val)
	default:
		fmt.Println("没有数据可接收")
	}

	// 3. 尝试接收（通道关闭时会返回零值和 false）
	select {
	case val, ok := <-ch:
		fmt.Printf("接收: %d, 通道状态: %v\n", val, ok)
	default:
		fmt.Println("没有数据")
	}

	// 4. 轮询模式
	ch2 := make(chan string, 1)
	go func() {
		time.Sleep(2 * time.Second)
		ch2 <- "ready"
	}()

	for i := 0; i < 10; i++ {
		select {
		case msg := <-ch2:
			fmt.Println("收到:", msg)
			return
		default:
			fmt.Println("等待中...", i)
			time.Sleep(500 * time.Millisecond)
		}
	}
}
```

## 超时控制

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	// 1. 基本超时
	result := make(chan string, 1)

	go func() {
		time.Sleep(2 * time.Second)
		result <- "操作完成"
	}()

	select {
	case res := <-result:
		fmt.Println(res)
	case <-time.After(1 * time.Second):
		fmt.Println("超时了！")
	}

	// 2. 自定义超时
	timeout := make(chan bool)
	go func() {
		time.Sleep(2 * time.Second)
		timeout <- true
	}()

	select {
	case res := <-result:
		fmt.Println(res)
	case <-timeout:
		fmt.Println("自定义超时！")
	}

	// 3. 带重试的操作
	err := doWithRetry(3, 500*time.Millisecond)
	fmt.Println("结果:", err)
}

func doWithRetry(maxAttempts int, delay time.Duration) error {
	var lastErr error

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		select {
		case err := <-tryOperation():
			if err == nil {
				return nil
			}
			lastErr = err
			fmt.Printf("尝试 %d 失败: %v\n", attempt, err)

			if attempt < maxAttempts {
				time.Sleep(delay)
			}
		case <-time.After(delay):
			lastErr = fmt.Errorf("操作超时")
		}
	}

	return fmt.Errorf("所有尝试失败，最后错误: %w", lastErr)
}

func tryOperation() <-chan error {
	ch := make(chan error, 1)
	go func() {
		// 模拟随机成功/失败
		time.Sleep(200 * time.Millisecond)
		if time.Now().UnixNano()%2 == 0 {
			ch <- nil
		} else {
			ch <- fmt.Errorf("操作失败")
		}
	}()
	return ch
}
```

## 心跳机制

```go
package main

import (
	"fmt"
	"time"
)

// 心跳示例：定期检查任务是否还在运行
func worker(done <-chan struct{}, heartbeat chan<- time.Time) {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			fmt.Println("Worker 收到停止信号")
			return
		case t := <-ticker.C:
			// 发送心跳
			heartbeat <- t
		}
	}
}

func main() {
	done := make(chan struct{})
	heartbeat := make(chan time.Time)

	// 启动 worker
	go worker(done, heartbeat)

	// 监听心跳
	timeout := time.NewTimer(5 * time.Second)
	defer timeout.Stop()

	for {
		select {
		case beat := <-heartbeat:
			fmt.Println("心跳:", beat.Format("15:04:05"))
			// 重置超时计时器
			if !timeout.Stop() {
				<-timeout.C
			}
			timeout.Reset(5 * time.Second)

		case <-timeout.C:
			fmt.Println("心跳超时！worker 可能已停止")
			return

		case <-time.After(10 * time.Second):
			// 模拟主进程停止
			close(done)
			time.Sleep(1 * time.Second)
			return
		}
	}
}
```

## 多路复用模式

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

// 从多个 channel 接收数据
func multiplexer(inputs ...<-chan int) <-chan int {
	output := make(chan int)

	go func() {
		defer close(output)

		// 使用 select 从多个输入 channel 读取
		for len(inputs) > 0 {
			select {
			case val, ok := <-inputs[0]:
				if !ok {
					inputs = inputs[1:]
					continue
				}
				output <- val

			case val, ok := <-inputs[1]:
				if !ok {
					inputs = append(inputs[:1], inputs[2:]...)
					continue
				}
				output <- val

			case val, ok := <-inputs[2]:
				if !ok {
					inputs = inputs[:2]
					continue
				}
				output <- val
			}
		}
	}()

	return output
}

func producer(id int) <-chan int {
	ch := make(chan int)
	go func() {
		defer close(ch)
		for i := 1; i <= 3; i++ {
			ch <- id*10 + i
			time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)
		}
		fmt.Printf("生产者 %d 完成\n", id)
	}()
	return ch
}

func main() {
	// 创建多个生产者
	p1 := producer(1)
	p2 := producer(2)
	p3 := producer(3)

	// 多路复用
	output := multiplexer(p1, p2, p3)

	// 接收数据
	for val := range output {
		fmt.Println("接收:", val)
	}

	fmt.Println("所有数据接收完成")
}
```

## 优雅关闭

```go
package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
	for job := range jobs {
		fmt.Printf("Worker %d 处理任务 %d\n", id, job)
		time.Sleep(500 * time.Millisecond)
		results <- job * 2
	}
	fmt.Printf("Worker %d 退出\n", id)
}

func main() {
	jobs := make(chan int, 10)
	results := make(chan int, 10)

	// 启动 workers
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	// 发送任务
	go func() {
		for j := 1; j <= 10; j++ {
			jobs <- j
		}
	}()

	// 处理退出信号
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// 启动结果处理器
	go func() {
		for result := range results {
			fmt.Printf("收到结果: %d\n", result)
		}
	}()

	// 等待退出信号
	<-sigChan
	fmt.Println("\n收到退出信号，正在关闭...")

	// 关闭 jobs channel，通知 worker 停止接收新任务
	close(jobs)

	// 等待一段时间让 worker 完成当前任务
	time.Sleep(2 * time.Second)

	// 关闭 results channel
	close(results)

	fmt.Println("优雅退出完成")
}
```

## Select 最佳实践

```go
package main

import (
	"context"
	"fmt"
	"time"
)

// 1. 结合 context 使用
func contextExample() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	data := make(chan int, 1)

	go func() {
		for i := 0; i < 5; i++ {
			select {
			case data <- i:
				fmt.Println("发送:", i)
			case <-ctx.Done():
				fmt.Println("发送方取消:", ctx.Err())
				return
			}
			time.Sleep(500 * time.Millisecond)
		}
	}()

	for {
		select {
		case val := <-data:
			fmt.Println("接收:", val)
		case <-ctx.Done():
			fmt.Println("接收方取消:", ctx.Err())
			return
		}
	}
}

// 2. 空 select 用于阻塞
func blockForever() {
	select {} // 永久阻塞
}

// 3. 避免空 channel
func emptyChannelIssue() {
	var ch chan int // nil channel

	select {
	case val := <-ch: // 永远不会执行
		fmt.Println("接收:", val)
	case ch <- 1:     // 永远不会执行
		fmt.Println("发送")
	default:
		fmt.Println("默认执行")
	}
}

func main() {
	fmt.Println("=== Context 示例 ===")
	contextExample()

	fmt.Println("\n=== 空 Channel 示例 ===")
	emptyChannelIssue()
}
```

## 与 Java 对比

| Go | Java | 说明 |
|----|------|------|
| `select { case <-ch: }` | 无直接对应 | Go 独有特性 |
| `default` | `else` | 非阻塞处理 |
| `time.After()` | `CompletableFuture.orTimeout()` | 超时控制 |
| 多 channel 同时等待 | 需要 ExecutorService | Go 更简洁 |
| 随机选择 | 有序执行 | Go 处理并发更公平 |

---

## 下一篇

[并发模式](./并发模式.md)
