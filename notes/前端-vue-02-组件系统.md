# Vue 组件系统

## 1. 组件定义

### 1.1 单文件组件 (SFC)

```vue
<!-- MyComponent.vue -->
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('标题')
const content = ref('内容')
</script>

<style scoped>
.my-component {
  padding: 20px;
  border: 1px solid #ddd;
}
</style>
```

### 1.2 组件注册

```vue
<!-- 全局注册 -->
<script>
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './components/MyComponent.vue'

const app = createApp(App)
app.component('MyComponent', MyComponent)
app.mount('#app')
</script>

<!-- 局部注册 -->
<script setup>
import MyComponent from './components/MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

## 2. Props

### 2.1 基础用法

```vue
<!-- 子组件 Child.vue -->
<script setup>
// 定义 props
const props = defineProps({
  // 基础类型检查
  title: String,
  // 多个可能的类型
  id: [String, Number],
  // 必填字段
  requiredProp: {
    type: String,
    required: true
  },
  // 带默认值
  optionalProp: {
    type: String,
    default: '默认值'
  },
  // 对象/数组默认值
  items: {
    type: Array,
    default: () => []
  },
  // 自定义验证
  age: {
    type: Number,
    validator: (value) => value >= 0
  }
})

// 使用 props
console.log(props.title)
</script>

<template>
  <h2>{{ title }}</h2>
</template>
```

```vue
<!-- 父组件 Parent.vue -->
<script setup>
import Child from './Child.vue'
</script>

<template>
  <!-- 静态传递 -->
  <Child title="标题" />
  
  <!-- 动态传递 -->
  <Child :title="dynamicTitle" />
  
  <!-- 传递对象 -->
  <Child v-bind="userObject" />
</template>
```

### 2.2 TypeScript 类型声明

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
})
</script>
```

## 3. 事件

### 3.1 定义和触发事件

```vue
<!-- 子组件 Child.vue -->
<script setup>
// 定义事件
const emit = defineEmits(['update', 'delete', 'change'])

// 触发事件
const handleClick = () => {
  emit('update', { id: 1, name: 'updated' })
}

// 带验证的事件
const emitWithValidation = defineEmits({
  submit: (payload) => {
    if (payload.email) {
      return true
    }
    console.warn('无效的提交数据')
    return false
  }
})
</script>

<template>
  <button @click="handleClick">更新</button>
</template>
```

```vue
<!-- 父组件 Parent.vue -->
<script setup>
import Child from './Child.vue'

const handleUpdate = (data) => {
  console.log('收到更新:', data)
}
</script>

<template>
  <Child @update="handleUpdate" />
</template>
```

### 3.2 v-model

```vue
<!-- 子组件 CustomInput.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateValue = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
  />
</template>
```

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const text = ref('')
</script>

<template>
  <CustomInput v-model="text" />
  <p>{{ text }}</p>
</template>
```

### 3.3 多个 v-model

```vue
<!-- 子组件 UserForm.vue -->
<script setup>
const props = defineProps(['firstName', 'lastName'])
const emit = defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

```vue
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import UserForm from './UserForm.vue'

const firstName = ref('')
const lastName = ref('')
</script>

<template>
  <UserForm
    v-model:first-name="firstName"
    v-model:last-name="lastName"
  />
</template>
```

## 4. Slots

### 4.1 默认插槽

```vue
<!-- 子组件 Card.vue -->
<template>
  <div class="card">
    <slot>默认内容</slot>
  </div>
</template>

<!-- 父组件 -->
<Card>
  <p>自定义内容</p>
</Card>
```

### 4.2 具名插槽

```vue
<!-- 子组件 Layout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件 -->
<Layout>
  <template #header>
    <h1>标题</h1>
  </template>
  
  <p>主要内容</p>
  
  <template #footer>
    <p>页脚</p>
  </template>
</Layout>
```

### 4.3 作用域插槽

```vue
<!-- 子组件 List.vue -->
<script setup>
const items = [
  { id: 1, name: 'Vue', stars: 20000 },
  { id: 2, name: 'React', stars: 18000 },
  { id: 3, name: 'Angular', stars: 15000 }
]
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="item.id">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件 -->
<List>
  <template #default="{ item, index }">
    <strong>{{ index }}. {{ item.name }}</strong>
    <span>⭐ {{ item.stars }}</span>
  </template>
</List>
```

### 4.4 动态插槽名

```vue
<template>
  <Component>
    <template #[dynamicSlotName]>
      动态插槽内容
    </template>
  </Component>
</template>

<script setup>
import { ref } from 'vue'
const dynamicSlotName = ref('header')
</script>
```

## 5. 组件通信

### 5.1 父子组件通信

```vue
<!-- 父传子: Props -->
<Child :data="parentData" />

<!-- 子传父: Emits -->
<Child @change="handleChange" />

<!-- 父访问子: ref -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const childRef = ref(null)

const getChildData = () => {
  // 访问子组件方法
  childRef.value.someMethod()
}
</script>

<template>
  <Child ref="childRef" />
  <button @click="getChildData">获取子组件数据</button>
</template>
```

### 5.2 跨组件通信

```javascript
// mitt.js - 事件总线
import mitt from 'mitt'
export const emitter = mitt()

// 组件 A - 发送事件
import { emitter } from './mitt'
emitter.emit('custom-event', { data: 'value' })

// 组件 B - 接收事件
import { emitter } from './mitt'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  emitter.on('custom-event', (data) => {
    console.log('收到事件:', data)
  })
})

onUnmounted(() => {
  emitter.off('custom-event')
})
```

### 5.3 依赖注入

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
const updateTheme = (newTheme) => {
  theme.value = newTheme
}

// 提供数据
provide('theme', theme)
provide('updateTheme', updateTheme)
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

// 注入数据
const theme = inject('theme', 'light') // 默认值 'light'
const updateTheme = inject('updateTheme')
</script>

<template>
  <p>当前主题: {{ theme }}</p>
  <button @click="updateTheme('light')">切换主题</button>
</template>
```

## 6. 动态组件

### 6.1 基础用法

```vue
<script setup>
import { ref } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref('ComponentA')
</script>

<template>
  <button @click="currentComponent = 'ComponentA'">A</button>
  <button @click="currentComponent = 'ComponentB'">B</button>
  
  <component :is="currentComponent" />
</template>
```

### 6.2 keep-alive

```vue
<template>
  <!-- 缓存组件状态 -->
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
  
  <!-- 条件缓存 -->
  <keep-alive :include="['ComponentA']" :exclude="['ComponentB']">
    <component :is="currentComponent" />
  </keep-alive>
  
  <!-- 最大缓存数 -->
  <keep-alive :max="10">
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

## 7. 异步组件

### 7.1 基础用法

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// 异步加载组件
const AsyncComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// 带配置的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
</script>

<template>
  <AsyncComponent />
  <AsyncComponentWithOptions />
</template>
```

## 8. 模板引用

### 8.1 DOM 引用

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  // 访问 DOM 元素
  inputRef.value.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 8.2 组件引用

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
  console.log('子组件方法被调用')
}

// 暴露给父组件
defineExpose({
  someMethod
})
</script>
```
