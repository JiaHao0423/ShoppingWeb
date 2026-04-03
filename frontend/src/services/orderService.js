import api from './api';

const OrderService = {
    createOrder: async (shippingAddress, paymentMethod) => {
        const response = await api.post('/orders', { shippingAddress, paymentMethod });
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, null, { params: { status } });
        return response.data;
    },
};

export default OrderService;