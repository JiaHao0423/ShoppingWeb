import axios from "@/api/axios";

const GUEST_CART_STORAGE_KEY = "guestCartItems";

export type GuestCartItem = {
  productVariantId: number | string;
  quantity: number;
  productName?: string;
  color?: string;
  size?: string;
  price?: number;
  imageUrl?: string;
};

function readGuestCart(): GuestCartItem[] {
  const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const results: GuestCartItem[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const obj = item as {
        productVariantId?: unknown;
        quantity?: unknown;
        productName?: unknown;
        color?: unknown;
        size?: unknown;
        price?: unknown;
        imageUrl?: unknown;
      };
      if (obj.productVariantId == null || typeof obj.quantity !== "number") continue;
      results.push({
        productVariantId: obj.productVariantId as number | string,
        quantity: Math.max(1, Math.trunc(obj.quantity)),
        productName: typeof obj.productName === "string" ? obj.productName : undefined,
        color: typeof obj.color === "string" ? obj.color : undefined,
        size: typeof obj.size === "string" ? obj.size : undefined,
        price: typeof obj.price === "number" ? obj.price : undefined,
        imageUrl: typeof obj.imageUrl === "string" ? obj.imageUrl : undefined,
      });
    }
    return results;
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
}

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

  getGuestCartItems: (): GuestCartItem[] => readGuestCart(),

  addOrUpdateGuestCartItem: (
    productVariantId: number | string,
    quantity: number,
    meta?: Omit<GuestCartItem, "productVariantId" | "quantity">
  ) => {
    const normalizedQuantity = Math.max(1, Math.trunc(quantity));
    const currentItems = readGuestCart();
    const existingIndex = currentItems.findIndex((item) => String(item.productVariantId) === String(productVariantId));
    if (existingIndex >= 0) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + normalizedQuantity,
        ...meta,
      };
    } else {
      currentItems.push({ productVariantId, quantity: normalizedQuantity, ...meta });
    }
    writeGuestCart(currentItems);
  },

  updateGuestCartItemQuantity: (productVariantId: number | string, quantity: number) => {
    const normalizedQuantity = Math.max(1, Math.trunc(quantity));
    const currentItems = readGuestCart();
    const nextItems = currentItems.map((item) =>
      String(item.productVariantId) === String(productVariantId) ? { ...item, quantity: normalizedQuantity } : item
    );
    writeGuestCart(nextItems);
  },

  removeGuestCartItem: (productVariantId: number | string) => {
    const currentItems = readGuestCart();
    const nextItems = currentItems.filter((item) => String(item.productVariantId) !== String(productVariantId));
    writeGuestCart(nextItems);
  },

  clearGuestCart: () => {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  },

  getGuestCartItemsCount: (): number => readGuestCart().reduce((sum, item) => sum + item.quantity, 0),

  mergeGuestCartToServer: async () => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;

    // 確保後端有建立目前會員的購物車
    await CartService.getCart();

    for (const item of guestItems) {
      await CartService.addOrUpdateCartItem(item.productVariantId, item.quantity);
    }
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  },
};

export default CartService;
