/**
 * 购物车模块
 * 使用 localStorage 实现数据持久化
 */
const CartModule = (function() {
    'use strict';

    const STORAGE_KEY = 'shop_cart';

    // 私有方法：从 localStorage 获取购物车数据
    function getCart() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('读取购物车数据失败:', e);
            return [];
        }
    }

    // 私有方法：保存购物车数据到 localStorage
    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.error('保存购物车数据失败:', e);
        }
    }

    // 公共接口
    return {
        /**
         * 添加商品到购物车
         * @param {Object} product - 商品对象
         * @param {number} quantity - 数量
         * @param {Object} options - 规格选项（如颜色、尺寸）
         */
        add(product, quantity = 1, options = {}) {
            const cart = getCart();
            const existingIndex = cart.findIndex(item =>
                item.id === product.id &&
                item.options.size === options.size &&
                item.options.color === options.color
            );

            if (existingIndex > -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    options: options,
                    maxStock: product.stock
                });
            }

            saveCart(cart);
            return cart;
        },

        /**
         * 从购物车移除商品
         * @param {string} productId - 商品ID
         * @param {Object} options - 规格选项
         */
        remove(productId, options = {}) {
            let cart = getCart();
            cart = cart.filter(item =>
                !(item.id === productId &&
                  item.options.size === options.size &&
                  item.options.color === options.color)
            );
            saveCart(cart);
            return cart;
        },

        /**
         * 更新商品数量
         * @param {string} productId - 商品ID
         * @param {number} quantity - 新数量
         * @param {Object} options - 规格选项
         */
        update(productId, quantity, options = {}) {
            const cart = getCart();
            const item = cart.find(item =>
                item.id === productId &&
                item.options.size === options.size &&
                item.options.color === options.color
            );

            if (item) {
                if (quantity <= 0) {
                    return this.remove(productId, options);
                }
                item.quantity = Math.min(quantity, item.maxStock || 99);
            }

            saveCart(cart);
            return cart;
        },

        /**
         * 清空购物车
         */
        clear() {
            saveCart([]);
            return [];
        },

        /**
         * 获取购物车所有商品
         */
        getAll() {
            return getCart();
        },

        /**
         * 获取购物车商品总数
         */
        getCount() {
            const cart = getCart();
            return cart.reduce((total, item) => total + item.quantity, 0);
        },

        /**
         * 计算购物车总价
         */
        getTotal() {
            const cart = getCart();
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        /**
         * 检查商品是否在购物车中
         * @param {string} productId - 商品ID
         */
        exists(productId) {
            const cart = getCart();
            return cart.some(item => item.id === productId);
        }
    };
})();
