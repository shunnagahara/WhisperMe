import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  const root = document.getElementById('root');
  if (splash && root) {
      setTimeout(() => {
          splash.style.display = 'none';
          root.style.display = 'block'; // `root`を表示
      }, 3000); // 表示時間を調整可能
  }
});

