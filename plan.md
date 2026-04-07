# 电商网站项目计划

## 1. 项目概述
- **项目名称**: shop-html
- **项目类型**: 静态电商网站（HTML5 + CSS3 + JavaScript，无数据库）
- **核心功能**: 商品展示、购物车、用户模拟登录、数据持久化使用 localStorage

## 2. 功能需求

### 页面结构
| 页面 | 文件 | 功能说明 |
|------|------|----------|
| 首页 | index.html | 轮播图、热门商品展示、品牌介绍 |
| 商品列表 | products.html | 商品分类筛选、价格排序、商品搜索 |
| 商品详情 | product.html | 商品图片、描述、规格参数、加入购物车 |
| 购物车 | cart.html | 数量修改、删除商品、总价计算 |
| 结算页 | checkout.html | 地址填写、支付方式模拟、订单确认 |
| 登录/注册 | login.html | 模拟用户系统（localStorage存储） |
| 用户中心 | user.html | 订单历史、收货地址管理 |

### 核心功能
- [x] 响应式布局（PC + 移动端适配）
- [x] 商品数据使用 JSON 文件模拟
- [x] 购物车功能（localStorage 持久化）
- [x] 用户登录状态管理
- [x] 商品搜索与分类筛选
- [x] 价格排序（升序/降序）
- [x] 轮播图自动切换
- [x] 模拟下单流程

## 3. 技术方案

### 技术栈
| 技术 | 用途 |
|------|------|
| HTML5 | 语义化标签、结构搭建 |
| CSS3 | 样式设计、Flexbox/Grid 布局、响应式媒体查询 |
| JavaScript (ES6+) | 交互逻辑、DOM 操作、localStorage |
| JSON | 模拟商品数据 |

### 文件结构
```
shop-html/
├── index.html          # 首页
├── products.html       # 商品列表
├── product.html        # 商品详情
├── cart.html           # 购物车
├── checkout.html       # 结算页
├── login.html          # 登录/注册
├── user.html           # 用户中心
├── css/
│   ├── reset.css       # CSS 重置
│   ├── common.css      # 公共样式（头部、底部、工具类）
│   └── style.css       # 主样式文件
├── js/
│   ├── data.js         # 商品 JSON 数据
│   ├── cart.js         # 购物车逻辑
│   ├── auth.js         # 登录认证逻辑
│   └── main.js         # 主逻辑（轮播、搜索等）
└── images/             # 图片资源目录
```

### 数据模拟
- 商品数据存储在 `js/data.js` 中
- 使用 localStorage 模拟数据库存储：
  - `localStorage.cart` - 购物车数据
  - `localStorage.user` - 用户信息
  - `localStorage.orders` - 订单历史

## 4. 实现步骤

### Phase 1: 基础架构
1. 创建目录结构
2. 编写 HTML 骨架（公共头部、底部）
3. CSS _RESET 和公共样式

### Phase 2: 首页
4. 轮播图组件
5. 热门商品展示
6. 品牌展示区

### Phase 3: 商品功能
7. 商品列表页（筛选、排序）
8. 商品详情页
9. 搜索功能

### Phase 4: 交易功能
10. 购物车功能
11. 结算流程
12. 订单确认

### Phase 5: 用户系统
13. 登录/注册页面
14. 用户中心
15. 订单历史

## 5. 验收标准
- 所有页面可正常打开，无 404 资源
- 购物车增删改查功能正常
- 刷新页面后购物车数据不丢失
- 响应式布局在 375px - 1920px 宽度下正常显示
