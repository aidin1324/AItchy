import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import userService from '../../services/userService';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginOpen: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth_date: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    if (!formData.surname) newErrors.surname = 'Фамилия обязательна';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов, 1 заглавную букву и 1 спецсимвол';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.birth_date) newErrors.birth_date = 'Дата рождения обязательна';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await userService.registerUser({
          ...formData,
          is_superuser: false,
          is_premium: false,
        });
        onClose();
        onLoginOpen();
      } catch (error) {
        setError('Ошибка регистрации. Пожалуйста, попробуйте снова.');
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
              <h2 className="text-2xl font-bold text-white">Регистрация</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              {errors.name && <p className="text-red-300 text-sm">{errors.name}</p>}
              
              <input
                type="text"
                name="surname"
                placeholder="Фамилия"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              {errors.surname && <p className="text-red-300 text-sm">{errors.surname}</p>}
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              {errors.email && <p className="text-red-300 text-sm">{errors.email}</p>}
              
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              {errors.password && <p className="text-red-300 text-sm">{errors.password}</p>}
              
              <input
                type="password"
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              {errors.confirmPassword && <p className="text-red-300 text-sm">{errors.confirmPassword}</p>}
              
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white"
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужчина</option>
                <option value="female">Женщина</option>
                <option value="other">Другое</option>
              </select>
              {errors.gender && <p className="text-red-300 text-sm">{errors.gender}</p>}
              
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white bg-opacity-20 text-white"
              />
              {errors.birth_date && <p className="text-red-300 text-sm">{errors.birth_date}</p>}
              
              {error && <p className="text-red-300 text-sm">{error}</p>}
              
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg text-white font-medium"
              >
                Зарегистрироваться
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;