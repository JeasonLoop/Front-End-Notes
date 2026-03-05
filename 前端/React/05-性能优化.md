# React 性能优化

## 1. React.memo

### 1.1 基础用法

```jsx
import { memo } from 'react'

// 使用 memo 包装组件
const SlowComponent = memo(function SlowComponent({ data }) {
  // 复杂计算
  const result = expensiveOperation(data)
  
  return <div>{result}</div>
})

// 自定义比较函数
const UserCard = memo(function UserCard({ user, onClick }) {
  return (
    <div onClick={() => onClick(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}, (prevProps, nextProps) => {
  // 返回 true 表示不需要重新渲染
  return prevProps.user.id === nextProps.user.id &&
         prevProps.user.name === nextProps.user.name
})

// 箭头函数简写
const SimpleComponent = memo(({ name }) => <div>{name}</div>)
```

### 1.2 使用场景

```jsx
// ✅ 适合：props 很少变化的纯组件
const ExpensiveList = memo(({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
})

// ❌ 不适合：props 经常变化
function Counter() {
  const [count, setCount] = useState(0)
  
  // 每次渲染都创建新对象
  const config = { color: 'red' }
  
  // memo 无效，因为 config 每次都是新对象
  return <MemoComponent config={config} count={count} />
}

// ✅ 正确：配合 useMemo 使用
function Counter() {
  const [count, setCount] = useState(0)
  
  const config = useMemo(() => ({ color: 'red' }), [])
  
  return <MemoComponent config={config} count={count} />
}
```

## 2. useMemo

### 2.1 缓存计算结果

```jsx
import { useState, useMemo } from 'react'

function ProductList({ products, filter, sort }) {
  // ✅ 缓存过滤和排序结果
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...')
    
    let result = products.filter(product => 
      product.name.includes(filter)
    )
    
    if (sort === 'price') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return result
  }, [products, filter, sort])
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}

// ❌ 不使用 useMemo，每次渲染都会重新计算
function BadExample({ products, filter }) {
  const filtered = products.filter(p => p.name.includes(filter))
  // ...
}
```

### 2.2 缓存对象引用

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0)
  
  // ✅ 缓存对象，避免子组件不必要的渲染
  const config = useMemo(() => ({
    color: 'blue',
    size: 'large',
    theme: 'dark'
  }), [])
  
  // ✅ 缓存函数结果
  const items = useMemo(() => generateItems(1000), [])
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ChildComponent config={config} items={items} />
    </div>
  )
}

const ChildComponent = memo(({ config, items }) => {
  console.log('Child rendered')
  return <div>{items.length} items</div>
})
```

### 2.3 依赖项管理

```jsx
function SearchResults({ query, page }) {
  // ✅ 正确的依赖项
  const results = useMemo(() => {
    return fetchResults(query, page)
  }, [query, page])
  
  // ❌ 遗漏依赖项
  const badResults = useMemo(() => {
    return fetchResults(query, page)
  }, [query]) // 缺少 page
  
  // ✅ 使用函数式更新避免依赖
  const [data, setData] = useState([])
  
  const addItem = useMemo(() => {
    return (item) => {
      setData(prev => [...prev, item])
    }
  }, []) // 不需要依赖 setData
}
```

## 3. useCallback

### 3.1 缓存回调函数

```jsx
import { useState, useCallback, memo } from 'react'

function ParentComponent() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([])
  
  // ✅ 缓存回调函数
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])
  
  // ✅ 带依赖项
  const handleAddItem = useCallback((item) => {
    setItems(prev => [...prev, item])
  }, [])
  
  // ✅ 事件处理
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ItemList 
        items={items} 
        onAdd={handleAddItem}
        onDelete={handleDelete}
      />
    </div>
  )
}

const ItemList = memo(({ items, onAdd, onDelete }) => {
  console.log('ItemList rendered')
  
  return (
    <div>
      <button onClick={() => onAdd({ id: Date.now() })}>Add</button>
      {items.map(item => (
        <div key={item.id}>
          {item.id}
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
})
```

### 3.2 使用场景

```jsx
// ✅ 场景1：作为 props 传递给 memo 组件
const ChildComponent = memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>
})

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])
  
  return <ChildComponent onClick={handleClick} />
}

