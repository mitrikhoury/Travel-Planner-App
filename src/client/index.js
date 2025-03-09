import './styles/style.scss';
import { handleSubmit } from './js/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('travel-form');

  // Prevent adding event listener multiple times
  if (!form.dataset.listener) {
    form.addEventListener('submit', handleSubmit);
    form.dataset.listener = "true"; // Mark as added
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
});
