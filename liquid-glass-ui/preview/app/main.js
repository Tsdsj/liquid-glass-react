import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@liquid-glass-ui/react/tokens.css';
import '@liquid-glass-ui/react/styles.css';
import './app.css';
import { App } from './app.js';
const container = document.getElementById('root');
if (!container)
    throw new Error('Missing #root container');
createRoot(container).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
