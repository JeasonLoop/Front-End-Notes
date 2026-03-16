## async/await、promise和setTimeout的执行顺序

``` js
async function async1() {
  console.log('async1 start');//2
  await async2();
  console.log('asnyc1 end');//6
}
async function async2() {
  console.log('async2');//3
}
console.log('script start'); //1
setTimeout(() => {
  console.log('setTimeOut');//8
}, 0);
async1();
new Promise(function (reslove) {
  console.log('promise1');//4
  reslove();
}).then(function () {
  console.log('promise2');//7
})
console.log('script end');//5
```

``` 
// 我们会得到如下输出
script start
async1 start
async2
promise1
script end
asnyc1 end
promise2
setTimeOut
```



## JS中EventLoop的事件循环机制

### 事件分类

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679907692018-0c260d11-7204-4c35-8859-882ccd7cede5.png)

### 事件执行顺序

事件的执行顺序，是先执行宏任务，然后执行微任务，这个是基础，任务可以有同步任务和异步任务，同步的进入主线程，异步的进入Event Table并注册函数，异步事件完成后，会将回调函数放入Event Queue中(宏任务和微任务是不同的Event Queue)，同步任务执行完成后，会从Event Queue中读取事件放入主线程执行，回调函数中可能还会包含不同的任务，因此会循环执行上述操作。

**注意**：setTimeOut并不是直接的把你的回掉函数放进上述的异步队列中去，而是在定时器的时间到了之后，把回掉函数放到执行异步队列中去。如果此时这个队列已经有很多任务了，那就排在他们的后面。这也就解释了为什么setTimeOut为什么不能精准的执行的问题了。setTimeOut执行需要满足两个条件：

1. 主进程必须是空闲的状态，如果到时间了，主进程不空闲也不会执行你的回调函数
2. 这个回调函数需要等到插入异步队列时前面的异步函数都执行完了，才会执行

### **promise、async/await**

首先，new Promise是同步的任务，会被放到主进程中去立即执行。而.then()函数是异步任务会放到异步队列中去，那什么时候放到异步队列中去呢？当你的promise状态结束的时候，就会立即放进异步队列中去了。

带 ***async*** 关键字的函数会返回一个 ***promise对象*** ，如果里面没有await，执行起来等同于普通函数；如果没有await，async函数并没有很厉害是不是。

await 关键字要在 async 关键字函数的内部，await 写在外面会报错；await如同他的语意，就是在等待，等待右侧的表达式完成。此时的await会让出线程，阻塞async内后续的代码，先去执行async外的代码。等外面的同步代码执行完毕，才会执行里面的后续代码。就算await的不是promise对象，是一个同步函数，也会等这样操作。

  
  

最终的执行具体过程

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679908536072-0632b464-d53e-4cd3-8eb6-70ffbd9af8d4.png)

在第4步中， await 这里有一个机制， 就是 await 的等待， 不会阻塞外部函数的执行， 而 await 等待的 如果是一个 Promise 则 Promise 里面的代码还是同步执行， 如果不是 Promise ，就会使用 Promise.resolve 来进行封装， 这里的 async2 是一个 async 方法， 里面的 打印会同步执行， 而 await async2() 后面的代码 会放到微任务队列中的第一个位置，等待外部同步代码执行完毕以后再执行。

所以我知道了script end为什么会优先于async1 end输出