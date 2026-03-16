---
title: React 基础入门
category: 前端
---
# React 基础入门

## 1. 创建 React 应用

### 1.1 使用 Vite 创建项目

```bash
# 创建项目
npm create vite@latest my-react-app -- --template react

# 或使用 react-ts 模板
npm create vite@latest my-react-app -- --template react-ts

# 安装依赖
cd my-react-app
npm install

# 启动开发服务器
npm run dev
```

### 1.2 项目结构

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

### 1.3 应用入口

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 2. JSX 语法

### 2.1 基础语法

```jsx
// JSX 是 JavaScript 的语法扩展
const element = <h1>Hello, React!</h1>

// JSX 中嵌入表达式
const name = 'React'
const element = <h1>Hello, {name}!</h1>

// 使用函数
function formatName(user) {
  return user.firstName + ' ' + user.lastName
}

const user = {
  firstName: 'John',
  lastName: 'Doe'
}

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
)
```

### 2.2 JSX 属性

```jsx
// 使用引号定义字符串属性
const element = <div className="container">内容</div>

// 使用大括号嵌入 JavaScript 表达式
const tabIndex = 0
const element = <div tabIndex={tabIndex}>内容</div>

// 使用 camelCase 命名属性
const element = (
  <div 
    className="container"
    htmlFor="input"
    style={{ color: 'red', fontSize: '16px' }}
  >
    内容
  </div>
)
```

### 2.3 JSX 条件渲染

```jsx
// 条件运算符
const element = (
  <div>
    {isLoggedIn ? <LogoutButton /> : <LoginButton />}
  </div>
)

// 逻辑与运算符
const element = (
  <div>
    {unreadMessages.length > 0 && (
      <h2>
        您有 {unreadMessages.length} 条未读消息。
      </h2>
    )}
  </div>
)

// 提前返回
function Mailbox(props) {
  const unreadMessages = props.unreadMessages
  
  if (unreadMessages.length === 0) {
    return <h1>没有新消息</h1>
  }
  
  return (
    <div>
      <h1>消息列表</h1>
      {unreadMessages.map(message => (
        <p key={message.id}>{message.text}</p>
      ))}
    </div>
  )
}
```

### 2.4 列表渲染

```jsx
// 使用 map 渲染列表
const numbers = [1, 2, 3, 4, 5]
const listItems = numbers.map(number => (
  <li key={number.toString()}>
    {number}
  </li>
))

// 复杂列表
const todos = [
  { id: 1, text: '学习 React', completed: true },
  { id: 2, text: '构建应用', completed: false },
  { id: 3, text: '部署上线', completed: false }
]

function TodoList() {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} style={{ 
          textDecoration: todo.completed ? 'line-through' : 'none' 
        }}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

// key 的最佳实践
// ✅ 使用唯一 ID
<li key={item.id}>{item.name}</li>

// ❌ 不要使用索引（除非列表是静态的）
<li key={index}>{item.name}</li>
```

## 3. 组件

### 3.1 函数组件

```jsx
// 简单函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// 箭头函数组件
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>
}

// 箭头函数简写
const Welcome = ({ name }) => <h1>Hello, {name}</h1>
```

### 3.2 组件组合

```jsx
// 组件嵌套
function App() {
  return (
    <div>
      <Header />
      <Main>
        <Sidebar />
        <Content />
      </Main>
      <Footer />
    </div>
  )
}

// 提取组件
function Avatar(props) {
  return (
    <img 
      className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  )
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  )
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
    </div>
  )
}
```

## 4. Props

### 4.1 基础用法

```jsx
// 传递 props
function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  )
}

// 接收 props
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

// 解构 props
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Age: {age}</p>
    </div>
  )
}
```

### 4.2 默认 Props

```jsx
// 默认值
function Button({ 
  text = 'Click me', 
  color = 'blue', 
  size = 'medium' 
}) {
  return (
    <button 
      className={`btn btn-${color} btn-${size}`}
    >
      {text}
    </button>
  )
}

// 使用
<Button />
<Button text="Submit" />
<Button text="Cancel" color="red" size="large" />
```

### 4.3 children prop

```jsx
// 使用 children
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-header">
        {title}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

// 使用
<Card title="用户信息">
  <p>Name: John</p>
  <p>Age: 25</p>
</Card>

// 条件性渲染 children
function ConditionalRender({ show, children }) {
  return show ? children : null
}

// 使用
<ConditionalRender show={isLoggedIn}>
  <Dashboard />
</ConditionalRender>
```

