## ⚪业务场景1：字体加载

在管理后台配置任务或者活动需要用到外部的字体包，前端的加载方案如下
```js
  const initOptionList = () => {
   // 这里的initFontList为后端传递来的数据，从props接收
    if ( !initFontList.length ) return

    const optionList = []

	// 用来渲染select（忽略）
    initFontList.forEach( optionItem => {
      optionList.push( {
        id: optionItem.id,
        family:optionItem.family,
        value: optionItem.link,
        label: optionItem.name,
      } )

      // 载入外部字体（非全量版本）👇
      const textFontFace = new FontFace( optionItem.family, `url(${optionItem.link})` )
      textFontFace.load().then( ( loadFace ) => {
        document.fonts.add( loadFace );
      } );
    } )
    setFontOptionList( optionList )
  }
```
通过后端传递的数据进行select的渲染和预览字体的加载，正常后端会返回一个全量的字体链接和一个非全量的字体链接，非全量的字体链接一般只有字体名字的那几个字有对应的字体效果，全量则是整体的字体包。

react中常见的加载都跟fontFace有关，如果项目中需要用的字体是固定的，可以提前下载到本地然后在css中用@font-face加载，栗子如下
```css
@font-face  
{  
font-family: yourFontName;  
src: url('your font local address'),  
}


div  
{  
  font-family: yourFontName;  
}
```

如果是跟我一样需要后端返回数据的，就需要用上FontFace对象

[FontFace - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FontFace)

正常就接收前面两个参数第一个是字体名称，第二个是字体的外部链接（需要用 url('')包起来），传入之后就创建好了，然后我们执行FontFace的 load函数，他本身是个promise，所以可以用then来处理后续的操作，直接在then函数中拿到字体对象 使用document的原生方法直接添加字体，然后在对应需要加载的字体上写上同名的fontFamily就可以生效了

(目前涉及到的字体包量比较小，C端的加载上还比较无感，等后续如果需要处理大体量字体的时候再进行字库分割)

- [ ] [字库分割方案](https://juejin.cn/post/7118700280136335396)



## ⚪业务场景2：React中的页面跳转问题

有遇到如下情况，在h5或者pc页面有个按钮，按钮的功能是完成某些操作然后跳转页面或者直接跳转页面，同时在页面中有对应的计数数值，当跳转页面后计数随之变化，但是有时候我们跳转页面然后返回后，并*不会触发* react的生命周期然后触发渲染，有如下的临时解决方案

```js

useEffect(() => {
 // 直接监听页面是否可视然后进行对应的操作
  document.addEventListener('visibilitychange', () => {  
        if (document.visibilityState === 'visible') {  
          // 需要的操作/接口调用  
        }  
      });
  return () => {
  document.removeEventListener('visibilitychange')
  }
},[])

```



