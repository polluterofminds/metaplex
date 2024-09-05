import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SettingsProvider, useSettings } from './hooks/useSettings';
import Products from './components/Products';
import CartComponent from './components/Cart';
import { getCookie, storeCookie } from './utils';
import { BASE_API_URL } from './config';
import axios from 'axios';

const App = () => {
  return (
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  );
};

const AppContent = () => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>{settings?.app?.company_name || 'Default Title'}</title>
      </Helmet>
      <AppRoutes />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    //  @ts-ignore
    if (window.__pageview && window.__pageview.recordPageLoad) {
      //  @ts-ignore
      window.__pageview.recordPageLoad();
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/cart" element={<CartComponent />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/review/:id" element={<Review />} />
      <Route path="/receipt/:id" element={<Receipt />} />
      <Route path="/" element={<Products />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const Invoice = () => <div>{/* Load component or HTML based on layout */}</div>;
const Review = () => <div>{/* Load component or HTML based on layout */}</div>;
const Receipt = () => <div>{/* Load component or HTML based on layout */}</div>;
const NotFound = () => {
  const { settings } = useSettings();
  useEffect(() => {
    if (settings?.app.not_found_url) {
      window.location.replace(settings.app.not_found_url);
    } else {
      window.location.replace(window.location.href.split("#")[0] + "#/");
    }

    let token = getCookie("token")
    if(!token) {
      //  Go get a limited token and store it
      getToken()
    }
  }, [settings]);

  const getToken = async () => {
    const response = await axios.get(`${BASE_API_URL}/auths/limited?timezone=UTC&account_id=${settings?.account.account_id}&test=${import.meta.env.MODE === "production" ? "false" : "true"}&user_locale=en-US`)
    const token = response.data.token;
    storeCookie("token", token)
  }

  return <div>Page not found</div>;
};

export default App;