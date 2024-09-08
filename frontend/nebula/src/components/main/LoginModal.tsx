import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { LoginResponse } from '../../types/authTypes';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

  

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response: LoginResponse = await userService.loginUser({
        username: formData.email,
        password: formData.password,
      });
      localStorage.setItem('access_token', response.access_token);
      onClose();
      navigate('/home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError('Ошибка входа. Пожалуйста, проверьте ваши данные и попробуйте снова.');
      } else {
        setError('Неизвестная ошибка. Пожалуйста, попробуйте снова.');
      }
    }
  };
  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Вход</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
                required
              />
              {error && <p className="text-red-300 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg text-white font-medium"
              >
                Войти
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;