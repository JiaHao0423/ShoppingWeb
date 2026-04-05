import axios from '../api/axios.js';

const OrderService = {
    createOrder: async (shippingAddress, paymentMethod) => {
        const response = await axios.post('/orders', { shippingAddress, paymentMethod });
        return response.data;
    },

    getOrders: async () => {
        const response = await axios.get('/orders');
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axios.get(`/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axios.put(`/orders/${id}/status`, null, { params: { status } });
        return response.data;
    },
};

export default OrderService;