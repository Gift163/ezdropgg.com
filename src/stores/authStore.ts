import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: number;
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  balance_ezcoin: number;
  balance_ezdrop: number;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  last_login: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initTelegramAuth: () => Promise<void>;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateBalance: (ezcoin: number, ezdrop: number) => void;
  clearError: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initTelegramAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Проверяем, есть ли сохраненный токен
          const { token } = get();
          if (token) {
            // Проверяем валидность токена
            const response = await axios.get(`${API_URL}/api/user/profile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.status === 200) {
              set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            }
          }

          // Если нет токена или он невалиден, пытаемся авторизоваться через Telegram
          if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
            await get().login(telegramUser);
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to initialize authentication' 
          });
        }
      },

      login: async (telegramData: any) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.post(`${API_URL}/api/auth/telegram`, {
            id: telegramData.id,
            username: telegramData.username,
            first_name: telegramData.first_name,
            last_name: telegramData.last_name
          });

          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Настраиваем axios для автоматического добавления токена
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Login failed'
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        
        // Удаляем токен из axios
        delete axios.defaults.headers.common['Authorization'];
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData }
          });
        }
      },

      updateBalance: (ezcoin: number, ezdrop: number) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              balance_ezcoin: ezcoin,
              balance_ezdrop: ezdrop
            }
          });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
); 