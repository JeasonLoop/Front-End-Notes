## 最新状态

正常我们为在使用react-hook的时候使用最多的应该是useState,但是在某些应用场景下，我们需要拿到更新完毕的state的最新的值

我们直接看一个对比代码

```js
import React, { useEffect, useState, useRef } from 'react'

export default function Demo() {
  const [count, setcount] = useState(0);
  const refCount = useRef(0);

  return (
    <div>
      <button onClick={() => {
        setcount(count + 1)
        console.log('count更新后的值', count); 
      }}>点击</button>
      <button onClick={() => {
        refCount.current++
        console.log('refCount更新后的值', refCount.current); 
      }}>ref点击</button>
      {count}-{refCount.current}
    </div>
  )
}
```

点击按钮1，我们可以看到log是在setCount之后执行的，但是这个时候却没有输出最新的值，如果我们需要在setCount之后做一些对于最新值的处理的话，这样就非常不友好。

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679042069859-292d8105-35ae-457a-8bb8-1aac992cc0e6.png)

我们点击第二个按钮

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679042180767-c0d6f9b3-28c9-41ee-84a7-8ea7d5617785.png)

点击之后发生的情况跟点第一个按钮刚好相反，因为第useRef是同步的，然后组件没有刷新导致新数据没有显示到视图上，但是我们在log中已经能拿到最新更新的值了，然后我们在业务场景中就可以在change函数中使用这个技巧，把需要获取最新值的变量用ref存入，代码如下:

```js
import React, { useEffect, useState, useRef } from 'react'

export default function Demo() {
  const [count, setcount] = useState(0);
  const refCount = useRef(0);

  useEffect(() => {
    console.log(refCount.current);
  }, []);

  return (
    <div>
      <input type="text" value={count} onChange={(e) => {
         console.log(`change了${refCount.current++}次`);
      }}/>
    </div>
  )
}
```

## 旧状态

由于useRef是同步的，我们根据刚刚的例子可以用来存以前的状态值

代码如下：
```js

import React, { useEffect, useState, useRef } from 'react'

export default function Demo() {
  const [count, setcount] = useState(0);
  const refCount = useRef(0);

  useEffect(() => {
    refCount.current = count
  }, [count]);

  return (
    <div>
      <button onClick={() => {
        setcount(count + 1)
        console.log('count更新后的值', count); 
      }}>点击</button>
      <button onClick={() => {
        refCount.current++
        console.log('refCount更新后的值', refCount.current); 
      }}>ref点击</button>
      {count}-{refCount.current}
    </div>
  )
}
```

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679043152907-49e5b1d6-3005-4305-9526-7b86f6d5f6ed.png)

不过这个在技术上好像没什么毛病，我在网上的文章看见了这么一个解释

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679043270723-8fb03521-b109-4f1c-9846-7e2f52d29bab.png)

**总结：使用useRef存取变量值获取最新值最好在onChange中执行，当我们有一些逻辑或状态对值的更新要求较高，在值更新后就要立刻拿到并使用，又要求他跨生命周期，在页面更新后仍然保存值，就可以采用这种方法定义值。**