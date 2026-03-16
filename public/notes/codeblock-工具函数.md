---
title: 前端实用工具函数集合
category: 前端
---



# 前端实用工具函数集合

## 1. 异步错误处理

```javascript
/**
 * try-catch 封装，优雅处理异步错误
 * @param {Promise} promise - Promise 对象
 * @returns {Array} [成功结果, 错误对象]
 */
export async function to(promise) {
  try {
    const response = await promise
    return [response, null]
  } catch (error) {
    return [null, error]
  }
}

// 使用示例
async function fetchUser() {
  const [data, err] = await to(api.getUser())
  if (err) {
    console.error('获取用户失败:', err)
    return
  }
  console.log('用户数据:', data)
}
```

## 2. 防抖与节流

```javascript
/**
 * 防抖函数：延迟执行，在延迟期间重复调用会重新计时
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 */
export function debounce(fn, delay = 300, immediate = false) {
  let timer = null
  
  return function (...args) {
    const context = this
    
    // 立即执行
    if (immediate && !timer) {
      fn.apply(context, args)
    }
    
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args)
      }
      timer = null
    }, delay)
  }
}

/**
 * 节流函数：固定时间间隔内只执行一次
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 时间间隔（毫秒）
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0
  let timer = null
  
  return function (...args) {
    const context = this
    const now = Date.now()
    
    if (now - lastTime >= interval) {
      fn.apply(context, args)
      lastTime = now
    } else {
      // 保证最后一次调用能执行
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
        lastTime = now
      }, interval - (now - lastTime))
    }
  }
}

// 使用示例
const handleSearch = debounce((query) => {
  console.log('搜索:', query)
}, 500)

const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY)
}, 200)
```

## 3. 深拷贝

```javascript
/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @param {WeakMap} cache - 缓存，防止循环引用
 */
export function deepClone(obj, cache = new WeakMap()) {
  // 基本类型和 null/undefined
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  // 循环引用检查
  if (cache.has(obj)) {
    return cache.get(obj)
  }
  
  // Date
  if (obj instanceof Date) {
    return new Date(obj)
  }
  
  // RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }
  
  // Set
  if (obj instanceof Set) {
    const cloneSet = new Set()
    cache.set(obj, cloneSet)
    obj.forEach(value => {
      cloneSet.add(deepClone(value, cache))
    })
    return cloneSet
  }
  
  // Map
  if (obj instanceof Map) {
    const cloneMap = new Map()
    cache.set(obj, cloneMap)
    obj.forEach((value, key) => {
      cloneMap.set(key, deepClone(value, cache))
    })
    return cloneMap
  }
  
  // Array
  if (Array.isArray(obj)) {
    const cloneArr = []
    cache.set(obj, cloneArr)
    obj.forEach((value, index) => {
      cloneArr[index] = deepClone(value, cache)
    })
    return cloneArr
  }
  
  // Object
  const cloneObj = Object.create(Object.getPrototypeOf(obj))
  cache.set(obj, cloneObj)
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], cache)
    }
  }
  
  return cloneObj
}

// 使用示例
const original = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  info: { city: 'Beijing' }
}
const cloned = deepClone(original)
```

## 4. 日期格式化

```javascript
/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式化模板
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const tokens = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0')
  }
  
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => tokens[match])
}

/**
 * 获取相对时间描述
 * @param {Date|string|number} date - 日期
 */
export function getRelativeTime(date) {
  const now = Date.now()
  const time = new Date(date).getTime()
  const diff = (now - time) / 1000
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`
  return `${Math.floor(diff / 31536000)}年前`
}

// 使用示例
formatDate(new Date()) // '2024-01-01 12:30:45'
formatDate(Date.now(), 'YYYY/MM/DD') // '2024/01/01'
getRelativeTime(Date.now() - 3600000) // '1小时前'
```

## 5. 数字格式化

```javascript
/**
 * 格式化数字（千分位）
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数
 */
