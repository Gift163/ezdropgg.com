import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';

// Components
import Layout from './components/Layout/Layout';
import LoadingScreen from './components/UI/LoadingScreen';

// Pages
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import GamesPage from './pages/GamesPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import ReferralsPage from './pages/ReferralsPage';

// Types
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          receiver: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
          chat: {
            id: number;
            type: string;
            title?: string;
            username?: string;
          };
          chat_type: string;
          chat_instance: string;
          start_param: string;
          can_send_after: number;
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: string;
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          link_color: string;
          button_color: string;
          button_text_color: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        backButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        mainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        onEvent: (eventType: string, eventHandler: () => void) => void;
        offEvent: (eventType: string, eventHandler: () => void) => void;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback: (status: string) => void) => void;
        showPopup: (params: {
          title: string;
          message: string;
          buttons: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: {
          text?: string;
        }, callback: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback: (data: string) => void) => void;
        requestWriteAccess: (callback: (access: boolean) => void) => void;
        requestContact: (callback: (contact: {
          phone_number: string;
          first_name: string;
          last_name?: string;
          user_id?: number;
          vcard?: string;
        }) => void) => void;
        invokeCustomMethod: (method: string, params: any, callback: (result: any) => void) => void;
        invokeCustomMethodUnsafe: (method: string, params: any, callback: (result: any) => void) => void;
        versionAtLeast: (version: string) => boolean;
        isVersionAtLeast: (version: string) => boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        setBackButton: (isVisible: boolean) => void;
        setMainButton: (params: {
          text: string;
          color?: string;
          text_color?: string;
          is_visible?: boolean;
          is_progress_visible?: boolean;
          is_active?: boolean;
        }) => void;
        onRequestClose: (callback: () => void) => void;
        offRequestClose: (callback: () => void) => void;
        onRequestWriteAccess: (callback: (access: boolean) => void) => void;
        offRequestWriteAccess: (callback: (access: boolean) => void) => void;
        onRequestContact: (callback: (contact: any) => void) => void;
        offRequestContact: (callback: (contact: any) => void) => void;
        onRequestCustomMethod: (method: string, callback: (params: any) => void) => void;
        offRequestCustomMethod: (method: string, callback: (params: any) => void) => void;
        onRequestCustomMethodUnsafe: (method: string, callback: (params: any) => void) => void;
        offRequestCustomMethodUnsafe: (method: string, callback: (params: any) => void) => void;
        onRequestScanQr: (callback: (data: string) => void) => void;
        offRequestScanQr: (callback: (data: string) => void) => void;
        onRequestReadTextFromClipboard: (callback: (data: string) => void) => void;
        offRequestReadTextFromClipboard: (callback: (data: string) => void) => void;
        onRequestWriteAccess: (callback: (access: boolean) => void) => void;
        offRequestWriteAccess: (callback: (access: boolean) => void) => void;
        onRequestContact: (callback: (contact: any) => void) => void;
        offRequestContact: (callback: (contact: any) => void) => void;
        onRequestCustomMethod: (method: string, callback: (params: any) => void) => void;
        offRequestCustomMethod: (method: string, callback: (params: any) => void) => void;
        onRequestCustomMethodUnsafe: (method: string, callback: (params: any) => void) => void;
        offRequestCustomMethodUnsafe: (method: string, callback: (params: any) => void) => void;
        onRequestScanQr: (callback: (data: string) => void) => void;
        offRequestScanQr: (callback: (data: string) => void) => void;
        onRequestReadTextFromClipboard: (callback: (data: string) => void) => void;
        offRequestReadTextFromClipboard: (callback: (data: string) => void) => void;
      };
    };
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { initTelegramAuth, isAuthenticated } = useAuthStore();
  const { initWebApp } = useTelegramWebApp();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инициализируем Telegram WebApp
        initWebApp();
        
        // Инициализируем аутентификацию
        await initTelegramAuth();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [initWebApp, initTelegramAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/cases" element={
            <Layout>
              <CasesPage />
            </Layout>
          } />
          <Route path="/games" element={
            <Layout>
              <GamesPage />
            </Layout>
          } />
          <Route path="/marketplace" element={
            <Layout>
              <MarketplacePage />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <ProfilePage />
            </Layout>
          } />
          <Route path="/deposit" element={
            <Layout>
              <DepositPage />
            </Layout>
          } />
          <Route path="/withdraw" element={
            <Layout>
              <WithdrawPage />
            </Layout>
          } />
          <Route path="/referrals" element={
            <Layout>
              <ReferralsPage />
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 