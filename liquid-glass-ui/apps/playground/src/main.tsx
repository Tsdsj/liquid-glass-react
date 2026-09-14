import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@liquid-glass-ui/react/tokens.css';
import '@liquid-glass-ui/react/styles.css';
import './app.css';
import { App } from './app.js';
const container = document.getElementById('root');
if (!container) throw new Error('Missing #root container');
createRoot(container).render(<StrictMode><App/></StrictMode>);
