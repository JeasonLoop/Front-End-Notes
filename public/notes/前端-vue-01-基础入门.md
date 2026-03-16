---
title: Vue 3 基础入门
category: 前端
---
# Vue 3 基础入门

## 1. 创建 Vue 应用

### 1.1 使用 Vite 创建项目

```bash
# 创建项目
npm create vue@latest

# 或使用 vite 直接创建
npm create vite@latest my-vue-app -- --template vue

# 安装依赖
cd my-vue-app
npm install

# 启动开发服务器
npm run dev
```

### 1.2 应用实例

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 创建应用实例
const app = createApp(App)

// 全局配置
app.config.errorHandler = (err) => {
  console.error('全局错误:', err)
}

// 挂载应用
app.mount('#app')
```

## 2. 模板语法

### 2.1 文本插值

```vue
<template>
  <!-- 双花括号语法 -->
  <p>{{ message }}</p>
  
  <!-- 支持 JavaScript 表达式 -->
  <p>{{ number + 1 }}</p>
  <p>{{ ok ? 'YES' : 'NO' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>
  
  <!-- 调用方法 -->
  <p>{{ formatDate(date) }}</p>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue 3!')
const number = ref(10)
const ok = ref(true)
const date = ref(new Date())

const formatDate = (date) => {
  return date.toLocaleDateString()
}
</script>
```

### 2.2 原始 HTML

```vue
<template>
  <!-- 使用 v-html 渲染原始 HTML -->
  <div v-html="rawHtml"></div>
  
  <!-- 注意：XSS 风险，不要在用户提交的内容上使用 -->
</template>

<script setup>
const rawHtml = '<span style="color: red;">红色文字</span>'
</script>
```

### 2.3 属性绑定

```vue
<template>
  <!-- 动态绑定属性 -->
  <div v-bind:id="dynamicId"></div>
  
  <!-- 缩写形式 -->
  <div :id="dynamicId"></div>
  
  <!-- 动态属性名 -->
  <div :[attributeName]="value"></div>
  
  <!-- 绑定多个属性 -->
  <div v-bind="objectOfAttrs"></div>
  
  <!-- 布尔型属性 -->
  <button :disabled="isDisabled">按钮</button>
</template>

<script setup>
import { ref } from 'vue'

const dynamicId = ref('my-id')
const attributeName = ref('href')
const value = ref('https://vuejs.org')
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
const isDisabled = ref(false)
</script>
```

## 3. 指令系统

### 3.1 条件渲染

```vue
<template>
  <!-- v-if / v-else-if / v-else -->
  <div v-if="type === 'A'">类型 A</div>
  <div v-else-if="type === 'B'">类型 B</div>
  <div v-else>类型 C</div>
  
  <!-- v-show：切换 display 属性 -->
  <div v-show="isVisible">可见内容</div>
  
  <!-- v-if vs v-show -->
  <!-- v-if：真正的条件渲染，会销毁和重建 -->
  <!-- v-show：只是 CSS 切换，适合频繁切换 -->
</template>

<script setup>
import { ref } from 'vue'

const type = ref('A')
const isVisible = ref(true)
</script>
```

### 3.2 列表渲染

```vue
<template>
  <!-- 遍历数组 -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }}: {{ item.name }}
    </li>
  </ul>
  
  <!-- 遍历对象 -->
  <ul>
    <li v-for="(value, key, index) in object" :key="key">
      {{ index }}. {{ key }}: {{ value }}
    </li>
  </ul>
  
  <!-- 使用 template 渲染多个元素 -->
  <template v-for="item in items" :key="item.id">
    <li>{{ item.name }}</li>
    <li class="divider"></li>
  </template>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
])

const object = ref({
  name: 'Vue',
  version: '3.x',
  author: 'Evan You'
})
</script>
```

### 3.3 事件处理

```vue
<template>
  <!-- 内联事件处理器 -->
  <button @click="count++">{{ count }}</button>
  
  <!-- 方法事件处理器 -->
  <button @click="handleClick">点击</button>
  
  <!-- 传递参数 -->
  <button @click="handleClick('hello')">点击</button>
  
  <!-- 访问事件对象 -->
  <button @click="handleClick($event)">点击</button>
  
  <!-- 事件修饰符 -->
  <form @submit.prevent="onSubmit">
    <button type="submit">提交</button>
  </form>
  
  <!-- 常用修饰符 -->
  <div @click.stop="onClick">阻止冒泡</div>
  <input @keyup.enter="onEnter" />
  <button @click.once="onClick">只触发一次</button>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const handleClick = (event) => {
  console.log('点击了', event)
}

const onSubmit = () => {
  console.log('表单提交')
}

