import axios from "../api/axios";

type AuthUser = {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
};

type AuthResponse = {
  token?: string;
  refreshToken?: string;
  roles?: string[];
  [key: string]: unknown;
};

const AuthService = {
  register: async (
    username: string,
    email: string,
    password: string,
    name: string,
    phone: string,
    address: string,
    idCardNumber: string,
    birthday: string,
    gender: string
  ) => {
    const response = await axios.post("/auth/register", {
      username,
      email,
      password,
      name,
      phone,
      address,
      idCardNumber,
      birthday,
      gender,
    });
    return response.data;
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>("/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
      localStorage.setItem("userRoles", JSON.stringify(response.data.roles ?? []));
    }
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await axios.post<AuthResponse>("/auth/refresh", { refreshToken });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRoles");
  },

  getCurrentUser: (): AuthUser => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token) {
      return { isAuthenticated: true, token, refreshToken: refreshToken ?? undefined };
    }
    return { isAuthenticated: false };
  },

  getUserRoles: (): string[] => {
    const roles = localStorage.getItem("userRoles");
    return roles ? (JSON.parse(roles) as string[]) : [];
  },
};

export default AuthService;
