import api from './api';

const ProductService = {
    getAllProducts: async (categoryId, page = 0, size = 10) => {
        const params = { page, size };
        if (categoryId) {
            params.categoryId = categoryId;
        }
        const response = await api.get('/products', { params });
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    getAllCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },
};

export default ProductService;