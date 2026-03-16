---
title: React 性能优化：从理论到实战
category: 经验教程
---
# React 性能优化：从理论到实战

做 React 开发也有几年了，性能优化做过不少，整理一套从入门到精通的实战经验。

## 先搞清楚：什么时候需要优化

**不要过早优化**。90% 的小项目，你瞎优化反而增加复杂度，性能也没提升。

什么时候你需要优化：
- 页面明显卡顿，交互掉帧
- 列表数据多，滚动不流畅
- 开发者工具 Performance 分析确实有问题

## 基础优化手段

### 1. React.memo 防止不必要重渲染

父组件更新，子组件默认也会更新。如果子组件 props 没变，可以用 `React.memo` 缓存：

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* 只有 props 变了才会重渲染 */
});
```

注意：它只做浅对比。如果对象是每次都是新引用，还是会重渲染。

### 2. useCallback / useMemo 缓存引用

```javascript
// 缓存函数
const handleClick = useCallback(() => {
  // ...
}, [dep]);

// 缓存计算结果
const sortedList = useMemo(() => {
  return list.sort((a, b) => a - b);
}, [list]);
```

**使用场景**：
- 函数传给 memo 包裹的子组件，防止因为函数引用变了导致重渲染
- 复杂计算，不需要每次渲染都重算

**不要乱用**：每个函数都包一层 `useCallback`，反而增加开销，代码也丑。

### 3. 拆分组件

把大组件拆成小组件，这样局部更新的时候，不需要整个组件重渲染。比如：

```jsx
// 不好：整个页面一个组件，导航栏每次都跟着重渲染
// 好：导航栏拆成独立组件，memo 包裹，只有自己 props 变了才更新
```

## 进阶：列表虚拟化

长列表性能杀手，几十条还好，成百上千条 DOM 全挂上去，肯定卡。

解决办法：**只渲染可视区内的元素**。

开源库直接用：
- `react-window`（轻量，推荐）
- `react-virtualized`（功能全，有点重）

我现在基本上长列表都用 `react-window`，体积小，API 简单，性能够⽤。

## 再进阶：Code Splitting 代码分割

首屏加载慢，打包出来 bundle 很大，怎么办？

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

按路由拆分，首屏只加载首屏需要的代码，其他路由按需加载，首屏加载速度立马上来。

## 高级：状态管理优化

状态地方不对，也会导致不必要重渲染：

- 把状态放对地方，不要把不需要全局共享的状态放到 Redux 里
- 状态拆分，更新 A 不要让 B 也跟着重渲染
- 使用 `useReducer` + `useContext` 的时候，注意拆分 context，不要让不相关的组件跟着更新

## 生产环境必做

1. **开启生产模式构建**——Vite/Webpack 生产模式自动去掉开发环境的校验，体积小很多
2. **压缩代码**——现在打包工具都自动做了，确认一下
3. **使用生产版本的 React**——开发版本有很多警告检查，生产版本去掉了

## 怎么找到性能问题

Chrome DevTools Performance 面板：
1. 录制一下你的操作
2.看哪个任务耗时太长
3.看哪个组件重渲染次数不对

React DevTools 也有 Profiler 能直接看每个组件渲染耗时，非常好用。

## 总结

性能优化是个循序渐进的过程：
1. 先保证代码结构清晰，该拆分拆分
2. 解决明显卡顿问题
3. 最后再抠细节优化

**先跑起来，再跑得快**——这是我的信条。
