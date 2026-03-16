---
title: 中间件
category: 后端
---
# 中间件

## 中间件概述

中间件是在请求和响应之间处理逻辑的函数，可以执行日志、认证、CORS 等操作。

```
中间件执行流程
客户端 → 中间件1 → 中间件2 → ... → Handler
       ←          ←          ←              ←
```

## 基础中间件

```go
package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"log"
)

// 日志中间件
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// 请求处理前
		log.Printf("请求开始: %s %s", c.Request.Method, c.Request.URL.Path)

		// 处理请求
		c.Next()

		// 请求处理后
		latency := time.Since(start)
		status := c.Writer.Status()
		log.Printf("请求结束: %s %s - 状态码: %d, 耗时: %v",
			c.Request.Method, c.Request.URL.Path, status, latency)
	}
}

// 响应时间中间件
func ResponseTimeMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		c.Header("X-Response-Time", latency.String())
	}
}

// 请求 ID 中间件
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = fmt.Sprintf("%d", time.Now().UnixNano())
		}
		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)
		c.Next()
	}
}

func main() {
	r := gin.Default()  // 已包含 Logger 和 Recovery

	// 使用自定义中间件
	r.Use(LoggerMiddleware())
	r.Use(ResponseTimeMiddleware())
	r.Use(RequestIDMiddleware())

	r.GET("/test", func(c *gin.Context) {
		requestID := c.GetString("request_id")
		c.JSON(200, gin.H{
			"message":    "测试接口",
			"request_id": requestID,
		})
	})

	r.Run(":8080")
}
```

## 认证授权中间件

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

// JWT 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取 token
		token := c.GetHeader("Authorization")

		// 检查 token 格式
		if token == "" || !strings.HasPrefix(token, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "未授权：缺少认证令牌",
			})
			c.Abort()
			return
		}

		// 提取 token
		tokenStr := strings.TrimPrefix(token, "Bearer ")

		// 验证 token（简化版）
		if !validateToken(tokenStr) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "未授权：无效的令牌",
			})
			c.Abort()
			return
		}

		// 将用户信息存入上下文
		c.Set("user_id", "12345")
		c.Set("username", "testuser")
		c.Next()
	}
}

// 简化版 token 验证
func validateToken(token string) bool {
	// 实际项目中应该验证 JWT
	return token == "valid-token-12345"
}

// 角色检查中间件
func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从上下文获取用户角色
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "权限不足：无法确定用户角色",
			})
			c.Abort()
			return
		}

		// 检查角色
		hasRole := false
		for _, role := range roles {
			if userRole == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "权限不足：需要的角色: " + strings.Join(roles, ", "),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	// 公开路由
	public := r.Group("/api/v1/public")
	{
		public.GET("/hello", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "公开接口"})
		})
	}

	// 需要认证的路由
	protected := r.Group("/api/v1/protected")
	protected.Use(AuthMiddleware())
	{
		protected.GET("/profile", func(c *gin.Context) {
			userID := c.GetString("user_id")
			username := c.GetString("username")
			c.JSON(200, gin.H{
				"user_id":  userID,
				"username": username,
			})
		})
	}

	// 管理员路由（需要认证 + 管理员角色）
	admin := r.Group("/api/v1/admin")
	admin.Use(AuthMiddleware())
	admin.Use(RoleMiddleware("admin", "superadmin"))
	{
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(200, gin.H{"dashboard": "data"})
		})
	}

	r.Run(":8080")
}
```

## CORS 中间件

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// CORS 中间件
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 允许所有来源（生产环境应该指定具体域名）
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		// 允许的 HTTP 方法
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// 允许的请求头
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		// 允许携带凭证
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// 预检请求缓存时间（秒）
		c.Writer.Header().Set("Access-Control-Max-Age", "3600")

		// 处理 OPTIONS 预检请求
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// 指定域名的 CORS
func CORSMiddlewareForOrigin(allowedOrigins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// 检查来源是否允许
		allowed := false
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin || allowedOrigin == "*" {
				allowed = true
				break
			}
		}

		if allowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	// 使用 CORS 中间件
	r.Use(CORSMiddleware())

	r.GET("/api/data", func(c *gin.Context) {
		c.JSON(200, gin.H{"data": "some data"})
	})

	r.Run(":8080")
}
```

## 限流中间件

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"sync"
	"time"
)

// 限流中间件
type RateLimiter struct {
	visitors map[string]*Visitor
	mu       sync.Mutex
	rate     int
	burst    int
}

type Visitor struct {
	tokens   int
	lastTime time.Time
}

func NewRateLimiter(rate, burst int) *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*Visitor),
		rate:     rate,
		burst:    burst,
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		rl.mu.Lock()
		visitor, exists := rl.visitors[ip]
		if !exists {
			visitor = &Visitor{
				tokens:   rl.burst,
				lastTime: time.Now(),
			}
			rl.visitors[ip] = visitor
		}

		// 计算 token
		now := time.Now()
		elapsed := now.Sub(visitor.lastTime).Seconds()
		visitor.tokens += int(elapsed * float64(rl.rate))
		if visitor.tokens > rl.burst {
			visitor.tokens = rl.burst
		}
		visitor.lastTime = now

		// 检查是否超限
		if visitor.tokens <= 0 {
			rl.mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "请求过于频繁，请稍后再试",
			})
			c.Abort()
			return
		}

		visitor.tokens--
		rl.mu.Unlock()

		c.Next()
	}
}

