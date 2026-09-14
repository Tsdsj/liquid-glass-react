import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@ttqtt/liquid-glass-react/style.css';
import './app.css';
import { App } from './app.js';
const container = document.getElementById('root');
if (!container) throw new Error('Missing #root container');
createRoot(container).render(<StrictMode><App/></StrictMode>);
