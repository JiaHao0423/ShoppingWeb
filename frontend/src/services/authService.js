import axios from '../api/axios.js';

const AuthService = {
    register: async (username, email, password, name, phone, address, idCardNumber, birthday, gender) => {
        const response = await axios.post(
            '/auth/register',
            { username, email, password, name, phone, address, idCardNumber, birthday, gender }
        );
        return response.data;
    },

    login: async (username, password) => {
        const response = await axios.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRoles', JSON.stringify(response.data.roles)); // 儲存使用者角色
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRoles');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (token) {
            // 在實際應用中，您可能需要解碼 JWT 或向後端發送請求來獲取使用者資訊
            // 這裡僅作為範例，簡單判斷是否有 token
            return { isAuthenticated: true, token: token };
        }
        return { isAuthenticated: false };
    },

    getUserRoles: () => {
        const roles = localStorage.getItem('userRoles');
        return roles ? JSON.parse(roles) : [];
    },
};

export default AuthService;