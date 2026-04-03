import api from './api';

const UserService = {
    getCurrentUserProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateCurrentUserProfile: async (profileData) => {
        const response = await api.put('/users/me', profileData);
        return response.data;
    },
};

export default UserService;