// ✅ 场景2：作为 useEffect 依赖
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('')
  
  const handleSearch = useCallback(() => {
    onSearch(query)
  }, [query, onSearch])
  
  useEffect(() => {
    const timer = setTimeout(handleSearch, 500)
    return () => clearTimeout(timer)
  }, [handleSearch])
  
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}

// ❌ 不需要 useCallback 的场景
function SimpleComponent() {
  // 组件不会被 memo，无需缓存函数
  const handleClick = () => {
    console.log('Clicked')
  }
  
  return <button onClick={handleClick}>Click</button>
}
```

## 4. 代码分割

### 4.1 React.lazy

```jsx
import { Suspense, lazy } from 'react'

// 懒加载组件
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Admin = lazy(() => import('./pages/Admin'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}

// Loading 组件
function Loading() {
  return (
    <div className="loading">
      <Spinner />
      <p>Loading...</p>
    </div>
  )
}
```

### 4.2 按路由分割

```jsx
import { lazy, Suspense } from 'react'

// 路由级代码分割
const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        {lazy(() => import('./pages/Home'))}
      </Suspense>
    )
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<Loading />}>
        {lazy(() => import('./pages/About'))}
      </Suspense>
    )
  }
]
```

### 4.3 条件加载

```jsx
function App() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [AdminComponent, setAdminComponent] = useState(null)
  
  const loadAdmin = async () => {
    const module = await import('./pages/Admin')
    setAdminComponent(() => module.default)
    setShowAdmin(true)
  }
  
  return (
    <div>
      <button onClick={loadAdmin}>Load Admin</button>
      {showAdmin && AdminComponent && <AdminComponent />}
    </div>
  )
}
```

### 4.4 named exports

```jsx
// ManyComponents.js
export const ComponentA = () => <div>A</div>
export const ComponentB = () => <div>B</div>
export const ComponentC = () => <div>C</div>

// App.js
const ComponentA = lazy(() => 
  import('./ManyComponents').then(module => ({ 
    default: module.ComponentA 
  }))
)

const ComponentB = lazy(() => 
  import('./ManyComponents').then(module => ({ 
    default: module.ComponentB 
  }))
)
```

## 5. 列表优化

### 5.1 虚拟列表

```jsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  })
  
  return (
    <div 
      ref={parentRef} 
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 5.2 列表项优化

```jsx
// ✅ 使用 key 正确
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// ❌ 使用索引作为 key
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  )
}

// ✅ memo 列表项
const UserItem = memo(({ user }) => {
  return <li>{user.name}</li>
})

function OptimizedUserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}
```

## 6. 避免不必要的渲染

### 6.1 状态下沉

```jsx
// ❌ 不好：父组件状态导致所有子组件重新渲染
function Parent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ExpensiveChild />
      <ExpensiveChild2 />
    </div>
  )
}

// ✅ 好：状态下移到需要它的组件
function Parent() {
  return (
    <div>
      <Counter />
      <ExpensiveChild />
      <ExpensiveChild2 />
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 6.2 组件拆分

```jsx
// ❌ 不好：一个组件处理多个职责
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [todos, setTodos] = useState([])
  
  // 复杂逻辑...
  
  return (
    <div>
      <UserInfo user={user} />
      <UserPosts posts={posts} />
      <UserTodos todos={todos} />
    </div>
  )
}

// ✅ 好：拆分为独立组件
function UserDashboard({ userId }) {
  return (
    <div>
      <UserInfoSection userId={userId} />
      <UserPostsSection userId={userId} />
      <UserTodosSection userId={userId} />
    </div>
  )
}

function UserInfoSection({ userId }) {
  const user = useFetch(`/api/users/${userId}`)
  return <UserInfo user={user} />
}
```

### 6.3 条件渲染优化

```jsx
// ❌ 不好：条件渲染的组件每次都会重新创建
function Component({ showExpensive }) {
  return (
    <div>
      {showExpensive && <ExpensiveComponent />}
    </div>
  )
}

// ✅ 好：使用 CSS 控制显示（如果组件已创建）
function Component({ showExpensive }) {
  return (
    <div>
      <div style={{ display: showExpensive ? 'block' : 'none' }}>
        <ExpensiveComponent />
      </div>
    </div>
  )
}

