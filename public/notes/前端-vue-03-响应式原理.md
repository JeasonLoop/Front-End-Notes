---
title: Vue 响应式原理
category: 前端
---
# Vue 响应式原理

## 1. 响应式基础

### 1.1 ref

```vue
<script setup>
import { ref } from 'vue'

// 创建响应式引用
const count = ref(0)

// 访问值需要 .value
console.log(count.value) // 0

// 修改值
count.value++

// 在模板中自动解包，不需要 .value
</script>

<template>
  <p>{{ count }}</p>
  <button @click="count++">增加</button>
</template>
```

### 1.2 reactive

```vue
<script setup>
import { reactive } from 'vue'

// 创建响应式对象
const state = reactive({
  name: 'Vue',
  version: 3,
  features: ['响应式', '组合式API']
})

// 直接访问属性
console.log(state.name)

// 直接修改
state.name = 'Vue.js'

// 不需要 .value
</script>

<template>
  <p>{{ state.name }}</p>
</template>
```

### 1.3 ref vs reactive

```vue
<script setup>
import { ref, reactive } from 'vue'

// ref 适合基本类型
const count = ref(0)
const message = ref('hello')

// reactive 适合对象类型
const user = reactive({
  name: 'John',
  age: 20
})

// ref 可以替换整个对象
const objRef = ref({ a: 1 })
objRef.value = { b: 2 } // 正常工作

// reactive 不能替换整个对象
const objReactive = reactive({ a: 1 })
// objReactive = { b: 2 } // 错误！会丢失响应性

// ref 可以解包
const refArray = ref([1, 2, 3])
refArray.value.push(4) // 需要 .value

// reactive 数组可以直接操作
const reactiveArray = reactive([1, 2, 3])
reactiveArray.push(4) // 不需要 .value
</script>
```

## 2. 响应式工具函数

### 2.1 readonly

```vue
<script setup>
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

// 创建只读代理
const readonlyCopy = readonly(original)

// 无法修改
readonlyCopy.count++ // 警告：目标是只读的

// 原始对象修改会影响只读代理
original.count++
console.log(readonlyCopy.count) // 1
</script>
```

### 2.2 shallowRef / shallowReactive

```vue
<script setup>
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// shallowRef：只有 .value 是响应式的
const shallow = shallowRef({
  nested: { count: 0 }
})

shallow.value.nested.count++ // 不触发更新
shallow.value = { nested: { count: 1 } } // 触发更新

// 手动触发更新
triggerRef(shallow)

// shallowReactive：只有根级属性是响应式的
const shallowObj = shallowReactive({
  nested: { count: 0 }
})

shallowObj.nested.count++ // 不触发更新
shallowObj.nested = { count: 1 } // 触发更新
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

// toRef：为单个属性创建 ref
const nameRef = toRef(state, 'name')
nameRef.value = 'Vue.js'
console.log(state.name) // 'Vue.js'

// toRefs：为所有属性创建 ref
const { name, version } = toRefs(state)
name.value = 'Vue 3'
console.log(state.name) // 'Vue 3'

// 解构后保持响应性
const { name: nameCopy, version: versionCopy } = toRefs(state)
</script>
```

### 2.4 unref / isRef

```vue
<script setup>
import { ref, unref, isRef } from 'vue'

const count = ref(0)
const normal = 1

// unref：如果是 ref 则返回 .value，否则返回本身
console.log(unref(count)) // 0
console.log(unref(normal)) // 1

// isRef：检查是否为 ref
console.log(isRef(count)) // true
console.log(isRef(normal)) // false
</script>
```

### 2.5 toRaw / markRaw

```vue
<script setup>
import { reactive, toRaw, markRaw } from 'vue'

const state = reactive({ count: 0 })

// toRaw：获取原始对象
const raw = toRaw(state)
raw.count++ // 不会触发更新

// markRaw：标记对象永远不会转为响应式
const obj = markRaw({ name: 'static' })
const reactiveObj = reactive(obj) // 不会转为响应式
console.log(isReactive(reactiveObj)) // false
</script>
```

## 3. 响应式原理详解

### 3.1 Proxy 代理

