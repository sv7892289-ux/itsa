// /js/animations.js
document.addEventListener('DOMContentLoaded', () => {
  // Agrega clases de animación al cargar la página (fade-in suave del body)
  document.body.classList.add('loaded');

  // Configuración del Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target); // Opcional: animar solo una vez
      }
    });
  }, observerOptions);

  // Selecciona todos los elementos que deseas animar
  const animatedElements = [
    // Tarjetas en menú y trámites
    ...document.querySelectorAll('.card'),
    // Secciones principales
    ...document.querySelectorAll('section'),
    // Encabezados importantes
    ...document.querySelectorAll('h1, h2'),
    // Botones
    ...document.querySelectorAll('.btn'),
    // Mensajes del chat
    ...document.querySelectorAll('.message'),
    // Carrusel (si existe)
    ...document.querySelectorAll('.carousel'),
    // Formularios y listas
    ...document.querySelectorAll('form, ul, ol')
  ];

  // Observa cada elemento
  animatedElements.forEach(el => {
    // Asegura que no tenga ya la clase 'animate'
    if (!el.classList.contains('animate')) {
      observer.observe(el);
    }
  });
});