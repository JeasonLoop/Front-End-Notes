---
title: Gin 框架
category: 后端
---
# Gin 框架

## Gin 概述

Gin 是一个高性能的 Go Web 框架，具有类似 Martini 的 API 性能，支持中间件、JSON 验证等特性。

```
Gin 特性
├── 高性能
│   └── 基于 HttpRouter，速度极快
├── 中间件支持
│   └── 灵活的中间件系统
├── JSON 验证
│   └── 自动解析和验证 JSON
├── 路由分组
│   └── 支持路由分组管理
└── 错误管理
    └── 内置错误处理和恢复
```

## 快速开始

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	// 创建 Gin 路由
	r := gin.Default()

	// 定义路由
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, Gin!",
		})
	})

	// 启动服务
	r.Run(":8080") // 默认在 0.0.0.0:8080
}
```

## 安装 Gin

```bash
# 初始化项目
go mod init my-gin-app

# 安装 Gin
go get -u github.com/gin-gonic/gin

# 运行
go run main.go
```

## 路由定义

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// GET 请求
	r.GET("/users", getUsers)

	// POST 请求
	r.POST("/users", createUser)

	// PUT 请求
	r.PUT("/users/:id", updateUser)

	// DELETE 请求
	r.DELETE("/users/:id", deleteUser)

	// PATCH 请求
	r.PATCH("/users/:id/status", patchUserStatus)

	// 匹配所有 HTTP 方法
	r.Any("/test", anyMethod)

	// NoRoute 处理 404
	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "页面不存在",
		})
	})

	// NoMethod 处理 405
	r.NoMethod(func(c *gin.Context) {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"error": "不允许的请求方法",
		})
	})

	r.Run(":8080")
}

func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"users": []string{"Alice", "Bob", "Charlie"},
	})
}

func createUser(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{
		"message": "用户创建成功",
	})
}

func updateUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户 " + id + " 更新成功",
	})
}

func deleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户 " + id + " 删除成功",
	})
}

func patchUserStatus(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户 " + id + " 状态更新成功",
	})
}

func anyMethod(c *gin.Context) {
	c.String(http.StatusOK, "匹配所有 HTTP 方法")
}
```

## 路径参数

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// 路径参数
	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.JSON(http.StatusOK, gin.H{
			"user_id": id,
		})
	})

	// 通配符参数
	r.GET("/files/*filepath", func(c *gin.Context) {
		filepath := c.Param("filepath")
		c.String(http.StatusOK, "访问文件: %s", filepath)
	})

	// 多个路径参数
	r.GET("/articles/:year/:month/:day", func(c *gin.Context) {
		year := c.Param("year")
		month := c.Param("month")
		day := c.Param("day")
		c.JSON(http.StatusOK, gin.H{
			"date": year + "-" + month + "-" + day,
		})
	})

	r.Run(":8080")
}
```

## 查询参数

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// 获取查询参数
	r.GET("/search", func(c *gin.Context) {
		// 获取单个参数
		keyword := c.DefaultQuery("keyword", "") // 默认空字符串
		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "10")

		// 获取多个同名参数
		tags := c.QueryArray("tags")

		// 获取所有查询参数
		queryParams := c.Request.URL.Query()

		c.JSON(http.StatusOK, gin.H{
			"keyword":    keyword,
			"page":       page,
			"limit":      limit,
			"tags":       tags,
			"all_params": queryParams,
		})
	})

	// Map 类型参数
	r.GET("/products", func(c *gin.Context) {
		var ids map[string]string
		c.ShouldBindQuery(&ids)
		c.JSON(http.StatusOK, ids)
	})

	r.Run(":8080")
}
```

## 处理请求体

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// 定义结构体
type User struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Age   int    `json:"age" binding:"min=1,max=150"`
}

func main() {
	r := gin.Default()

	// 处理 JSON 请求体
	r.POST("/users", func(c *gin.Context) {
		var user User

		// 自动解析和验证
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "用户创建成功",
			"user":    user,
		})
	})

	// 处理表单数据
	r.POST("/login", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")

		// 获取多选框
		hobbies := c.PostFormArray("hobbies")

		c.JSON(http.StatusOK, gin.H{
			"username": username,
			"hobbies":  hobbies,
		})
	})

	// 处理文件上传
	r.POST("/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		// 保存文件
		c.SaveUploadedFile(file, file.Filename)

		c.JSON(http.StatusOK, gin.H{
			"filename": file.Filename,
			"size":     file.Size,
		})
	})

	// 绑定 URI 参数
	r.GET("/users/:name", func(c *gin.Context) {
		var user struct {
			Name string `uri:"name" binding:"required"`
		}
		if err := c.ShouldBindUri(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, user)
	})

	r.Run(":8080")
}
```

## 响应处理

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// JSON 响应
	r.GET("/json", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "JSON 响应",
			"code":    200,
		})
	})

	// 字符串响应
	r.GET("/string", func(c *gin.Context) {
		c.String(http.StatusOK, "字符串响应")
	})

	// XML 响应
	r.GET("/xml", func(c *gin.Context) {
		c.XML(http.StatusOK, gin.H{
			"message": "XML 响应",
		})
	})

	// YAML 响应
	r.GET("/yaml", func(c *gin.Context) {
		c.YAML(http.StatusOK, gin.H{
			"message": "YAML 响应",
		})
	})

	// HTML 响应
	r.LoadHTMLGlob("templates/*")
	r.GET("/html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "HTML 响应",
		})
	})

	// 重定向
	r.GET("/redirect", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/json")
	})

	// 文件响应
	r.GET("/file", func(c *gin.Context) {
		c.File("example.txt")
	})

	// 文件下载
	r.GET("/download", func(c *gin.Context) {
		c.FileAttachment("example.txt", "download.txt")
	})

	// 流式响应
	r.GET("/stream", func(c *gin.Context) {
		c.Header("Content-Type", "text/plain")
		c.Stream(func(w io.Writer) bool {
			for i := 0; i < 5; i++ {
				fmt.Fprintf(w, "数据行 %d\n", i+1)
			}
			return false
		})
	})

	// 自定义状态码
	r.GET("/custom", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{
			"message": "资源创建",
		})
	})

	r.Run(":8080")
}
```

