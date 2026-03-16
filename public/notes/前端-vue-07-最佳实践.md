---
title: Vue 最佳实践
category: 前端
---
# Vue 最佳实践

## 1. 项目结构

### 1.1 推荐目录结构

```
src/
├── assets/              # 静态资源
│   ├── images/
│   ├── styles/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── main.css
│   └── fonts/
├── components/          # 通用组件
│   ├── common/          # 基础组件
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   ├── layout/          # 布局组件
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Sidebar.vue
│   └── ui/              # UI 组件
│       ├── Card.vue
│       ├── Table.vue
│       └── Form.vue
├── composables/         # 组合式函数
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useLocalStorage.js
├── directives/          # 自定义指令
│   ├── clickOutside.js
│   ├── lazy.js
│   └── permission.js
├── plugins/             # 插件
│   ├── axios.js
│   └── i18n.js
├── router/              # 路由配置
│   ├── index.js
│   ├── routes/
│   └── guards.js
├── stores/              # 状态管理
│   ├── index.js
│   ├── user.js
│   └── cart.js
├── utils/               # 工具函数
│   ├── format.js
│   ├── validate.js
│   └── storage.js
├── views/               # 页面组件
│   ├── Home.vue
│   ├── About.vue
│   └── admin/
│       ├── Dashboard.vue
│       └── Users.vue
├── App.vue
└── main.js
```

### 1.2 组件命名规范

```javascript
// 组件名应该始终是多词的
// ✅ 好的命名
TodoList.vue
UserProfile.vue
SearchBar.vue
NavigationHeader.vue

// ❌ 不好的命名
Todo.vue
User.vue
Search.vue

// 组件名使用 PascalCase
import UserProfile from './components/UserProfile.vue'

// 在模板中使用 kebab-case
<user-profile />
```

## 2. 组件设计原则

### 2.1 单一职责原则

```vue
<!-- ❌ 不好：一个组件做太多事 -->
<template>
  <div>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <user-list :users="users" />
      <user-form @submit="addUser" />
    </main>
    <footer>...</footer>
  </div>
</template>

<!-- ✅ 好：职责分离 -->
<template>
  <app-header />
  <main>
    <user-list :users="users" @add="addUser" />
  </main>
  <app-footer />
</template>
```

### 2.2 Props 设计

```vue
<script setup>
// ✅ 定义详细的 props
const props = defineProps({
  // 基础类型检查
  title: {
    type: String,
    required: true
  },
  
  // 多类型
  value: [String, Number],
  
  // 带默认值
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  },
  
  // 对象默认值
  user: {
    type: Object,
    default: () => ({
      name: '',
      age: 0
    })
  },
  
  // 数组默认值
  items: {
    type: Array,
    default: () => []
  }
})
</script>
```

### 2.3 事件命名

```vue
<script setup>
// ✅ 事件名使用 kebab-case
const emit = defineEmits(['update:modelValue', 'user-added', 'form-submit'])

// 触发事件
const handleAdd = (user) => {
  emit('user-added', user)
}

// ❌ 避免
const emit = defineEmits(['updateModelValue', 'UserAdded'])
</script>
```

### 2.4 组件通信最佳实践

```vue
<!-- 父子组件：Props + Emits -->
<template>
  <ChildComponent 
    :data="parentData" 
    @update="handleUpdate" 
  />
</template>

<!-- 跨组件：Provide/Inject -->
<script setup>
// 祖先组件
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)

// 后代组件
import { inject } from 'vue'
const theme = inject('theme', 'light')
</script>

<!-- 全局状态：Pinia -->
<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<!-- 兄弟组件：事件总线或 Pinia -->
<script setup>
import { emitter } from '@/utils/eventBus'
emitter.emit('event-name', data)
emitter.on('event-name', handler)
</script>
```

## 3. 响应式最佳实践

### 3.1 ref vs reactive

```vue
<script setup>
import { ref, reactive } from 'vue'

// ✅ ref 适合基本类型
const count = ref(0)
const message = ref('hello')

// ✅ ref 适合需要重新赋值的对象
const user = ref(null)
user.value = { name: 'John' }

// ✅ reactive 适合对象类型且不需要重新赋值
const form = reactive({
  username: '',
  password: ''
})

// ❌ 避免解构 reactive
const { username, password } = form // 失去响应性

// ✅ 使用 toRefs
import { toRefs } from 'vue'
const { username, password } = toRefs(form)
</script>
```

### 3.2 避免响应式陷阱

