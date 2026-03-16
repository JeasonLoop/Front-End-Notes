---
title: Vue Router 路由管理
category: 前端
---
# Vue Router 路由管理

## 1. 基础配置

### 1.1 安装和设置

```bash
# 创建项目时选择 Router
npm create vue@latest

# 手动安装
npm install vue-router@4
```

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### 1.2 路由视图

```vue
<!-- App.vue -->
<template>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
  </nav>
  
  <!-- 路由出口 -->
  <router-view></router-view>
</template>
```

## 2. 路由定义

### 2.1 动态路由

```javascript
// router/index.js
const routes = [
  // 动态字段以冒号开始
  {
    path: '/user/:id',
    name: 'User',
    component: User
  },
  
  // 多个动态字段
  {
    path: '/user/:id/post/:postId',
    name: 'Post',
    component: Post
  },
  
  // 可选参数
  {
    path: '/user/:id?',
    component: User
  },
  
  // 重复参数
  {
    path: '/search/:query+',
    component: Search
  }
]
```

```vue
<!-- User.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// 访问参数
console.log(route.params.id)
</script>

<template>
  <p>用户 ID: {{ $route.params.id }}</p>
</template>
```

### 2.2 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 匹配 /user/:id
        path: '',
        name: 'UserHome',
        component: UserHome
      },
      {
        // 匹配 /user/:id/profile
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        // 匹配 /user/:id/posts
        path: 'posts',
        name: 'UserPosts',
        component: UserPosts
      }
    ]
  }
]
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h2>用户中心</h2>
    
    <nav>
      <router-link :to="{ name: 'UserHome' }">主页</router-link>
      <router-link :to="{ name: 'UserProfile' }">资料</router-link>
      <router-link :to="{ name: 'UserPosts' }">文章</router-link>
    </nav>
    
    <!-- 嵌套路由出口 -->
    <router-view></router-view>
  </div>
</template>
```

### 2.3 命名路由

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: User
  }
]
```

```vue
<template>
  <!-- 使用 name -->
  <router-link :to="{ name: 'user', params: { id: 123 } }">
    用户
  </router-link>
  
  <!-- 或在代码中导航 -->
  <button @click="goToUser">跳转</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToUser = () => {
  router.push({ name: 'user', params: { id: 123 } })
}
</script>
```

### 2.4 命名视图

```javascript
const routes = [
  {
    path: '/layout',
    components: {
      default: Home,
      sidebar: Sidebar,
      footer: Footer
    }
  }
]
```

```vue
<template>
  <router-view></router-view>
  <router-view name="sidebar"></router-view>
  <router-view name="footer"></router-view>
</template>
```

### 2.5 重定向和别名

```javascript
const routes = [
  // 重定向
  {
    path: '/home',
    redirect: '/'
  },
  
  // 命名路由重定向
  {
    path: '/home',
    redirect: { name: 'Home' }
  },
  
  // 动态重定向
  {
    path: '/search/:query',
    redirect: to => {
      return { path: '/search', query: { q: to.params.query } }
    }
  },
  
  // 别名
  {
    path: '/users',
    component: Users,
    alias: '/people'  // /people 也是这个路由
  }
]
```

## 3. 路由导航

### 3.1 router-link

```vue
<template>
  <!-- 字符串路径 -->
  <router-link to="/">首页</router-link>
  
  <!-- v-bind 形式 -->
  <router-link :to="'/about'">关于</router-link>
  
  <!-- 对象形式 -->
  <router-link :to="{ path: '/about' }">关于</router-link>
  <router-link :to="{ name: 'user', params: { id: 123 } }">用户</router-link>
  <router-link :to="{ path: '/search', query: { q: 'vue' } }">搜索</router-link>
  
  <!-- 替换当前路由 -->
  <router-link to="/about" replace>关于</router-link>
  
  <!-- 自定义标签 -->
  <router-link to="/about" custom v-slot="{ navigate, isActive }">
    <button @click="navigate" :class="{ active: isActive }">
      关于
    </button>
  </router-link>
  
  <!-- active-class -->
  <router-link to="/about" active-class="current">关于</router-link>
  
  <!-- exact-active-class -->
  <router-link to="/about" exact-active-class="exact-current">关于</router-link>
</template>
```

### 3.2 编程式导航

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航到不同路由
const navigate = () => {
  // 字符串路径
  router.push('/users')
  
  // 对象形式
  router.push({ path: '/users' })
  
  // 命名路由
  router.push({ name: 'user', params: { id: 123 } })
  
  // 带查询参数
  router.push({ path: '/search', query: { q: 'vue' } })
  
  // 替换当前路由（不留历史记录）
  router.replace({ path: '/users' })
  
  // 前进/后退
  router.go(1)   // 前进 1 页
  router.go(-1)  // 后退 1 页
  router.back()  // 后退
  router.forward() // 前进
}
</script>
```

## 4. 路由守卫

### 4.1 全局守卫

```javascript
// router/index.js

// 全局前置守卫
router.beforeEach((to, from) => {
  // 返回 false 取消导航
  // 返回路由地址重定向
  // 不返回或返回 true 继续导航
  
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})

// 全局解析守卫
router.beforeResolve(async to => {
  // 在导航被确认之前，所有组件内守卫和异步路由组件被解析之后调用
  if (to.meta.requiresAuth) {
    await checkAuth()
  }
})

