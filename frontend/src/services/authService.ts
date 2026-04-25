import axios from "../api/axios";

type AuthUser = {
  isAuthenticated: boolean;
  token?: string;
};

type AuthResponse = {
  token?: string;
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
      localStorage.setItem("userRoles", JSON.stringify(response.data.roles ?? []));
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRoles");
  },

  getCurrentUser: (): AuthUser => {
    const token = localStorage.getItem("token");
    if (token) {
      return { isAuthenticated: true, token };
    }
    return { isAuthenticated: false };
  },

  getUserRoles: (): string[] => {
    const roles = localStorage.getItem("userRoles");
    return roles ? (JSON.parse(roles) as string[]) : [];
  },
};

export default AuthService;
