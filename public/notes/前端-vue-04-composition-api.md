---
title: Vue Composition API
category: 前端
---
# Vue Composition API

## 1. 组合式 API 基础

### 1.1 setup 函数

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 暴露给模板
    return {
      count,
      increment
    }
  }
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### 1.2 setup 语法糖

```vue
<script setup>
import { ref } from 'vue'

// 无需 return，自动暴露
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### 1.3 访问 Props 和 Context

```vue
<script setup>
// Props
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['update', 'delete'])

// 访问 props
console.log(props.title)

// 触发事件
emit('update', { id: 1 })
</script>
```

```vue
<script>
export default {
  setup(props, context) {
    // context.attrs
    // context.slots
    // context.emit
    // context.expose
    
    console.log(props.title)
    context.emit('update', { id: 1 })
  }
}
</script>
```

## 2. 响应式 API

### 2.1 ref

```vue
<script setup>
import { ref, isRef, unref } from 'vue'

// 基本类型
const count = ref(0)
const message = ref('hello')

// 对象类型
const user = ref({ name: 'Vue', age: 3 })

// 访问需要 .value
console.log(count.value)
console.log(user.value.name)

// 修改
count.value++
user.value.name = 'Vue 3'

// 检查是否为 ref
console.log(isRef(count)) // true

// 获取值（自动解包）
console.log(unref(count)) // 0
</script>
```

### 2.2 reactive

```vue
<script setup>
import { reactive, isReactive } from 'vue'

// 创建响应式对象
const state = reactive({
  name: 'Vue',
  version: 3,
  features: ['响应式', '组合式API']
})

// 直接访问，无需 .value
console.log(state.name)

// 修改
state.name = 'Vue 3'
state.features.push('Teleport')

// 解构会失去响应性
const { name } = state // ❌ 不推荐
</script>
```

### 2.3 toRef / toRefs

```vue
<script setup>
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  name: 'Vue',
  version: 3
})

// toRef - 单个属性转 ref
const nameRef = toRef(state, 'name')
nameRef.value = 'Vue 3'
console.log(state.name) // 'Vue 3'

// toRefs - 所有属性转 ref
const { name, version } = toRefs(state)
name.value = 'Vue 3.x'
console.log(state.name) // 'Vue 3.x'

// 解构后保持响应性
</script>
```

### 2.4 readonly

```vue
<script setup>
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

// 创建只读代理
const readonlyCopy = readonly(original)

// 无法修改
readonlyCopy.count++ // 警告

// 原始对象修改会同步
original.count++
console.log(readonlyCopy.count) // 1
</script>
```

### 2.5 shallowRef / shallowReactive

```vue
<script setup>
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef - 只有 .value 是响应式的
const shallow = shallowRef({
  nested: { count: 0 }
})

shallow.value.nested.count++ // 不触发更新
shallow.value = { nested: { count: 1 } } // 触发更新
triggerRef(shallow) // 手动触发

// shallowReactive - 只有根级属性响应式
const shallowObj = shallowReactive({
  nested: { count: 0 }
})

shallowObj.nested.count++ // 不触发更新
shallowObj.nested = { count: 1 } // 触发更新
</script>
```

## 3. 生命周期钩子

### 3.1 钩子函数对照表

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured
} from 'vue'

onBeforeMount(() => {
  console.log('挂载前')
})

onMounted(() => {
  console.log('已挂载')
})

onBeforeUpdate(() => {
  console.log('更新前')
})

onUpdated(() => {
  console.log('已更新')
})

onBeforeUnmount(() => {
  console.log('卸载前')
})

onUnmounted(() => {
  console.log('已卸载')
})

onErrorCaptured((err, instance, info) => {
  console.error('捕获错误:', err)
  return false // 阻止错误继续传播
})
</script>
```

### 3.2 生命周期图示

```
Options API          →    Composition API
------------------------------------------------
beforeCreate         →    setup()
created              →    setup()
beforeMount          →    onBeforeMount
mounted              →    onMounted
beforeUpdate         →    onBeforeUpdate
updated              →    onUpdated
beforeUnmount        →    onBeforeUnmount
unmounted            →    onUnmounted
errorCaptured        →    onErrorCaptured
renderTracked        →    onRenderTracked
renderTriggered      →    onRenderTriggered
```

## 4. 依赖注入

### 4.1 provide / inject

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref, readonly } from 'vue'

const theme = ref('dark')
const user = ref({ name: 'John' })

