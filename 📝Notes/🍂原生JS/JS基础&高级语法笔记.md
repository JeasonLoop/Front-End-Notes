
## 1.对象遍历
对于对象的便利 我们通常可以使用Object.keys(),Object.entries(),Object.getOwnPropertyNames(),其中Object.keys()与Object.getOwnPropertyNames()效果是一样的，但是后者可以 ==***返回不可枚举的属性名称***==

```js
const a = ['Hello', 'World'];

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
```

后者比较少用，这里只是做一个记录

## 2.JS中更为原生的深拷贝
js给我们提供了一个api - structuredClone，它可以通过结构化克隆算法创建一个给定值的深拷贝，并且还可以传输原始值的可转移对象

用法：
```js
const originalObject = {
    name: "John",
    age: 30,
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "Anystate"
    },
    date: new Date(123),
  }
const copied =structuredClone(originalObject);
```

拷贝结果：
![[Pasted image 20230609135553.png]]

⚪structuredClone不可拷贝的属性
1.函数或者方法
2.DOM节点
3.属性描述符、setter和getter
4.对象原型

⚪structuredClone允许拷贝的对象
1.JS内置对象
2.Error Type
3.Web/API 类型

支持主流浏览器，泛用性好
![[Pasted image 20230609140800.png]]

**对比JSON.parse(JSON.stringfy(x))**

1.Date对象拷贝不正确
对象如下：
![[Pasted image 20230609141135.png]]

拷贝结果对比：
![[Pasted image 20230609141213.png]]

2.部分非基本对象拷贝后为空
例如：
![[Pasted image 20230609141637.png]]

拷贝后：
![[Pasted image 20230609141709.png]]


3.无法对包含循环引用的对象进行clone
![[Pasted image 20230609141755.png]]
除上述情况外两者并没有区别