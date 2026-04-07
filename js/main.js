/**
 * 主逻辑模块
 * 包含轮播图、搜索、页面渲染等公共功能
 */
const App = (function() {
    'use strict';

    // DOM 工具函数
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    /**
     * 初始化应用
     */
    function init() {
        updateCartCount();
        updateUserMenu();
        initPageSpecific();
    }

    /**
     * 更新购物车数量显示
     */
    function updateCartCount() {
        const countEl = $('#cartCount');
        if (countEl) {
            const count = CartModule.getCount();
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    /**
     * 更新用户菜单状态
     */
    function updateUserMenu() {
        const userMenu = $('#userMenu');
        if (!userMenu) return;

        const user = AuthModule.getUser();
        if (user) {
            userMenu.innerHTML = `
                <div class="user-avatar">${user.avatar || user.username.charAt(0).toUpperCase()}</div>
                <div class="user-dropdown">
                    <a href="user.html">个人中心</a>
                    <a href="user.html#orders">我的订单</a>
                    <a href="#" id="logoutBtn">退出登录</a>
                </div>
            `;
            $('#logoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                AuthModule.logout();
                window.location.reload();
            });
        }
    }

    /**
     * 根据页面初始化特定功能
     */
    function initPageSpecific() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1);

        switch (page) {
            case 'index.html':
            case '':
                initHomePage();
                break;
            case 'products.html':
                initProductsPage();
                break;
            case 'product.html':
                initProductPage();
                break;
            case 'cart.html':
                initCartPage();
                break;
            case 'checkout.html':
                initCheckoutPage();
                break;
            case 'login.html':
                initLoginPage();
                break;
            case 'user.html':
                initUserPage();
                break;
        }
    }

    /**
     * 初始化首页
     */
    function initHomePage() {
        renderHeroCarousel();
        renderFeaturedProducts();
        renderBrandSection();
    }

    /**
     * 渲染轮播图
     */
    function renderHeroCarousel() {
        const heroSection = $('.hero');
        if (!heroSection) return;

        const banners = [
            { id: 1, title: '春季新品上市', subtitle: '精选时尚单品', color: '#667eea' },
            { id: 2, title: '运动专区', subtitle: '释放你的活力', color: '#f093fb' },
            { id: 3, title: '箱包特惠', subtitle: '出行必备', color: '#4facfe' }
        ];

        let currentSlide = 0;
        let interval;

        heroSection.innerHTML = `
            <div class="carousel">
                <div class="carousel-inner">
                    ${banners.map((banner, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}" style="background: ${banner.color}">
                            <div class="container">
                                <h2>${banner.title}</h2>
                                <p>${banner.subtitle}</p>
                                <a href="products.html" class="btn btn-primary btn-lg">立即选购</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-prev">&lt;</button>
                <button class="carousel-next">&gt;</button>
                <div class="carousel-indicators">
                    ${banners.map((_, index) => `
                        <button class="${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                    `).join('')}
                </div>
            </div>
        `;

        const items = $$('.carousel-item');
        const indicators = $$('.carousel-indicators button');
        const prevBtn = $('.carousel-prev');
        const nextBtn = $('.carousel-next');

        function goToSlide(index) {
            items[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            currentSlide = (index + items.length) % items.length;
            items[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }

        function startAutoPlay() {
            interval = setInterval(() => goToSlide(currentSlide + 1), 4000);
        }

        function stopAutoPlay() {
            clearInterval(interval);
        }

        prevBtn?.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(currentSlide - 1);
            startAutoPlay();
        });

        nextBtn?.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(currentSlide + 1);
            startAutoPlay();
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                startAutoPlay();
            });
        });

        heroSection.addEventListener('mouseenter', stopAutoPlay);
        heroSection.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    }

    /**
     * 渲染热门商品
     */
    function renderFeaturedProducts() {
        const container = $('#featuredProducts');
        if (!container) return;

        const hotProducts = ProductData.getHotProducts(4);

        container.innerHTML = `
            <div class="container">
                <h2 class="section-title">热门商品</h2>
                <ul class="product-list">
                    ${hotProducts.map(product => createProductCard(product)).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * 渲染品牌区域
     */
    function renderBrandSection() {
        const container = $('#brandSection');
        if (!container) return;

        container.innerHTML = `
            <div class="container">
                <h2 class="section-title">品牌专区</h2>
                <div class="brand-grid">
                    <div class="brand-item">时尚优品</div>
                    <div class="brand-item">运动达人</div>
                    <div class="brand-item">经典传承</div>
                    <div class="brand-item">青春潮流</div>
                </div>
            </div>
        `;
    }

    /**
     * 创建商品卡片 HTML
     */
    function createProductCard(product) {
        const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;

        return `
            <li class="product-card">
                <a href="product.html?id=${product.id}" class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${discount > 0 ? `<span class="product-discount">${discount}%</span>` : ''}
                    ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                </a>
                <div class="product-info">
                    <h3 class="product-name">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-price">
                        <span class="price-current">¥${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="price-original">¥${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-meta">
                        <span class="product-sales">销量 ${product.sales}</span>
                        <span class="product-rating">★ ${product.rating}</span>
                    </div>
                    <button class="btn btn-primary btn-sm btn-add-cart" data-product-id="${product.id}">加入购物车</button>
                </div>
            </li>
        `;
    }

    /**
     * 初始化商品列表页
     */
    function initProductsPage() {
        renderProductList();
        initFilters();
        initSearch();
    }

    /**
     * 渲染商品列表
     */
    function renderProductList(category = 'all', sortType = 'default', keyword = '') {
        const productList = $('#productList');
        const resultCount = $('#resultCount');
        if (!productList) return;

        let products = ProductData.getAllProducts();

        // 搜索过滤
        if (keyword) {
            products = ProductData.searchProducts(keyword);
        }

        // 分类过滤
        if (category && category !== 'all') {
            products = products.filter(p => p.category === category);
        }

        // 排序
        products = ProductData.sortProducts(products, sortType);

        // 更新数量
        if (resultCount) {
            resultCount.textContent = products.length;
        }

        // 渲染列表
        if (products.length === 0) {
            productList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <h3>未找到商品</h3>
                    <p>请尝试其他搜索条件或分类</p>
                </div>
            `;
            return;
        }

        productList.innerHTML = products.map(product => createProductCard(product)).join('');

        // 绑定加入购物车事件
        $$('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = btn.dataset.productId;
                const product = ProductData.getProductById(productId);
                if (product) {
                    CartModule.add(product, 1);
                    updateCartCount();
                    showToast('已加入购物车');
                }
            });
        });
    }

    /**
     * 初始化筛选器
     */
    function initFilters() {
        const categoryFilter = $('#categoryFilter');
        const sortSelect = $('#sortSelect');

        // 分类筛选
        categoryFilter?.addEventListener('click', (e) => {
            if (e.target.matches('a')) {
                e.preventDefault();
                $$('#categoryFilter a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                const sort = $('#sortSelect')?.value || 'default';
                renderProductList(category, sort);
            }
        });

        // 排序
        sortSelect?.addEventListener('change', () => {
            const activeCategory = $('#categoryFilter a.active');
            const category = activeCategory?.dataset.category || 'all';
            renderProductList(category, sortSelect.value);
        });
    }

    /**
     * 初始化搜索
     */
    function initSearch() {
        const searchInput = $('#searchInput');
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = searchInput.value.trim();
                const activeCategory = $('#categoryFilter a.active');
                const category = activeCategory?.dataset.category || 'all';
                const sort = $('#sortSelect')?.value || 'default';
                renderProductList(category, sort, keyword);
            }
        });
    }

    /**
     * 初始化商品详情页
     */
    function initProductPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) {
            window.location.href = 'products.html';
            return;
        }

        const product = ProductData.getProductById(productId);
        if (!product) {
            $('#productDetail').innerHTML = `
                <div class="empty-state">
                    <h3>商品不存在</h3>
                    <a href="products.html" class="btn btn-primary">返回商品列表</a>
                </div>
            `;
            return;
        }

        renderProductDetail(product);
    }

    /**
     * 渲染商品详情
     */
    function renderProductDetail(product) {
        const container = $('#productDetail');
        const breadcrumb = $('#breadcrumbProduct');
        if (!container) return;

        if (breadcrumb) breadcrumb.textContent = product.name;

        const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;

        container.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-gallery">
                    <div class="gallery-main">
                        <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
                    </div>
                    <ul class="gallery-thumbs">
                        ${product.images.map((img, index) => `
                            <li class="${index === 0 ? 'active' : ''}">
                                <img src="${img}" alt="缩略图${index + 1}" data-image="${img}">
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="product-detail-info">
                    <h1 class="product-detail-name">${product.name}</h1>
                    <div class="product-detail-desc">${product.description}</div>
                    <div class="product-detail-price">
                        <span class="price-current">¥${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `
                            <span class="price-original">¥${product.originalPrice.toFixed(2)}</span>
                            <span class="badge badge-error">${discount}% 折扣</span>
                        ` : ''}
                    </div>
                    <div class="product-detail-meta">
                        <span>销量 ${product.sales}</span>
                        <span>★ ${product.rating}</span>
                        <span>库存 ${product.stock}</span>
                    </div>

                    <div class="product-options">
                        <div class="option-group">
                            <label class="option-label">颜色</label>
                            <div class="option-buttons">
                                ${product.colors.map((color, index) => `
                                    <button class="option-btn ${index === 0 ? 'active' : ''}" data-type="color" data-value="${color}">${color}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="option-group">
                            <label class="option-label">尺码</label>
                            <div class="option-buttons">
                                ${product.sizes.map((size, index) => `
                                    <button class="option-btn ${index === 0 ? 'active' : ''}" data-type="size" data-value="${size}">${size}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="option-group">
                            <label class="option-label">数量</label>
                            <div class="quantity-input">
                                <button class="qty-btn" id="qtyMinus">-</button>
                                <input type="number" value="1" min="1" max="${product.stock}" id="qtyInput">
                                <button class="qty-btn" id="qtyPlus">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="product-detail-actions">
                        <button class="btn btn-primary btn-lg" id="addToCartBtn">加入购物车</button>
                        <button class="btn btn-outline btn-lg" id="buyNowBtn">立即购买</button>
                    </div>
                </div>
            </div>
        `;

        // 绑定事件
        const selectedOptions = { color: product.colors[0], size: product.sizes[0] };
        let quantity = 1;

        // 颜色/尺码选择
        $$('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const value = btn.dataset.value;
                btn.parentElement.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedOptions[type] = value;
            });
        });

        // 数量调整
        const qtyInput = $('#qtyInput');
        $('#qtyMinus')?.addEventListener('click', () => {
            if (qtyInput.value > 1) {
                qtyInput.value = --quantity;
            }
        });
        $('#qtyPlus')?.addEventListener('click', () => {
            if (qtyInput.value < product.stock) {
                qtyInput.value = ++quantity;
            }
        });
        qtyInput?.addEventListener('change', () => {
            let val = parseInt(qtyInput.value) || 1;
            val = Math.max(1, Math.min(val, product.stock));
            qtyInput.value = val;
            quantity = val;
        });

        // 加入购物车
        $('#addToCartBtn')?.addEventListener('click', () => {
            CartModule.add(product, quantity, selectedOptions);
            updateCartCount();
            showToast('已加入购物车');
        });

        // 立即购买
        $('#buyNowBtn')?.addEventListener('click', () => {
            CartModule.add(product, quantity, selectedOptions);
            updateCartCount();
            window.location.href = 'checkout.html';
        });

        // 缩略图点击
        $$('.gallery-thumbs img').forEach(img => {
            img.addEventListener('click', () => {
                $$('.gallery-thumbs li').forEach(li => li.classList.remove('active'));
                img.parentElement.classList.add('active');
                $('#mainImage').src = img.dataset.image;
            });
        });
    }

    /**
     * 初始化购物车页面
     */
    function initCartPage() {
        renderCart();
    }

    /**
     * 渲染购物车
     */
    function renderCart() {
        const container = $('#cartContent');
        if (!container) return;

        const cartItems = CartModule.getAll();

        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <h3>购物车是空的</h3>
                    <p>快去挑选心仪的商品吧</p>
                    <a href="products.html" class="btn btn-primary">去购物</a>
                </div>
            `;
            return;
        }

        const total = CartModule.getTotal();

        container.innerHTML = `
            <div class="cart-layout">
                <div class="cart-list">
                    <div class="cart-header">
                        <label class="flex items-center gap-sm">
                            <input type="checkbox" id="selectAll" checked>
                            <span>全选</span>
                        </label>
                        <span>单价</span>
                        <span>数量</span>
                        <span>小计</span>
                        <span>操作</span>
                    </div>
                    <ul class="cart-items">
                        ${cartItems.map(item => `
                            <li class="cart-item" data-id="${item.id}" data-options='${JSON.stringify(item.options)}'>
                                <label>
                                    <input type="checkbox" class="item-checkbox" checked>
                                </label>
                                <div class="cart-item-info">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div>
                                        <a href="product.html?id=${item.id}">${item.name}</a>
                                        <p class="cart-item-options">${item.options.color || ''} ${item.options.size || ''}</p>
                                    </div>
                                </div>
                                <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                                <div class="cart-item-quantity">
                                    <button class="qty-btn update-qty" data-action="minus">-</button>
                                    <input type="number" value="${item.quantity}" min="1" class="qty-value">
                                    <button class="qty-btn update-qty" data-action="plus">+</button>
                                </div>
                                <div class="cart-item-subtotal">¥${(item.price * item.quantity).toFixed(2)}</div>
                                <button class="btn-text cart-item-remove">删除</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>商品总价</span>
                        <span id="cartSubtotal">¥${total.toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>运费</span>
                        <span>¥0.00</span>
                    </div>
                    <div class="cart-summary-row total">
                        <span>应付总额</span>
                        <span id="cartTotal">¥${total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary btn-lg btn-block" id="checkoutBtn">去结算</button>
                    <button class="btn-text btn-block" id="clearCartBtn">清空购物车</button>
                </div>
            </div>
        `;

        // 绑定事件
        $$('.update-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const li = btn.closest('.cart-item');
                const id = li.dataset.id;
                const options = JSON.parse(li.dataset.options || '{}');
                let qty = parseInt(li.querySelector('.qty-value').value);

                if (btn.dataset.action === 'plus') {
                    qty++;
                } else {
                    qty--;
                }

                if (qty > 0) {
                    CartModule.update(id, qty, options);
                    renderCart();
                }
            });
        });

        $$('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const li = btn.closest('.cart-item');
                const id = li.dataset.id;
                const options = JSON.parse(li.dataset.options || '{}');
                CartModule.remove(id, options);
                updateCartCount();
                renderCart();
            });
        });

        $('#clearCartBtn')?.addEventListener('click', () => {
            if (confirm('确定要清空购物车吗？')) {
                CartModule.clear();
                updateCartCount();
                renderCart();
            }
        });

        $('#checkoutBtn')?.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    /**
     * 初始化结算页面
     */
    function initCheckoutPage() {
        const cartItems = CartModule.getAll();

        if (cartItems.length === 0) {
            $('#cartContent')?.classList.add('empty-state');
            return;
        }

        renderCheckoutOrder();
        initCheckoutEvents();
    }

    /**
     * 渲染结算订单
     */
    function renderCheckoutOrder() {
        const cartItems = CartModule.getAll();
        const orderItems = $('#orderItems');

        if (!orderItems) return;

        const subtotal = CartModule.getTotal();

        orderItems.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-options">${item.options.color || ''} ${item.options.size || ''}</span>
                </div>
                <div class="order-item-price">¥${item.price.toFixed(2)}</div>
                <div class="order-item-qty">x${item.quantity}</div>
            </div>
        `).join('');

        $('#subtotal').textContent = `¥${subtotal.toFixed(2)}`;
        $('#shippingFee').textContent = '¥0.00';
        $('#totalPrice').textContent = `¥${subtotal.toFixed(2)}`;
    }

    /**
     * 初始化结算事件
     */
    function initCheckoutEvents() {
        // 支付方式选择
        $$('.payment-method input').forEach(input => {
            input.addEventListener('change', () => {
                $$('.payment-method').forEach(m => m.classList.remove('active'));
                input.closest('.payment-method').classList.add('active');
            });
        });

        // 配送方式选择
        $$('.shipping-method input').forEach(input => {
            input.addEventListener('change', () => {
                $$('.shipping-method').forEach(m => m.classList.remove('active'));
                input.closest('.shipping-method').classList.add('active');
                // 更新运费
                const shippingFee = input.value === 'express' ? 10 : 0;
                const subtotal = CartModule.getTotal();
                $('#shippingFee').textContent = `¥${shippingFee.toFixed(2)}`;
                $('#totalPrice').textContent = `¥${(subtotal + shippingFee).toFixed(2)}`;
            });
        });

        // 提交订单
        $('#submitOrderBtn')?.addEventListener('click', () => {
            const receiverName = $('#receiverName')?.value.trim();
            const receiverPhone = $('#receiverPhone')?.value.trim();
            const addressDetail = $('#addressDetail')?.value.trim();

            if (!receiverName || !receiverPhone || !addressDetail) {
                showToast('请填写完整的收货信息');
                return;
            }

            if (!/^1[3-9]\d{9}$/.test(receiverPhone)) {
                showToast('请输入正确的手机号码');
                return;
            }

            // 创建订单
            const cartItems = CartModule.getAll();
            const shippingFee = $$('.shipping-method input:checked')[0]?.value === 'express' ? 10 : 0;
            const paymentMethod = $$('.payment-method input:checked')[0]?.value;

            const order = {
                items: cartItems,
                subtotal: CartModule.getTotal(),
                shippingFee: shippingFee,
                total: CartModule.getTotal() + shippingFee,
                receiver: {
                    name: receiverName,
                    phone: receiverPhone,
                    address: addressDetail
                },
                paymentMethod: paymentMethod,
                status: 'paid'
            };

            const result = AuthModule.saveOrder(order);

            if (result.success) {
                CartModule.clear();
                updateCartCount();
                showToast('订单提交成功！');
                setTimeout(() => {
                    window.location.href = 'user.html#orders';
                }, 1500);
            } else {
                showToast(result.message || '提交失败，请重试');
            }
        });
    }

    /**
     * 初始化登录页面
     */
    function initLoginPage() {
        const loginBox = $('#loginBox');
        const registerBox = $('#registerBox');
        const showRegister = $('#showRegister');
        const showLogin = $('#showLogin');

        showRegister?.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'none';
            registerBox.style.display = 'block';
        });

        showLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.style.display = 'block';
            registerBox.style.display = 'none';
        });

        // 登录表单
        $('#loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = $('#loginUsername')?.value.trim();
            const password = $('#loginPassword')?.value;

            if (!username || !password) {
                showToast('请输入用户名和密码');
                return;
            }

            const result = AuthModule.login(username, password);

            if (result.success) {
                showToast('登录成功！');
                setTimeout(() => {
                    window.location.href = 'user.html';
                }, 1000);
            } else {
                showToast(result.message);
            }
        });

        // 注册表单
        $('#registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = $('#regUsername')?.value.trim();
            const phone = $('#regPhone')?.value.trim();
            const password = $('#regPassword')?.value;
            const confirmPassword = $('#regConfirmPassword')?.value;
            const agreeTerms = $('#agreeTerms')?.checked;

            if (!agreeTerms) {
                showToast('请同意用户协议和隐私政策');
                return;
            }

            const result = AuthModule.register({
                username,
                phone,
                password,
                confirmPassword
            });

            if (result.success) {
                showToast('注册成功！');
                setTimeout(() => {
                    window.location.href = 'user.html';
                }, 1000);
            } else {
                showToast(result.message);
            }
        });
    }

    /**
     * 初始化用户中心
     */
    function initUserPage() {
        const user = AuthModule.getUser();
        const guestEl = $('#userGuest');
        const dashboardEl = $('#userDashboard');

        if (!user) {
            guestEl.style.display = 'block';
            dashboardEl.style.display = 'none';
            return;
        }

        guestEl.style.display = 'none';
        dashboardEl.style.display = 'flex';

        // 填充用户信息
        $('#userAvatar').textContent = user.avatar || user.username.charAt(0).toUpperCase();
        $('#userName').textContent = user.username;
        $('#settingsUsername').value = user.username;
        $('#settingsPhone').value = user.phone || '';
        $('#settingsEmail').value = user.email || '';

        // Tab 切换
        $$('.user-nav-item[data-tab]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;

                $$('.user-nav-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                $$('.user-section').forEach(s => s.style.display = 'none');
                $(`#${tab}Section`).style.display = 'block';

                if (tab === 'orders') {
                    renderOrderList();
                }
            });
        });

        // 退出登录
        $('#logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            AuthModule.logout();
            window.location.reload();
        });

        // 渲染订单
        renderOrderList();

        // 订单状态 Tab
        $$('.order-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.order-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderOrderList(tab.dataset.status);
            });
        });
    }

    /**
     * 渲染订单列表
     */
    function renderOrderList(status = 'all') {
        const orderList = $('#orderList');
        if (!orderList) return;

        let orders = AuthModule.getOrders();

        if (status !== 'all') {
            orders = orders.filter(o => o.status === status);
        }

        if (orders.length === 0) {
            orderList.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <h3>暂无订单</h3>
                    <a href="products.html" class="btn btn-primary">去购物</a>
                </div>
            `;
            return;
        }

        const statusMap = {
            pending: { text: '待支付', class: 'badge-warning' },
            paid: { text: '已支付', class: 'badge-primary' },
            shipped: { text: '已发货', class: 'badge-primary' },
            completed: { text: '已完成', class: 'badge-success' }
        };

        orderList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-card-header">
                    <span class="order-id">订单号：${order.id}</span>
                    <span class="badge ${statusMap[order.status]?.class || ''}">${statusMap[order.status]?.text || order.status}</span>
                </div>
                <div class="order-card-items">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <img src="${item.image}" alt="${item.name}">
                            <span class="order-product-name">${item.name}</span>
                            <span class="order-product-price">¥${item.price.toFixed(2)}</span>
                            <span class="order-product-qty">x${item.quantity}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-card-footer">
                    <span class="order-total">合计：¥${order.total.toFixed(2)}</span>
                    ${order.status === 'pending' ? `<button class="btn btn-primary btn-sm pay-order-btn" data-order-id="${order.id}">去支付</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * 显示提示信息
     */
    function showToast(message) {
        // 移除已存在的 toast
        $('.toast')?.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);

    return {
        updateCartCount,
        updateUserMenu,
        showToast,
        createProductCard
    };
})();
