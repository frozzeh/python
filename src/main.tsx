import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><React.Suspense fallback={<div className="p-8 text-slate-400">Загрузка редактора…</div>}><App/></React.Suspense></React.StrictMode>);
