# JavaScript this 绑定和上下文

## 1. this 是什么

`this` 是 JavaScript 中的一个关键字，它指向当前执行上下文的对象。`this` 的值不是静态的，而是在函数被调用时动态确定的。

```javascript
// this 的值取决于函数的调用方式
function sayHello() {
  console.log(this);
}

sayHello(); // 在浏览器中：Window 对象；在 Node.js 中：global 对象
```

## 2. this 的绑定规则

### 2.1 默认绑定（Default Binding）

当函数独立调用时，`this` 指向全局对象（非严格模式）或 `undefined`（严格模式）。

```javascript
// 非严格模式
function showThis() {
  console.log(this); // Window 对象（浏览器）或 global 对象（Node.js）
}

showThis(); // 默认绑定

// 严格模式
function showThisStrict() {
  "use strict";
  console.log(this); // undefined
}

showThisStrict(); // undefined

// 函数作为回调时也是默认绑定
var obj = {
  name: "Object",
  getName: function() {
    console.log(this.name);
  }
};

setTimeout(obj.getName, 1000); // undefined（this 指向全局对象）
```

### 2.2 隐式绑定（Implicit Binding）

当函数作为对象的方法调用时，`this` 指向调用该函数的对象。

```javascript
var person = {
  name: "John",
  age: 30,
  // 方法中的 this 指向 person 对象
  introduce: function() {
    console.log("我是 " + this.name + "，今年 " + this.age + " 岁");
  },
  // 嵌套函数中的 this 需要注意
  nestedFunction: function() {
    console.log("外层 this:", this.name); // "John"

    // 内部函数是独立调用，this 指向全局对象
    function innerFunction() {
      console.log("内层 this:", this); // Window 对象
    }
    innerFunction();

    // 解决方案：使用箭头函数或保存 this
    var self = this;
    function innerFunctionFixed() {
      console.log("内层 this (使用 self):", self.name); // "John"
    }
    innerFunctionFixed();
  }
};

person.introduce(); // "我是 John，今年 30 岁"
person.nestedFunction();
```

### 2.3 显式绑定（Explicit Binding）

使用 `call`、`apply` 或 `bind` 方法显式指定 `this` 的值。

#### call 方法

```javascript
/**
 * call 方法：立即调用函数，并指定 this 和参数
 * func.call(thisArg, arg1, arg2, ...)
 */

function greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

var person1 = { name: "Alice" };
var person2 = { name: "Bob" };

greet.call(person1, "Hello", "!"); // "Hello, Alice!"
greet.call(person2, "Hi", ".");     // "Hi, Bob."

// 实际应用：借用方法
var arrayLike = {
  0: "a",
  1: "b",
  2: "c",
  length: 3
};

// 使用数组的 slice 方法
var realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ["a", "b", "c"]
```

#### apply 方法

```javascript
/**
 * apply 方法：立即调用函数，参数以数组形式传递
 * func.apply(thisArg, [arg1, arg2, ...])
 */

function introduce(greeting, age, city) {
  console.log(greeting + ", 我是 " + this.name +
              ", 今年 " + age + " 岁, 来自 " + city);
}

var person = { name: "Charlie" };

// call 需要逐个传递参数
introduce.call(person, "你好", 25, "北京");

// apply 可以传递数组
introduce.apply(person, ["你好", 25, "北京"]);

// 实际应用：求数组最大值
var numbers = [5, 6, 2, 3, 7];
var max = Math.max.apply(null, numbers);
console.log(max); // 7

// ES6 可以使用扩展运算符
var max2 = Math.max(...numbers);
console.log(max2); // 7
```

#### bind 方法

