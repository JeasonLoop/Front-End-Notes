---
title: React Hooks
category: 前端
---
# React Hooks

## 1. useState

### 1.1 基础用法

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```


### 1.2 函数式更新

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  
  // ✅ 基于前一个状态更新
  const increment = () => {
    setCount(prevCount => prevCount + 1)
  }
  
  // 批量更新
  const incrementMultiple = () => {
    setCount(prevCount => prevCount + 1)
    setCount(prevCount => prevCount + 1)
    setCount(prevCount => prevCount + 1) // 最终 +3
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={incrementMultiple}>Increment 3x</button>
    </div>
  )
}
```



### 1.3 对象和数组状态

```jsx
function Form() {
  // 对象状态
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  
  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 数组状态
  const [items, setItems] = useState([])
  
  const addItem = (item) => {
    setItems(prev => [...prev, item])
  }
  
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }
  
  const updateItem = (id, newItem) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...newItem } : item
    ))
  }
  
  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
      />
      <input
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
      />
    </form>
  )
}
```

### 1.4 惰性初始化

```jsx
function ExpensiveComponent() {
  // ✅ 只在首次渲染时执行
  const [state, setState] = useState(() => {
    const initialState = expensiveComputation()
    return initialState
  })
  
  // ❌ 每次渲染都会执行
  const [state2, setState2] = useState(expensiveComputation())
  
  return <div>{state}</div>
}

function LocalStorageCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count')
    return saved ? parseInt(saved, 10) : 0
  })
  
  const increment = () => {
    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem('count', newCount.toString())
  }
  
  return (
    <button onClick={increment}>{count}</button>
  )
}
```

## 2. useEffect

### 2.1 基础用法

```jsx
import { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)
  
  // 每次渲染后执行
  useEffect(() => {
    document.title = `You clicked ${count} times`
  })
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}
```

### 2.2 依赖数组

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  
  // 仅在 userId 变化时执行
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data))
  }, [userId])
  
  // 仅在挂载时执行一次
  useEffect(() => {
    console.log('Component mounted')
  }, [])
  
  // 每次渲染都执行
  useEffect(() => {
    console.log('Component rendered')
  })
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>
}
```

### 2.3 清理副作用

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    
    // 清理函数：组件卸载时执行
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  return <div>Seconds: {seconds}</div>
}

function WindowResize() {
  const [width, setWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    
    // 清理：移除事件监听
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <div>Window width: {width}px</div>
}
```

### 2.4 数据获取

```jsx
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    let isMounted = true // 处理竞态条件
    
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        
        if (isMounted) {
          setUsers(data)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchUsers()
    
    return () => {
      isMounted = false
    }
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### 2.5 useEffect 注意事项

```jsx
function Example({ userId }) {
  const [data, setData] = useState(null)
  
  // ❌ 错误：遗漏依赖
  useEffect(() => {
    fetchData(userId).then(setData)
  }, []) // 缺少 userId
  
  // ✅ 正确：包含所有依赖
  useEffect(() => {
    fetchData(userId).then(setData)
  }, [userId])
  
  // ❌ 错误：在 useEffect 中直接使用 async
  useEffect(async () => {
    const data = await fetchData(userId)
    setData(data)
  }, [userId])
  
  // ✅ 正确：在 useEffect 内部定义 async 函数
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData(userId)
      setData(data)
    }
    loadData()
  }, [userId])
}
```

## 3. useContext

### 3.1 创建和使用 Context

```jsx
import { createContext, useContext, useState } from 'react'

// 创建 Context
const ThemeContext = createContext('light')
const UserContext = createContext(null)

function App() {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState({ name: 'John', role: 'admin' })
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Dashboard />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

function Dashboard() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  )
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext)
  const { user } = useContext(UserContext)
  
  return (
    <header className={`header ${theme}`}>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  )
}
```

### 3.2 自定义 Context Hook

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const value = {
    theme,
    setTheme,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 使用
function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}

function Component() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

## 4. useReducer

### 4.1 基础用法

```jsx
import { useReducer } from 'react'

// Reducer 函数
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: action.payload }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset', payload: 0 })}>Reset</button>
    </div>
  )
}
```

### 4.2 复杂状态管理

```jsx
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      }
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    case 'setFilter':
      return {
        ...state,
        filter: action.payload
      }
    default:
      return state
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  })
  
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'completed') return todo.completed
    if (state.filter === 'active') return !todo.completed
    return true
  })
  
  return (
    <div>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            dispatch({ type: 'add', payload: e.target.value })
            e.target.value = ''
          }
        }}
        placeholder="Add todo"
      />
      
      <select
        value={state.filter}
        onChange={(e) => dispatch({ type: 'setFilter', payload: e.target.value })}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'toggle', payload: todo.id })}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'delete', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### 4.3 惰性初始化

```jsx
function init(initialCount) {
  return { count: initialCount }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init)
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'reset', payload: initialCount })}>
        Reset
      </button>
    </div>
  )
}
```

## 5. useRef

### 5.1 访问 DOM 元素