```vue
<script setup>
import { ref, reactive, toRefs, nextTick } from 'vue'

// ❌ 解构 reactive 对象
const state = reactive({ count: 0 })
const { count } = state // 失去响应性

// ✅ 使用 toRefs
const { count } = toRefs(state)

// ❌ 直接替换 reactive 对象
const state = reactive({ count: 0 })
// state = { count: 1 } // 错误

// ✅ 修改属性或使用 Object.assign
state.count = 1
Object.assign(state, { count: 1, newProp: 'value' })

// ❌ 在异步更新后立即访问 DOM
const message = ref('')
message.value = 'new value'
console.log(document.getElementById('msg').textContent) // 可能是旧值

// ✅ 使用 nextTick
message.value = 'new value'
await nextTick()
console.log(document.getElementById('msg').textContent) // 新值
</script>
```

### 3.3 计算属性最佳实践

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// ✅ 使用计算属性缓存复杂计算
const fullName = computed(() => {
  console.log('计算 fullName')
  return `${firstName.value} ${lastName.value}`
})

// ✅ 避免在计算属性中执行副作用
// ❌ 错误示例
const badComputed = computed(() => {
  // 不要在这里修改其他状态
  count.value++
  return firstName.value + lastName.value
})

// ✅ 计算属性应该是纯函数
const goodComputed = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// ✅ 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ')
  }
})
</script>
```

## 4. 性能优化

### 4.1 懒加载组件

```javascript
// router/index.js
const routes = [
  {
    path: '/admin',
    component: () => import('@/views/admin/Dashboard.vue') // 懒加载
  }
]

// 组件内懒加载
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
</script>
```

### 4.2 使用 shallowRef

```vue
<script setup>
import { shallowRef } from 'vue'

// ✅ 大型对象使用 shallowRef
const bigData = shallowRef({
  // 大量数据
})

// 只在替换整个对象时触发更新
bigData.value = newData
</script>
```

### 4.3 虚拟列表

```vue
<script setup>
import { ref } from 'vue'
import { useVirtualList } from '@vueuse/core'

const items = ref(Array.from({ length: 10000 }, (_, i) => i))

const { list, containerProps, wrapperProps } = useVirtualList(items, {
  itemHeight: 50
})
</script>

<template>
  <div v-bind="containerProps" style="height: 400px; overflow-y: auto;">
    <div v-bind="wrapperProps">
      <div v-for="{ data, index } in list" :key="index" style="height: 50px;">
        {{ data }}
      </div>
    </div>
  </div>
</template>
```

### 4.4 v-once 和 v-memo

```vue
<template>
  <!-- 只渲染一次 -->
  <div v-once>
    <h1>{{ title }}</h1>
  </div>
  
  <!-- 条件性缓存 -->
  <div v-memo="[item.id]">
    {{ item.name }}
  </div>
  
  <!-- 复杂列表性能优化 -->
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    <!-- 只有 item.selected 变化时才重新渲染 -->
  </div>
</template>
```

### 4.5 避免不必要的响应式

```vue
<script setup>
import { ref, reactive, markRaw } from 'vue'

// ❌ 不需要响应式的数据
const config = reactive({
  apiUrl: 'https://api.example.com',
  timeout: 5000
})

// ✅ 使用 markRaw 或直接定义常量
import { markRaw } from 'vue'
const config = markRaw({
  apiUrl: 'https://api.example.com',
  timeout: 5000
})

// 或
const API_URL = 'https://api.example.com'
const TIMEOUT = 5000
</script>
```

## 5. 代码规范

### 5.1 组件代码顺序

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 1. 导入
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import MyComponent from '@/components/MyComponent.vue'

// 2. Props
const props = defineProps({
  // ...
})

// 3. Emits
const emit = defineEmits(['update', 'delete'])

// 4. 响应式状态
const count = ref(0)
const state = reactive({})

// 5. 计算属性
const doubleCount = computed(() => count.value * 2)

// 6. 方法
const increment = () => {
  count.value++
}

// 7. 侦听器
watch(count, (newVal) => {
  console.log(newVal)
})

// 8. 生命周期钩子
onMounted(() => {
  // ...
})

// 9. 组合式函数
const router = useRouter()
const userStore = useUserStore()
</script>

<style scoped>
/* 样式 */
</style>
```

### 5.2 命名规范

```javascript
// 组件名：PascalCase
import UserProfile from './UserProfile.vue'

// 组合式函数：use 开头
export function useCounter() {}
export function useFetch() {}

// Props：camelCase
defineProps({
  userName: String,
  isActive: Boolean
})

// 事件：kebab-case
emit('user-added', user)

// 常量：UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// 变量/函数：camelCase
const userName = 'John'
function getUserData() {}

// 私有属性/方法：_开头
const _privateMethod = () => {}
```

### 5.3 指令简写

```vue
<template>
  <!-- ✅ 推荐简写 -->
  <div :class="{ active: isActive }"></div>
  <button @click="handleClick">点击</button>
  <input v-model="value" />
  
  <!-- ✅ 动态参数 -->
  <div :[attr]="value"></div>
  <button @[event]="handler">按钮</button>
</template>
```

## 6. 错误处理

