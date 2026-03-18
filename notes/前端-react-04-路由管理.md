# React Router 路由管理

## 1. 安装和基础配置

### 1.1 安装

```bash
npm install react-router-dom
```

### 1.2 基础配置

```jsx
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

### 1.3 定义路由

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Users from './pages/Users'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
```

## 2. 路由导航

### 2.1 Link 组件

```jsx
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/users">Users</Link>
      
      {/* 相对路径 */}
      <Link to="profile">Profile</Link>
      
      {/* 带查询参数 */}
      <Link to="/users?id=123">User 123</Link>
      
      {/* 带 hash */}
      <Link to="/about#contact">Contact</Link>
      
      {/* 带状态 */}
      <Link to="/dashboard" state={{ from: 'home' }}>
        Dashboard
      </Link>
    </nav>
  )
}
```

### 2.2 NavLink 组件

```jsx
import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>
      
      <NavLink 
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? 'red' : 'black'
        })}
      >
        About
      </NavLink>
      
      {/* 自定义 active 类名 */}
      <NavLink 
        to="/users"
        className={({ isActive, isPending }) => 
          isPending ? 'pending' : isActive ? 'active' : ''
        }
      >
        Users
      </NavLink>
      
      {/* 结束匹配 */}
      <NavLink to="/about" end>About</NavLink>
    </nav>
  )
}
```

### 2.3 编程式导航

```jsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials)
      // 导航到指定路径
      navigate('/dashboard')
      
      // 替换当前历史记录
      navigate('/dashboard', { replace: true })
      
      // 前进/后退
      navigate(-1) // 后退
      navigate(1)  // 前进
      
      // 带状态
      navigate('/dashboard', { 
        state: { from: 'login' } 
      })
    } catch (error) {
      console.error(error)
    }
  }
  
  return <button onClick={handleLogin}>Login</button>
}
```

## 3. 动态路由

### 3.1 路由参数

```jsx
// 定义动态路由
<Route path="/users/:userId" element={<UserDetail />} />
<Route path="/posts/:postId/comments/:commentId" element={<Comment />} />

// 获取参数
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { userId } = useParams()
  
  const { data: user, loading } = useFetch(`/api/users/${userId}`)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>ID: {userId}</p>
    </div>
  )
}

// 多个参数
function Comment() {
  const { postId, commentId } = useParams()
  
  return (
    <div>
      Post ID: {postId}
      Comment ID: {commentId}
    </div>
  )
}
```

### 3.2 可选参数

```jsx
// 可选参数
<Route path="/users/:userId?" element={<Users />} />

function Users() {
  const { userId } = useParams()
  
  return (
    <div>
      {userId ? <UserDetail id={userId} /> : <UserList />}
    </div>
  )
}
```

### 3.3 通配符

```jsx
// 匹配所有路径
<Route path="*" element={<NotFound />} />

// 匹配多个段
<Route path="/files/*" element={<Files />} />

function Files() {
  // 获取剩余路径
  const { '*': filePath } = useParams()
  
  return <div>File path: {filePath}</div>
}
```

## 4. 嵌套路由

### 4.1 基础嵌套路由

```jsx
// App.jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users" element={<Users />}>
          <Route index element={<UserList />} />
          <Route path=":userId" element={<UserDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

// Layout.jsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/users">Users</Link>
        </nav>
      </header>
      
      <main>
        <Outlet /> {/* 子路由渲染位置 */}
      </main>
      
      <footer>
        <p>Footer</p>
      </footer>
    </div>
  )
}

// Users.jsx
function Users() {
  return (
    <div>
      <h1>Users</h1>
      <Outlet /> {/* 嵌套子路由渲染位置 */}
    </div>
  )
}
```

### 4.2 布局路由

```jsx
function App() {
  return (
    <Routes>
      {/* 管理后台布局 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 用户界面布局 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
```

## 5. 查询参数

### 5.1 使用查询参数

```jsx
import { useSearchParams } from 'react-router-dom'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // 读取参数
  const page = searchParams.get('page') || '1'
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'asc'
  
  // 设置参数
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, category, sort })
  }
  
  // 批量设置
  const handleFilter = (filters) => {
    setSearchParams({ ...Object.fromEntries(searchParams), ...filters })
  }
  
  // 删除参数
  const clearCategory = () => {
    searchParams.delete('category')
    setSearchParams(searchParams)
  }
  
  return (
    <div>
      <p>Page: {page}</p>
      <p>Category: {category}</p>
      
      <button onClick={() => handlePageChange(2)}>Page 2</button>
      <button onClick={clearCategory}>Clear Category</button>
    </div>
  )
}
```

### 5.2 自定义 Hook

