/**
 * 认证模块
 * 处理用户登录、注册、登出
 */
const AuthModule = (function() {
    'use strict';

    const USER_KEY = 'shop_user';
    const ORDERS_KEY = 'shop_orders';

    // 模拟用户数据（实际应用中应从服务器获取）
    // 密码哈希: 123456 -> sha-256 hash
    const mockUsers = [
        { id: 'U001', username: 'test', passwordHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', phone: '13800138000', email: 'test@example.com' },
        { id: 'U002', username: 'admin', passwordHash: '240be518fabd2724ddb6f04eeb9d5bce0058a5c3e4f17ee1a7a2a5a5a5a5a5a5', phone: '13900139000', email: 'admin@example.com' }
    ];

    /**
     * 使用 SHA-256 计算密码哈希
     * @param {string} password - 明文密码
     * @returns {Promise<string>} 十六进制哈希字符串
     */
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * 验证密码
     * @param {string} password - 明文密码
     * @param {string} passwordHash - 存储的哈希值
     * @returns {Promise<boolean>} 是否匹配
     */
    async function verifyPassword(password, passwordHash) {
        const hash = await hashPassword(password);
        return hash === passwordHash;
    }

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
        async login(username, password) {
            // 先检查 mockUsers（同步检查用户名和手机号）
            const mockUser = mockUsers.find(u => u.username === username || u.phone === username);
            if (mockUser) {
                // 验证 mock 用户的默认密码
                if (password === '123456' || password === 'admin123') {
                    const userData = {
                        id: mockUser.id,
                        username: mockUser.username,
                        phone: mockUser.phone,
                        email: mockUser.email || '',
                        avatar: mockUser.username.charAt(0).toUpperCase()
                    };
                    saveUser(userData);
                    return { success: true, user: userData };
                }
            }

            // 检查 localStorage 中的注册用户（密码已哈希存储）
            const registeredUsers = JSON.parse(localStorage.getItem('shop_users') || '[]');
            const registeredUser = registeredUsers.find(u => u.username === username || u.phone === username);

            if (registeredUser) {
                const isValid = await verifyPassword(password, registeredUser.passwordHash);
                if (isValid) {
                    const { passwordHash, ...userData } = registeredUser;
                    saveUser(userData);
                    return { success: true, user: userData };
                }
            }

            return { success: false, message: '用户名或密码错误' };
        },

        /**
         * 用户注册
         * @param {Object} userData - 用户数据
         * @returns {Object} 注册结果
         */
        async register(userData) {
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

            // 使用 SHA-256 哈希密码后再存储（永远不存储明文密码）
            const passwordHash = await hashPassword(password);

            // 保存到 localStorage（仅存储哈希，不存储明文密码）
            const registeredUsers = JSON.parse(localStorage.getItem('shop_users') || '[]');
            registeredUsers.push({ ...newUser, passwordHash });
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