```javascript
// Vue 3 使用 Proxy 实现响应式
const target = {
  name: 'Vue',
  count: 0
}

const handler = {
  get(target, key, receiver) {
    console.log(`获取属性: ${key}`)
    track(target, key) // 收集依赖
    return Reflect.get(target, key, receiver)
  },
  
  set(target, key, value, receiver) {
    console.log(`设置属性: ${key} = ${value}`)
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key) // 触发更新
    return result
  },
  
  deleteProperty(target, key) {
    console.log(`删除属性: ${key}`)
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key) // 触发更新
    return result
  }
}

const proxy = new Proxy(target, handler)

// 测试
proxy.count // 获取属性: count
proxy.count = 1 // 设置属性: count = 1
```

### 3.2 依赖收集

```javascript
// 当前正在执行的副作用
let activeEffect = null

// 存储依赖关系
const targetMap = new WeakMap()

// 收集依赖
function track(target, key) {
  if (!activeEffect) return
  
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  dep.add(activeEffect)
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}

// 副作用函数
function effect(fn) {
  activeEffect = fn
  fn() // 执行时收集依赖
  activeEffect = null
}
```

### 3.3 简化版响应式实现

```javascript
// 简化版 reactive
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    }
  })
}

// 简化版 ref
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}

// 简化版 computed
function computed(getter) {
  const refValue = ref()
  effect(() => {
    refValue.value = getter()
  })
  return refValue
}

// 使用示例
const state = reactive({ count: 0 })

effect(() => {
  console.log('count 改变了:', state.count)
})

state.count++ // 自动触发 effect
```

### 3.4 响应式流程图

```
┌─────────────────────────────────────────────────────────────┐
│                       响应式系统流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│  │  Data   │───▶│  Proxy  │───▶│  Getter │                │
│  └─────────┘    └─────────┘    └────┬────┘                │
│                                      │                      │
│                                      ▼                      │
│                              ┌──────────────┐              │
│                              │ Track 依赖收集 │              │
│                              └──────┬───────┘              │
│                                     │                       │
│                                     ▼                       │
│                             ┌─────────────┐                │
│                             │  Effect 副作用 │                │
│                             └─────────────┘                │
│                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│  │  Setter │◀───│  Proxy  │◀───│  修改值  │                │
│  └────┬────┘    └─────────┘    └─────────┘                │
│       │                                                     │
│       ▼                                                     │
│ ┌─────────────────┐                                        │
│ │ Trigger 触发更新 │                                        │
│ └────────┬────────┘                                        │
│          │                                                  │
│          ▼                                                  │
│  ┌───────────────┐                                         │
│  │ 更新 DOM 视图  │                                         │
│  └───────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 4. 响应式陷阱

### 4.1 解构失去响应性

```vue
<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({
  name: 'Vue',
  count: 0
})

// ❌ 错误：解构会失去响应性
const { name, count } = state

// ✅ 正确：使用 toRefs
const { name, count } = toRefs(state)

// ✅ 正确：使用 toRef 单个转换
const nameRef = toRef(state, 'name')
</script>
```

### 4.2 替换 reactive 对象

```vue
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

// ❌ 错误：替换会失去响应性
// state = { count: 1 }

// ✅ 正确：修改属性
state.count = 1

// ✅ 正确：Object.assign
Object.assign(state, { count: 1, newProp: 'value' })
</script>
```

### 4.3 数组响应式陷阱

```vue
<script setup>
import { reactive } from 'vue'

const list = reactive([1, 2, 3])

// ✅ 这些操作都是响应式的
list.push(4)
list.pop()
list.shift()
list.unshift(0)
list.splice(1, 1)
list.sort()
list.reverse()

// ❌ 通过索引直接设置（Vue 3 中是响应式的，Vue 2 中不是）
list[0] = 100 // Vue 3 支持

// ❌ 修改数组长度
list.length = 0 // Vue 3 支持

// Vue 2 中的替代方案
// list.splice(0)
</script>
```

### 4.4 异步更新

```vue
<script setup>
import { ref, nextTick } from 'vue'

const message = ref('')

const updateMessage = async () => {
  message.value = '新消息'
  
  // DOM 还没更新
  console.log(document.getElementById('msg').textContent) // 可能是旧值
  
  // 等待 DOM 更新
  await nextTick()
  
  // DOM 已更新
  console.log(document.getElementById('msg').textContent) // '新消息'
}
</script>
```
