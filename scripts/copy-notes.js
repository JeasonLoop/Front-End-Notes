const fs = require('fs');
const path = require('path');

// 笔记文件列表
const notesFiles = [
  // JavaScript
  { source: '前端/JS/01-闭包和作用域.md', target: 'js-01-closures.md' },
  { source: '前端/JS/02-this绑定和上下文.md', target: 'js-02-this.md' },
  { source: '前端/JS/03-原型和继承.md', target: 'js-03-prototype.md' },
  { source: '前端/JS/04-异步编程详解.md', target: 'js-04-async.md' },
  { source: '前端/JS/05-事件循环和并发.md', target: 'js-05-eventloop.md' },
  { source: '前端/JS/06-函数式编程.md', target: 'js-06-functional.md' },
  { source: '前端/JS/07-ES6+新特性详解.md', target: 'js-07-es6.md' },
  { source: '前端/JS/08-元编程和反射.md', target: 'js-08-metaprogramming.md' },
  { source: '前端/JS/09-设计模式.md', target: 'js-09-patterns.md' },
  { source: '前端/JS/10-内存管理和性能优化.md', target: 'js-10-performance.md' },
  { source: '前端/JS/11-模块化和打包.md', target: 'js-11-modules.md' },
  { source: '前端/JS/12-错误处理和调试.md', target: 'js-12-error.md' },
  // Vue
  { source: '前端/Vue/01-基础入门.md', target: 'vue-01-basics.md' },
  { source: '前端/Vue/02-组件系统.md', target: 'vue-02-components.md' },
  { source: '前端/Vue/03-响应式原理.md', target: 'vue-03-reactive.md' },
  { source: '前端/Vue/04-Composition-API.md', target: 'vue-04-composition.md' },
  { source: '前端/Vue/05-路由管理.md', target: 'vue-05-router.md' },
  { source: '前端/Vue/06-状态管理.md', target: 'vue-06-state.md' },
  { source: '前端/Vue/07-最佳实践.md', target: 'vue-07-bestpractices.md' },
  // React
  { source: '前端/React/01-基础入门.md', target: 'react-01-basics.md' },
  { source: '前端/React/02-Hooks.md', target: 'react-02-hooks.md' },
  { source: '前端/React/03-状态管理.md', target: 'react-03-state.md' },
  { source: '前端/React/04-路由管理.md', target: 'react-04-router.md' },
  { source: '前端/React/05-性能优化.md', target: 'react-05-performance.md' },
  { source: '前端/React/06-最佳实践.md', target: 'react-06-bestpractices.md' },
  // Go
  { source: '后端/Go/!MOC-Go.md', target: 'go-01-intro.md' },
  { source: '后端/Go/01-基础入门/安装与环境配置.md', target: 'go-02-install.md' },
  { source: '后端/Go/01-基础入门/基础语法.md', target: 'go-03-syntax.md' },
  { source: '后端/Go/01-基础入门/数据类型与变量.md', target: 'go-04-types.md' },
  { source: '后端/Go/01-基础入门/控制结构.md', target: 'go-05-control.md' },
  { source: '后端/Go/01-基础入门/函数.md', target: 'go-06-function.md' },
  { source: '后端/Go/01-基础入门/接口.md', target: 'go-07-interface.md' },
  { source: '后端/Go/01-基础入门/结构体与方法.md', target: 'go-08-struct.md' },
  { source: '后端/Go/02-核心特性/Goroutine-协程.md', target: 'go-09-goroutine.md' },
  { source: '后端/Go/02-核心特性/Channel-通道.md', target: 'go-10-channel.md' },
  { source: '后端/Go/02-核心特性/Select-语句.md', target: 'go-11-select.md' },
  { source: '后端/Go/03-Web开发/HTTP-服务基础.md', target: 'go-12-http.md' },
  { source: '后端/Go/03-Web开发/Gin-框架.md', target: 'go-13-gin.md' },
  { source: '后端/Go/05-企业架构/微服务基础.md', target: 'go-14-microservices.md' },
  // Java
  { source: '后端/Java/!MOC-Java.md', target: 'java-01-intro.md' },
  { source: '后端/Java/01-基础入门/安装与环境配置.md', target: 'java-02-install.md' },
  { source: '后端/Java/01-基础入门/基础语法.md', target: 'java-03-syntax.md' },
  { source: '后端/Java/01-基础入门/数据类型与变量.md', target: 'java-04-types.md' },
  { source: '后端/Java/01-基础入门/控制结构.md', target: 'java-05-control.md' },
  { source: '后端/Java/01-基础入门/函数与方法.md', target: 'java-06-function.md' },
  { source: '后端/Java/01-基础入门/数组与字符串.md', target: 'java-07-array.md' },
  { source: '后端/Java/01-基础入门/异常处理.md', target: 'java-08-exception.md' },
  { source: '后端/Java/01-基础入门/IO流.md', target: 'java-09-io.md' },
  { source: '后端/Java/02-面向对象/类与对象.md', target: 'java-10-oop.md' },
  { source: '后端/Java/02-面向对象/继承与多态.md', target: 'java-11-inheritance.md' },
  { source: '后端/Java/02-面向对象/接口与抽象类.md', target: 'java-12-interface.md' },
  { source: '后端/Java/02-面向对象/内部类.md', target: 'java-13-inner.md' },
  { source: '后端/Java/02-面向对象/枚举.md', target: 'java-14-enum.md' },
  { source: '后端/Java/03-高级特性/集合-List.md', target: 'java-15-list.md' },
  { source: '后端/Java/07-数据库操作/JDBC基础.md', target: 'java-16-jdbc.md' },
  { source: '后端/Java/07-数据库操作/MyBatis入门.md', target: 'java-17-mybatis.md' },
];

const rootDir = process.cwd();
const targetDir = path.join(rootDir, 'public', 'notes');

// 创建目标目录
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('复制笔记文件...');

let successCount = 0;
let failCount = 0;

notesFiles.forEach(({ source, target }) => {
  const sourcePath = path.join(rootDir, source);
  const targetPath = path.join(targetDir, target);

  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ ${target}`);
      successCount++;
    } else {
      console.log(`✗ 源文件不存在: ${source}`);
      failCount++;
    }
  } catch (err) {
    console.log(`✗ 复制失败 ${source}: ${err.message}`);
    failCount++;
  }
});

console.log(`\n完成: ${successCount} 成功, ${failCount} 失败`);
