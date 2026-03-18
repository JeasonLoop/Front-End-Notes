# JavaScript ES6+ 新特性详解

## 1. 变量声明：let 和 const

### 1.1 let 和 const 基础

```javascript
/**
 * let：块作用域变量
 * const：块作用域常量
 */

// let：块作用域
if (true) {
  let x = 1;
  console.log(x); // 1
}
// console.log(x); // 报错：x is not defined

// const：必须初始化，不能重新赋值
const PI = 3.14159;
// PI = 3.14; // 报错：Assignment to constant variable

// const 对象可以修改属性
const obj = { name: "John" };
obj.name = "Jane"; // 可以
obj.age = 30;      // 可以
// obj = {};        // 报错：不能重新赋值
```

### 1.2 暂时性死区（TDZ）

```javascript
/**
 * let 和 const 存在暂时性死区
 * 在声明之前访问会报错
 */

// console.log(x); // 报错：Cannot access 'x' before initialization
let x = 1;

// 即使 typeof 也不安全
// typeof y; // 报错：Cannot access 'y' before initialization
let y = 2;
```

## 2. 箭头函数（Arrow Functions）

### 2.1 基本语法

```javascript
/**
 * 箭头函数：更简洁的函数语法
 * 没有自己的 this，继承外层作用域
 */

// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
var add = (a, b) => {
  return a + b;
};

// 单表达式可以省略大括号和 return
var add = (a, b) => a + b;

// 单个参数可以省略括号
var square = x => x * x;

// 无参数需要括号
var greet = () => "Hello";

// 返回对象需要括号
var getObj = () => ({ name: "John" });
```

### 2.2 this 绑定

```javascript
/**
 * 箭头函数没有自己的 this
 * this 继承自外层作用域
 */

var obj = {
  name: "Object",
  // 传统函数：this 指向调用对象
  regularFunction: function() {
    console.log(this.name); // "Object"
  },
  // 箭头函数：this 继承外层作用域
  arrowFunction: () => {
    console.log(this); // Window 对象（全局作用域）
  },
  // 嵌套函数中的 this
  nested: function() {
    var self = this;
    setTimeout(function() {
      console.log(self.name); // "Object"（使用 self）
    }, 100);
    // 箭头函数自动绑定 this
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 100);
  }
};
```

## 3. 解构赋值（Destructuring）

### 3.1 数组解构

```javascript
/**
 * 数组解构：从数组提取值
 */

var arr = [1, 2, 3];

// 基本解构
var [a, b, c] = arr;
console.log(a, b, c); // 1 2 3

// 跳过元素
var [x, , z] = arr;
console.log(x, z); // 1 3

// 默认值
var [p, q, r = 10] = [1, 2];
console.log(p, q, r); // 1 2 10

// 剩余元素
var [first, ...rest] = arr;
console.log(first); // 1
console.log(rest);  // [2, 3]

// 交换变量
var x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
```

### 3.2 对象解构

```javascript
/**
 * 对象解构：从对象提取属性
 */

var obj = {
  name: "John",
  age: 30,
  city: "New York"
};

// 基本解构
var { name, age } = obj;
console.log(name, age); // "John" 30

// 重命名
var { name: personName, age: personAge } = obj;
console.log(personName, personAge); // "John" 30

// 默认值
var { name, age, country = "USA" } = obj;
console.log(country); // "USA"

// 嵌套解构
var user = {
  name: "John",
  address: {
    city: "New York",
    zip: "10001"
  }
};
var { address: { city } } = user;
console.log(city); // "New York"

// 函数参数解构
function greet({ name, age }) {
  console.log(`Hello, ${name}. You are ${age} years old.`);
}
greet({ name: "John", age: 30 }); // "Hello, John. You are 30 years old."
```

## 4. 模板字符串（Template Literals）

### 4.1 基本用法

```javascript
/**
 * 模板字符串：使用反引号 ` 包裹
 * 支持多行字符串和表达式插值
 */

// 基本用法
var name = "John";
var greeting = `Hello, ${name}!`;
console.log(greeting); // "Hello, John!"

// 多行字符串
var multiLine = `
  第一行
  第二行
  第三行
`;

// 表达式
var a = 5, b = 10;
var result = `The sum is ${a + b}`;
console.log(result); // "The sum is 15"

// 嵌套模板字符串
var items = ["apple", "banana", "orange"];
var list = `
  <ul>
    ${items.map(item => `    <li>${item}</li>`).join("\n")}
  </ul>
`;
```

### 4.2 标签模板（Tagged Templates）

```javascript
/**
 * 标签模板：在模板字符串前加函数名
 * 函数接收字符串数组和表达式值
 */