export function formatNumber(num, decimals = 2) {
  if (isNaN(num)) return '0'
  
  return Number(num).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${units[i]}`
}

/**
 * 数字转中文
 * @param {number} num - 数字
 */
export function numberToChinese(num) {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
  
  if (num === 0) return '零'
  
  let result = ''
  let unitIndex = 0
  
  while (num > 0) {
    const digit = num % 10
    if (digit !== 0) {
      result = digits[digit] + units[unitIndex] + result
    } else if (result[0] !== '零') {
      result = '零' + result
    }
    num = Math.floor(num / 10)
    unitIndex++
  }
  
  return result.replace(/零+$/, '').replace(/零{2,}/g, '零')
}

// 使用示例
formatNumber(1234567.89) // '1,234,567.89'
formatFileSize(1234567) // '1.18 MB'
numberToChinese(12345) // '一万二千三百四十五'
```

## 6. 数组处理

```javascript
/**
 * 数组去重
 * @param {Array} arr - 数组
 * @param {string} key - 对象数组的唯一键
 */
export function unique(arr, key) {
  if (!Array.isArray(arr)) return []
  
  if (key) {
    const map = new Map()
    return arr.filter(item => {
      const value = item[key]
      return !map.has(value) && map.set(value, 1)
    })
  }
  
  return [...new Set(arr)]
}

/**
 * 数组扁平化
 * @param {Array} arr - 数组
 * @param {number} depth - 扁平化深度
 */
export function flatten(arr, depth = Infinity) {
  if (!Array.isArray(arr)) return []
  return arr.flat(depth)
}

/**
 * 数组分组
 * @param {Array} arr - 数组
 * @param {string|Function} key - 分组键或函数
 */
export function groupBy(arr, key) {
  if (!Array.isArray(arr)) return {}
  
  const fn = typeof key === 'function' ? key : (item) => item[key]
  
  return arr.reduce((groups, item) => {
    const groupKey = fn(item)
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {})
}

/**
 * 数组排序
 * @param {Array} arr - 数组
 * @param {string} key - 排序键
 * @param {string} order - 'asc' 或 'desc'
 */
export function sortBy(arr, key, order = 'asc') {
  if (!Array.isArray(arr)) return []
  
  return [...arr].sort((a, b) => {
    const valueA = typeof key === 'function' ? key(a) : a[key]
    const valueB = typeof key === 'function' ? key(b) : b[key]
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1
    if (valueA > valueB) return order === 'asc' ? 1 : -1
    return 0
  })
}

// 使用示例
unique([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]
unique([{id: 1}, {id: 2}, {id: 1}], 'id') // [{id: 1}, {id: 2}]
flatten([1, [2, [3, [4]]]]) // [1, 2, 3, 4]
groupBy([{type: 'A'}, {type: 'B'}, {type: 'A'}], 'type')
// { A: [{type: 'A'}, {type: 'A'}], B: [{type: 'B'}] }
sortBy([{age: 20}, {age: 18}], 'age') // [{age: 18}, {age: 20}]
```

## 7. 对象处理

```javascript
/**
 * 对象深比较
 * @param {*} obj1 - 对象1
 * @param {*} obj2 - 对象2
 */
export function isEqual(obj1, obj2) {
  // 基本类型比较
  if (obj1 === obj2) return true
  
  // null 或 undefined
  if (obj1 == null || obj2 == null) return false
  
  // 类型不同
  if (typeof obj1 !== typeof obj2) return false
  
  // 引用类型
  if (typeof obj1 !== 'object') return false
  
  // 数组比较
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false
    return obj1.every((item, index) => isEqual(item, obj2[index]))
  }
  
  // 对象比较
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  return keys1.every(key => isEqual(obj1[key], obj2[key]))
}

/**
 * 对象扁平化
 * @param {Object} obj - 对象
 * @param {string} separator - 分隔符
 */
export function flattenObject(obj, separator = '.') {
  const result = {}
  
  function flatten(current, prefix = '') {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key
        
        if (typeof current[key] === 'object' && 
            current[key] !== null && 
            !Array.isArray(current[key])) {
          flatten(current[key], newKey)
        } else {
          result[newKey] = current[key]
        }
      }
    }
  }
  
  flatten(obj)
  return result
}

/**
 * 对象属性剔除
 * @param {Object} obj - 对象
 * @param {Array} keys - 要剔除的键
 */
export function omit(obj, keys) {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

/**
 * 对象属性选择
 * @param {Object} obj - 对象
 * @param {Array} keys - 要选择的键
 */
export function pick(obj, keys) {
  const result = {}
  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  })
  return result
}

// 使用示例
isEqual({a: 1, b: 2}, {a: 1, b: 2}) // true
flattenObject({a: {b: {c: 1}}}) // {'a.b.c': 1}
omit({a: 1, b: 2, c: 3}, ['b', 'c']) // {a: 1}
pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
```

## 8. URL 和查询参数

```javascript
/**
 * 解析 URL 参数
 * @param {string} url - URL 字符串
 */
export function parseQuery(url) {
  const queryString = url ? url.split('?')[1] : window.location.search.slice(1)
  if (!queryString) return {}
  
  const query = {}
  const pairs = queryString.split('&')
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=')
    query[decodeURIComponent(key)] = decodeURIComponent(value || '')
  })
  
  return query
}

/**
 * 对象转查询字符串
 * @param {Object} obj - 参数对象
 */
export function stringifyQuery(obj) {
  if (!obj || typeof obj !== 'object') return ''
  
  return Object.keys(obj)
    .map(key => {
      const value = obj[key]
      if (value === null || value === undefined) return ''
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .filter(Boolean)
    .join('&')
}

/**
 * 获取 URL 参数
 * @param {string} name - 参数名
 */
export function getQueryParam(name) {
  const query = parseQuery(window.location.href)
  return query[name]
}

/**
 * 添加 URL 参数
 * @param {string} url - URL
 * @param {Object} params - 参数对象
 */
export function addQueryParams(url, params) {
  const query = parseQuery(url)
  const newQuery = { ...query, ...params }
  const queryString = stringifyQuery(newQuery)
  const [baseUrl] = url.split('?')
  return `${baseUrl}?${queryString}`
}

// 使用示例
parseQuery('https://example.com?a=1&b=2') // {a: '1', b: '2'}
stringifyQuery({a: 1, b: 2}) // 'a=1&b=2'
getQueryParam('id') // 获取当前页面 URL 的 id 参数
addQueryParams('https://example.com', {a: 1}) // 'https://example.com?a=1'
```

## 9. 本地存储

```javascript
/**
 * localStorage 封装
 */
export const storage = {
  /**
   * 获取存储项
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  /**
   * 设置存储项
   * @param {string} key - 键
   * @param {*} value - 值
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  /**
   * 删除存储项
   * @param {string} key - 键
   */
  remove(key) {
    localStorage.removeItem(key)
  },
  
  /**
   * 清空存储
   */
  clear() {
    localStorage.clear()
  }
}

/**
 * sessionStorage 封装
 */
export const sessionStorage = {
  get(key, defaultValue = null) {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  
  clear() {
    window.sessionStorage.clear()
  }
}

// 使用示例
storage.set('user', { name: 'John', age: 30 })
const user = storage.get('user')
storage.remove('user')
```

## 10. 表单验证

```javascript
/**
 * 验证规则集合
 */
export const validators = {
  /**
   * 验证邮箱
   */
  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  },
  
  /**
   * 验证手机号（中国大陆）
   */
  phone(value) {
    const regex = /^1[3-9]\d{9}$/
    return regex.test(value)
  },
  
  /**
   * 验证身份证号
   */
  idCard(value) {
    const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return regex.test(value)
  },
  
  /**
   * 验证 URL
   */
  url(value) {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    return regex.test(value)
  },
  
  /**
   * 验证是否为空
   */
  required(value) {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return value !== null && value !== undefined && value !== ''
  },
  
  /**
   * 验证最小长度
   */
  minLength(value, length) {
    return String(value).length >= length
  },
  
  /**
   * 验证最大长度
   */
  maxLength(value, length) {
    return String(value).length <= length
  },
  
  /**
   * 验证数字范围
   */
  range(value, min, max) {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
  },
  
  /**
   * 验证是否为数字
   */
  number(value) {
    return !isNaN(Number(value))
  },
  
  /**
   * 验证密码强度
   */
  password(value) {
    // 至少8位，包含大小写字母和数字
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return regex.test(value)
  }
}

/**
 * 表单验证
 * @param {Object} data - 表单数据
 * @param {Object} rules - 验证规则
 */
export function validate(data, rules) {
  const errors = {}
  
  for (const field in rules) {
    const value = data[field]
    const fieldRules = rules[field]
    
    for (const rule of fieldRules) {
      // 必填验证
      if (rule.required && !validators.required(value)) {
        errors[field] = rule.message || '此项为必填项'
        break
      }
      
      // 自定义验证器
      if (rule.validator && typeof rule.validator === 'function') {
        const result = rule.validator(value, data)
        if (result !== true) {
          errors[field] = result
          break
        }
      }
      
      // 内置验证器
      if (rule.type && validators[rule.type]) {
        if (!validators[rule.type](value, ...rule.params || [])) {
          errors[field] = rule.message || `${field}格式不正确`
          break
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// 使用示例
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { type: 'minLength', params: [6], message: '密码至少6位' }
  ]
}

const { isValid, errors } = validate(formData, rules)
```

## 11. DOM 操作

```javascript
/**
 * 获取元素样式
 * @param {HTMLElement} element - DOM 元素
 * @param {string} property - CSS 属性
 */
export function getStyle(element, property) {
  return window.getComputedStyle(element)[property]
}

/**
 * 添加类名
 * @param {HTMLElement} element - DOM 元素
 * @param {string} className - 类名
 */
export function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className)
  } else {
    element.className += ` ${className}`
  }
}

/**
 * 移除类名
 * @param {HTMLElement} element - DOM 元素
 * @param {string} className - 类名
 */
export function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className)
  } else {
    element.className = element.className.replace(
      new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
      ' '
    )
  }
}

/**
 * 判断是否有类名
 * @param {HTMLElement} element - DOM 元素
 * @param {string} className - 类名
 */
export function hasClass(element, className) {
  if (element.classList) {
    return element.classList.contains(className)
  }
  return new RegExp(`(^| )${className}( |$)`, 'gi').test(element.className)
}

/**
 * 获取滚动位置
 */
export function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  }
}

/**
 * 平滑滚动到指定位置
 * @param {number} top - 目标位置
 * @param {number} duration - 动画时长
 */
export function smoothScroll(top = 0, duration = 500) {
  const start = window.pageYOffset
  const distance = top - start
  const startTime = performance.now()
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = easeInOutCubic(progress)
    
    window.scrollTo(0, start + distance * ease)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// 使用示例
const position = getScrollPosition()
smoothScroll(0, 800) // 滚动到顶部
```

## 12. 其他实用函数

```javascript
/**
 * 延迟执行
 * @param {number} ms - 毫秒数
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

/**
 * 生成 UUID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} chars - 字符集
 */
export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 颜色转换：RGB 转 HEX
 * @param {number} r - 红色值
 * @param {number} g - 绿色值
 * @param {number} b - 蓝色值
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * 颜色转换：HEX 转 RGB
 * @param {string} hex - 十六进制颜色
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * 设备类型检测
 */
export function getDeviceType() {
  const ua = navigator.userAgent
  
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua) || /ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}

/**
 * 浏览器信息检测
 */
export function getBrowserInfo() {
  const ua = navigator.userAgent
  
  if (/chrome/i.test(ua)) return 'Chrome'
  if (/safari/i.test(ua)) return 'Safari'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/edge/i.test(ua)) return 'Edge'
  if (/msie|trident/i.test(ua)) return 'IE'
  
  return 'Unknown'
}

/**
 * 判断是否为空
 * @param {*} value - 任意值
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// 使用示例
await sleep(1000) // 延迟1秒
await copyToClipboard('Hello World') // 复制到剪贴板
generateUUID() // 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
randomString(16) // 'aB3dE5fG7hI9jK1l'
rgbToHex(255, 0, 0) // '#ff0000'
getDeviceType() // 'desktop'
isEmpty({}) // true
```

## 13. 函数组合

```javascript
/**
 * 函数组合：从左到右
 */
export function pipe(...fns) {
  return function (x) {
    return fns.reduce((acc, fn) => fn(acc), x)
  }
}

/**
 * 函数组合：从右到左
 */
export function compose(...fns) {
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x)
  }
}

/**
 * 柯里化
 * @param {Function} fn - 函数
 */
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs))
    }
  }
}

/**
 * 记忆化
 * @param {Function} fn - 函数
 */
export function memoize(fn) {
  const cache = new Map()
  
  return function (...args) {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// 使用示例
const add = (a, b, c) => a + b + c
const curriedAdd = curry(add)
curriedAdd(1)(2)(3) // 6

const memoizedFib = memoize(function fib(n) {
  if (n < 2) return n
  return memoizedFib(n - 1) + memoizedFib(n - 2)
})
```