## 中间件

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

		// 处理请求
		c.Next()

		// 请求处理后执行
		latency := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		path := c.Request.URL.Path

		log.Printf("[%s] %s %s - %v", method, path, status, latency)
	}
}

// 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		if token == "" || token != "Bearer valid-token" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "未授权",
			})
			c.Abort() // 中止后续处理
			return
		}

		// 将用户信息存入上下文
		c.Set("user_id", "12345")
		c.Next()
	}
}

// CORS 中间件
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	r := gin.Default()

	// 全局中间件
	r.Use(LoggerMiddleware())
	r.Use(CORSMiddleware())

	// 路由分组
	public := r.Group("/api/v1")
	{
		public.GET("/hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "公开接口",
			})
		})
	}

	// 需要认证的路由
	protected := r.Group("/api/v1/protected")
	protected.Use(AuthMiddleware())
	{
		protected.GET("/profile", func(c *gin.Context) {
			userID := c.GetString("user_id")
			c.JSON(http.StatusOK, gin.H{
				"user_id": userID,
				"profile": "用户信息",
			})
		})
	}

	// 单个路由使用中间件
	r.GET("/admin", AuthMiddleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "管理员页面",
		})
	})

	// 自定义中间件
	customMiddleware := func(c *gin.Context) {
		fmt.Println("自定义中间件 - 进入")
		c.Next()
		fmt.Println("自定义中间件 - 离开")
	}

	r.GET("/custom", customMiddleware, func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "使用自定义中间件",
		})
	})

	r.Run(":8080")
}
```

## 路由分组

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func setupUserRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("", getUsers)
		users.POST("", createUser)
		users.GET("/:id", getUser)
		users.PUT("/:id", updateUser)
		users.DELETE("/:id", deleteUser)
	}
}

func setupPostRoutes(rg *gin.RouterGroup) {
	posts := rg.Group("/posts")
	{
		posts.GET("", getPosts)
		posts.POST("", createPost)
	}
}

func main() {
	r := gin.Default()

	// API v1
	v1 := r.Group("/api/v1")
	{
		setupUserRoutes(v1)
		setupPostRoutes(v1)
	}

	// API v2
	v2 := r.Group("/api/v2")
	{
		v2.GET("/users", getUsersV2)
	}

	r.Run(":8080")
}

// Handler functions
func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"users": "list"})
}

func createUser(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
}

func getUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"user_id": id})
}

func updateUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "updated"})
}

func deleteUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

func getPosts(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"posts": "list"})
}

func createPost(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
}

func getUsersV2(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"version": 2, "users": "list"})
}
```

## 错误处理

```go
package main

import (
	"errors"

	"github.com/gin-gonic/gin"
	"net/http"
)

// 自定义错误
type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrUserNotFound = &AppError{Code: 404, Message: "用户不存在"}
	ErrBadRequest  = &AppError{Code: 400, Message: "请求参数错误"}
)

func main() {
	r := gin.Default()

	// 全局错误恢复中间件
	r.Use(gin.Recovery())

	// 自定义错误处理
	r.Use(func(c *gin.Context) {
		c.Next()

		// 检查是否有错误
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// 处理自定义错误
			var appErr *AppError
			if errors.As(err, &appErr) {
				c.JSON(appErr.Code, gin.H{
					"code":    appErr.Code,
					"message": appErr.Message,
				})
				return
			}

			// 其他错误
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": "服务器内部错误",
			})
		}
	})

	// 返回错误
	r.GET("/error", func(c *gin.Context) {
		c.Error(ErrUserNotFound)
	})

	// 使用 JSON 错误
	r.GET("/json-error", func(c *gin.Context) {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "错误信息",
		})
	})

	// 使用 AbortWithStatusJSON
	r.GET("/abort", func(c *gin.Context) {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"message": "禁止访问",
		})
	})

	// 使用 Error 绑定错误
	r.GET("/user/:id", func(c *gin.Context) {
		id := c.Param("id")
		if id == "0" {
			c.Error(ErrUserNotFound)
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"user_id": id,
		})
	})

	r.Run(":8080")
}
```

## 与其他框架对比

| 框架 | 性能 | 特点 | 适用场景 |
|------|------|------|----------|
| Gin | ⭐⭐⭐⭐⭐ | 高性能，文档完善 | 大部分场景 |
| Echo | ⭐⭐⭐⭐⭐ | 极简，高性能 | 性能优先 |
| Beego | ⭐⭐⭐ | 全栈，类似 Laravel | 企业应用 |
| Fiber | ⭐⭐⭐⭐⭐ | 基于 Fasthttp | 高并发 |

---

## 下一篇

[路由处理](./路由处理.md)
