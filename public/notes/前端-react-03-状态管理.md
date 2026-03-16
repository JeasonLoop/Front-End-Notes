---
title: React 状态管理
category: 前端
---
# React 状态管理

## 1. Context API

### 1.1 基础用法

```jsx
import { createContext, useContext, useState } from 'react'

// 创建 Context
const UserContext = createContext(null)

// Provider 组件
function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  
  const login = async (credentials) => {
    const response = await api.login(credentials)
    setUser(response.data)
  }
  
  const logout = () => {
    setUser(null)
  }
  
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// 自定义 Hook
function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

// 使用
function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  )
}

function Dashboard() {
  const { user, logout } = useUser()
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 1.2 多个 Context

```jsx
const ThemeContext = createContext('light')
const UserContext = createContext(null)
const LanguageContext = createContext('en')

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

// 或合并 Context
function AppProviders({ children }) {
  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={userValue}>
        <LanguageContext.Provider value={langValue}>
          {children}
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

// 使用
function Component() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const language = useContext(LanguageContext)
  
  return <div>{/* 使用 */}</div>
}
```

### 1.3 Context 性能优化

```jsx
// ❌ 整个 context 变化会导致所有消费者重新渲染
function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  
  return (
    <UserContext.Provider value={{ user, theme, setUser, setTheme }}>
      {children}
    </UserContext.Provider>
  )
}

// ✅ 拆分 Context
const UserContext = createContext()
const ThemeContext = createContext()

function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ✅ 使用 useMemo 优化
function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  
  const value = useMemo(() => ({
    user,
    setUser
  }), [user])
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
```

## 2. Redux

### 2.1 安装和设置

```bash
npm install @reduxjs/toolkit react-redux
```

### 2.2 使用 Redux Toolkit

```javascript
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 异步 action
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, thunkAPI) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      return await response.json()
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
```

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer
  }
})
```

```jsx
// main.jsx
import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### 2.3 使用 Redux

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser, fetchUser } from './store/userSlice'

function UserProfile() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(state => state.user)
  
  useEffect(() => {
    dispatch(fetchUser(1))
  }, [dispatch])
  
  const handleLogout = () => {
    dispatch(clearUser())
  }
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### 2.4 TypeScript 支持

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 使用
function Component() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  
  return <div>{user.name}</div>
}
```

## 3. Zustand

### 3.1 安装和基础用法

```bash
npm install zustand
```

```javascript
// stores/userStore.js
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        loading: false,
        error: null,
        
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        
        login: async (credentials) => {
          set({ loading: true, error: null })
          try {
            const response = await api.login(credentials)
            set({ user: response.data, loading: false })
          } catch (error) {
            set({ error: error.message, loading: false })
          }
        },
        
        logout: () => {
          set({ user: null, error: null })
        }
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ user: state.user })
      }
    )
  )
)
```

### 3.2 使用 Zustand

```jsx
function UserProfile() {
  const user = useUserStore(state => state.user)
  const login = useUserStore(state => state.login)
  const logout = useUserStore(state => state.logout)
  
  const handleLogin = () => {
    login({ email: 'user@example.com', password: '123456' })
  }
  
  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}

// 选择器优化
function UserName() {
  // ✅ 只订阅 name 变化
  const name = useUserStore(state => state.user?.name)
  return <h1>{name}</h1>
}

// 多个值
function UserInfo() {
  const { user, loading, error } = useUserStore(state => ({
    user: state.user,
    loading: state.loading,
    error: state.error
  }))
  
  // 或使用 shallow 比较
  import { shallow } from 'zustand/shallow'
  
  const { user, loading, error } = useUserStore(
    state => ({ user: state.user, loading: state.loading, error: state.error }),
    shallow
  )
}
```

### 3.3 TypeScript 支持

```typescript
import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}))
```

## 4. Jotai

### 4.1 安装和基础用法

```bash
npm install jotai
```

```javascript
// atoms/userAtom.js
import { atom, useAtom } from 'jotai'

// 基础 atom
export const userAtom = atom(null)
export const countAtom = atom(0)

// 只读 atom
export const doubleCountAtom = atom((get) => get(countAtom) * 2)

// 可写 atom
export const incrementAtom = atom(
  null,
  (get, set) => set(countAtom, get(countAtom) + 1)
)

// 异步 atom
export const userAtom = atom(async (get) => {
  const response = await fetch('/api/user')
  return response.json()
})

// 派生 atom
export const userNameAtom = atom((get) => get(userAtom)?.name)
```