// 提供只读数据
provide('theme', readonly(theme))

// 提供可修改数据和方法
provide('user', user)
provide('updateUser', (newUser) => {
  Object.assign(user.value, newUser)
})
</script>
```

```vue
<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

// 注入数据，带默认值
const theme = inject('theme', 'light')
const user = inject('user')
const updateUser = inject('updateUser')

// 使用
updateUser({ name: 'Jane' })
</script>
```

### 4.2 应用级 Provide

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局提供
app.provide('globalConfig', {
  apiUrl: 'https://api.example.com',
  theme: 'dark'
})

app.mount('#app')
```

## 5. 组合式函数

### 5.1 创建组合式函数

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}
```

```vue
<!-- 使用 -->
<script setup>
import { useCounter } from './composables/useCounter'

const { count, doubleCount, increment, decrement, reset } = useCounter(10)
</script>

<template>
  <p>{{ count }} x 2 = {{ doubleCount }}</p>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="reset">重置</button>
</template>
```

### 5.2 常用组合式函数示例

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
```

```javascript
// composables/useFetch.js
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const fetch = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  watchEffect(() => {
    fetch()
  })
  
  return { data, error, loading, refetch: fetch }
}
```

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)
  
  // 读取
  const stored = localStorage.getItem(key)
  if (stored) {
    data.value = JSON.parse(stored)
  }
  
  // 监听变化并保存
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return data
}
```

### 5.3 使用示例

```vue
<script setup>
import { useMouse } from './composables/useMouse'
import { useFetch } from './composables/useFetch'
import { useLocalStorage } from './composables/useLocalStorage'

// 鼠标位置
const { x, y } = useMouse()

// 数据获取
const { data, loading, error } = useFetch('https://api.example.com/users')

// 本地存储
const theme = useLocalStorage('theme', 'light')
</script>

<template>
  <p>鼠标位置: {{ x }}, {{ y }}</p>
  
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">错误: {{ error.message }}</div>
  <div v-else>{{ data }}</div>
  
  <button @click="theme = theme === 'light' ? 'dark' : 'light'">
    切换主题: {{ theme }}
  </button>
</template>
```

## 6. 模板引用

### 6.1 DOM 引用

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)
const listRef = ref([])

onMounted(() => {
  // 自动聚焦
  inputRef.value.focus()
})

const addItem = () => {
  // 访问多个元素
  console.log(listRef.value)
}
</script>

<template>
  <input ref="inputRef" />
  
  <ul>
    <li v-for="item in items" :key="item.id" :ref="el => listRef.push(el)">
      {{ item.name }}
    </li>
  </ul>
</template>
```

### 6.2 组件引用

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref(null)

const callChildMethod = () => {
  childRef.value.someMethod()
}
</script>

<template>
  <ChildComponent ref="childRef" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>

<!-- 子组件 -->
<script setup>
const someMethod = () => {
  console.log('子组件方法')
  return 'result'
}

// 暴露给父组件
defineExpose({
  someMethod
})
</script>
```

## 7. 最佳实践

### 7.1 命名规范

```javascript
// 组合式函数以 use 开头
export function useCounter() { }
export function useMouse() { }
export function useLocalStorage() { }

// ref 以 Ref 结尾
const countRef = ref(0)
const userRef = ref({})

// reactive 对象不以特殊后缀
const state = reactive({})
const user = reactive({})
```

### 7.2 组织代码

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 1. Props
const props = defineProps({})

// 2. Emits
const emit = defineEmits([])

// 3. 响应式状态
const count = ref(0)
const state = reactive({})

// 4. 计算属性
const doubleCount = computed(() => count.value * 2)

// 5. 方法
const increment = () => {
  count.value++
}

// 6. 侦听器
watch(count, (newVal) => {
  console.log('count changed:', newVal)
})

// 7. 生命周期
onMounted(() => {
  console.log('mounted')
})

// 8. 组合式函数
const router = useRouter()
const store = useStore()
</script>
```

### 7.3 TypeScript 支持

```vue
<script setup lang="ts">
import { ref, reactive, computed, type Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

// Props 类型
interface Props {
  title: string
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

// Ref 类型
const user: Ref<User | null> = ref(null)
const count = ref<number>(0)

// Reactive 类型
const state = reactive<{
  name: string
  age: number
}>({
  name: 'Vue',
  age: 3
})

// Computed 类型
const doubleCount = computed<number>(() => count.value * 2)
</script>
```
