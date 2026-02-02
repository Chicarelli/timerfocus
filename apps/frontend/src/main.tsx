import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getOrCreateUserId } from './utils/getOrCreateUserId.ts'

declare global {
  interface Window {
    __USER_ID: string;
  }
}

const userId = getOrCreateUserId();

window.__USER_ID = userId;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