function highlight(strings, ...values) {
  return strings.reduce(function(result, str, i) {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : "");
  }, "");
}

var name = "John";
var age = 30;
var result = highlight`Hello, ${name}. You are ${age} years old.`;
console.log(result); // "Hello, <mark>John</mark>. You are <mark>30</mark> years old."
```

## 5. 扩展运算符（Spread Operator）

### 5.1 数组扩展

```javascript
/**
 * 扩展运算符：... 展开数组或对象
 */

// 数组展开
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 复制数组
var original = [1, 2, 3];
var copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3]（原数组不变）

// 函数参数
function sum(a, b, c) {
  return a + b + c;
}
var numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// 数组合并
var arr3 = [0, ...arr1, 4, ...arr2, 7];
console.log(arr3); // [0, 1, 2, 3, 4, 4, 5, 6, 7]
```

### 5.2 对象扩展

```javascript
/**
 * 对象扩展：展开对象属性
 */

var obj1 = { a: 1, b: 2 };
var obj2 = { c: 3, d: 4 };
var merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// 对象复制
var original = { name: "John", age: 30 };
var copy = { ...original };
copy.age = 31;
console.log(original.age); // 30（原对象不变）

// 属性覆盖
var defaults = { color: "red", size: "medium" };
var custom = { ...defaults, size: "large" };
console.log(custom); // { color: "red", size: "large" }

// 浅拷贝注意
var nested = {
  name: "John",
  address: { city: "NYC" }
};
var shallowCopy = { ...nested };
shallowCopy.address.city = "LA";
console.log(nested.address.city); // "LA"（也被修改了）
```

## 6. 默认参数（Default Parameters）

```javascript
/**
 * 默认参数：函数参数可以有默认值
 */

function greet(name = "Guest", greeting = "Hello") {
  console.log(`${greeting}, ${name}!`);
}

greet();              // "Hello, Guest!"
greet("John");        // "Hello, John!"
greet("John", "Hi");  // "Hi, John!"

// 默认值可以是表达式
function createUser(name, id = Math.random().toString(36)) {
  return { name, id };
}

var user1 = createUser("John");
var user2 = createUser("Jane");
console.log(user1.id !== user2.id); // true

// 默认值可以使用前面的参数
function multiply(a, b = a) {
  return a * b;
}
console.log(multiply(5));    // 25 (5 * 5)
console.log(multiply(5, 3)); // 15 (5 * 3)
```

## 7. 剩余参数（Rest Parameters）

```javascript
/**
 * 剩余参数：... 收集剩余参数为数组
 */

