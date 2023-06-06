
## 1.对象遍历
对于对象的便利 我们通常可以使用Object.keys(),Object.entries(),Object.getOwnPropertyNames(),其中Object.keys()与Object.getOwnPropertyNames()效果是一样的，但是后者可以 ==***返回不可枚举的属性名称***==

```js
const a = ['Hello', 'World'];

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
```

后者比较少用，这里只是做一个记录