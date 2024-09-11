import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, LogOut, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import AIGradient from '../components/AIGradient';
import Tooltip from '../components/Tooltip';

interface UserProfile {
  name: string;
  surname: string;
  email: string;
  gender: string;
  birth_date: string;
  is_premium: boolean;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://127.0.0.1:8000/auth/current/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        damping: 20,
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-white text-4xl"
        >
          <Star className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-2xl bg-red-500 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <StarryBackground />
      <AIGradient />

      <Link to="/home" className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors duration-300">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-8 h-8" />
        </motion.div>
      </Link>

      <motion.div 
        className="relative w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-purple-500 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl"></div>
        <div className="relative p-8">
          <motion.h1 
            className="text-4xl font-bold text-white mb-8 text-center"
            variants={itemVariants}
          >
            Профиль
          </motion.h1>
          
          {profile && (
            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-4"
                variants={itemVariants}
              >
                <div className="relative">
                  <User className="w-16 h-16 text-white" />
                  {profile.is_premium && (
                    <motion.div 
                      className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-4 h-4 text-purple-900" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{`${profile.name} ${profile.surname}`}</h2>
                  <p className="text-indigo-200">{profile.email}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white bg-opacity-10 rounded-xl p-6 space-y-3 shadow-inner"
                variants={itemVariants}
              >
                <p className="text-indigo-100"><span className="font-semibold">Пол:</span> {profile.gender}</p>
                <p className="text-indigo-100"><span className="font-semibold">Дата рождения:</span> {profile.birth_date}</p>
                <p className="text-indigo-100">
                  <span className="font-semibold">Премиум статус:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${profile.is_premium ? 'bg-yellow-400 text-purple-900' : 'bg-gray-600 text-white'}`}>
                    {profile.is_premium ? 'Активен' : 'Неактивен'}
                  </span>
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-4 mt-8"
                variants={itemVariants}
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center space-x-2 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <Settings className="w-5 h-5" />
                  <span>Настройки</span>
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full py-3 bg-purple-600 text-white rounded-xl flex items-center justify-center space-x-2 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Подписка</span>
                </motion.button>
              </motion.div>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full py-3 bg-red-600 text-white rounded-xl flex items-center justify-center space-x-2 mt-4 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px]"
              >
                <LogOut className="w-5 h-5" />
                <span>Выйти</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <Tooltip />
    </div>
  );
};

export default ProfilePage;