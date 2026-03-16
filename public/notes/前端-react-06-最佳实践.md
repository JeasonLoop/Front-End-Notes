---
title: React 最佳实践
category: 前端
---
# React 最佳实践

## 1. 项目结构

### 1.1 推荐目录结构

```
src/
├── components/          # 可复用组件
│   ├── common/          # 基础组件
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── Input/
│   │   └── Modal/
│   └── layout/          # 布局组件
│       ├── Header/
│       ├── Footer/
│       └── Sidebar/
├── features/            # 功能模块
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.js
│   ├── user/
│   └── product/
├── hooks/               # 自定义 Hooks
│   ├── useAuth.js
│   ├── useFetch.js
│   └── index.js
├── contexts/            # Context
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/            # API 服务
│   ├── api.js
│   ├── authService.js
│   └── userService.js
├── utils/               # 工具函数
│   ├── format.js
│   ├── validate.js
│   └── constants.js
├── pages/               # 页面组件
│   ├── Home/
│   ├── About/
│   └── NotFound/
├── routes/              # 路由配置
│   ├── index.jsx
│   └── ProtectedRoute.jsx
├── styles/              # 全局样式
│   ├── reset.css
│   ├── variables.css
│   └── global.css
├── App.jsx
└── main.jsx
```

### 1.2 组件命名规范

```jsx
// ✅ 组件名：PascalCase
function UserProfile() {}
const UserCard = () => {}

// ✅ 文件名：PascalCase 或 kebab-case
// UserProfile.jsx 或 user-profile.jsx

// ✅ 组件文件夹
Button/
  ├── Button.jsx        // 组件实现
  ├── Button.test.jsx   // 测试文件
  ├── Button.module.css // 样式文件
  └── index.js          // 导出

// index.js
export { default } from './Button'
export * from './Button'
```

## 2. 组件设计

### 2.1 单一职责原则

```jsx
// ❌ 不好：一个组件做太多事
function UserDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [todos, setTodos] = useState([])
  
  // 大量逻辑...
  
  return (
    <div>
      <UserStats />
      <UserList users={users} />
      <PostList posts={posts} />
      <TodoList todos={todos} />
    </div>
  )
}

// ✅ 好：职责分离
function UserDashboard() {
  return (
    <div>
      <UserStatsSection />
      <UserListSection />
      <PostListSection />
      <TodoListSection />
    </div>
  )
}

function UserStatsSection() {
  const stats = useUserStats()
  return <UserStats stats={stats} />
}
```

### 2.2 组件组合

```jsx
// ✅ 使用组合而非继承
function Card({ children, header, footer }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

// 使用
<Card
  header={<h2>Title</h2>}
  footer={<button>Submit</button>}
>
  <p>Content</p>
</Card>

// ✅ 复合组件模式
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>
}

Tabs.Tab = function Tab({ children, value }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  
  return (
    <button
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabPanel({ children, value }) {
  const { activeTab } = useContext(TabsContext)
  
  if (activeTab !== value) return null
  return <div className="tab-panel">{children}</div>
}

// 使用
<Tabs defaultTab="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs>
```

### 2.3 Props 设计

```jsx
// ✅ 明确的 Props 接口
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

// ✅ 使用 TypeScript 类型
type UserCardProps = {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (id: number) => void
  showActions?: boolean
}

// ✅ 默认值处理
function UserCard({ user, onEdit, onDelete, showActions = true }: UserCardProps) {
  // ...
}

// ✅ 解构 Props
function UserCard({ 
  user: { name, email, avatar },
  onEdit,
  onDelete 
}: UserCardProps) {
  // ...
}
```

## 3. Hooks 最佳实践

### 3.1 自定义 Hooks

```jsx
// ✅ 命名：use 开头
function useUser(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    let isMounted = true
    
    async function fetchUser() {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        
        if (isMounted) {
          setUser(data)
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
    
    fetchUser()
    
    return () => {
      isMounted = false
    }
  }, [userId])
  
  return { user, loading, error }
}

// 使用
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId)
  
  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  
  return <UserCard user={user} />
}
```

### 3.2 Hooks 规则

```jsx
// ✅ 在顶层调用 Hooks
function Component() {
  const [count, setCount] = useState(0)
  const user = useContext(UserContext)
  const location = useLocation()
  
  // ✅ 在条件语句之前调用
  const shouldFetch = useMemo(() => {
    return count > 0
  }, [count])
  
  // ...
}

// ❌ 不要在循环、条件或嵌套函数中调用
function BadComponent({ items }) {
  // ❌ 不要在循环中调用
  items.forEach(item => {
    const [value, setValue] = useState(item.value)
  })
  
  // ❌ 不要在条件中调用
  if (condition) {
    const [count, setCount] = useState(0)
  }
  
  // ❌ 不要在嵌套函数中调用
  const handleClick = () => {
    const [value, setValue] = useState('')
  }
}

// ✅ 自定义 Hook 可以调用其他 Hooks
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return size
}
```

## 4. 状态管理最佳实践

### 4.1 状态分类