// ✅ 更好：结合懒加载
const ExpensiveComponent = lazy(() => import('./ExpensiveComponent'))

function Component({ showExpensive }) {
  return (
    <div>
      {showExpensive && (
        <Suspense fallback={<Loading />}>
          <ExpensiveComponent />
        </Suspense>
      )}
    </div>
  )
}
```

## 7. 表单优化

### 7.1 防抖输入

```jsx
import { useState, useEffect, useRef } from 'react'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery)
    }
  }, [debouncedQuery])
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

### 7.2 非受控组件

```jsx
import { useRef } from 'react'

// ✅ 使用非受控组件减少渲染
function Form() {
  const inputRef = useRef(null)
  const textareaRef = useRef(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      input: inputRef.current.value,
      textarea: textareaRef.current.value
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="default" />
      <textarea ref={textareaRef} defaultValue="default text" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 8. Context 优化

### 8.1 拆分 Context

```jsx
// ❌ 不好：单个大 Context
const AppContext = createContext()

function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

// ✅ 好：拆分 Context
const UserContext = createContext()
const ThemeContext = createContext()
const LanguageContext = createContext()

function AppProvider({ children }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </UserProvider>
  )
}
```

### 8.2 选择性订阅

```jsx
// ✅ 只订阅需要的状态
function UserName() {
  const user = useContext(UserContext)
  return <span>{user.name}</span>
}

// ✅ 使用选择器
function useUserSelector(selector) {
  const user = useContext(UserContext)
  return useMemo(() => selector(user), [user, selector])
}

function UserName() {
  const name = useUserSelector(user => user.name)
  return <span>{name}</span>
}
```

## 9. 性能监控

### 9.1 React DevTools Profiler

```jsx
import { Profiler } from 'react'

function onRenderCallback(
  id,           // Profiler 的 id
  phase,        // "mount" 或 "update"
  actualDuration,  // 本次渲染花费的时间
  baseDuration,    // 不使用 memo 时预计花费的时间
  startTime,       // 开始渲染的时间戳
  commitTime       // 提交的时间戳
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`)
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Main />
    </Profiler>
  )
}
```

### 9.2 使用 React.memo 进行性能分析

```jsx
// 检查组件是否不必要地重新渲染
const MemoComponent = memo(function Component(props) {
  console.log('Component rendered')
  return <div>{props.value}</div>
}, (prevProps, nextProps) => {
  const shouldSkip = prevProps.value === nextProps.value
  if (!shouldSkip) {
    console.log('Re-rendering because value changed')
  }
  return shouldSkip
})
```

## 10. 最佳实践总结

### 10.1 优化清单

```
✅ 性能优化检查清单
├─ 组件优化
│  ├─ 使用 React.memo 包装纯组件
│  ├─ 拆分大型组件
│  └─ 避免不必要的重新渲染
├─ 状态管理
│  ├─ 状态下沉到需要的组件
│  ├─ 使用 useMemo 缓存计算结果
│  └─ 使用 useCallback 缓存回调函数
├─ 列表优化
│  ├─ 使用正确的 key
│  ├─ 使用虚拟列表处理大数据
│  └─ memo 列表项
├─ 代码分割
│  ├─ 使用 React.lazy 懒加载
│  ├─ 按路由分割代码
│  └─ 条件加载重型组件
├─ Context 优化
│  ├─ 拆分大 Context
│  ├─ 选择性订阅
│  └─ useMemo 包装 value
└─ 监控
   ├─ 使用 React DevTools Profiler
   └─ 监控渲染性能
```

### 10.2 性能测量

```jsx
// 使用 Performance API 测量
function measurePerformance(name, fn) {
  performance.mark(`${name}-start`)
  fn()
  performance.mark(`${name}-end`)
  performance.measure(name, `${name}-start`, `${name}-end`)
  
  const measure = performance.getEntriesByName(name)[0]
  console.log(`${name} took ${measure.duration}ms`)
  
  performance.clearMarks()
  performance.clearMeasures()
}

// 使用 console.time
function Component() {
  useEffect(() => {
    console.time('expensive-operation')
    expensiveOperation()
    console.timeEnd('expensive-operation')
  }, [])
}
```
