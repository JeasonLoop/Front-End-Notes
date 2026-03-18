# TypeScript 进阶：用好类型体操提升代码质量

用 TypeScript 也有几年了，从最开始的 `any` 大法好，到现在尽量给所有代码都加上类型，这里聊聊我对类型体操的理解。

## 类型体操是什么

简单说就是**利用 TypeScript 的类型系统能力，解决复杂的类型推导问题**。你写业务代码其实不需要天天写，但看懂、会用一些常用的，能让你的代码更健壮。

## 我常用的进阶类型技巧

### 1. 泛型（Generic）

泛型是类型体操的基础，说白了就是**类型层面的参数化**。你写函数的时候，不知道进来是什么类型，但你想保留类型信息，就用泛型。

```typescript
function first<T>(arr: T[]): T {
  return arr[0];
}
```

这样 `first([1, 2, 3])` 返回类型就是 `number`，`first(['a', 'b'])` 返回就是 `string`，完美。

### 2. 条件类型（Conditional Types）

```typescript
type IsString<T> = T extends string ? true : false;
```

有点像 JavaScript 的三元表达式，但作用在类型层面。配合泛型，能玩出很多花样。

最常用的就是 `Extract` 和 `Exclude`：
- `Extract<T, U>` 从 T 中找出能赋值给 U 的类型
- `Exclude<T, U>` 从 T 中排除能赋值给 U 的类型

### 3. 映射类型（Mapped Types）

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

遍历一个对象的所有 key，给每个 key 加上修饰。内置工具类型很多都是这么实现的。

### 4.  infer 类型推断

```typescript
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
```

`infer` 可以让 TypeScript 帮你推断一个类型里面的子类型，非常强大。

比如你想拿到 Promise 返回的类型：

```typescript
type Awaited<T> =
  T extends Promise<infer R> ? R : never;
```

就这么几行，搞定。

## 实际开发中，类型体操什么时候用

### 1. 写通用工具库的时候

你写一个工具函数，要给别人用，泛型配上类型体操，能让类型推导非常准确，用户用起来IDE自动补全都对。

### 2. 约束 API 接口的时候

后端返回的数据结构，用类型体操能写出很灵活的类型，比写死强很多。

### 3. 重构老 JS 代码的时候

逐步加类型，类型体操能帮你处理一些兼容问题。

## 我的观点

**不用为了体操而体操**。业务代码能看得懂，能满足需求就行，不需要写一堆花里胡哨的高级类型，别人看不懂维护不了。

但你得懂这些概念，遇到复杂场景你知道有这些工具能解决问题，这就够了。

TypeScript 最大的好处不是类型检查，是**IDE 提示准，重构放心**。类型体操就是帮你把这件事做得更好。
