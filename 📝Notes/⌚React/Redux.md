## 使用 react-redux

首先在最外层容器中，把所有内容包裹在 `Provider` 组件中，将之前创建的 `store` 作为 `prop` 传给 `Provider`。
```jsx

const App = () => {
  return (
    <Provider store={store}>
      <Comp/>
    </Provider>
  )
};

```
`Provider` 内的任何一个组件（比如这里的 `Comp`），如果需要使用 `state` 中的数据，就必须是「被 connect 过的」组件——使用 `connect` 方法对「你编写的组件（`MyComp`）」进行包装后的产物。

```jsx
class MyComp extends Component {
  // content...
}

const Comp = connect(...args)(MyComp);
```

可见，`connect` 方法是重中之重。

## connect 详解

究竟 `connect` 方法到底做了什么，我们来一探究竟。

首先看下函数的签名：

```js
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

`connect()` 接收四个参数，它们分别是 `mapStateToProps`，`mapDispatchToProps`，`mergeProps`和`options`。

### 3.1. mapStateToProps(state, ownProps) : stateProps

这个函数允许我们将 `store` 中的数据作为 `props` 绑定到组件上。

```js
const mapStateToProps = (state) => {
  return {
    count: state.count
  }
}
```

这个函数的第一个参数就是 Redux 的 `store`，我们从中摘取了 `count` 属性。因为返回了具有 `count`属性的对象，所以 `MyComp` 会有名为 `count` 的 `props` 字段。

![](https://flowus.cn/preview/b55816eb-17f1-419d-9107-031b5db2dacd)

```jsx
class MyComp extends Component {
  render(){
    return <div>计数：{this.props.count}次</div>
  }
}
const Comp = connect(...args)(MyComp);

```


当然，你不必将 `state` 中的数据原封不动地传入组件，可以根据 `state` 中的数据，动态地输出组件需要的（最小）属性。

```jsx
const mapStateToProps = (state) => {
  return {
    greaterThanFive: state.count > 5
  }
}
```

函数的第二个参数 `ownProps`，是 `MyComp` 自己的 `props`。有的时候，`ownProps` 也会对其产生影响。比如，当你在 `store` 中维护了一个用户列表，而你的组件 `MyComp` 只关心一个用户（通过 `props` 中的 `userId` 体现）。

```jsx
const mapStateToProps = (state, ownProps) => {
  // state 是 {userList: [{id: 0, name: '王二'}]}
  return {
    user: _.find(state.userList, {id: ownProps.userId})
  }
}

class MyComp extends Component {

  static PropTypes = {
    userId: PropTypes.string.isRequired,
    user: PropTypes.object
  };

  render(){
    return <div>用户名：{this.props.user.name}</div>
  }
}

const Comp = connect(mapStateToProps)(MyComp);
```

当 `state` 变化，或者 `ownProps` 变化的时候，`mapStateToProps` 都会被调用，计算出一个新的 `stateProps`，（在与 `ownProps` merge 后）更新给 `MyComp`。

这就是将 Redux `store` 中的数据连接到组件的基本方式。

### 3.2. mapDispatchToProps(dispatch, ownProps): dispatchProps

`connect` 的第二个参数是 `mapDispatchToProps`，它的功能是，将 action 作为 `props` 绑定到 `MyComp`上。

```jsx
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increase: (...args) => dispatch(actions.increase(...args)),
    decrease: (...args) => dispatch(actions.decrease(...args))
  }
}

class MyComp extends Component {
  render(){
    const {count, increase, decrease} = this.props;
    return (<div>
      <div>计数：{this.props.count}次</div>
      <button onClick={increase}>增加</button>
      <button onClick={decrease}>减少</button>
      </div>)
  }
}

const Comp = connect(mapStateToProps， mapDispatchToProps)(MyComp);
```

由于 `mapDispatchToProps` 方法返回了具有 `increase` 属性和 `decrease` 属性的对象，这两个属性也会成为 `MyComp` 的 `props`。

如上所示，调用 `actions.increase()` 只能得到一个 `action` 对象 `{type:'INCREASE'}`，要触发这个 `action` 必须在 `store` 上调用 `dispatch` 方法。`diapatch` 正是 `mapDispatchToProps` 的第一个参数。但是，为了不让 `MyComp` 组件感知到 `dispatch` 的存在，我们需要将 `increase` 和 `decrease` 两个函数包装一下，使之成为直接可被调用的函数（即，调用该方法就会触发 `dispatch`）。

Redux 本身提供了 `bindActionCreators` 函数，来将 action 包装成直接可被调用的函数。

```jsx
import {bindActionCreators} from 'redux';

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    increase: action.increase,
    decrease: action.decrease
  });
}
```

同样，当 `ownProps` 变化的时候，该函数也会被调用，生成一个新的 `dispatchProps`，（在与 `statePrope` 和 `ownProps` merge 后）更新给 `MyComp`。注意，`action` 的变化不会引起上述过程，默认 `action` 在组件的生命周期中是固定的。

### 3.3. [mergeProps(stateProps, dispatchProps, ownProps): props]

之前说过，不管是 `stateProps` 还是 `dispatchProps`，都需要和 `ownProps` merge 之后才会被赋给 `MyComp`。`connect` 的第三个参数就是用来做这件事。通常情况下，你可以不传这个参数，`connect` 就会使用 `Object.assign` 替代该方法。