### 4.4 Props 类型检查

```jsx
import PropTypes from 'prop-types'

function UserCard({ user, onUpdate, isAdmin }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {isAdmin && <button onClick={onUpdate}>Update</button>}
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    age: PropTypes.number
  }).isRequired,
  onUpdate: PropTypes.func,
  isAdmin: PropTypes.bool
}

UserCard.defaultProps = {
  isAdmin: false,
  onUpdate: () => {}
}
```

## 5. State

### 5.1 useState Hook

```jsx
import { useState } from 'react'

function Counter() {
  // 声明状态变量
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

### 5.2 使用 State 的注意事项

```jsx
import { useState } from 'react'

function Example() {
  // ✅ 正确：直接更新
  const [count, setCount] = useState(0)
  
  const increment = () => {
    setCount(count + 1)
  }
  
  // ✅ 正确：基于前一个状态更新
  const incrementSafe = () => {
    setCount(prevCount => prevCount + 1)
  }
  
  // ✅ 对象状态
  const [user, setUser] = useState({ name: '', age: 0 })
  
  const updateName = (name) => {
    setUser(prevUser => ({
      ...prevUser,
      name
    }))
  }
  
  // ✅ 数组状态
  const [items, setItems] = useState([])
  
  const addItem = (item) => {
    setItems(prevItems => [...prevItems, item])
  }
  
  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }
  
  // ❌ 错误：不要直接修改 state
  const badUpdate = () => {
    // user.name = 'John' // 错误
    // items.push(newItem) // 错误
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={incrementSafe}>Increment Safe</button>
    </div>
  )
}
```

### 5.3 惰性初始化

```jsx
import { useState } from 'react'

function Counter() {
  // 惰性初始化：只在首次渲染时执行
  const [count, setCount] = useState(() => {
    const initialCount = localStorage.getItem('count')
    return initialCount ? parseInt(initialCount, 10) : 0
  })
  
  const increment = () => {
    const newCount = count + 1
    setCount(newCount)
    localStorage.setItem('count', newCount.toString())
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## 6. 事件处理

### 6.1 基础事件处理

```jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked')
  }
  
  return (
    <button onClick={handleClick}>
      Click me
    </button>
  )
}

// 传递参数
function ItemList({ items }) {
  const handleDelete = (id) => {
    console.log('Delete item:', id)
  }
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => handleDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

// 使用 event 对象
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止默认行为
    console.log('Form submitted')
  }
  
  const handleInput = (e) => {
    console.log('Input value:', e.target.value)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleInput} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 6.2 受控组件

```jsx
import { useState } from 'react'

function Form() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 6.3 事件修饰符

```jsx
// 阻止默认行为
<form onSubmit={(e) => {
  e.preventDefault()
  // 处理提交
}}>
  <button type="submit">Submit</button>
</form>

// 阻止事件冒泡
<div onClick={() => console.log('Parent')}>
  <button onClick={(e) => {
    e.stopPropagation()
    console.log('Child')
  }}>
    Click me
  </button>
</div>

// 传递自定义参数
function List({ items, onSelect }) {
  return (
    <ul>
      {items.map(item => (
        <li 
          key={item.id}
          onClick={(e) => onSelect(item.id, e)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}
```

## 7. 条件渲染

### 7.1 多种条件渲染方式

```jsx
import { useState } from 'react'

function UserDashboard({ user }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 1. if 语句
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  // 2. 三元运算符
  return (
    <div>
      {user ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  )
  
  // 3. 逻辑与运算符
  function Mailbox({ unreadMessages }) {
    return (
      <div>
        <h1>Hello!</h1>
        {unreadMessages.length > 0 && (
          <h2>
            You have {unreadMessages.length} unread messages.
          </h2>
        )}
      </div>
    )
  }
  
  // 4. 立即执行函数（不推荐）
  function Component({ status }) {
    return (
      <div>
        {(() => {
          switch (status) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error />
            case 'success':
              return <Success />
            default:
              return null
          }
        })()}
      </div>
    )
  }
  
  // 5. 组件提取
  function Status({ status }) {
    if (status === 'loading') return <Loading />
    if (status === 'error') return <Error />
    if (status === 'success') return <Success />
    return null
  }
  
  function Component({ status }) {
    return (
      <div>
        <Status status={status} />
      </div>
    )
  }
}
```

### 7.2 阻止渲染

```jsx
// 返回 null 阻止渲染
function WarningBanner({ warn }) {
  if (!warn) {
    return null
  }
  
  return (
    <div className="warning">
      Warning!
    </div>
  )
}

// 使用
function Page() {
  const [showWarning, setShowWarning] = useState(true)
  
  return (
    <div>
      <WarningBanner warn={showWarning} />
      <button onClick={() => setShowWarning(!showWarning)}>
        {showWarning ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
```

## 8. 样式处理

### 8.1 内联样式

```jsx
function Component() {
  const style = {
    color: 'red',
    backgroundColor: 'blue',
    fontSize: '16px',
    padding: '10px 20px'
  }
  
  return (
    <div style={style}>
      Styled component
    </div>
  )
}

// 动态样式
function Button({ primary, size }) {
  return (
    <button
      style={{
        backgroundColor: primary ? 'blue' : 'gray',
        padding: size === 'large' ? '20px' : '10px',
        color: 'white'
      }}
    >
      Button
    </button>
  )
}
```

### 8.2 CSS 类名

```jsx
// className 属性
function Component() {
  return (
    <div className="container">
      <h1 className="title">Title</h1>
      <p className="text content">Paragraph</p>
    </div>
  )
}

// 动态类名
function Button({ active, disabled }) {
  return (
    <button
      className={`btn ${active ? 'btn-active' : ''} ${disabled ? 'btn-disabled' : ''}`}
    >
      Button
    </button>
  )
}

// 使用 classnames 库
import classNames from 'classnames'

function Button({ active, disabled, size }) {
  const buttonClass = classNames('btn', {
    'btn-active': active,
    'btn-disabled': disabled,
    [`btn-${size}`]: size
  })
  
  return (
    <button className={buttonClass}>
      Button
    </button>
  )
}
```

### 8.3 CSS Modules

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.primary {
  background-color: blue;
  color: white;
}

.secondary {
  background-color: gray;
  color: white;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css'

function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  )
}

// 或使用 classnames
import classNames from 'classnames'
import styles from './Button.module.css'

function Button({ variant = 'primary', children }) {
  return (
    <button className={classNames(styles.button, styles[variant])}>
      {children}
    </button>
  )
}
```

## 9. 表单处理

### 9.1 受控组件

```jsx
import { useState } from 'react'

function Form() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    subscribe: false,
    gender: ''
  })
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 文本输入 */}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      
      {/* 邮箱 */}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      {/* 选择框 */}
      <select 
        name="role" 
        value={formData.role}
        onChange={handleChange}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      
      {/* 复选框 */}
      <label>
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleChange}
        />
        Subscribe to newsletter
      </label>
      
      {/* 单选按钮 */}
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === 'male'}
          onChange={handleChange}
        />
        Male
      </label>
      
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === 'female'}
          onChange={handleChange}
        />
        Female
      </label>
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

