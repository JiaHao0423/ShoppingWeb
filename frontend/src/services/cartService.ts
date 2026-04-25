import axios from "../api/axios";

const CartService = {
  getCart: async (signal?: AbortSignal) => {
    const response = await axios.get("/carts", { signal });
    return response.data;
  },

  addOrUpdateCartItem: async (productVariantId: number | string, quantity: number) => {
    const response = await axios.post("/carts/items", { productVariantId, quantity });
    return response.data;
  },

  updateCartItemQuantity: async (cartItemId: number | string, quantity: number) => {
    const response = await axios.put(`/carts/items/${cartItemId}`, null, { params: { quantity } });
    return response.data;
  },

  removeCartItem: async (cartItemId: number | string) => {
    const response = await axios.delete(`/carts/items/${cartItemId}`);
    return response.data;
  },
};

export default CartService;
