import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "JeasonLoop's Notes",
  description: "前端 & 后端技术笔记，记录成长之路",
  lang: 'zh-CN',

  // GitHub Pages 部署时需要设置 base（仓库名）
  base: '/Front-End-Notes/',

  head: [
    ['link', { rel: 'icon', href: '/Front-End-Notes/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: "JeasonLoop's Notes",

    // 顶部导航
    nav: [
      { text: '🏠 首页', link: '/' },
      {
        text: '🌐 前端',
        items: [
          { text: 'JavaScript', link: '/前端/JS/01-闭包和作用域' },
          { text: 'React', link: '/前端/React/01-基础入门' },
          { text: 'Vue', link: '/前端/Vue/01-基础入门' },
        ]
      },
      {
        text: '⚙️ 后端',
        items: [
          { text: 'Go', link: '/后端/Go/01-基础入门/Go-简介与特点' },
          { text: 'Java', link: '/后端/Java/01-基础入门/Java-简介与特点' },
          { text: 'NestJS', link: '/Nest/01-快速开始' },
        ]
      },
      { text: '📝 随记', link: '/Notes/🐸技术课程收集' },
      { text: '🛠️ 工具函数', link: '/CodeBlock/工具函数' },
      { text: '🖥️ 服务器', link: '/服务器/Docker部署前端项目教程' },
    ],

    // 侧边栏
    sidebar: {
      // ===== 前端 JS =====
      '/前端/JS/': [
        {
          text: 'JavaScript 深度解析',
          collapsed: false,
          items: [
            { text: '01 - 闭包和作用域', link: '/前端/JS/01-闭包和作用域' },
            { text: '02 - this绑定和上下文', link: '/前端/JS/02-this绑定和上下文' },
            { text: '03 - 原型和继承', link: '/前端/JS/03-原型和继承' },
            { text: '04 - 异步编程详解', link: '/前端/JS/04-异步编程详解' },
            { text: '05 - 事件循环和并发', link: '/前端/JS/05-事件循环和并发' },
            { text: '06 - 函数式编程', link: '/前端/JS/06-函数式编程' },
            { text: '07 - ES6+ 新特性详解', link: '/前端/JS/07-ES6+新特性详解' },
            { text: '08 - 元编程和反射', link: '/前端/JS/08-元编程和反射' },
            { text: '09 - 设计模式', link: '/前端/JS/09-设计模式' },
            { text: '10 - 内存管理和性能优化', link: '/前端/JS/10-内存管理和性能优化' },
            { text: '11 - 模块化和打包', link: '/前端/JS/11-模块化和打包' },
            { text: '12 - 错误处理和调试', link: '/前端/JS/12-错误处理和调试' },
          ]
        }
      ],

      // ===== 前端 React =====
      '/前端/React/': [
        {
          text: 'React 全面指南',
          collapsed: false,
          items: [
            { text: '01 - 基础入门', link: '/前端/React/01-基础入门' },
            { text: '02 - Hooks', link: '/前端/React/02-Hooks' },
            { text: '03 - 状态管理', link: '/前端/React/03-状态管理' },
            { text: '04 - 路由管理', link: '/前端/React/04-路由管理' },
            { text: '05 - 性能优化', link: '/前端/React/05-性能优化' },
            { text: '06 - 最佳实践', link: '/前端/React/06-最佳实践' },
          ]
        }
      ],

      // ===== 前端 Vue =====
      '/前端/Vue/': [
        {
          text: 'Vue 3 完全指南',
          collapsed: false,
          items: [
            { text: '01 - 基础入门', link: '/前端/Vue/01-基础入门' },
            { text: '02 - 组件系统', link: '/前端/Vue/02-组件系统' },
            { text: '03 - 响应式原理', link: '/前端/Vue/03-响应式原理' },
            { text: '04 - Composition API', link: '/前端/Vue/04-Composition-API' },
            { text: '05 - 路由管理', link: '/前端/Vue/05-路由管理' },
            { text: '06 - 状态管理', link: '/前端/Vue/06-状态管理' },
            { text: '07 - 最佳实践', link: '/前端/Vue/07-最佳实践' },
          ]
        }
      ],

      // ===== 后端 Go =====
      '/后端/Go/': [
        {
          text: 'Go 语言学习路线',
          link: '/后端/Go/!MOC-Go',
        },
        {
          text: '01 - 基础入门',
          collapsed: false,
          items: [
            { text: 'Go 简介与特点', link: '/后端/Go/01-基础入门/Go-简介与特点' },
            { text: '安装与环境配置', link: '/后端/Go/01-基础入门/安装与环境配置' },
            { text: '基础语法', link: '/后端/Go/01-基础入门/基础语法' },
            { text: '数据类型与变量', link: '/后端/Go/01-基础入门/数据类型与变量' },
            { text: '控制结构', link: '/后端/Go/01-基础入门/控制结构' },
            { text: '函数', link: '/后端/Go/01-基础入门/函数' },
            { text: '结构体与方法', link: '/后端/Go/01-基础入门/结构体与方法' },
            { text: '接口', link: '/后端/Go/01-基础入门/接口' },
            { text: '包与模块', link: '/后端/Go/01-基础入门/包与模块' },
          ]
        },
        {
          text: '02 - 核心特性',
          collapsed: true,
          items: [
            { text: 'Goroutine 协程', link: '/后端/Go/02-核心特性/Goroutine-协程' },
            { text: 'Channel 通道', link: '/后端/Go/02-核心特性/Channel-通道' },
            { text: 'Select 语句', link: '/后端/Go/02-核心特性/Select-语句' },
            { text: '同步原语', link: '/后端/Go/02-核心特性/同步原语' },
            { text: '错误处理机制', link: '/后端/Go/02-核心特性/错误处理机制' },
          ]
        },
        {
          text: '03 - Web 开发',
          collapsed: true,
          items: [
            { text: 'HTTP 服务基础', link: '/后端/Go/03-Web开发/HTTP-服务基础' },
            { text: 'Gin 框架', link: '/后端/Go/03-Web开发/Gin-框架' },
            { text: '路由处理', link: '/后端/Go/03-Web开发/路由处理' },
            { text: '中间件', link: '/后端/Go/03-Web开发/中间件' },
          ]
        },
      ],

      // ===== 后端 Java =====
      '/后端/Java/': [
        {
          text: 'Java 学习路线',
          link: '/后端/Java/!MOC-Java',
        },
        {
          text: '01 - 基础入门',
          collapsed: false,
          items: [
            { text: 'Java 简介与特点', link: '/后端/Java/01-基础入门/Java-简介与特点' },
            { text: '安装与环境配置', link: '/后端/Java/01-基础入门/安装与环境配置' },
            { text: '基础语法', link: '/后端/Java/01-基础入门/基础语法' },
            { text: '数据类型与变量', link: '/后端/Java/01-基础入门/数据类型与变量' },
            { text: '控制结构', link: '/后端/Java/01-基础入门/控制结构' },
            { text: '函数与方法', link: '/后端/Java/01-基础入门/函数与方法' },
            { text: '数组与字符串', link: '/后端/Java/01-基础入门/数组与字符串' },
            { text: '异常处理', link: '/后端/Java/01-基础入门/异常处理' },
            { text: 'IO流', link: '/后端/Java/01-基础入门/IO流' },
          ]
        },
        {
          text: '02 - 面向对象',
          collapsed: true,
          items: [
            { text: '类与对象', link: '/后端/Java/02-面向对象/类与对象' },
            { text: '继承与多态', link: '/后端/Java/02-面向对象/继承与多态' },
            { text: '接口与抽象类', link: '/后端/Java/02-面向对象/接口与抽象类' },
            { text: '枚举', link: '/后端/Java/02-面向对象/枚举' },
            { text: '内部类', link: '/后端/Java/02-面向对象/内部类' },
          ]
        },
        {
          text: '03 - 高级特性',
          collapsed: true,
          items: [
            { text: '集合 - List', link: '/后端/Java/03-高级特性/集合-List' },
          ]
        },
        {
          text: '07 - 数据库操作',
          collapsed: true,
          items: [
            { text: 'JDBC 基础', link: '/后端/Java/07-数据库操作/JDBC基础' },
            { text: 'MyBatis 入门', link: '/后端/Java/07-数据库操作/MyBatis入门' },
          ]
        },
      ],

      // ===== NestJS =====
      '/Nest/': [
        {
          text: 'NestJS 完全指南',
          collapsed: false,
          items: [
            { text: '01 - 快速开始', link: '/Nest/01-快速开始' },
            { text: '02 - 核心概念', link: '/Nest/02-核心概念' },
            { text: '03 - 依赖注入', link: '/Nest/03-依赖注入' },
            { text: '04 - 中间件', link: '/Nest/04-中间件' },
            { text: '05 - 异常处理', link: '/Nest/05-异常处理' },
            { text: '06 - 管道', link: '/Nest/06-管道' },
            { text: '07 - 守卫', link: '/Nest/07-守卫' },
            { text: '08 - 拦截器', link: '/Nest/08-拦截器' },
            { text: '09 - TypeORM 集成', link: '/Nest/09-TypeORM集成' },
            { text: '10 - MongoDB 集成', link: '/Nest/10-MongoDB集成' },
            { text: '11 - RESTful API', link: '/Nest/11-RESTful-API' },
            { text: '12 - WebSocket', link: '/Nest/12-WebSocket' },
            { text: '13 - 微服务', link: '/Nest/13-微服务' },
            { text: '14 - 认证授权', link: '/Nest/14-认证授权' },
            { text: '15 - 文件上传', link: '/Nest/15-文件上传' },
            { text: '16 - 项目结构', link: '/Nest/16-项目结构' },
            { text: '17 - 配置管理', link: '/Nest/17-配置管理' },
            { text: '18 - 测试', link: '/Nest/18-测试' },
            { text: '19 - 部署', link: '/Nest/19-部署' },
          ]
        }
      ],

      // ===== 随记 Notes =====
      '/Notes/': [
        {
          text: '📝 随手笔记',
          items: [
            { text: '🐸 技术课程收集', link: '/Notes/🐸技术课程收集' },
          ]
        },
        {
          text: '⌚ React 进阶',
          collapsed: false,
          items: [
            { text: 'Diff 算法', link: '/Notes/React/Diff' },
            { text: 'HOC 高阶组件', link: '/Notes/React/HOC高阶组件' },
            { text: 'Redux', link: '/Notes/React/Redux' },
            { text: 'useCallback & useMemo', link: '/Notes/React/useCallBack&useMemo' },
            { text: 'useRef 存取状态', link: '/Notes/React/useRef存取状态' },
          ]
        },
        {
          text: '🍂 原生 JS',
          collapsed: false,
          items: [
            { text: 'JS 基础&高级语法笔记', link: '/Notes/原生JS/JS基础&高级语法笔记' },
            { text: '原型链解析', link: '/Notes/原生JS/原型链解析' },
            { text: '同步异步函数', link: '/Notes/原生JS/同步异步函数' },
          ]
        },
        {
          text: '💿 计算机网络',
          collapsed: false,
          items: [
            { text: 'HTTP & HTTPS', link: '/Notes/计算机网络/HTTP&HTTPS' },
            { text: 'TCP 三次握手', link: '/Notes/计算机网络/TCP三次握手' },
            { text: '浏览器工作原理', link: '/Notes/计算机网络/浏览器工作原理' },
            { text: '浏览器缓存', link: '/Notes/计算机网络/浏览器缓存' },
            { text: '访问 URL 的背后', link: '/Notes/计算机网络/访问URL的背后' },
            { text: 'BOM 属性对象方法', link: '/Notes/计算机网络/BOM属性对象方法' },
          ]
        },
      ],

      // ===== 工具函数 =====
      '/CodeBlock/': [
        {
          text: '🛠️ 代码库',
          items: [
            { text: '工具函数', link: '/CodeBlock/工具函数' },
          ]
        }
      ],

      // ===== 服务器 =====
      '/服务器/': [
        {
          text: '🖥️ 服务器运维',
          items: [
            { text: 'Docker 部署前端项目', link: '/服务器/Docker部署前端项目教程' },
          ]
        }
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JeasonLoop/Front-End-Notes' }
    ],

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present JeasonLoop'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/JeasonLoop/Front-End-Notes/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大纲
    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro'
    }
  },

  // 构建配置
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    }
  }
})
