// admin.js - versión que guarda todo lo que necesita main.js
(() => {
  const ADMIN_PASSWORD = "futbol2025"; // o cámbiala si quieres
  // elementos
  const loginBox = document.getElementById("loginBox");
  const loginBtn = document.getElementById("loginBtn");
  const adminKey = document.getElementById("adminKey");
  const loginMsg = document.getElementById("loginMsg");
  const adminPanel = document.getElementById("adminPanel");
  const csvFileInput = document.getElementById("csvFile");
  const uploadCsvBtn = document.getElementById("uploadCsvBtn");
  const acumuladoInput = document.getElementById("acumuladoInput");
  const saveAcumuladoBtn = document.getElementById("saveAcumuladoBtn");
  const activarJornadaBtn = document.getElementById("activarJornadaBtn");
  const adminMsg = document.getElementById("adminMsg");

  loginBtn.addEventListener('click', () => {
    if ((adminKey.value || '').trim() === ADMIN_PASSWORD) {
      loginBox.style.display = 'none';
      adminPanel.style.display = 'block';
      loginMsg.textContent = '';
    } else {
      loginMsg.textContent = '❌ Contraseña incorrecta';
    }
  });

  // cargar CSV en localStorage
  uploadCsvBtn.addEventListener('click', () => {
    const f = csvFileInput.files[0];
    if (!f) { alert('Selecciona un CSV'); return; }
    const r = new FileReader();
    r.onload = (e) => {
      const txt = e.target.result;
      // guardar raw CSV
      localStorage.setItem('jornadaCSV', txt);
      adminMsg.textContent = '✅ CSV cargado (guardado temporal en localStorage).';
    };
    r.readAsText(f, 'utf-8');
  });

  // guardar acumulado
  saveAcumuladoBtn.addEventListener('click', () => {
    const v = (acumuladoInput.value || '').trim();
    if (!v) { alert('Ingresa un valor de acumulado'); return; }
    localStorage.setItem('acumuladoJornada', v);
    adminMsg.textContent = `💰 Acumulado guardado: ${v}`;
  });

  // activar jornada (marca activo y comprueba que CSV exista)
  activarJornadaBtn.addEventListener('click', () => {
    const csv = localStorage.getItem('jornadaCSV');
    if (!csv) { alert('Primero carga un CSV'); return; }
    // marca que la jornada está activa
    localStorage.setItem('jornadaActiva', 'true');
    adminMsg.textContent = '⚽ Jornada activada con éxito.';
  });
})();
