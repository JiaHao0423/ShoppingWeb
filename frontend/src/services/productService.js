import axios from '../api/axios.js';

const ProductService = {
    getProducts: async (categoryId, page = 0, size = 10) => {
        const params = { page, size };
        if (categoryId) {
            params.categoryId = categoryId;
        }
        const response = await axios.get('/products', { params });
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axios.get(`/products/${id}`);
        return response.data;
    },

    getAllCategories: async () => {
        const response = await axios.get('/products/categories');
        return response.data;
    },
};

export default ProductService;