```jsx
// ✅ 组件本地状态
function Form() {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <form>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  )
}

// ✅ 组件间共享状态（提升状态）
function Parent() {
  const [selected, setSelected] = useState(null)
  
  return (
    <div>
      <ChildA selected={selected} />
      <ChildB onSelect={setSelected} />
    </div>
  )
}

// ✅ 全局状态（Context 或状态管理库）
const UserContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <App />
    </UserContext.Provider>
  )
}
```

### 4.2 避免过度使用全局状态

```jsx
// ❌ 不好：所有状态都放全局
function useGlobalStore() {
  return {
    modalVisible: false,
    inputValue: '',
    hoverState: false,
    // ...
  }
}

// ✅ 好：只有真正需要共享的状态才放全局
function useAuthStore() {
  return {
    user: null,
    login: async () => { /* ... */ },
    logout: () => { /* ... */ }
  }
}

// ✅ 组件本地状态保持本地
function Modal() {
  const [visible, setVisible] = useState(false)
  
  return (
    <div>
      <button onClick={() => setVisible(true)}>Open</button>
      {visible && <Dialog onClose={() => setVisible(false)} />}
    </div>
  )
}
```

## 5. 事件处理

### 5.1 命名约定

```jsx
// ✅ 事件处理函数：handle + 动作
function Component() {
  const handleClick = () => {}
  const handleSubmit = () => {}
  const handleInputChange = () => {}
  const handleUserDelete = () => {}
  
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <form onSubmit={handleSubmit}>
        <input onChange={handleInputChange} />
      </form>
    </div>
  )
}

// ✅ Props 回调：on + 事件
interface ButtonProps {
  onClick?: () => void
  onSubmit?: () => void
  onChange?: (value: string) => void
}

// ✅ 渲染函数：render + 内容
function Component() {
  const renderHeader = () => <header>Header</header>
  const renderItem = (item) => <li key={item.id}>{item.name}</li>
  
  return (
    <div>
      {renderHeader()}
      <ul>{items.map(renderItem)}</ul>
    </div>
  )
}
```

### 5.2 传递参数

```jsx
// ✅ 使用箭头函数
function UserList({ users, onDelete }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => onDelete(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

// ✅ 使用 useCallback 优化
function UserList({ users, onDelete }) {
  const handleDelete = useCallback((id) => {
    onDelete(id)
  }, [onDelete])
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

// ✅ 使用 data 属性
function UserList({ users, onDelete }) {
  const handleClick = (e) => {
    const id = e.currentTarget.dataset.userId
    onDelete(id)
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button data-user-id={user.id} onClick={handleClick}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

## 6. 样式管理

### 6.1 CSS Modules

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  background-color: #007bff;
  color: white;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css'
import classNames from 'classnames'

function Button({ variant = 'primary', disabled, children, onClick }) {
  const buttonClass = classNames(
    styles.button,
    styles[variant],
    { [styles.disabled]: disabled }
  )
  
  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
```

### 6.2 样式规范

```jsx
// ✅ 使用 CSS 变量
// variables.css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --border-radius: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

// ✅ 使用 CSS-in-JS（styled-components）
import styled from 'styled-components'

const Button = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  
  &:hover {
    opacity: 0.8;
  }
`

// ✅ 内联样式仅用于动态值
function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

## 7. TypeScript 最佳实践

### 7.1 类型定义

```typescript
// types/index.ts
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface APIResponse<T> {
  data: T
  status: number
  message: string
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

// 使用
function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

### 7.2 组件类型

```typescript
import { ReactNode, ButtonHTMLAttributes } from 'react'

// ✅ 扩展 HTML 元素属性
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

function Button({ 
  variant = 'primary', 
  loading = false, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

// ✅ 泛型组件
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  keyExtractor: (item: T) => string | number
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// 使用
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>
```

## 8. 错误处理

### 8.1 错误边界

```jsx
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // 上报错误
    reportError(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes />
      </Router>
    </ErrorBoundary>
  )
}
```

### 8.2 异步错误处理

```jsx
// ✅ 使用 try-catch
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// ✅ 组件中的错误处理
function DataComponent() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await fetchData()
        if (isMounted) {
          setData(result)
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
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [])
  
  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  
  return <DataDisplay data={data} />
}
```

## 9. 测试最佳实践

### 9.1 单元测试

```jsx
// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
  
  it('applies variant class', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByText('Delete')).toHaveClass('btn-danger')
  })
})
```

### 9.2 组件测试

```jsx
// UserCard.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UserCard from './UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  }
  
  it('displays user information', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = vi.fn()
    render(<UserCard user={mockUser} onEdit={handleEdit} />)
    
    await userEvent.click(screen.getByText('Edit'))
    expect(handleEdit).toHaveBeenCalledWith(mockUser)
  })
})
```

## 10. 代码规范

### 10.1 ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

### 10.2 Prettier 配置

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "jsxSingleQuote": false
}
```

### 10.3 目录结构约定

```
✅ 文件命名约定
├─ 组件：PascalCase
│  └─ UserProfile.jsx
├─ 工具函数：camelCase
│  └─ formatDate.js
├─ Hooks：use + camelCase
│  └─ useAuth.js
├─ 常量：UPPER_SNAKE_CASE
│  └─ API_ENDPOINTS.js
└─ 样式：kebab-case
   └─ user-profile.module.css
```
