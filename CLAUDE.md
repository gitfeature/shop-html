# HTML5 电商项目代码规范

## 1. HTML 规范

### 1.1 文档结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="网站描述">
    <title>页面标题 - 网站名</title>
    <!-- 按顺序引入 CSS -->
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- 顶部导航 -->
    <header class="site-header"></header>

    <!-- 主内容区 -->
    <main class="main-content"></main>

    <!-- 页脚 -->
    <footer class="site-footer"></footer>

    <!-- 按顺序引入 JS -->
    <script src="js/data.js"></script>
    <script src="js/cart.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

### 1.2 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | 小写字母，中划线分隔 | `product-detail.html` |
| class | 小写字母，中划线分隔 | `.product-card` |
| id | 小写字母，下划线分隔 | `id="main_content"` |
| 自定义属性 | `data-` 前缀 | `data-product-id` |

### 1.3 语义化标签
```html
<!-- 导航 -->
<nav class="navbar"></nav>

<!-- 区块 -->
<section class="banner"></section>
<article class="product-item"></article>
<aside class="sidebar"></aside>

<!-- 通用容器 -->
<div class="container"></div>
<div class="wrapper"></div>

<!-- 列表结构 -->
<ul class="product-list"></ul>
```

## 2. CSS 规范

### 2.1 样式文件结构
```css
/* ========== 1. 变量定义 ========== */
:root {
    --color-primary: #1890ff;
    --color-text: #333;
    --color-bg: #f5f5f5;
    --spacing-md: 16px;
    --border-radius: 4px;
}

/* ========== 2. 重置样式 ========== */

/* ========== 3. 公共组件 ========== */
/* 头部、底部、按钮、卡片 */

/* ========== 4. 布局类 ========== */
/* 栅格、flex 工具类 */

/* ========== 5. 页面特定样式 ========== */
/* 首页、商品列表等 */
```

### 2.2 选择器规范
```css
/* 推荐：使用 class 选择器，性能更好 */
.product-card { }
.product-card__title { }
.product-card--active { }

/* 不推荐：避免过于具体的选择器 */
div.container div.product-card ul li.item { }
```

### 2.3 响应式断点
```css
/* 移动端优先 */
/* 超小屏幕 */
@media (max-width: 575px) { }

/* 小屏幕 */
@media (min-width: 576px) { }

/* 中等屏幕 */
@media (min-width: 768px) { }

/* 大屏幕 */
@media (min-width: 992px) { }

/* 超大屏幕 */
@media (min-width: 1200px) { }
```

### 2.4 Flex 布局规范
```css
/* 常用 flex 工具类 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
```

## 3. JavaScript 规范

### 3.1 模块结构
```javascript
// ========== 购物车模块 ==========
const CartModule = (function() {
    'use strict';

    // 私有变量
    const STORAGE_KEY = 'shop_cart';

    // 私有方法
    function getCart() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    // 公共接口
    return {
        add(product, quantity) { },
        remove(productId) { },
        update(productId, quantity) { },
        clear() { },
        getAll() { }
    };
})();
```

### 3.2 命名规范
```javascript
// 变量：camelCase
const productList = [];
const totalPrice = 0;

// 常量：UPPER_SNAKE_CASE
const MAX_QUANTITY = 99;
const API_BASE_URL = 'https://api.example.com';

// 函数：动词前缀
function getCartData() { }
function updateQuantity() { }
function renderProductList() { }

// 布尔值：is/has/can 前缀
const isLoggedIn = false;
const hasDiscount = true;
```

### 3.3 DOM 操作
```javascript
// 推荐：封装 DOM 查询
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 使用
const btn = $('#add-cart-btn');
const items = $$('.product-item');
```

### 3.4 localStorage 操作
```javascript
// 封装存储操作
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};
```

### 3.5 事件处理
```javascript
// 推荐：事件委托
$('.product-list').addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.btn-add-cart')) {
        const productId = target.dataset.productId;
        CartModule.add(productId);
    }
});

// 推荐：解绑时使用具名函数（便于移除）
function handleClick() { }
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick);
```

### 3.6 页面间通信
```javascript
// 商品详情页：从 URL 参数获取商品 ID
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// 加入购物车后，重定向到购物车页
function addToCart(productId) {
    // ... 添加逻辑
    window.location.href = 'cart.html';
}
```

## 4. 图片资源规范
- 格式：WebP > JPEG > PNG
- 命名：`{类型}_{序号}.{后缀}`，如 `product_01.webp`、`banner_01.jpg`
- 尺寸：商品图建议 800x800px，轮播图建议 1920x600px
- 路径：`./images/` 或 `/images/`

## 5. 注释规范
```html
<!-- #region 顶部导航 -->
<header>...</header>
<!-- #endregion -->

<!-- 模块化注释 -->
<!-- 商品卡片组件 -->
<div class="product-card">...</div>
```

```css
/* ========== 商品卡片 ========== */
.product-card { }

/* 卡片标题 */
.product-card__title { }
```

```javascript
/**
 * 添加商品到购物车
 * @param {string} productId - 商品ID
 * @param {number} quantity - 数量
 */
function addToCart(productId, quantity) { }
```

## 6. SEO 规范
- 每个页面有独立的 `<title>` 和 `<meta description>`
- 使用语义化标签
- 图片添加 `alt` 属性
- 链接使用有意义的 `title` 属性