```javascript
/**
 * bind 方法：返回一个新函数，this 被永久绑定
 * func.bind(thisArg, arg1, arg2, ...)
 */

var person = {
  name: "David",
  age: 28
};

function introduce(greeting, punctuation) {
  console.log(greeting + ", 我是 " + this.name + punctuation);
}

// bind 返回一个新函数，this 绑定到 person
var boundIntroduce = introduce.bind(person);

boundIntroduce("Hello", "!"); // "Hello, 我是 David!"

// bind 还可以预设参数（部分应用）
var sayHello = introduce.bind(person, "你好");
sayHello("！"); // "你好, 我是 David！"

// 实际应用：修复 this 指向问题
var obj = {
  name: "Object",
  items: [1, 2, 3],
  // 问题：forEach 回调中的 this 不是 obj
  printItemsWrong: function() {
    this.items.forEach(function(item) {
      console.log(this.name + ": " + item); // this 指向全局对象
    });
  },
  // 解决方案1：使用 bind
  printItemsBind: function() {
    this.items.forEach(function(item) {
      console.log(this.name + ": " + item);
    }.bind(this)); // 绑定 this 到 obj
  },
  // 解决方案2：使用箭头函数
  printItemsArrow: function() {
    this.items.forEach((item) => {
      console.log(this.name + ": " + item); // this 指向 obj
    });
  },
  // 解决方案3：保存 this
  printItemsSelf: function() {
    var self = this;
    this.items.forEach(function(item) {
      console.log(self.name + ": " + item);
    });
  }
};

obj.printItemsBind();   // 正确输出
obj.printItemsArrow();  // 正确输出
obj.printItemsSelf();   // 正确输出
```

### 2.4 new 绑定（Constructor Binding）

使用 `new` 关键字调用构造函数时，`this` 指向新创建的对象。

```javascript
/**
 * new 操作符做了什么：
 * 1. 创建一个新对象
 * 2. 将新对象的 __proto__ 指向构造函数的 prototype
 * 3. 将 this 绑定到新对象
 * 4. 执行构造函数
 * 5. 如果构造函数返回对象，则返回该对象；否则返回新对象
 */

function Person(name, age) {
  // this 指向新创建的对象
  this.name = name;
  this.age = age;

  // 如果返回对象，则返回该对象
  // return { custom: "object" };

  // 如果返回原始值，则忽略，仍然返回新对象
  // return "string";
}

var person1 = new Person("Alice", 25);
var person2 = new Person("Bob", 30);

console.log(person1.name); // "Alice"
console.log(person2.name); // "Bob"

// 手动实现 new 操作符
function myNew(constructor, ...args) {
  // 1. 创建新对象
  var obj = {};

  // 2. 设置原型链
  obj.__proto__ = constructor.prototype;

  // 3. 绑定 this 并执行构造函数
  var result = constructor.apply(obj, args);

  // 4. 返回结果（如果是对象则返回，否则返回新对象）
  return result instanceof Object ? result : obj;
}

var person3 = myNew(Person, "Charlie", 35);
console.log(person3.name); // "Charlie"
```

### 2.5 箭头函数的 this

箭头函数没有自己的 `this`，它继承外层作用域的 `this`。

```javascript
var obj = {
  name: "Object",
  // 普通函数
  regularFunction: function() {
    console.log("普通函数 this:", this.name); // "Object"

    // 内部普通函数
    setTimeout(function() {
      console.log("setTimeout 普通函数 this:", this); // Window 对象
    }, 100);

    // 内部箭头函数
    setTimeout(() => {
      console.log("setTimeout 箭头函数 this:", this.name); // "Object"
    }, 200);
  },
  // 箭头函数
  arrowFunction: () => {
    // 箭头函数的 this 继承外层作用域（这里是全局作用域）
    console.log("箭头函数 this:", this); // Window 对象
  }
};

obj.regularFunction();
obj.arrowFunction();

// 箭头函数不能作为构造函数
var ArrowConstructor = () => {
  this.name = "Test";
};
// var instance = new ArrowConstructor(); // 报错：ArrowConstructor is not a constructor

// 箭头函数没有 arguments
var regularFunc = function() {
  console.log(arguments); // 类数组对象
};

var arrowFunc = () => {
  // console.log(arguments); // 报错：arguments is not defined
};

regularFunc(1, 2, 3);
```

## 3. this 绑定优先级

```javascript
/**
 * this 绑定优先级（从高到低）：
 * 1. new 绑定
 * 2. 显式绑定（call/apply/bind）
 * 3. 隐式绑定（对象方法调用）
 * 4. 默认绑定（独立函数调用）
 */

function test() {
  console.log(this.name);
}

var obj1 = { name: "obj1" };
var obj2 = { name: "obj2" };

// 1. new 绑定优先级最高
var instance = new test(); // this 指向新创建的对象

// 2. 显式绑定
test.call(obj1); // "obj1"

// 3. 隐式绑定
obj2.test = test;
obj2.test(); // "obj2"

// 4. 默认绑定
test(); // undefined（严格模式）或全局对象（非严格模式）
```

