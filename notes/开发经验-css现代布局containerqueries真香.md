# CSS 现代布局：Container Queries 真香

CSS 这些年发展真快，好多以前不好做的布局，现在原生支持了。Container Queries 就是一个，用了一段时间，真心香。

## 以前我们怎么做响应式

以前只有媒体查询（Media Queries），根据**视口宽度**变布局。

但问题来了：同一个组件，在侧边栏里是一种布局，在主内容区又是另一种布局，媒体查询搞不定啊——因为视口宽度没变，变的是组件容器宽度。

## Container Queries 能做什么

**根据容器宽度来响应式，不是视口宽度**。完美解决上面的问题。

### 基本用法

```css
/* 父容器声明要查询 */
.card-container {
  container-type: inline-size;
  container-name: card-container;
}

/* 简写 */
.card-container {
  container: card-container / inline-size;
}

/* 根据容器宽度变样式 */
@container card-container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```

就这么简单。容器宽度超过 400px 就两栏布局，不够就还是单列，不管你浏览器窗口多大。

## 实际使用场景

### 1. 卡片列表

卡片网格，在宽容器里多列，窄容器里单列，自动适应，写一次到处用。

### 2. 侧边栏 / 主内容 共用组件

同一个组件，侧边栏窄就紧凑布局，主内容区宽就展开布局，完美。

### 3. 可折叠面板

折叠起来窄，展开宽，内容布局自动调整，不用 JS 算宽度。

## 我现在的使用心得

### 1. 和 Grid 搭配更香

```css
.card-grid {
  container-type: inline-size;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

容器变窄，自动减少列数，完全自适应，不用写媒体查询了。

### 2. 降级处理

现在现代浏览器都支持了，如果你要兼容很老的浏览器，可以提供一个默认布局，不支持也能用，就是没那么智能而已。

### 3. 命名可以偷懒

如果你不需要嵌套查询，可以省略 `container-name`，直接写：

```css
.parent {
  container-type: inline-size;
}

@container (min-width: 400px) {
  /* ... */
}
```

直接匹配最近的容器，够用。

## 为什么说这是 CSS 布局一大进步

以前 CSS 只能看窗口，现在终于能看自己爹（容器）了。组件真正能做到**自适应任何容器**，复用性提升一大截。

我现在写组件，遇到需要根据容器宽度变布局的场景，直接上 Container Queries，真香。
