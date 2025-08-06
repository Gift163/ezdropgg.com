import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useTelegramWebApp = () => {
  const initWebApp = useCallback(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Инициализируем WebApp
      webApp.ready();
      
      // Настраиваем тему
      webApp.expand();
      
      // Настраиваем цветовую схему
      webApp.setHeaderColor('#8B5CF6');
      webApp.setBackgroundColor('#0F0F23');
      
      // Настраиваем основную кнопку
      webApp.MainButton.setText('🎮 Открыть EZDROP');
      webApp.MainButton.setParams({
        color: '#8B5CF6',
        text_color: '#FFFFFF',
        is_visible: false
      });
      
      // Обработчики событий
      webApp.onEvent('mainButtonClicked', () => {
        // Действие при нажатии на основную кнопку
        toast.success('Добро пожаловать в EZDROP!');
      });
      
      webApp.onEvent('backButtonClicked', () => {
        // Действие при нажатии на кнопку назад
        if (window.history.length > 1) {
          window.history.back();
        } else {
          webApp.close();
        }
      });
      
      // Включаем подтверждение закрытия
      webApp.enableClosingConfirmation();
      
      console.log('Telegram WebApp initialized');
    } else {
      console.warn('Telegram WebApp not available');
    }
  }, []);

  const showMainButton = useCallback((text: string, callback?: () => void) => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      
      if (callback) {
        webApp.MainButton.onClick(callback);
      }
    }
  }, []);

  const hideMainButton = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }, []);

  const showBackButton = useCallback((callback?: () => void) => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.BackButton.show();
      
      if (callback) {
        webApp.BackButton.onClick(callback);
      }
    }
  }, []);

  const hideBackButton = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, []);

  const hapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  }, []);

  const showAlert = useCallback((message: string) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      toast(message);
    }
  }, []);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        const confirmed = window.confirm(message);
        resolve(confirmed);
      }
    });
  }, []);

  const closeWebApp = useCallback(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  }, []);

  const getUser = useCallback(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
  }, []);

  const getThemeParams = useCallback(() => {
    if (window.Telegram?.WebApp?.themeParams) {
      return window.Telegram.WebApp.themeParams;
    }
    return null;
  }, []);

  const isTelegramWebApp = useCallback(() => {
    return !!window.Telegram?.WebApp;
  }, []);

  const getStartParam = useCallback(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
      return window.Telegram.WebApp.initDataUnsafe.start_param;
    }
    return null;
  }, []);

  useEffect(() => {
    // Инициализируем WebApp при загрузке
    initWebApp();
  }, [initWebApp]);

  return {
    initWebApp,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    closeWebApp,
    getUser,
    getThemeParams,
    isTelegramWebApp,
    getStartParam
  };
}; 