## 4. 实际应用示例

### 4.1 事件处理中的 this

```javascript
// HTML: <button id="btn">点击我</button>

var button = document.getElementById("btn");

var handler = {
  message: "按钮被点击了",
  handleClick: function(event) {
    console.log(this.message); // "按钮被点击了"
    console.log(event.target); // button 元素
  }
};

// 直接绑定方法，this 指向 button 元素
button.addEventListener("click", handler.handleClick); // undefined（this 指向 button）

// 使用 bind 绑定 this
button.addEventListener("click", handler.handleClick.bind(handler)); // "按钮被点击了"

// 使用箭头函数
handler.handleClickArrow = (event) => {
  console.log(this.message); // undefined（this 指向全局对象）
};
```

### 4.2 类中的 this

```javascript
class Counter {
  constructor() {
    this.count = 0;
  }

  // 普通方法，this 指向实例
  increment() {
    this.count++;
    console.log(this.count);
  }

  // 箭头函数方法，this 在定义时绑定
  decrement = () => {
    this.count--;
    console.log(this.count);
  }

  // 问题：方法作为回调时 this 丢失
  setupTimerWrong() {
    setInterval(this.increment, 1000); // this 指向全局对象
  }

  // 解决方案1：使用 bind
  setupTimerBind() {
    setInterval(this.increment.bind(this), 1000); // this 指向实例
  }

  // 解决方案2：使用箭头函数
  setupTimerArrow() {
    setInterval(() => {
      this.increment(); // this 指向实例
    }, 1000);
  }

  // 解决方案3：使用箭头函数方法
  setupTimerArrowMethod() {
    setInterval(this.decrement, 1000); // this 指向实例
  }
}

var counter = new Counter();
counter.setupTimerArrow(); // 正确工作
```

### 4.3 函数柯里化

```javascript
/**
 * 使用 bind 实现函数柯里化
 * 柯里化：将多参数函数转换为单参数函数序列
 */

function multiply(a, b, c) {
  return a * b * c;
}

// 使用 bind 预设参数
var multiplyBy2 = multiply.bind(null, 2);
console.log(multiplyBy2(3, 4)); // 24 (2 * 3 * 4)

var multiplyBy2And3 = multiply.bind(null, 2, 3);
console.log(multiplyBy2And3(4)); // 24 (2 * 3 * 4)

// 通用柯里化函数
function curry(fn) {
  return function curried(...args) {
    // 如果参数数量足够，直接调用
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个新函数，等待更多参数
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

var curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4));     // 24
console.log(curriedMultiply(2, 3)(4));     // 24
console.log(curriedMultiply(2)(3, 4));     // 24
console.log(curriedMultiply(2, 3, 4));     // 24
```

### 4.4 方法借用

```javascript
/**
 * 使用 call/apply 借用其他对象的方法
 */

// 借用数组方法处理类数组对象
function printArguments() {
  // arguments 是类数组对象，没有数组方法
  // 借用 Array.prototype.slice 转换为数组
  var args = Array.prototype.slice.call(arguments);
  console.log(args.join(", "));

  // 或者使用 Array.from（ES6）
  var args2 = Array.from(arguments);
  console.log(args2.join(" - "));
}

printArguments("a", "b", "c"); // "a, b, c" 和 "a - b - c"

// 借用数组方法处理 NodeList
var divs = document.querySelectorAll("div");
var divArray = Array.prototype.map.call(divs, function(div) {
  return div.textContent;
});

// ES6 可以使用扩展运算符
var divArray2 = [...divs].map(div => div.textContent);
```

## 5. 总结

### 关键点：

1. **this 的绑定规则**：
   - 默认绑定：独立函数调用 → 全局对象/undefined
   - 隐式绑定：对象方法调用 → 调用对象
   - 显式绑定：call/apply/bind → 指定对象
   - new 绑定：构造函数调用 → 新对象

2. **call vs apply vs bind**：
   - `call`：立即调用，参数逐个传递
   - `apply`：立即调用，参数数组传递
   - `bind`：返回新函数，this 永久绑定

3. **箭头函数**：
   - 没有自己的 this，继承外层作用域
   - 不能作为构造函数
   - 不能使用 arguments

4. **最佳实践**：
   - 在类中使用箭头函数方法保持 this
   - 使用 bind 修复回调中的 this
   - 理解不同绑定规则的优先级

