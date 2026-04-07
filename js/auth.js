/**
 * 认证模块
 * 处理用户登录、注册、登出
 */
const AuthModule = (function() {
    'use strict';

    const USER_KEY = 'shop_user';
    const ORDERS_KEY = 'shop_orders';

    // 模拟用户数据（实际应用中应从服务器获取）
    const mockUsers = [
        { id: 'U001', username: 'test', password: '123456', phone: '13800138000', email: 'test@example.com' },
        { id: 'U002', username: 'admin', password: 'admin123', phone: '13900139000', email: 'admin@example.com' }
    ];

    // 私有方法：获取当前用户
    function getCurrentUser() {
        try {
            const data = localStorage.getItem(USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('读取用户数据失败:', e);
            return null;
        }
    }

    // 私有方法：保存用户
    function saveUser(user) {
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (e) {
            console.error('保存用户数据失败:', e);
        }
    }

    // 公共接口
    return {
        /**
         * 用户登录
         * @param {string} username - 用户名或手机号
         * @param {string} password - 密码
         * @returns {Object} 登录结果
         */
        login(username, password) {
            // 模拟登录验证
            const user = mockUsers.find(u =>
                (u.username === username || u.phone === username) && u.password === password
            );

            if (user) {
                // 检查 localStorage 是否有注册用户
                const registeredUsers = JSON.parse(localStorage.getItem('shop_users') || '[]');
                const registeredUser = registeredUsers.find(u => u.username === username || u.phone === username);

                const userData = registeredUser || {
                    id: 'U' + Date.now(),
                    username: user.username,
                    phone: user.phone,
                    email: user.email || '',
                    avatar: user.username.charAt(0).toUpperCase()
                };

                saveUser(userData);
                return { success: true, user: userData };
            }

            return { success: false, message: '用户名或密码错误' };
        },

        /**
         * 用户注册
         * @param {Object} userData - 用户数据
         * @returns {Object} 注册结果
         */
        register(userData) {
            const { username, phone, password, confirmPassword } = userData;

            // 验证密码
            if (password !== confirmPassword) {
                return { success: false, message: '两次密码输入不一致' };
            }

            if (password.length < 6) {
                return { success: false, message: '密码长度至少6位' };
            }

            // 检查用户是否已存在
            const existingUsers = [
                ...mockUsers,
                ...JSON.parse(localStorage.getItem('shop_users') || '[]')
            ];

            if (existingUsers.some(u => u.username === username)) {
                return { success: false, message: '用户名已存在' };
            }

            if (existingUsers.some(u => u.phone === phone)) {
                return { success: false, message: '手机号已被注册' };
            }

            // 创建新用户
            const newUser = {
                id: 'U' + Date.now(),
                username: username,
                phone: phone,
                email: '',
                avatar: username.charAt(0).toUpperCase()
            };

            // 保存到 localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('shop_users') || '[]');
            registeredUsers.push({ ...newUser, password });
            localStorage.setItem('shop_users', JSON.stringify(registeredUsers));

            // 自动登录
            saveUser(newUser);

            return { success: true, user: newUser };
        },

        /**
         * 退出登录
         */
        logout() {
            localStorage.removeItem(USER_KEY);
            return { success: true };
        },

        /**
         * 获取当前用户
         */
        getUser() {
            return getCurrentUser();
        },

        /**
         * 检查是否已登录
         */
        isLoggedIn() {
            return getCurrentUser() !== null;
        },

        /**
         * 更新用户信息
         * @param {Object} userData - 用户新数据
         */
        updateProfile(userData) {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                return { success: false, message: '请先登录' };
            }

            const updatedUser = { ...currentUser, ...userData };
            saveUser(updatedUser);

            return { success: true, user: updatedUser };
        },

        /**
         * 获取用户订单
         */
        getOrders() {
            const user = getCurrentUser();
            if (!user) return [];

            const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
            return allOrders.filter(order => order.userId === user.id);
        },

        /**
         * 保存订单
         * @param {Object} order - 订单数据
         */
        saveOrder(order) {
            const user = getCurrentUser();
            if (!user) {
                return { success: false, message: '请先登录' };
            }

            const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
            const newOrder = {
                id: 'ORD' + Date.now(),
                userId: user.id,
                ...order,
                status: 'pending',
                createTime: new Date().toISOString()
            };

            allOrders.push(newOrder);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

            return { success: true, order: newOrder };
        },

        /**
         * 更新订单状态
         * @param {string} orderId - 订单ID
         * @param {string} status - 新状态
         */
        updateOrderStatus(orderId, status) {
            const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
            const order = allOrders.find(o => o.id === orderId);

            if (order) {
                order.status = status;
                localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
                return { success: true };
            }

            return { success: false, message: '订单不存在' };
        }
    };
})();