// 全局后置钩子
router.afterEach((to, from, failure) => {
  // 可用于分析、更新标题等
  document.title = to.meta.title || 'My App'
})
```

### 4.2 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from) => {
      // 路由独享守卫
      if (!isAdmin()) {
        return { path: '/login' }
      }
    }
  },
  
  // 多个守卫
  {
    path: '/protected',
    component: Protected,
    beforeEnter: [guard1, guard2, guard3]
  }
]

function guard1(to, from) {
  // ...
}

function guard2(to, from) {
  // ...
}
```

### 4.3 组件内守卫

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// 离开守卫
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定要离开吗？更改将不会保存！')
  if (!answer) return false
})

// 更新守卫
onBeforeRouteUpdate((to, from) => {
  // 路由参数变化时调用
  // 例如从 /users/1 到 /users/2
  fetchUser(to.params.id)
})
</script>
```

### 4.4 完整导航解析流程

```
1. 触发导航
2. 调用失活组件的 beforeRouteLeave
3. 调用全局 beforeEach
4. 重用组件调用 beforeRouteUpdate
5. 路由配置调用 beforeEnter
6. 解析异步路由组件
7. 激活组件调用 beforeRouteEnter
8. 调用全局 beforeResolve
9. 导航确认
10. 调用全局 afterEach
11. DOM 更新
12. 调用 beforeRouteEnter 的 next 回调
```

## 5. 路由元信息

### 5.1 定义元信息

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      title: '管理后台',
      roles: ['admin']
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: '个人资料'
    }
  }
]
```

### 5.2 访问元信息

```javascript
// 全局守卫
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'Login' }
  }
  
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

// 扩展 RouteMeta 类型 (TypeScript)
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
    roles?: string[]
  }
}
```

## 6. 数据获取

### 6.1 导航后获取

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchUser } from '../api'

const route = useRoute()
const user = ref(null)

// 监听路由变化
watch(
  () => route.params.id,
  async (id) => {
    user.value = await fetchUser(id)
  },
  { immediate: true }
)
</script>
```

### 6.2 导航前获取

```vue
<script setup>
import { ref, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)

// 组件内守卫
onBeforeRouteEnter(async (to) => {
  // 返回 Promise
  return await fetchUser(to.params.id)
})

// 或使用导航守卫
router.beforeEach(async (to) => {
  if (to.name === 'User') {
    to.meta.user = await fetchUser(to.params.id)
  }
})
</script>
```

## 7. 懒加载

### 7.1 动态导入

```javascript
// 懒加载组件
const routes = [
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue')
  }
]
```

### 7.2 分组打包

```javascript
const routes = [
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    children: [
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Users.vue')
      },
      {
        path: 'settings',
        component: () => import(/* webpackChunkName: "admin" */ '../views/admin/Settings.vue')
      }
    ]
  }
]
```

## 8. 高级特性

### 8.1 滚动行为

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回滚动位置
    if (savedPosition) {
      return savedPosition
    }
    
    // 锚点
    if (to.hash) {
      return { el: to.hash }
    }
    
    // 返回顶部
    return { top: 0 }
  }
})
```

### 8.2 动态路由

```javascript
// 添加路由
router.addRoute({
  path: '/new-route',
  component: NewRoute
})

// 添加嵌套路由
router.addRoute('parentRoute', {
  path: 'child',
  component: Child
})

// 删除路由
router.removeRoute('routeName')

// 检查路由是否存在
router.hasRoute('routeName')

// 获取所有路由
router.getRoutes()
```

### 8.3 路由匹配

```javascript
import { useRouteMatch } from 'vue-router'

// 自定义正则
const routes = [
  {
    path: '/user/:id(\\d+)',  // 只匹配数字
    component: User
  },
  {
    path: '/user/:name([a-z]+)',  // 只匹配小写字母
    component: User
  }
]
```

## 9. 组合式 API

### 9.1 useRoute

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.path)       // 当前路由路径
console.log(route.params)     // 路由参数
console.log(route.query)      // 查询参数
console.log(route.hash)       // hash
console.log(route.fullPath)   // 完整路径
console.log(route.name)       // 路由名称
console.log(route.meta)       // 元信息
console.log(route.matched)    // 匹配的路由记录
</script>
```

### 9.2 useRouter

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigate = () => {
  router.push('/')
  router.replace('/')
  router.go(1)
  router.back()
  router.forward()
  
  // 当前路由
  console.log(router.currentRoute.value)
  
  // 是否就绪
  router.isReady().then(() => {
    console.log('路由已就绪')
  })
}
</script>
```

## 10. 最佳实践

### 10.1 项目结构

```
src/
├── router/
│   ├── index.js          # 主路由配置
│   ├── routes/
│   │   ├── admin.js      # 管理路由
│   │   ├── user.js       # 用户路由
│   │   └── public.js     # 公开路由
│   └── guards.js         # 路由守卫
├── views/
│   ├── admin/
│   ├── user/
│   └── public/
└── App.vue
```

### 10.2 路由模块化

```javascript
// router/routes/admin.js
export default [
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      }
    ]
  }
]

// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './routes/admin'
import userRoutes from './routes/user'
import publicRoutes from './routes/public'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes
  ]
})

export default router
```

### 10.3 错误处理

```javascript
// 404 路由
const routes = [
  // ... 其他路由
  
  // 捕获所有路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})
```
