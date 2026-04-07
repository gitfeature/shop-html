/**
 * 商品数据模块
 * 包含商品列表和分类数据
 */
const ProductData = (function() {
    'use strict';

    // 商品分类
    const categories = [
        { id: 'clothing', name: '服装', icon: '👕' },
        { id: 'shoes', name: '鞋靴', icon: '👟' },
        { id: 'bags', name: '箱包', icon: '👜' },
        { id: 'accessories', name: '配饰', icon: '⌚' }
    ];

    // 商品列表
    const products = [
        {
            id: 'P001',
            name: '简约纯棉圆领T恤',
            category: 'clothing',
            price: 129.00,
            originalPrice: 199.00,
            image: 'https://picsum.photos/400/400?random=1',
            images: [
                'https://picsum.photos/400/400?random=1',
                'https://picsum.photos/400/400?random=2',
                'https://picsum.photos/400/400?random=3'
            ],
            description: '精选优质纯棉面料，透气舒适，简约圆领设计，适合日常穿着。',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['白色', '黑色', '灰色', '蓝色'],
            stock: 100,
            sales: 520,
            rating: 4.8,
            tags: ['新品', '热卖'],
            createTime: '2024-01-15'
        },
        {
            id: 'P002',
            name: '休闲运动长裤',
            category: 'clothing',
            price: 199.00,
            originalPrice: 299.00,
            image: 'https://picsum.photos/400/400?random=4',
            images: [
                'https://picsum.photos/400/400?random=4',
                'https://picsum.photos/400/400?random=5'
            ],
            description: '弹性面料，舒适透气，适合运动和日常休闲穿着。',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['黑色', '深灰色', '藏青色'],
            stock: 80,
            sales: 380,
            rating: 4.6,
            tags: ['热卖'],
            createTime: '2024-01-10'
        },
        {
            id: 'P003',
            name: '经典款真皮皮带',
            category: 'accessories',
            price: 89.00,
            originalPrice: 129.00,
            image: 'https://picsum.photos/400/400?random=6',
            images: [
                'https://picsum.photos/400/400?random=6'
            ],
            description: '优质真皮材质，经典扣头设计，耐用美观。',
            sizes: ['105cm', '110cm', '115cm', '120cm'],
            colors: ['黑色', '棕色'],
            stock: 150,
            sales: 890,
            rating: 4.9,
            tags: ['经典'],
            createTime: '2024-01-08'
        },
        {
            id: 'P004',
            name: '时尚双肩背包',
            category: 'bags',
            price: 259.00,
            originalPrice: 399.00,
            image: 'https://picsum.photos/400/400?random=7',
            images: [
                'https://picsum.photos/400/400?random=7',
                'https://picsum.photos/400/400?random=8'
            ],
            description: '大容量设计，多功能分层，防泼水面料，适合上学和旅行。',
            sizes: ['标准'],
            colors: ['黑色', '深蓝色', '灰色'],
            stock: 60,
            sales: 450,
            rating: 4.7,
            tags: ['新品'],
            createTime: '2024-01-20'
        },
        {
            id: 'P005',
            name: '轻便跑步运动鞋',
            category: 'shoes',
            price: 359.00,
            originalPrice: 499.00,
            image: 'https://picsum.photos/400/400?random=9',
            images: [
                'https://picsum.photos/400/400?random=9',
                'https://picsum.photos/400/400?random=10'
            ],
            description: '轻盈透气，缓震鞋底，提供出色的穿着舒适度。',
            sizes: ['38', '39', '40', '41', '42', '43', '44'],
            colors: ['白色', '黑色', '红色'],
            stock: 90,
            sales: 620,
            rating: 4.8,
            tags: ['热卖', '运动'],
            createTime: '2024-01-12'
        },
        {
            id: 'P006',
            name: '羊毛保暖针织衫',
            category: 'clothing',
            price: 289.00,
            originalPrice: 399.00,
            image: 'https://picsum.photos/400/400?random=11',
            images: [
                'https://picsum.photos/400/400?random=11'
            ],
            description: '优质羊毛混纺，柔软保暖，经典款式。',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['米色', '驼色', '深棕色'],
            stock: 70,
            sales: 280,
            rating: 4.5,
            tags: ['保暖'],
            createTime: '2024-01-05'
        },
        {
            id: 'P007',
            name: '商务简约手提包',
            category: 'bags',
            price: 459.00,
            originalPrice: 599.00,
            image: 'https://picsum.photos/400/400?random=12',
            images: [
                'https://picsum.photos/400/400?random=12'
            ],
            description: '简约商务风格，真皮材质，适合上班通勤。',
            sizes: ['小号', '中号', '大号'],
            colors: ['黑色', '棕色'],
            stock: 45,
            sales: 190,
            rating: 4.7,
            tags: ['商务'],
            createTime: '2024-01-18'
        },
        {
            id: 'P008',
            name: '潮流棒球帽',
            category: 'accessories',
            price: 69.00,
            originalPrice: 99.00,
            image: 'https://picsum.photos/400/400?random=13',
            images: [
                'https://picsum.photos/400/400?random=13'
            ],
            description: '经典棒球帽款式，透气网眼设计，可调节帽围。',
            sizes: ['可调节'],
            colors: ['黑色', '白色', '蓝色', '红色'],
            stock: 200,
            sales: 750,
            rating: 4.6,
            tags: ['潮流'],
            createTime: '2024-01-22'
        },
        {
            id: 'P009',
            name: '休闲板鞋',
            category: 'shoes',
            price: 229.00,
            originalPrice: 329.00,
            image: 'https://picsum.photos/400/400?random=14',
            images: [
                'https://picsum.photos/400/400?random=14',
                'https://picsum.photos/400/400?random=15'
            ],
            description: '经典板鞋款式，帆布与皮质结合，百搭时尚。',
            sizes: ['38', '39', '40', '41', '42', '43'],
            colors: ['白色', '黑色', '藏青色'],
            stock: 120,
            sales: 540,
            rating: 4.7,
            tags: ['百搭'],
            createTime: '2024-01-14'
        },
        {
            id: 'P010',
            name: '时尚连衣裙',
            category: 'clothing',
            price: 329.00,
            originalPrice: 459.00,
            image: 'https://picsum.photos/400/400?random=16',
            images: [
                'https://picsum.photos/400/400?random=16',
                'https://picsum.photos/400/400?random=17'
            ],
            description: '优雅气质连衣裙，收腰设计，适合多种场合。',
            sizes: ['S', 'M', 'L'],
            colors: ['红色', '黑色', '米色'],
            stock: 55,
            sales: 320,
            rating: 4.8,
            tags: ['新品', '优雅'],
            createTime: '2024-01-25'
        },
        {
            id: 'P011',
            name: '轻奢手拿包',
            category: 'bags',
            price: 189.00,
            originalPrice: 289.00,
            image: 'https://picsum.photos/400/400?random=18',
            images: [
                'https://picsum.photos/400/400?random=18'
            ],
            description: '精致手拿包，小巧实用，适合晚宴和聚会。',
            sizes: ['标准'],
            colors: ['金色', '银色', '黑色'],
            stock: 85,
            sales: 260,
            rating: 4.5,
            tags: ['轻奢'],
            createTime: '2024-01-16'
        },
        {
            id: 'P012',
            name: '复古太阳镜',
            category: 'accessories',
            price: 159.00,
            originalPrice: 229.00,
            image: 'https://picsum.photos/400/400?random=19',
            images: [
                'https://picsum.photos/400/400?random=19'
            ],
            description: '复古框型，UV防护镜片，时尚百搭。',
            sizes: ['标准'],
            colors: ['黑色', '棕色', '金色'],
            stock: 130,
            sales: 410,
            rating: 4.6,
            tags: ['复古'],
            createTime: '2024-01-19'
        }
    ];

    // 获取所有商品
    function getAllProducts() {
        return products;
    }

    // 根据分类获取商品
    function getProductsByCategory(category) {
        if (!category || category === 'all') {
            return products;
        }
        return products.filter(p => p.category === category);
    }

    // 根据ID获取商品
    function getProductById(id) {
        return products.find(p => p.id === id);
    }

    // 搜索商品
    function searchProducts(keyword) {
        if (!keyword) return products;
        const lowerKeyword = keyword.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerKeyword) ||
            p.description.toLowerCase().includes(lowerKeyword) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
        );
    }

    // 获取分类列表
    function getCategories() {
        return categories;
    }

    // 排序商品
    function sortProducts(productList, sortType) {
        const list = [...productList];
        switch (sortType) {
            case 'price-asc':
                return list.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return list.sort((a, b) => b.price - a.price);
            case 'sales-desc':
                return list.sort((a, b) => b.sales - a.sales);
            default:
                return list;
        }
    }

    // 获取热销商品
    function getHotProducts(limit = 4) {
        return [...products]
            .sort((a, b) => b.sales - a.sales)
            .slice(0, limit);
    }

    // 获取新品
    function getNewProducts(limit = 4) {
        return [...products]
            .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
            .slice(0, limit);
    }

    return {
        getAllProducts,
        getProductsByCategory,
        getProductById,
        searchProducts,
        getCategories,
        sortProducts,
        getHotProducts,
        getNewProducts
    };
})();