// 简单的 IP 限流
func SimpleRateLimit() gin.HandlerFunc {
	limiter := make(map[string]int)
	var mu sync.Mutex

	go func() {
		for {
			time.Sleep(time.Second)
			mu.Lock()
			limiter = make(map[string]int)
			mu.Unlock()
		}
	}()

	return func(c *gin.Context) {
		ip := c.ClientIP()
		mu.Lock()
		limiter[ip]++
		count := limiter[ip]
		mu.Unlock()

		if count > 10 {  // 每秒最多10次
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "请求过于频繁",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	// 使用限流中间件
	r.Use(NewRateLimiter(10, 20).Middleware())

	r.GET("/api/data", func(c *gin.Context) {
		c.JSON(200, gin.H{"data": "success"})
	})

	r.Run(":8080")
}
```

## 数据压缩中间件

```go
package main

import (
	"compress/gzip"
	"io"
	"strings"

	"github.com/gin-gonic/gin"
)

// Gzip 中间件
func GzipMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 检查客户端是否支持 gzip
		if !strings.Contains(c.Request.Header.Get("Accept-Encoding"), "gzip") {
			c.Next()
			return
		}

		// 设置响应头
		c.Header("Content-Encoding", "gzip")
		c.Header("Vary", "Accept-Encoding")

		// 创建 gzip writer
		gz := gzip.NewWriter(c.Writer)
		defer gz.Close()

		// 替换响应 writer
		c.Writer = &gzipWriter{c.Writer, gz}

		c.Next()
	}
}

type gzipWriter struct {
	gin.ResponseWriter
	writer io.Writer
}

func (g *gzipWriter) Write(data []byte) (int, error) {
	return g.writer.Write(data)
}

func main() {
	r := gin.Default()

	r.Use(GzipMiddleware())

	r.GET("/api/data", func(c *gin.Context) {
		largeData := strings.Repeat("这是一些需要压缩的数据", 1000)
		c.JSON(200, gin.H{"data": largeData})
	})

	r.Run(":8080")
}
```

## 自定义响应格式

```go
package main

import (
	"github.com/gin-gonic/gin"
)

// 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(200, Response{
		Code:    200,
		Message: "success",
		Data:    data,
	})
}

// 失败响应
func Fail(c *gin.Context, code int, message string) {
	c.JSON(code, Response{
		Code:    code,
		Message: message,
	})
}

// 分页响应
type PageResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Total   int64       `json:"total"`
	Page    int         `json:"page"`
	Size    int         `json:"size"`
}

func SuccessPage(c *gin.Context, data interface{}, total int64, page, size int) {
	c.JSON(200, PageResponse{
		Code:    200,
		Message: "success",
		Data:    data,
		Total:   total,
		Page:    page,
		Size:    size,
	})
}

// 统一响应中间件
func ResponseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 设置响应头
		c.Header("Content-Type", "application/json; charset=utf-8")
		c.Next()

		// 如果响应是 Response 类型，可以统一处理
		// ...
	}
}

func main() {
	r := gin.Default()
	r.Use(ResponseMiddleware())

	r.GET("/api/success", func(c *gin.Context) {
		Success(c, gin.H{"name": "test"})
	})

	r.GET("/api/fail", func(c *gin.Context) {
		Fail(c, 400, "参数错误")
	})

	r.GET("/api/page", func(c *gin.Context) {
		data := []string{"A", "B", "C"}
		SuccessPage(c, data, 100, 1, 10)
	})

	r.Run(":8080")
}
```

## 中间件最佳实践

```go
package main

import (
	"github.com/gin-gonic/gin"
)

// 1. 中间件应该专注单一职责
// 不好：一个中间件做太多事
func BadMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 日志
		// 认证
		// CORS
		// 限流
		// ...
	}
}

// 好：每个中间件做一件事
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只做日志
		c.Next()
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只做认证
		c.Next()
	}
}

// 2. 使用 c.Abort() 中止请求
func AbortOnError() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 发生错误时
		c.JSON(400, gin.H{"error": "error"})
		c.Abort()  // 中止后续中间件和 handler
	}
}

// 3. 使用 c.Set() 和 c.Get() 传递数据
func main() {
	r := gin.Default()

	// 中间件1：设置数据
	r.Use(func(c *gin.Context) {
		c.Set("user", "testuser")
		c.Next()
	})

	// 中间件2：读取数据
	r.Use(func(c *gin.Context) {
		user, _ := c.Get("user")
		println("User:", user.(string))
		c.Next()
	})

	r.Run(":8080")
}
```

## 与 Java 对比

| Go (Gin) | Java (Spring) | 说明 |
|-----------|---------------|------|
| `r.Use(middleware)` | `@Component` Filter/Interceptor | 注册方式不同 |
| `c.Next()` | `chain.doFilter()` | 控制流程 |
| `c.Abort()` | 不继续 filter | 中止请求 |
| `c.Set/Get()` | `request.setAttribute` | 传递数据 |
| 中间件函数 | Filter/Interceptor 类 | 结构不同 |
| 路由级别中间件 | Controller 注解 | 作用域控制 |

---

## 下一篇

[请求与响应](./请求与响应.md)
