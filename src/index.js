import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import './utility/utility.css';
import './utility/card.css';
import './utility/resposive.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './data/index';
import { ThemeProvider } from "@material-tailwind/react";
import 'fontawesome6pro/css/all.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
