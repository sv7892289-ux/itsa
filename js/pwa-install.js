// pwa-install.js - crea un botón "Instalar" y maneja beforeinstallprompt
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Previene el prompt automático y guarda el evento
  e.preventDefault();
  deferredPrompt = e;
  createInstallButton(); // crea el botón si conviene mostrarlo
});

function createInstallButton() {
  // no crear más de uno
  if (document.getElementById('pwa-install-btn')) return;

  // buscamos un lugar visible (tu .login-card existe en tu HTML)
  const container = document.querySelector('.login-card') || document.body;
  const btn = document.createElement('button');
  btn.id = 'pwa-install-btn';
  btn.type = 'button';
  btn.textContent = 'Instalar App';
  btn.className = 'login-btn'; // reutiliza estilo del botón existente
  btn.style.marginTop = '12px';
  btn.style.display = 'block';

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }
    deferredPrompt = null;
    btn.remove();
  });

  container.appendChild(btn);
}

// Utilidad pública para solicitar fullscreen (ejecutar por gesto)
window.requestAppFullscreen = async function() {
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      return true;
    }
  } catch (err) {
    console.warn('No se pudo activar fullscreen:', err);
  }
  return false;
};