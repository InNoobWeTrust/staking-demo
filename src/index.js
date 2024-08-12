import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3Onboard } from './services';
import { Web3OnboardProvider } from '@web3-onboard/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3OnboardProvider web3Onboard={Web3Onboard}>
      <App />
    </Web3OnboardProvider>
  </React.StrictMode>
);
