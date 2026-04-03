import api from './api';

const CartService = {
    getCart: async () => {
        const response = await api.get('/carts');
        return response.data;
    },

    addOrUpdateCartItem: async (productVariantId, quantity) => {
        const response = await api.post('/carts/items', { productVariantId, quantity });
        return response.data;
    },

    updateCartItemQuantity: async (cartItemId, quantity) => {
        const response = await api.put(`/carts/items/${cartItemId}`, null, { params: { quantity } });
        return response.data;
    },

    removeCartItem: async (cartItemId) => {
        const response = await api.delete(`/carts/items/${cartItemId}`);
        return response.data;
    },
};

export default CartService;