```jsx
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function Products() {
  const query = useQuery()
  const page = query.get('page')
  
  return <div>Page: {page}</div>
}
```

## 6. 路由状态

### 6.1 传递状态

```jsx
// 传递状态
<Link to="/dashboard" state={{ from: 'home', userId: 123 }}>
  Dashboard
</Link>

// 或使用 navigate
const navigate = useNavigate()
navigate('/dashboard', { state: { from: 'home' } })

// 接收状态
import { useLocation } from 'react-router-dom'

function Dashboard() {
  const location = useLocation()
  const state = location.state
  
  return (
    <div>
      {state?.from && <p>Came from: {state.from}</p>}
    </div>
  )
}
```

## 7. 路由守卫

### 7.1 受保护路由

```jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    // 重定向到登录页，保存当前位置
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

// 使用
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}
```

### 7.2 权限路由

```jsx
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  const location = useLocation()
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

// 使用
<Route 
  path="/admin" 
  element={
    <RoleRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </RoleRoute>
  } 
/>
```

### 7.3 路由加载器

```jsx
import { useLoaderData } from 'react-router-dom'

// 定义 loader
async function userLoader({ params }) {
  const response = await fetch(`/api/users/${params.userId}`)
  if (!response.ok) {
    throw new Response('Not Found', { status: 404 })
  }
  return response.json()
}

// 使用 loader
<Route 
  path="/users/:userId" 
  element={<UserDetail />} 
  loader={userLoader}
/>

// 组件中获取数据
function UserDetail() {
  const user = useLoaderData()
  
  return <h1>{user.name}</h1>
}
```

## 8. 错误处理

### 8.1 错误边界

```jsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

function ErrorBoundary() {
  const error = useRouteError()
  
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} {error.statusText}</h1>
        <p>{error.data}</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  )
}

// 使用
<Route 
  path="/users/:userId" 
  element={<UserDetail />} 
  errorElement={<ErrorBoundary />}
/>
```

### 8.2 404 页面

```jsx
function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Link to="/">Go Home</Link>
    </div>
  )
}

<Route path="*" element={<NotFound />} />
```

## 9. 懒加载

### 9.1 React.lazy

```jsx
import { Suspense, lazy } from 'react'

// 懒加载组件
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  )
}
```

### 9.2 嵌套懒加载

```jsx
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Users = lazy(() => import('./pages/admin/Users'))

function App() {
  return (
    <Routes>
      <Route 
        path="/admin" 
        element={
          <Suspense fallback={<Loading />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<Loading />}><Users /></Suspense>} />
      </Route>
    </Routes>
  )
}
```

## 10. 路由配置

### 10.1 配置式路由

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UserList />
          },
          {
            path: ':userId',
            element: <UserDetail />,
            loader: userLoader
          }
        ]
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}
```

### 10.2 模块化路由

```jsx
// routes/userRoutes.jsx
export const userRoutes = {
  path: 'users',
  children: [
    {
      index: true,
      element: <UserList />
    },
    {
      path: ':userId',
      element: <UserDetail />
    }
  ]
}

// routes/adminRoutes.jsx
export const adminRoutes = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />
    },
    {
      path: 'users',
      element: <AdminUsers />
    }
  ]
}

// App.jsx
import { userRoutes } from './routes/userRoutes'
import { adminRoutes } from './routes/adminRoutes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      userRoutes,
      adminRoutes
    ]
  }
])
```

## 11. 最佳实践

### 11.1 路由结构

```
src/
├── routes/
│   ├── index.jsx          # 路由配置
│   ├── ProtectedRoute.jsx # 路由守卫
│   ├── userRoutes.jsx     # 用户路由
│   └── adminRoutes.jsx    # 管理路由
├── layouts/
│   ├── MainLayout.jsx
│   └── AdminLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── users/
│   │   ├── UserList.jsx
│   │   └── UserDetail.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       └── Users.jsx
└── App.jsx
```

### 11.2 类型安全（TypeScript）

```typescript
// types/router.ts
import { Location } from 'react-router-dom'

interface LocationState {
  from?: string
  userId?: number
}

// 使用
function Dashboard() {
  const location = useLocation() as Location<LocationState>
  const state = location.state
  
  return <div>{state?.from}</div>
}
```

### 11.3 路由常量

```javascript
// constants/routes.js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  USERS: '/users',
  USER_DETAIL: '/users/:userId',
  ADMIN: '/admin',
  LOGIN: '/login',
  DASHBOARD: '/dashboard'
}

// 使用
import { ROUTES } from '@/constants/routes'

<Route path={ROUTES.HOME} element={<Home />} />
<Link to={ROUTES.ABOUT}>About</Link>
navigate(ROUTES.DASHBOARD)
```
