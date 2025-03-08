import './styles/style.scss';
import { handleSubmit } from './js/app';

// Add event listener for form submission
document.getElementById('travel-form').addEventListener('submit', handleSubmit);

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
