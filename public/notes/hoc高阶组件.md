### 基本概念

- 函数可以作为参数被传递
- 函数可以作为返回值输出

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679016379011-c178e25e-41ff-49b6-8497-2399e5082977.png)

本质是利用一个函数，该函数接受react组件，并返回一个新的组件，一个组件经过一个函数以后成为了一个具有新的业务逻辑的组件

const NewComponent = higherOrderComponent(oldComponent) 复制代码

- 高阶组件就是接受一个组件作为参数并返回一个新组件的函数
- **高阶组件是一个函数，并不是组件**

![](https://cdn.nlark.com/yuque/0/2023/png/32650608/1679016409579-6cfabd07-1614-4414-8187-9066c4eaeea7.png)

尝试先写一个HOC：

```jsx
function HOC(Component) {
  return class wrapComponent extends React.Component{
     constructor(){
       super()
       this.state={
         name:'alien'
       }
     }
     render=()=><Component { ...this.props } { ...this.state } />
  }
}

@HOC
class Index extends React.Component{
  say(){
    const { name } = this.props
    console.log(name)
  }
  render(){
    return <div> hello,world <button onClick={ this.say.bind(this) } >点击</button>  </div>
  }
}
```

**高阶组件解决的问题**

**① 复用逻辑：**

高阶组件更像是一个加工react组件的工厂，批量对原有组件进行**加工**，**包装**处理。我们可以根据业务需求定制化专属的HOC,这样可以解决复用逻辑。

**② 强化props：**

这个是HOC最常用的用法之一，高阶组件返回的组件，可以劫持上一层传过来的props,然后混入新的props,来增强组件的功能。代表作react-router中的withRouter。

**③ 赋能组件：**

HOC有一项独特的特性，就是可以给被HOC包裹的业务组件，提供一些拓展功能，比如说**额外的生命周期，额外的事件**，但是这种HOC，可能需要和业务组件紧密结合。典型案例react-keepalive-router中的 keepaliveLifeCycle就是通过HOC方式，给业务组件增加了额外的生命周期。

**④ 控制渲染：**

劫持渲染是hoc一个特性，在wrapComponent包装组件中，可以对原来的组件，进行条件渲染，节流渲染，懒加载等功能，后面会详细讲解，典型代表做react-redux中connect和 dva中 dynamic 组件懒加载。

### Usage

#### 装饰器模式和函数包裹模式

对于`class`声明的有状态组件，我们可以用装饰器模式，对类组件进行包装：

```jsx
@withStyles(styles)
@withRouter
@keepaliveLifeCycle
class Index extends React.Component{
    /* ... */
}
```

**我们要注意一下包装顺序，越靠近**`**Index**`**组件的，就是越内层的**`**HOC**`**,离组件**`**Index**`**也就越近。**

对于无状态组件(函数声明）我们可以这么写：

```jsx
function Index(){
    /* .... */
}
export default withStyles(styles)(withRouter( keepaliveLifeCycle(Index) ))
```

### 模型：嵌套HOC

对于不需要传递参数的`HOC`，我们编写模型我们只需要嵌套一层就可以，比如`withRouter`,

```jsx
function withRouter(){
    return class wrapComponent extends React.Component{
        /* 编写逻辑 */
    }
}

```
对于需要参数的`HOC`，我们需要一层代理，如下：

```jsx
function connect (mapStateToProps){
    /* 接受第一个参数 */
    return function connectAdvance(wrapCompoent){
        /* 接受组件 */
        return class WrapComponent extends React.Component{  }
    }
}
```

### 正向属性代理 & 反向组件继承

#### ⚪正向属性代理

所谓正向属性代理，就是用组件包裹一层代理组件，在代理组件上，我们可以做一些，对源组件的代理操作。在`fiber tree` 上，先`mounted`代理组件，然后才是我们的业务组件。我们可以理解为父子组件关系，父组件对子组件进行一系列强化操作。

```jsx
function HOC(WrapComponent){
    return class Advance extends React.Component{
       state={
           name:'alien'
       }
       render(){
           return <WrapComponent  { ...this.props } { ...this.state }  />
       }
    }
}

```
#### 优点

- ① 正常属性代理可以和业务组件低耦合，零耦合，对于`条件渲染`和`props属性增强`,只负责控制子组件渲染和传递额外的`props`就可以，所以无须知道，业务组件做了些什么。所以正向属性代理，更适合做一些开源项目的`hoc`，目前开源的`HOC`基本都是通过这个模式实现的。
- ② 同样适用于`class`声明组件，和`function`声明的组件。
- ③ 可以完全隔离业务组件的渲染,相比反向继承，属性代理这种模式。可以完全控制业务组件渲染与否，可以避免`反向继承`带来一些副作用，比如生命周期的执行。
- ④ 可以嵌套使用，多个`hoc`是可以嵌套使用的，而且一般不会限制包装`HOC`的先后顺序。

#### 缺点

- ① 一般无法直接获取业务组件的状态，如果想要获取，需要`ref`获取组件实例。
- ② 无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库。

#### ⚪ 反向继承

反向继承和属性代理有一定的区别，在于包装后的组件继承了业务组件本身，所以我们我无须在去实例化我们的业务组件。当前高阶组件就是继承后，加强型的业务组件。这种方式类似于组件的强化。

```jsx
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
function HOC(Component){
    return class wrapComponent extends Component{ /* 直接继承需要包装的组件 */

    }
}
export default HOC(Index)
```

#### 优点

- ① 方便获取组件内部状态，比如`state`，`props` ,生命周期,绑定的事件函数等
- ② `es6`继承可以良好继承静态属性。我们无须对静态属性和方法进行额外的处理。

```jsx
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
Index.say = function(){
  console.log('my name is alien')
}
function HOC(Component) {
  return class wrapComponent extends Component{
  }
}
const newIndex =  HOC(Index) 
console.log(newIndex.say)
```

#### 缺点

- ① 无状态组件无法使用。
- ② 和被包装的组件强耦合，需要知道被包装的组件的内部状态，具体是做什么？
- ③ 如果多个反向继承`hoc`嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个`componentDidMount`，当前`componentDidMount`会覆盖上一个`componentDidMount`。这样副作用串联起来，影响很大。

### ⚪ 应用场景

#### 有状态组件 - 属性代理

```jsx
function classHOC(WrapComponent){
    return class  Idex extends React.Component{
        state={
            name:'alien'
        }
        componentDidMount(){
           console.log('HOC')
        }
        render(){
            return <WrapComponent { ...this.props }  { ...this.state }   />
        }
    }
}
function Index(props){
  const { name } = props
  useEffect(()=>{
     console.log( 'index' )
  },[])
  return <div>
    hello,world , my name is { name }
  </div>
}

// 用classHOC混入了新的state，在高阶组件函数中我们可以看到多了个state,最终这个state中的name
// 可以在Index中被取到
export default classHOC(Index)

同样也适用与无状态组件。

function functionHoc(WrapComponent){
    return function Index(props){
        const [ state , setState ] = useState({ name :'alien'  })       
        return  <WrapComponent { ...props }  { ...state }   />
    }
}
```

### 抽离state控制更新

高阶组件可以将`HOC`的`state`的配合起来，控制业务组件的更新。这种用法在`react-redux`中`connect`高阶组件中用到过，用于处理来自`redux`中`state`更改，带来的订阅更新作用。

我们将上述代码进行改造。

```jsx
function classHOC(WrapComponent){
  return class  Idex extends React.Component{
      constructor(){
        super()
        this.state={
          name:'alien'
        }
      }
      changeName(name){
        this.setState({ name })
      }
      render(){
          return <WrapComponent { ...this.props }  { ...this.state } changeName={this.changeName.bind(this)  }  />
      }
  }
}
function Index(props){
  const [ value ,setValue ] = useState(null)
  const { name ,changeName } = props
  return <div>
    <div>   hello,world , my name is { name }</div>
    改变name <input onChange={ (e)=> setValue(e.target.value)  }  />
    <button onClick={ ()=>  changeName(value) }  >确定</button>
  </div>
}

export default classHOC(Index)
```