function sum(...numbers) {
  return numbers.reduce(function(acc, n) {
    return acc + n;
  }, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15

// 剩余参数必须在最后
function example(a, b, ...rest) {
  console.log(a, b, rest);
}
example(1, 2, 3, 4, 5); // 1 2 [3, 4, 5]

// 与 arguments 的区别
function oldWay() {
  console.log(arguments); // 类数组对象
}

function newWay(...args) {
  console.log(args); // 真正的数组
}
```

## 8. Symbol

### 8.1 Symbol 基础

```javascript
/**
 * Symbol：唯一且不可变的值
 * 用作对象属性的唯一标识符
 */

// 创建 Symbol
var sym1 = Symbol();
var sym2 = Symbol();
console.log(sym1 === sym2); // false（每个 Symbol 都是唯一的）

// 带描述的 Symbol
var sym3 = Symbol("description");
console.log(sym3.toString()); // "Symbol(description)"

// 作为对象属性
var obj = {};
var sym = Symbol("key");
obj[sym] = "value";
console.log(obj[sym]); // "value"

// Symbol 属性不会被枚举
var obj2 = {
  [Symbol("key1")]: "value1",
  key2: "value2"
};
console.log(Object.keys(obj2));        // ["key2"]
console.log(Object.getOwnPropertySymbols(obj2)); // [Symbol(key1)]
```

### 8.2 Symbol 方法

```javascript
/**
 * Symbol.for()：全局 Symbol 注册表
 * Symbol.keyFor()：获取全局 Symbol 的键
 */

// Symbol.for() 会查找或创建全局 Symbol
var sym1 = Symbol.for("key");
var sym2 = Symbol.for("key");
console.log(sym1 === sym2); // true（同一个 Symbol）

// Symbol.keyFor() 获取键名
var sym = Symbol.for("myKey");
console.log(Symbol.keyFor(sym)); // "myKey"

// 内置 Symbol
var obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
console.log([...obj]); // [1, 2, 3]
```

## 9. Set 和 Map

### 9.1 Set

```javascript
/**
 * Set：唯一值的集合
 */

var set = new Set([1, 2, 3, 3, 4]);
console.log(set.size);        // 4（去重）
console.log([...set]);        // [1, 2, 3, 4]

// 添加和删除
set.add(5);
set.delete(3);
console.log(set.has(5));      // true
console.log(set.has(3));      // false

// 遍历
set.forEach(function(value) {
  console.log(value);
});

// 转换为数组
var arr = Array.from(set);
console.log(arr); // [1, 2, 4, 5]
```

### 9.2 Map

```javascript
/**
 * Map：键值对集合，键可以是任何类型
 */

var map = new Map();
map.set("name", "John");
map.set(1, "one");
map.set({}, "object");

console.log(map.get("name")); // "John"
console.log(map.size);         // 3

// 遍历
map.forEach(function(value, key) {
  console.log(key, value);
});

// 转换为数组
console.log([...map]); // [["name", "John"], [1, "one"], [{}, "object"]]
```

## 10. 迭代器和生成器

### 10.1 迭代器（Iterator）

```javascript
/**
 * 迭代器：提供统一遍历接口
 */

var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// 自定义迭代器
var myIterable = {
  [Symbol.iterator]: function() {
    var step = 0;
    return {
      next: function() {
        step++;
        if (step === 1) {
          return { value: "hello", done: false };
        } else if (step === 2) {
          return { value: "world", done: false };
        }
        return { done: true };
      }
    };
  }
};

console.log([...myIterable]); // ["hello", "world"]
```

### 10.2 生成器（Generator）

```javascript
/**
 * 生成器：可以暂停和恢复的函数
 */

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

var gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 生成器函数
function* fibonacci() {
  var [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

var fib = fibonacci();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
```

## 11. Proxy 和 Reflect

### 11.1 Proxy

```javascript
/**
 * Proxy：拦截对象操作
 */

var target = { name: "John" };
var handler = {
  get: function(target, prop) {
    console.log(`获取属性 ${prop}`);
    return target[prop];
  },
  set: function(target, prop, value) {
    console.log(`设置属性 ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
};

var proxy = new Proxy(target, handler);
proxy.name;        // "获取属性 name"
proxy.age = 30;    // "设置属性 age = 30"
```

### 11.2 Reflect

```javascript
/**
 * Reflect：提供对象操作的默认行为
 */

var obj = { name: "John" };

// 使用 Reflect
Reflect.get(obj, "name");        // "John"
Reflect.set(obj, "age", 30);     // true
Reflect.has(obj, "name");        // true
Reflect.deleteProperty(obj, "age"); // true

// 在 Proxy 中使用
var handler = {
  get: function(target, prop) {
    return Reflect.get(target, prop);
  }
};
```

## 12. Class 类

### 12.1 Class 基础

```javascript
/**
 * Class：ES6 的类语法（语法糖）
 */

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 静态方法
  static getSpecies() {
    return "Homo sapiens";
  }

  // Getter
  get info() {
    return `${this.name} is ${this.age} years old`;
  }

  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error("Age cannot be negative");
    }
    this._age = value;
  }
}

var person = new Person("John", 30);
person.greet();              // "Hello, I'm John"
Person.getSpecies();         // "Homo sapiens"
console.log(person.info);    // "John is 30 years old"
```

### 12.2 Class 继承

```javascript
/**
 * Class 继承：使用 extends
 */

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  speak() {
    super.speak(); // 调用父类方法
    console.log(`${this.name} barks`);
  }
}

var dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // "Buddy makes a sound" 和 "Buddy barks"
```

## 13. 模块化（ES Modules）

### 13.1 导出（Export）

```javascript
// math.js
// 命名导出
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// 默认导出
export default function multiply(a, b) {
  return a * b;
}

// 导出常量
export const PI = 3.14159;
```

### 13.2 导入（Import）

```javascript
// main.js
// 命名导入
import { add, subtract } from "./math.js";

// 默认导入
import multiply from "./math.js";

// 全部导入
import * as math from "./math.js";
console.log(math.add(1, 2));

// 重命名
import { add as sum } from "./math.js";
```

## 14. 总结

### ES6+ 主要特性：

1. **变量声明**：let、const（块作用域）
2. **箭头函数**：简洁语法，this 绑定
3. **解构赋值**：数组和对象解构
4. **模板字符串**：多行字符串，表达式插值
5. **扩展运算符**：展开数组和对象
6. **默认参数**：函数参数默认值
7. **剩余参数**：收集剩余参数
8. **Symbol**：唯一标识符
9. **Set/Map**：新的数据结构
10. **迭代器/生成器**：统一遍历接口
11. **Proxy/Reflect**：元编程能力
12. **Class**：类语法
13. **ES Modules**：模块化

这些特性让 JavaScript 更强大、更易用、更现代化。