const onClick = () => {
  console.log('点击')
}

const onEnter = () => {
  console.log('按下回车')
}
</script>
```

### 3.4 表单绑定

```vue
<template>
  <!-- 文本输入 -->
  <input v-model="text" placeholder="输入文本" />
  <p>{{ text }}</p>
  
  <!-- 多行文本 -->
  <textarea v-model="message"></textarea>
  
  <!-- 复选框 -->
  <input type="checkbox" v-model="checked" />
  <label>{{ checked }}</label>
  
  <!-- 多个复选框 -->
  <input type="checkbox" value="vue" v-model="checkedNames" />
  <input type="checkbox" value="react" v-model="checkedNames" />
  <p>{{ checkedNames }}</p>
  
  <!-- 单选按钮 -->
  <input type="radio" value="one" v-model="picked" />
  <input type="radio" value="two" v-model="picked" />
  <p>{{ picked }}</p>
  
  <!-- 选择框 -->
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
  </select>
  
  <!-- 修饰符 -->
  <input v-model.lazy="text" />  <!-- change 事件后同步 -->
  <input v-model.number="age" /> <!-- 转换为数字 -->
  <input v-model.trim="text" />  <!-- 去除首尾空格 -->
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const message = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const age = ref(0)
</script>
```

## 4. 计算属性

### 4.1 基础用法

```vue
<template>
  <p>原始数据: {{ firstName }} {{ lastName }}</p>
  <p>计算属性: {{ fullName }}</p>
  <p>计算属性: {{ fullNameReversed }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const fullNameReversed = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

### 4.2 计算属性 vs 方法

```vue
<template>
  <!-- 计算属性：有缓存，依赖不变不会重新计算 -->
  <p>{{ computedMessage }}</p>
  <p>{{ computedMessage }}</p>
  
  <!-- 方法：每次调用都会执行 -->
  <p>{{ getMessage() }}</p>
  <p>{{ getMessage() }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const message = ref('Hello')

// 计算属性（有缓存）
const computedMessage = computed(() => {
  console.log('计算属性执行')
  return message.value.toUpperCase()
})

// 方法（无缓存）
const getMessage = () => {
  console.log('方法执行')
  return message.value.toUpperCase()
}
</script>
```

## 5. 侦听器

### 5.1 基础用法

```vue
<template>
  <input v-model="question" />
  <p>{{ answer }}</p>
</template>

<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('')

// 侦听 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    answer.value = '思考中...'
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    answer.value = '这是答案'
  }
})
</script>
```

### 5.2 侦听多个数据源

```vue
<script setup>
import { ref, watch } from 'vue'

const firstName = ref('')
const lastName = ref('')

// 侦听多个源
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`姓名变更: ${newFirst} ${newLast}`)
})
</script>
```

### 5.3 侦听对象属性

```vue
<script setup>
import { ref, watch } from 'vue'

const user = ref({
  name: 'John',
  age: 20,
  address: {
    city: 'Beijing'
  }
})

// 侦听嵌套属性
watch(
  () => user.value.address.city,
  (newCity) => {
    console.log('城市变更:', newCity)
  }
)

// 深度侦听
watch(
  user,
  (newUser) => {
    console.log('用户信息变更:', newUser)
  },
  { deep: true }
)

// 立即执行
watch(
  () => user.value.name,
  (name) => {
    console.log('姓名:', name)
  },
  { immediate: true }
)
</script>
```

### 5.4 watchEffect

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 自动追踪依赖
watchEffect(() => {
  console.log(`count: ${count.value}, name: ${name.value}`)
})

// 停止侦听
const stop = watchEffect(() => {
  console.log(count.value)
})

// 调用 stop() 停止侦听
// stop()
</script>
```

## 6. 生命周期

### 6.1 生命周期钩子

```vue
<template>
  <div ref="el">内容</div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const el = ref(null)

// 组件挂载后
onMounted(() => {
  console.log('组件已挂载')
  console.log('DOM 元素:', el.value)
})

// 组件更新后
onUpdated(() => {
  console.log('组件已更新')
})

// 组件卸载前
onUnmounted(() => {
  console.log('组件即将卸载')
})

// 其他钩子
// onBeforeMount - 挂载之前
// onBeforeUpdate - 更新之前
// onBeforeUnmount - 卸载之前
// onErrorCaptured - 捕获后代组件错误
</script>
```

### 6.2 生命周期图示

```
创建阶段:
setup() → onBeforeMount → onMounted

更新阶段:
数据变更 → onBeforeUpdate → onUpdated

销毁阶段:
卸载 → onBeforeUnmount → onUnmounted
```
