import axios from '../api/axios.js';

const UserService = {
    getCurrentUserProfile: async () => {
        const response = await axios.get('/users/me');
        return response.data;
    },

    updateCurrentUserProfile: async (profileData) => {
        const response = await axios.put('/users/me', profileData);
        return response.data;
    },
};

export default UserService;