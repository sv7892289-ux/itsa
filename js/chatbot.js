// Chatbot funcional para ITSaBOT
(() => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  const voiceBtn = document.getElementById('voice-btn');
  const tramiteForm = document.getElementById('tramite-form');
  const tramiteFeedback = document.getElementById('tramite-feedback');

  function appendMessage(text, who='bot'){
    const el = document.createElement('div');
    el.className = 'message ' + (who === 'user' ? 'user' : 'bot');
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Función para generar respuestas inteligentes del bot
  function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Respuestas predefinidas
    const responses = {
      'hola': '¡Hola! Soy ITSaBOT, tu asistente virtual del Instituto Tecnológico Sacaba. ¿En qué puedo ayudarte?',
      'ayuda': 'Puedo ayudarte con:\n• Información sobre trámites\n• Calendario académico\n• Carreras disponibles\n• Horarios de atención\n• Contacto institucional',
      'tramites': 'Los trámites disponibles son:\n• Certificado de Estudios\n• Constancia de Matrícula\n• Inscripción\n• Reinscripción\n\nVe a la sección "Trámites" para más información.',
      'calendario': 'Puedes consultar el calendario académico en la sección "Calendario" donde encontrarás fechas importantes, feriados y eventos institucionales.',
      'carreras': 'Las carreras disponibles son:\n• Gastronomía\n• Contaduría Pública\n• Informática Industrial\n• Secretariado Ejecutivo',
      'contacto': 'Información de contacto:\n• Dirección: Av. Principal, Sacaba\n• Teléfono: (591) 4-1234567\n• Email: info@itsacaba.edu.bo',
      'horarios': 'Horarios de atención:\n• Secretaría: L-V, 8:00-18:00\n• Biblioteca: L-V, 9:00-17:00',
      'gracias': '¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?',
      'adios': '¡Hasta luego! Que tengas un excelente día. Recuerda que estoy disponible 24/7 para ayudarte.'
    };

    // Buscar respuesta específica
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Respuesta por defecto
    return 'Entiendo tu consulta. Para obtener información más específica, puedes:\n• Escribir "ayuda" para ver opciones\n• Visitar la sección "Trámites"\n• Consultar el "Calendario"\n• Revisar la "Información" institucional';
  }

  // Manejar envío del formulario de chat
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const text = chatInput.value.trim();
      if(!text) return;
      
      // Agregar mensaje del usuario
      appendMessage(text,'user');
      chatInput.value = '';
      
      // Simular delay de respuesta del bot
      setTimeout(()=>{
        const reply = getBotResponse(text);
        appendMessage(reply,'bot');
        
        // Síntesis de voz opcional
        if('speechSynthesis' in window){
          const ut = new SpeechSynthesisUtterance(reply);
          ut.lang = 'es-ES';
          ut.rate = 0.9;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(ut);
        }
      }, 800);
    });
  }

  // Reconocimiento de voz (opcional)
  let recognition = null;
  let listening = false;
  
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', (ev)=>{
      const transcript = ev.results[0][0].transcript;
      if (chatInput) {
        chatInput.value = transcript;
      }
    });

    recognition.addEventListener('end', ()=>{
      listening = false;
      if (voiceBtn) {
        voiceBtn.setAttribute('aria-pressed','false');
      }
    });
  } else if (voiceBtn) {
    voiceBtn.style.display = 'none';
  }

  // Botón de voz
  if (voiceBtn && recognition) {
    voiceBtn.addEventListener('click', ()=>{
      if(!listening){
        recognition.start();
        listening = true;
        voiceBtn.setAttribute('aria-pressed','true');
      } else {
        recognition.stop();
        listening = false;
        voiceBtn.setAttribute('aria-pressed','false');
      }
    });
  }

  // Manejar formularios de trámites
  if (tramiteForm && tramiteFeedback) {
    tramiteForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nombre = document.getElementById('nombre')?.value.trim();
      const correo = document.getElementById('correo')?.value.trim();
      
      if(!nombre || !correo){
        tramiteFeedback.textContent = 'Rellena los campos requeridos.';
        return;
      }
      
      tramiteFeedback.textContent = 'Solicitud recibida. En breve recibirá información por correo.';
      tramiteForm.reset();
    });
  }

  // Registrar service worker
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW registro falló', err));
    });
  }
})();
