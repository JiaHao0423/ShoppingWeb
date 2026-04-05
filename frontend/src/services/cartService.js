import axios from '../api/axios.js';

const CartService = {
    getCart: async () => {
        const response = await axios.get('/carts');
        return response.data;
    },

    addOrUpdateCartItem: async (productVariantId, quantity) => {
        const response = await axios.post('/carts/items', { productVariantId, quantity });
        return response.data;
    },

    updateCartItemQuantity: async (cartItemId, quantity) => {
        const response = await axios.put(`/carts/items/${cartItemId}`, null, { params: { quantity } });
        return response.data;
    },

    removeCartItem: async (cartItemId) => {
        const response = await axios.delete(`/carts/items/${cartItemId}`);
        return response.data;
    },
};

export default CartService;