### 9.2 非受控组件

```jsx
import { useRef } from 'react'

function Form() {
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Input value:', inputRef.current.value)
    console.log('File:', fileRef.current.files[0])
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        ref={inputRef} 
        defaultValue="default value"
      />
      
      <input 
        type="file" 
        ref={fileRef}
      />
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 10. 最佳实践

### 10.1 组件拆分

```jsx
// ❌ 不好：一个组件做太多事
function UserDashboard() {
  // 大量代码...
  return (
    <div>
      {/* 复杂的 JSX */}
    </div>
  )
}

// ✅ 好：职责分离
function UserDashboard() {
  return (
    <div>
      <UserHeader />
      <UserStats />
      <UserActivity />
      <UserSettings />
    </div>
  )
}
```

### 10.2 提升 State

```jsx
// 父组件管理共享状态
function App() {
  const [user, setUser] = useState(null)
  
  return (
    <div>
      <Header user={user} onLogout={() => setUser(null)} />
      <Main user={user} />
      <Footer user={user} />
    </div>
  )
}

// 或使用 Context
const UserContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <Main />
      <Footer />
    </UserContext.Provider>
  )
}
```

### 10.3 命名规范

```jsx
// 组件名：PascalCase
function UserProfile() {}

// 事件处理函数：handle + 动作
const handleClick = () => {}
const handleSubmit = () => {}
const handleInputChange = () => {}

// 布尔值：is/has 前缀
const [isLoading, setIsLoading] = useState(false)
const [hasError, setHasError] = useState(false)

// 回调 props：on + 事件
<Button onClick={handleClick} onSubmit={handleSubmit} />

// 渲染函数：render + 内容
const renderHeader = () => {}
const renderItems = () => {}
```