### 4.2 使用 Jotai

```jsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { userAtom, countAtom, incrementAtom } from './atoms'

function UserProfile() {
  const [user, setUser] = useAtom(userAtom)
  const count = useAtomValue(countAtom)
  const increment = useSetAtom(incrementAtom)
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

// 只读
function UserName() {
  const name = useAtomValue(userNameAtom)
  return <span>{name}</span>
}

// 只写
function LogoutButton() {
  const setUser = useSetAtom(userAtom)
  
  const handleLogout = () => {
    setUser(null)
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

### 4.3 Atom with Storage

```javascript
import { atomWithStorage } from 'jotai/utils'

// 自动持久化到 localStorage
export const themeAtom = atomWithStorage('theme', 'light')

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  )
}
```

## 5. 状态管理对比

### 5.1 选择建议

```
┌─────────────────────────────────────────────────────────┐
│                    状态管理选择指南                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  简单应用（< 5 个共享状态）                                │
│  └─ Context API + useState/useReducer                  │
│                                                         │
│  中等应用（需要 DevTools、中间件）                         │
│  └─ Zustand                                            │
│                                                         │
│  大型应用（团队协作、复杂状态逻辑）                         │
│  └─ Redux Toolkit                                      │
│                                                         │
│  细粒度状态更新、原子化                                    │
│  └─ Jotai / Recoil                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 性能对比

```jsx
// Context API - 整个 context 变化会触发所有消费者重渲染
<UserContext.Provider value={{ user, setUser }}>
  <ComponentA /> {/* 订阅 user */}
  <ComponentB /> {/* 订阅 setUser */}
  <ComponentC /> {/* 不订阅 */}
</UserContext.Provider>

// Zustand - 精确订阅
function ComponentA() {
  const user = useUserStore(state => state.user) // 只订阅 user
}

function ComponentB() {
  const setUser = useUserStore(state => state.setUser) // 只订阅 setUser
}

// Jotai - 原子化
function ComponentA() {
  const user = useAtomValue(userAtom) // 只订阅 userAtom
}

function ComponentB() {
  const userName = useAtomValue(userNameAtom) // 只订阅 userNameAtom
}
```

## 6. 最佳实践

### 6.1 状态分类

```jsx
// 组件本地状态
function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
}

// 组件间共享状态（父子/兄弟）
function Parent() {
  const [user, setUser] = useState(null)
  
  return (
    <div>
      <ChildA user={user} />
      <ChildB setUser={setUser} />
    </div>
  )
}

// 全局状态
// - 用户认证信息
// - 全局主题
// - 购物车
// - 应用配置

// 服务器状态（推荐使用 React Query / SWR）
// - API 数据缓存
// - 自动重新获取
// - 后台更新
```

### 6.2 状态提升

```jsx
// ❌ 状态分散
function Parent() {
  return (
    <div>
      <ChildA />
      <ChildB />
    </div>
  )
}

function ChildA() {
  const [selected, setSelected] = useState(null)
}

function ChildB() {
  // 需要访问 ChildA 的 selected，但无法获取
}

// ✅ 状态提升
function Parent() {
  const [selected, setSelected] = useState(null)
  
  return (
    <div>
      <ChildA selected={selected} onSelect={setSelected} />
      <ChildB selected={selected} />
    </div>
  )
}
```

### 6.3 避免过度使用全局状态

```jsx
// ❌ 不好：所有状态都放全局
const useGlobalStore = create((set) => ({
  modalVisible: false,
  inputValue: '',
  hoverState: false,
  // ...
}))

// ✅ 好：只有真正需要共享的状态才放全局
const useUserStore = create((set) => ({
  user: null,
  login: async (credentials) => { /* ... */ },
  logout: () => set({ user: null })
}))

// 组件本地状态保持本地
function Component() {
  const [modalVisible, setModalVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
}
```

### 6.4 状态持久化

```javascript
// Zustand
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }) // 只持久化部分
    }
  )
)

// Redux
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // 只持久化 user
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer
})

export const persistor = persistStore(store)
```
