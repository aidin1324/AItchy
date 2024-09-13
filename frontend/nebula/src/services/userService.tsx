import axios from 'axios';
import { LoginResponse } from '../types/authTypes';

const API_URL = 'http://138.197.30.86:8000';

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

interface LoginUserData {
  username: string;
  password: string;
}

const userService = {
  registerUser: async (userData: RegisterUserData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register/user`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (userData: LoginUserData) => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', userData.username);
      formData.append('password', userData.password);
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', 'string');

      const response = await axios.post(`${API_URL}/auth/login/user/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data as LoginResponse;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;