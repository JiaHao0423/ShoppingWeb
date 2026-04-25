import axios from "../api/axios";

const OrderService = {
  createOrder: async (shippingAddress: string, paymentMethod: string) => {
    const response = await axios.post("/orders", { shippingAddress, paymentMethod });
    return response.data;
  },

  getOrders: async (signal?: AbortSignal) => {
    const response = await axios.get("/orders", { signal });
    return response.data;
  },

  getOrderById: async (id: number | string) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number | string, status: string) => {
    const response = await axios.put(`/orders/${id}/status`, null, { params: { status } });
    return response.data;
  },
};

export default OrderService;
