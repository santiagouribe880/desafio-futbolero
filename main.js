// main.js - lee jornada activada y muestra formulario según CSV (columnas: codigo,partido,equipo_local,equipo_visitante)
document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('codeInput');
  const validateBtn = document.getElementById('validateBtn');
  const accessMsg = document.getElementById('accessMsg');
  const jornadaCard = document.getElementById('jornadaCard');
  const matchesContainer = document.getElementById('matchesContainer');
  const pronForm = document.getElementById('pronForm');
  const acumuladoText = document.getElementById('acumuladoText');
  const playerCodeHidden = document.getElementById('playerCodeHidden');

  function getCSVData(){
    const csv = localStorage.getItem('jornadaCSV');
    if(!csv) return null;
    const lines = csv.split(/\\r?\\n/).map(l=>l.trim()).filter(l=>l!=='');
    if(lines.length < 2) return null;
    const headers = lines[0].split(',').map(h=>h.trim().toLowerCase());
    const rows = lines.slice(1).map(line=>{
      const cols = line.split(',').map(c=>c.trim());
      const obj = {};
      headers.forEach((h,i)=> obj[h] = cols[i] || '');
      return obj;
    });
    return rows;
  }

  validateBtn.addEventListener('click', () => {
    const code = (codeInput.value || '').trim().toUpperCase();
    if(!code){ accessMsg.textContent = 'Ingresa un código.'; return; }

    if(localStorage.getItem('jornadaActiva') !== 'true'){
      accessMsg.textContent = 'No hay jornada activa.';
      return;
    }

    const data = getCSVData();
    if(!data){ accessMsg.textContent = 'No hay datos de jornada (CSV vacío).'; return; }

    // comprobar que el código esté en la lista de códigos permitidos
    const found = data.find(r => (r.codigo || '').toUpperCase() === code);
    if(!found){
      accessMsg.textContent = 'Código no válido. Consulta con el administrador.';
      return;
    }

    accessMsg.textContent = 'Código válido. Cargando formulario...';
    // mostrar formulario con TODOS los partidos (no solo el del código)
    showForm(data, code);
  });

  function showForm(data, code){
    document.querySelectorAll('.login-box, .login-section').forEach(n=>{ if(n) n.style.display='none'; });
    jornadaCard.style.display = 'block';
    matchesContainer.innerHTML = '';
    const acumulado = localStorage.getItem('acumuladoJornada') || '0';
    if(acumuladoText) acumuladoText.textContent = `💰 Premio: $${Number(acumulado).toLocaleString('es-CO')}`;

    data.forEach((p, idx) => {
      const div = document.createElement('div');
      div.className = 'match-row';
      div.innerHTML = `
        <p><strong>${p.equipo_local}</strong> vs <strong>${p.equipo_visitante}</strong></p>
        <input type="number" min="0" id="gL_${idx}" placeholder="Goles ${p.equipo_local}" required>
        <input type="number" min="0" id="gV_${idx}" placeholder="Goles ${p.equipo_visitante}" required>
        <hr>
      `;
      matchesContainer.appendChild(div);
    });
    playerCodeHidden.value = code;
  }

  // envío (aún no manda a Sheets, solo demo — lo podemos conectar)
  pronForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const code = playerCodeHidden.value;
    // simple validación de que se hayan llenado inputs
    const inputs = matchesContainer.querySelectorAll('input');
    for(let i=0;i<inputs.length;i++){
      if(inputs[i].value === '') { alert('Completa todos los marcadores.'); return; }
    }
    // marcar código usado (local)
    localStorage.setItem(`codigo_${code}_usado`, 'true');
    // opcional: si quieres que no haya jornada activa tras cada envío, descomenta:
    // localStorage.removeItem('jornadaActiva');

    alert('Pronóstico enviado. Gracias!');
    window.location.reload();
  });

  // Si quieres que la página muestre mensaje al cargar:
  if(localStorage.getItem('jornadaActiva') === 'true'){
    accessMsg.textContent = 'Jornada activa — ingresa tu código.';
  } else {
    accessMsg.textContent = 'No hay jornada activa.';
  }
});
