import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './pages/App';
import './css/reset.css'
import './css/index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const root = document.getElementById('root');
  if (splash && root) {
    setTimeout(() => {
      splash.style.display = 'none';
      root.style.display = 'block';
    }, 3000);
  }
});