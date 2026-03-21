import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style/app.css'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);