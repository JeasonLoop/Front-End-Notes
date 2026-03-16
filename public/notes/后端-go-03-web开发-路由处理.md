---
title: 路由处理
category: 后端
---
# 路由处理

## 路由基础

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// 基础路由
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "首页")
	})

	// 路径参数
	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.JSON(http.StatusOK, gin.H{"user_id": id})
	})

	// 通配符路由
	r.GET("/files/*filepath", func(c *gin.Context) {
		filepath := c.Param("filepath")
		c.String(http.StatusOK, "文件路径: %s", filepath)
	})

	// 查询参数
	r.GET("/search", func(c *gin.Context) {
		keyword := c.Query("keyword")
		page := c.DefaultQuery("page", "1")
		c.JSON(http.StatusOK, gin.H{
			"keyword": keyword,
			"page":    page,
		})
	})

	r.Run(":8080")
}
```

## RESTful 路由

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// RESTful 路由示例
	r.GET("/users", getUsers)           // 获取用户列表
	r.POST("/users", createUser)         // 创建用户
	r.GET("/users/:id", getUser)        // 获取单个用户
	r.PUT("/users/:id", updateUser)      // 更新用户
	r.PATCH("/users/:id", patchUser)    // 部分更新用户
	r.DELETE("/users/:id", deleteUser)   // 删除用户

	r.Run(":8080")
}

// 获取用户列表
func getUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"users": []gin.H{
			{"id": 1, "name": "张三"},
			{"id": 2, "name": "李四"},
		},
	})
}

// 创建用户
func createUser(c *gin.Context) {
	var user struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "用户创建成功",
		"user":    user,
	})
}

// 获取单个用户
func getUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"id":   id,
		"name": "张三",
	})
}

// 更新用户
func updateUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户更新成功",
		"user_id": id,
	})
}

// 部分更新用户
func patchUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户部分更新成功",
		"user_id": id,
	})
}

// 删除用户
func deleteUser(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"message": "用户删除成功",
		"user_id": id,
	})
```

## 路由分组

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// API 版本分组
	v1 := r.Group("/api/v1")
	{
		v1.GET("/users", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"version": "v1", "users": []string{"A", "B"}})
		})
	}

	v2 := r.Group("/api/v2")
	{
		v2.GET("/users", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"version": "v2", "users": []string{"A", "B", "C"}})
		})
	}

	// 功能模块分组
	// 用户模块
	users := r.Group("/users")
	users.GET("", listUsers)
	users.POST("", createUser)
	users.GET("/:id", getUser)

	// 文章模块
	articles := r.Group("/articles")
	articles.GET("", listArticles)
	articles.POST("", createArticle)

	// 评论模块
	comments := r.Group("/comments")
	comments.GET("", listComments)

	// 嵌套分组
	admin := r.Group("/admin")
	admin.GET("/dashboard", adminDashboard)

	adminUsers := admin.Group("/users")
	adminUsers.GET("", adminListUsers)
	adminUsers.DELETE("/:id", adminDeleteUser)

	r.Run(":8080")
}

// Handler functions
func listUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"users": "list"})
}
func createUser(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
}
func getUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"user": "detail"})
}
func listArticles(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"articles": "list"})
}
func createArticle(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
}
func listComments(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"comments": "list"})
}
func adminDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"dashboard": "data"})
}
func adminListUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"admin": "users"})
}
func adminDeleteUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
```

## 路由参数处理

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// 单个路径参数
	r.GET("/users/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.JSON(http.StatusOK, gin.H{
			"user_id": id,
		})
	})

	// 多个路径参数
	r.GET("/articles/:year/:month/:slug", func(c *gin.Context) {
		year := c.Param("year")
		month := c.Param("month")
		slug := c.Param("slug")
		c.JSON(http.StatusOK, gin.H{
			"date": year + "/" + month,
			"slug": slug,
		})
	})

	// 通配符
	r.GET("/files/*filepath", func(c *gin.Context) {
		filepath := c.Param("filepath")
		c.String(http.StatusOK, "访问: %s", filepath)
	})

	// URI 绑定到结构体
	r.GET("/profile/:name", func(c *gin.Context) {
		var person struct {
			Name string `uri:"name" binding:"required"`
		}

		if err := c.ShouldBindUri(&person); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, person)
	})

	// 查询参数
	r.GET("/products", func(c *gin.Context) {
		category := c.Query("category")
		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "10")
		sort := c.Query("sort")

		c.JSON(http.StatusOK, gin.H{
			"category": category,
			"page":     page,
			"limit":    limit,
			"sort":     sort,
		})
	})

	// 多值查询参数
	r.GET("/search", func(c *gin.Context) {
		tags := c.QueryArray("tags")
		ids := c.QueryArray("ids")

		c.JSON(http.StatusOK, gin.H{
			"tags": tags,
			"ids":  ids,
		})
	})

	// Map 类型查询参数
	r.GET("/filter", func(c *gin.Context) {
		var filter map[string]string
		c.ShouldBindQuery(&filter)

		c.JSON(http.StatusOK, filter)
	})

	r.Run(":8080")
}
```

