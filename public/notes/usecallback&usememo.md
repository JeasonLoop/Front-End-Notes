最近在重构公司的类组件项目，同时也在进行hook的重新学习，useCallback 与 useMemo是hook中针对渲染以及缓存的两个内置hooks，主要的功能是对函数和计算结果进行缓存来判断是否需要重新渲染。

**useCallback**

缓存一个函数，我们可以想象这样子的业务场景，有一个父组件和子组件，父组件向子组件传递了一个函数

```jsx
const Father = () => {
   const [parentState,setParentState] = useState(0);  //父组件的state
    
    //需要传入子组件的函数
    const toChildFun = () => {
        console.log("需要传入子组件的函数");
        ...
    }
    
    return (<div>
          <button onClick={() => setParentState(val => val+1)}>
              点击我改变父组件中与Child组件无关的state
          </button>
          //将父组件的函数传入子组件
          <Child fun={toChildFun}></Child>
          )

};


/**被memo保护的子组件**/
const Child = memo(() => {
    consolo.log("我被打印了就说明子组件重新构建了")
    return <div><div>
}
```

当我们点击父组件的按钮时候，虽然memo会把子组件保护起来，但是因为传递了函数还是会重新渲染，然后我们修改一下

```jsx
const Father = () => {
   const [parentState,setParentState] = useState(0);  //父组件的state
    
    //需要传入子组件的函数,包上useCallback
    const toChildFun = useCallBack(() => {
        console.log("需要传入子组件的函数");
        ...
    },[])
    
    return (<div>
          <button onClick={() => setParentState(val => val+1)}>
              点击我改变父组件中与Child组件无关的state
          </button>
          //将父组件的函数传入子组件
          <Child fun={toChildFun}></Child>
          )

};


/**被memo保护的子组件**/
const Child = memo(() => {
    consolo.log("我被打印了就说明子组件重新构建了")
    return <div><div>
}
```



这个时候再点击父组件的按钮，子组件就不会重新渲染了，useCallback的本质其实就是返回旧的函数的地址，不生成新的函数的内存地址，减少渲染量，我们只需要使用useCallBack保护一下父组件中传入子组件的那个函数（toChildFun函数）**保证它不会在没有必要的情况下返回一个新的内存地址就好了。** 然后useCallback的依赖是用来判断是否要返回新函数地址的，依赖改变，函数地址改变，这样可以做一些其他的业务

**useMemo**

缓存一个计算结果 ，我们可是试想这么一个业务场景，在父组件调用了一个接口返回了一个数据列表。子组件需要依赖于这个数据列表做select下拉列表的渲染。

```jsx
const Father = () => {
   
  // 项目中用的dva 这边简单写一下
  const getStudentList = name => {
    dispatch( {
      type: 'home/getStudentList',
      payload: {
        name,
      },
    } );
  };
    
    return (
          //将父组件的函数传入子组件
          <Child fun={toChildFun}></Child>
          )

};

export defalt connect()( Father )

const Son = (props) => {
  const { studentList } = props

  const studentOption = useMemo(()=>{
  return (
    <div>
      {studentList.map(info => (
        <Option value={String(info.code)} key={info.code}>
          {info.name}
        </Option>
      ))}
    </div>
  )
  
  },[studentList])
  

  return (
    <Select style={{ width: '75%' }}>
      {studentOption}
    </Select>
  )
};

const mapProps = ({ home }) => ({
  studentList: home.studentList,
});

export default connect(mapProps)(Son)
```