```jsx
import { useRef, useEffect } from 'react'

function TextInput() {
  const inputRef = useRef(null)
  
  useEffect(() => {
    // 自动聚焦
    inputRef.current.focus()
  }, [])
  
  return <input ref={inputRef} type="text" />
}

function VideoPlayer() {
  const videoRef = useRef(null)
  
  const play = () => {
    videoRef.current.play()
  }
  
  const pause = () => {
    videoRef.current.pause()
  }
  
  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  )
}
```

### 5.2 存储可变值

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)
  
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }
  
  const stopTimer = () => {
    clearInterval(intervalRef.current)
  }
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef()
  
  useEffect(() => {
    prevCountRef.current = count
  })
  
  const prevCount = prevCountRef.current
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

## 6. useMemo

### 6.1 性能优化

```jsx
import { useState, useMemo } from 'react'

function ExpensiveComponent({ list, filter }) {
  // ✅ 缓存计算结果
  const filteredList = useMemo(() => {
    console.log('Filtering list...')
    return list.filter(item => item.value > filter)
  }, [list, filter])
  
  // ✅ 缓存排序结果
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => a.value - b.value)
  }, [filteredList])
  
  return (
    <ul>
      {sortedList.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### 6.2 引用相等性

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([])
  
  // ✅ 避免不必要的重新渲染
  const config = useMemo(() => ({
    color: 'blue',
    size: 'large'
  }), [])
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <ChildComponent items={items} config={config} />
    </div>
  )
}

const ChildComponent = React.memo(({ items, config }) => {
  console.log('Child rendered')
  return <div>Child</div>
})
```

## 7. useCallback

### 7.1 缓存函数

```jsx
import { useState, useCallback, memo } from 'react'

function ParentComponent() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([])
  
  // ✅ 缓存回调函数
  const handleClick = useCallback(() => {
    console.log('Button clicked')
  }, [])
  
  const handleAddItem = useCallback((item) => {
    setItems(prev => [...prev, item])
  }, [])
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ChildComponent onClick={handleClick} onAdd={handleAddItem} />
    </div>
  )
}

const ChildComponent = memo(({ onClick, onAdd }) => {
  console.log('Child rendered')
  return (
    <div>
      <button onClick={onClick}>Click</button>
      <button onClick={() => onAdd({ id: Date.now() })}>Add</button>
    </div>
  )
})
```

### 7.2 依赖项

```jsx
function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('')
  
  // ✅ 依赖项变化时重新创建函数
  const handleSearch = useCallback(() => {
    onSearch(query)
  }, [query, onSearch])
  
  // ✅ 使用函数式更新避免依赖项
  const handleClear = useCallback(() => {
    setQuery('') // 不需要依赖 setQuery
  }, [])
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

## 8. 自定义 Hooks

### 8.1 创建自定义 Hook

```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue]
}

// 使用
function App() {
  const [name, setName] = useLocalStorage('name', '')
  
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter your name"
    />
  )
}
```

### 8.2 常用自定义 Hooks

```jsx
// hooks/useFetch.js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) throw new Error('Network response was not ok')
        const json = await response.json()
        if (isMounted) {
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isMounted = false
    }
  }, [url])
  
  return { data, loading, error }
}

// hooks/useToggle.js
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])
  
  return [value, toggle]
}

// hooks/useDebounce.js
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// hooks/useWindowSize.js
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return windowSize
}

// hooks/useMousePosition.js
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return position
}

// 使用示例
function App() {
  const [isOn, toggleIsOn] = useToggle(false)
  const { data, loading, error } = useFetch('/api/users')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const { width, height } = useWindowSize()
  const { x, y } = useMousePosition()
  
  return (
    <div>
      <button onClick={toggleIsOn}>{isOn ? 'ON' : 'OFF'}</button>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Window: {width} x {height}</p>
      <p>Mouse: {x}, {y}</p>
    </div>
  )
}
```

## 9. useLayoutEffect

```jsx
import { useState, useLayoutEffect, useRef } from 'react'

function Tooltip({ children }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  
  useLayoutEffect(() => {
    // 在 DOM 更新后、浏览器绘制前同步执行
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 10,
      left: rect.left
    })
  }, [children])
  
  return (
    <div ref={ref}>
      {children}
      <div style={{ position: 'absolute', ...position }}>
        Tooltip content
      </div>
    </div>
  )
}

// useLayoutEffect vs useEffect
// useEffect: 浏览器绘制后异步执行
// useLayoutEffect: 浏览器绘制前同步执行
// 大多数情况下使用 useEffect
// 需要在绘制前读取 DOM 布局时使用 useLayoutEffect
```

## 10. useImperativeHandle

```jsx
import { useRef, useImperativeHandle, forwardRef } from 'react'

// 自定义暴露给父组件的方法
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef()
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    },
    clear: () => {
      inputRef.current.value = ''
    },
    getValue: () => {
      return inputRef.current.value
    }
  }))
  
  return <input ref={inputRef} {...props} />
})

// 使用
function App() {
  const inputRef = useRef()
  
  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </div>
  )
}
```
