# Vue 状态管理 - Pinia

## 1. Pinia 基础

### 1.1 安装和设置

```bash
# 安装 Pinia
npm install pinia

# 创建项目时选择 Pinia
npm create vue@latest
```

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

// 创建 pinia 实例
const pinia = createPinia()

// 使用 pinia
app.use(pinia)
app.mount('#app')
```

### 1.2 定义 Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 组合式 API 风格
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  
  // Getters
  const doubleCount = computed(() => count.value * 2)
  
  // Actions
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement
  }
})

// Options API 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  actions: {
    increment() {
      this.count++
    },
    
    decrement() {
      this.count--
    }
  }
})
```

### 1.3 使用 Store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()

// 访问 state
console.log(counterStore.count)

// 访问 getters
console.log(counterStore.doubleCount)

// 调用 actions
counterStore.increment()
counterStore.decrement()

// 直接修改 state
counterStore.count++

// 批量修改
counterStore.$patch({
  count: 10
})

// 函数式批量修改
counterStore.$patch((state) => {
  state.count = 10
  state.name = 'Vue'
})
</script>

<template>
  <p>{{ counterStore.count }}</p>
  <p>{{ counterStore.doubleCount }}</p>
  <button @click="counterStore.increment">+</button>
  <button @click="counterStore.decrement">-</button>
</template>
```

## 2. State

### 2.1 定义 State

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'John',
    age: 20,
    email: 'john@example.com',
    preferences: {
      theme: 'dark',
      language: 'zh-CN'
    }
  })
})
```

### 2.2 访问 State

```vue
<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// 直接访问
console.log(userStore.name)
console.log(userStore.preferences.theme)

// 解构（保持响应性）
const { name, age } = storeToRefs(userStore)

// ❌ 不要直接解构，会失去响应性
// const { name, age } = userStore
</script>
```

### 2.3 修改 State

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 直接修改
userStore.name = 'Jane'

// $patch 对象形式
userStore.$patch({
  name: 'Jane',
  age: 25
})

// $patch 函数形式
userStore.$patch((state) => {
  state.name = 'Jane'
  state.preferences.theme = 'light'
})

// 替换整个 state
userStore.$state = {
  name: 'Jane',
  age: 25,
  email: 'jane@example.com',
  preferences: {
    theme: 'light',
    language: 'en-US'
  }
}
</script>
```

### 2.4 重置 State

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 重置到初始状态
userStore.$reset()
</script>
```

### 2.5 订阅 State 变化

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 订阅 state 变化
userStore.$subscribe((mutation, state) => {
  console.log('类型:', mutation.type)
  console.log('storeId:', mutation.storeId)
  console.log('payload:', mutation.payload)
  console.log('新 state:', state)
  
  // 持久化到本地存储
  localStorage.setItem('user', JSON.stringify(state))
})

// 订阅 $patch
userStore.$onAction(({ name, args, after, onError }) => {
  console.log(`Action ${name} 被调用，参数:`, args)
  
  // action 执行后
  after((result) => {
    console.log(`Action ${name} 执行完成，结果:`, result)
  })
  
  // action 出错
  onError((error) => {
    console.error(`Action ${name} 出错:`, error)
  })
})
</script>
```

## 3. Getters

### 3.1 定义 Getters

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    firstName: 'John',
    lastName: 'Doe',
    age: 20
  }),
  
  getters: {
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    
    // 使用 this 访问其他 getter
    fullNameUpperCase() {
      return this.fullName.toUpperCase()
    },
    
    // 传递参数
    getAgeMessage: (state) => {
      return (prefix) => `${prefix}: ${state.age}岁`
    }
  }
})
```

### 3.2 使用 Getters

```vue
<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// 访问 getters
console.log(userStore.fullName)
console.log(userStore.fullNameUpperCase)

// 传递参数
console.log(userStore.getAgeMessage('年龄'))

// 解构 getters
const { fullName, fullNameUpperCase } = storeToRefs(userStore)
</script>

<template>
  <p>{{ userStore.fullName }}</p>
  <p>{{ userStore.fullNameUpperCase }}</p>
  <p>{{ userStore.getAgeMessage('年龄') }}</p>
</template>
```

### 3.3 组合式 API 风格

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const firstName = ref('John')
  const lastName = ref('Doe')
  const age = ref(20)
  
  // Getters 就是 computed
  const fullName = computed(() => `${firstName.value} ${lastName.value}`)
  
  const fullNameUpperCase = computed(() => fullName.value.toUpperCase())
  
  const getAgeMessage = computed(() => {
    return (prefix) => `${prefix}: ${age.value}岁`
  })
  
  return {
    firstName,
    lastName,
    age,
    fullName,
    fullNameUpperCase,
    getAgeMessage
  }
})
```

## 4. Actions

### 4.1 定义 Actions

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.login(credentials)
        this.user = response.data
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.error = null
    },
    
    async updateProfile(data) {
      this.loading = true
      
      try {
        const response = await api.updateProfile(data)
        this.user = { ...this.user, ...response.data }
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 4.2 使用 Actions

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const handleLogin = async () => {
  const success = await userStore.login({
    email: 'user@example.com',
    password: 'password'
  })
  
  if (success) {
    console.log('登录成功')
  } else {
    console.log('登录失败:', userStore.error)
  }
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div v-if="userStore.loading">加载中...</div>
  <div v-else-if="userStore.user">
    欢迎, {{ userStore.user.name }}
    <button @click="handleLogout">登出</button>
  </div>
  <div v-else>
    <button @click="handleLogin">登录</button>
  </div>
  
  <div v-if="userStore.error">{{ userStore.error }}</div>
</template>
```