## 静态文件服务

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// 服务单个文件
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.File("favicon.ico")
	})

	// 服务静态文件目录
	r.Static("/static", "./static")
	// 访问: http://localhost:8080/static/test.png

	// 服务静态文件（带 URL 前缀）
	r.StaticFS("/assets", http.Dir("./assets"))

	// 服务单个文件（自定义路径）
	r.StaticFile("/robots.txt", "./robots.txt")

	// 多个静态目录
	r.Static("/css", "./public/css")
	r.Static("/js", "./public/js")
	r.Static("/images", "./public/images")

	// 使用 LoadHTMLGlob 服务 HTML 模板
	r.LoadHTMLGlob("templates/*")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "首页",
		})
	})

	// 使用 LoadHTMLFiles 加载指定模板
	r.LoadHTMLFiles("templates/index.html", "templates/about.html")
	r.GET("/about", func(c *gin.Context) {
		c.HTML(http.StatusOK, "about.html", nil)
	})

	r.Run(":8080)
}
```

## 路由匹配顺序

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// 注意：路由匹配顺序很重要
	// 越具体的路由应该放在前面

	// 正确顺序
	r.GET("/users/:id", userDetail)        // 会匹配 /users/123
	r.GET("/users/special", specialUsers)  // 会匹配 /users/special
	r.GET("/users/*", catchAllUsers)        // 会匹配 /users/abc/def

	// 通配符示例
	r.GET("/api/v1/*action", func(c *gin.Context) {
		action := c.Param("action")
		c.String(200, "API v1 action: %s", action)
	})

	// 多个通配符
	r.GET("/files/*filename", func(c *gin.Context) {
		filename := c.Param("filename")
		c.String(200, "文件: %s", filename)
	})

	r.Run(":8080")
}

func userDetail(c *gin.Context) {
	c.String(200, "用户详情: %s", c.Param("id"))
}

func specialUsers(c *gin.Context) {
	c.String(200, "特殊用户")
}

func catchAllUsers(c *gin.Context) {
	c.String(200, "捕获所有: %s", c.Param("id"))
}
```

## 路由信息查询

```go
package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// 添加路由
	r.GET("/users", func(c *gin.Context) {})
	r.POST("/users", func(c *gin.Context) {})
	r.GET("/users/:id", func(c *gin.Context) {})

	// 打印所有路由
	routes := r.Routes()
	fmt.Println("注册的路由:")
	for _, route := range routes {
		fmt.Printf("%s %s\n", route.Method, route.Path)
	}

	// 检查路由是否存在
	fmt.Println("\n路由检查:")
	fmt.Println("GET /users 存在:", routeExists(r, "GET", "/users"))
	fmt.Println("GET /users/:id 存在:", routeExists(r, "GET", "/users/:id"))
	fmt.Println("PUT /users 存在:", routeExists(r, "PUT", "/users"))

	r.Run(":8080")
}

// 检查路由是否存在
func routeExists(r *gin.Engine, method, path string) bool {
	for _, route := range r.Routes() {
		if route.Method == method && route.Path == path {
			return true
		}
	}
	return false
}
```

## 路由最佳实践

```go
package main

import (
	"github.com/gin-gonic/gin"
)

// 1. 使用常量定义路由路径
const (
	RouteRoot        = "/"
	RouteUsers       = "/users"
	RouteUserDetail  = "/users/:id"
	RouteArticles    = "/articles"
	RouteArticleDetail = "/articles/:id"
)

// 2. 定义 Handler 组
type UserHandlers struct{}

func (h *UserHandlers) List(c *gin.Context) {
	c.JSON(200, gin.H{"users": "list"})
}

func (h *UserHandlers) Create(c *gin.Context) {
	c.JSON(201, gin.H{"message": "created"})
}

func (h *UserHandlers) Detail(c *gin.Context) {
	c.JSON(200, gin.H{"user": "detail"})
}

type ArticleHandlers struct{}

func (h *ArticleHandlers) List(c *gin.Context) {
	c.JSON(200, gin.H{"articles": "list"})
}

func (h *ArticleHandlers) Detail(c *gin.Context) {
	c.JSON(200, gin.H{"article": "detail"})
}

// 3. 路由注册函数
func RegisterRoutes(r *gin.Engine) {
	userHandlers := &UserHandlers{}
	articleHandlers := &ArticleHandlers{}

	api := r.Group("/api/v1")

	// 用户路由
	users := api.Group(RouteUsers)
	{
		users.GET("", userHandlers.List)
		users.POST("", userHandlers.Create)
		users.GET("/:id", userHandlers.Detail)
	}

	// 文章路由
	articles := api.Group(RouteArticles)
	{
		articles.GET("", articleHandlers.List)
		articles.GET("/:id", articleHandlers.Detail)
	}
}

func main() {
	r := gin.Default()
	RegisterRoutes(r)
	r.Run(":8080")
}
```

## 与 Java 对比

| Go (Gin) | Java (Spring MVC) | 说明 |
|-----------|-------------------|------|
| `r.GET("/path", handler)` | `@GetMapping("/path")` | 注解 vs 方法 |
| `:id` 路径参数 | `@PathVariable` | 参数绑定 |
| `c.Query("key")` | `@RequestParam` | 查询参数 |
| `c.ShouldBindJSON(&obj)` | `@RequestBody` | 请求体绑定 |
| `r.Group("/prefix")` | 无直接对应 | Gin 有路由分组 |
| 中间件链 | Filter/Interceptor | 概念相似 |

---

## 下一篇

[中间件](./中间件.md)