### 6.1 全局错误处理

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err)
  console.error('组件实例:', instance)
  console.error('错误信息:', info)
  
  // 上报错误
  reportError(err, info)
}

// 全局警告处理（仅开发模式）
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('全局警告:', msg)
}

app.mount('#app')
```

### 6.2 组件错误边界

```vue
<!-- ErrorBoundary.vue -->
<template>
  <slot v-if="!error" />
  <div v-else class="error">
    <h2>出错了</h2>
    <p>{{ error.message }}</p>
    <button @click="resetError">重试</button>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  console.error('组件错误:', err, info)
  return false // 阻止错误继续传播
})

const resetError = () => {
  error.value = null
}
</script>
```

```vue
<!-- 使用错误边界 -->
<template>
  <ErrorBoundary>
    <ChildComponent />
  </ErrorBoundary>
</template>
```

### 6.3 异步错误处理

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getData()
    // 处理数据
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else>
    <!-- 内容 -->
  </div>
</template>
```

## 7. 测试

### 7.1 单元测试

```javascript
// __tests__/counter.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 }
    })
    
    expect(wrapper.text()).toContain('0')
  })
  
  it('increments when button is clicked', async () => {
    const wrapper = mount(Counter)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.text()).toContain('1')
  })
  
  it('emits update event', async () => {
    const wrapper = mount(Counter)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('update')
  })
})
```

### 7.2 组件测试

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserList from '@/components/UserList.vue'

describe('UserList.vue', () => {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
  
  it('renders users', () => {
    const wrapper = mount(UserList, {
      props: { users }
    })
    
    expect(wrapper.findAll('.user-item')).toHaveLength(2)
  })
  
  it('emits select event when user is clicked', async () => {
    const wrapper = mount(UserList, {
      props: { users }
    })
    
    await wrapper.find('.user-item').trigger('click')
    
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([users[0]])
  })
})
```

## 8. TypeScript 最佳实践

### 8.1 类型定义

```typescript
// types/user.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}
```

### 8.2 组件类型

```vue
<script setup lang="ts">
import type { PropType } from 'vue'

interface User {
  id: number
  name: string
}

// Props 类型
interface Props {
  title: string
  users: User[]
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits 类型
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()

// 泛型组件
interface Props<T> {
  items: T[]
  selected: T
}

const props = defineProps<Props<User>>()
</script>
```

### 8.3 组合式函数类型

```typescript
// composables/useFetch.ts
import { ref, type Ref } from 'vue'

interface FetchResult<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useFetch<T>(url: string): FetchResult<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)
  
  const execute = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return { data, error, loading, execute }
}
```

## 9. 安全最佳实践

### 9.1 XSS 防护

```vue
<script setup>
import { ref } from 'vue'

// ✅ 自动转义，安全
const userInput = ref('<script>alert("xss")<\/script>')

// ❌ 危险：v-html 可能导致 XSS
const rawHtml = ref('<span>用户输入</span>')
</script>

<template>
  <!-- ✅ 安全：自动转义 -->
  <p>{{ userInput }}</p>
  
  <!-- ❌ 危险：只在可信内容使用 -->
  <div v-html="rawHtml"></div>
  
  <!-- ✅ 使用 DOMPurify 清理 -->
  <div v-html="sanitize(userInput)"></div>
</template>

<script setup>
import DOMPurify from 'dompurify'

const sanitize = (html: string) => {
  return DOMPurify.sanitize(html)
}
</script>
```

### 9.2 敏感数据处理

```vue
<script setup>
// ❌ 不要在代码中硬编码敏感信息
const API_KEY = 'sk-xxxxx' // 错误

// ✅ 使用环境变量
const API_KEY = import.meta.env.VITE_API_KEY

// ✅ 不要在前端存储敏感数据
// localStorage 不安全
localStorage.setItem('token', token) // 避免存储敏感信息

// ✅ 使用 httpOnly cookie 存储敏感信息
// 后端设置 cookie
</script>
```

## 10. 文档和注释

### 10.1 组件文档

```vue
<!--
@component UserCard
@description 显示用户信息的卡片组件
@example
<UserCard
  :user="currentUser"
  :showActions="true"
  @edit="handleEdit"
  @delete="handleDelete"
/>
-->
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <div v-if="showActions" class="actions">
      <button @click="$emit('edit', user)">编辑</button>
      <button @click="$emit('delete', user.id)">删除</button>
    </div>
  </div>
</template>

<script setup>
/**
 * UserCard 组件
 * @description 用于显示用户信息
 */
interface Props {
  /** 用户对象 */
  user: User
  /** 是否显示操作按钮 */
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false
})

/**
 * 编辑用户
 * @event edit
 * @type {User}
 */
emit('edit', user)

/**
 * 删除用户
 * @event delete
 * @type {number}
 */
emit('delete', userId)
</script>
```

### 10.2 函数注释

```javascript
/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // '2024-01-01'
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  // 实现
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```
