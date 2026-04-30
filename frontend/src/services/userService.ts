import axios from "../api/axios";

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  idCardNumber?: string;
  birthday?: string;
  gender?: boolean | null;
  avatarUrl?: string;
  memberLevel?: string;
  roles?: string[];
  createdAt?: string;
};

export type UpdateUserProfileRequest = {
  name: string;
  phone?: string;
  address?: string;
  idCardNumber?: string;
  birthday?: string;
  gender?: boolean | null;
};

export type UserAddress = {
  id: number;
  recipientName: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

export type UserAddressRequest = {
  recipientName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
};

const UserService = {
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const response = await axios.get<UserProfile>("/users/me");
    return response.data;
  },

  updateCurrentUserProfile: async (profileData: UpdateUserProfileRequest): Promise<UserProfile> => {
    const response = await axios.put<UserProfile>("/users/me", profileData);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post<UserProfile>("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAddresses: async (): Promise<UserAddress[]> => {
    const response = await axios.get<UserAddress[]>("/users/me/addresses");
    return response.data;
  },

  createAddress: async (payload: UserAddressRequest): Promise<UserAddress> => {
    const response = await axios.post<UserAddress>("/users/me/addresses", payload);
    return response.data;
  },

  updateAddress: async (id: number, payload: UserAddressRequest): Promise<UserAddress> => {
    const response = await axios.put<UserAddress>(`/users/me/addresses/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await axios.delete(`/users/me/addresses/${id}`);
  },

  setDefaultAddress: async (id: number): Promise<UserAddress> => {
    const response = await axios.put<UserAddress>(`/users/me/addresses/${id}/default`);
    return response.data;
  },
};

export default UserService;
