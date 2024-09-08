import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

interface RegisterUserData {
  name: string;
  surname: string;
  email: string;
  gender: string;
  birth_date: string;
  password: string;
  is_superuser: boolean;
  is_premium: boolean;
}

const userService = {
  registerUser: async (userData: RegisterUserData) => {
    try {
        console.log(userData);
      const response = await axios.post(`${API_URL}/auth/register/user`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;