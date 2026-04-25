import axios from "../api/axios";

const ProductService = {
  getProducts: async (categoryId?: number | string | null, page = 0, size = 10, signal?: AbortSignal) => {
    const params: { page: number; size: number; categoryId?: number | string } = { page, size };
    if (categoryId) {
      params.categoryId = categoryId;
    }
    const response = await axios.get("/products", { params, signal });
    return response.data;
  },

  getProductById: async (id: number | string) => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  getAllCategories: async () => {
    const response = await axios.get("/products/categories");
    return response.data;
  },
};

export default ProductService;