### 4.3 Actions 中调用其他 Actions

```javascript
export const useUserStore = defineStore('user', {
  actions: {
    async login(credentials) {
      // ...
    },
    
    async afterLogin() {
      await this.login()
      await this.fetchProfile()
      await this.fetchPermissions()
    },
    
    async fetchProfile() {
      // ...
    },
    
    async fetchPermissions() {
      // ...
    }
  }
})
```

### 4.4 订阅 Actions

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 订阅 actions
const unsubscribe = userStore.$onAction(
  ({
    name,      // action 名称
    args,      // action 参数
    after,     // action 完成后的钩子
    onError    // action 出错的钩子
  }) => {
    console.log(`Action ${name} 开始执行`)
    
    after((result) => {
      console.log(`Action ${name} 执行完成:`, result)
    })
    
    onError((error) => {
      console.error(`Action ${name} 出错:`, error)
    })
  }
)

// 取消订阅
// unsubscribe()
</script>
```

## 5. 组合式 Store

### 5.1 在 Store 中使用其他 Store

```javascript
// stores/user.js
export const useUserStore = defineStore('user', () => {
  const name = ref('John')
  
  return { name }
})

// stores/cart.js
export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const items = ref([])
  
  const addItem = (item) => {
    items.value.push({
      ...item,
      userId: userStore.name // 使用其他 store
    })
  }
  
  return { items, addItem }
})
```

### 5.2 组合多个 Store

```javascript
// stores/root.js
import { useUserStore } from './user'
import { useCartStore } from './cart'
import { useProductStore } from './product'

export function useRootStore() {
  const userStore = useUserStore()
  const cartStore = useCartStore()
  const productStore = useProductStore()
  
  const initialize = async () => {
    await userStore.fetchUser()
    await productStore.fetchProducts()
    await cartStore.fetchCart()
  }
  
  return {
    userStore,
    cartStore,
    productStore,
    initialize
  }
}
```

## 6. 插件

### 6.1 持久化插件

```javascript
// plugins/pinia-plugin-persistedstate.js
import { toValue } from 'vue'

export function piniaPluginPersistedstate({ store, options }) {
  if (options.persist) {
    const storage = options.persist.storage || localStorage
    const key = options.persist.key || store.$id
    
    // 恢复状态
    const savedState = storage.getItem(key)
    if (savedState) {
      store.$patch(JSON.parse(savedState))
    }
    
    // 监听变化
    store.$subscribe((mutation, state) => {
      storage.setItem(key, JSON.stringify(state))
    })
  }
}
```

```javascript
// main.js
import { createPinia } from 'pinia'
import { piniaPluginPersistedstate } from './plugins/pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    token: ''
  }),
  
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token'] // 只持久化 token
  }
})
```

### 6.2 自定义插件

```javascript
// plugins/pinia-logger.js
export function piniaPluginLogger({ store }) {
  // 订阅 actions
  store.$onAction(({ name, args }) => {
    console.log(`[${store.$id}] Action: ${name}`, args)
  })
  
  // 订阅 state 变化
  store.$subscribe((mutation, state) => {
    console.log(`[${store.$id}] State changed:`, mutation.type, state)
  })
}

// main.js
pinia.use(piniaPluginLogger)
```

## 7. TypeScript 支持

### 7.1 定义类型化 Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state): boolean => state.user !== null,
    
    userName: (state): string => state.user?.name || ''
  },
  
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      
      try {
        const response = await api.login(credentials)
        this.user = response.data
      } catch (error) {
        this.error = (error as Error).message
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 7.2 组合式 API 风格

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const isLoggedIn = computed(() => user.value !== null)
  const userName = computed(() => user.value?.name || '')
  
  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    
    try {
      const response = await api.login(credentials)
      user.value = response.data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }
  
  return {
    user,
    loading,
    error,
    isLoggedIn,
    userName,
    login
  }
})
```

## 8. 最佳实践

### 8.1 项目结构

```
src/
├── stores/
│   ├── index.js          # 导出所有 stores
│   ├── user.js           # 用户相关
│   ├── cart.js           # 购物车相关
│   ├── product.js        # 产品相关
│   └── plugins/
│       ├── persistedstate.js
│       └── logger.js
├── main.js
└── App.vue
```

### 8.2 命名约定

```javascript
// Store 命名：use + 实体 + Store
export const useUserStore = defineStore('user', () => { /* ... */ })
export const useCartStore = defineStore('cart', () => { /* ... */ })
export const useProductStore = defineStore('product', () => { /* ... */ })
```

### 8.3 解构使用

```vue
<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// ✅ 正确：使用 storeToRefs 解构 state 和 getters
const { user, loading, isLoggedIn } = storeToRefs(userStore)

// ✅ 正确：直接解构 actions
const { login, logout } = userStore

// ❌ 错误：直接解构 state 会失去响应性
// const { user, loading } = userStore
</script>
```

### 8.4 重置状态

```vue
<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 重置到初始状态
const reset = () => {
  userStore.$reset()
}

// 组合式 API 风格中需要手动实现
export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const age = ref(0)
  
  const reset = () => {
    name.value = ''
    age.value = 0
  }
  
  return { name, age, reset }
})
</script>
```
