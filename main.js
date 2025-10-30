// ============================
// VARIABLES GLOBALES
// ============================
const adminPassword = "admin123";
const horaColombiaOffset = -5; // UTC-5

// ============================
// ADMINISTRADOR
// ============================
const loginBtn = document.getElementById("btn-login");
const adminPassInput = document.getElementById("admin-pass");
const configSection = document.getElementById("config-section");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const pass = adminPassInput.value.trim();
    if (pass === adminPassword) {
      document.getElementById("login-section").style.display = "none";
      configSection.style.display = "block";
      cargarConfiguracion();
    } else {
      document.getElementById("login-msg").textContent = "❌ Contraseña incorrecta.";
    }
  });
}

function cargarConfiguracion() {
  const data = JSON.parse(localStorage.getItem("configJornada"));
  if (data) {
    document.getElementById("premio").value = data.premio || "";
    document.getElementById("hora-limite-input").value = data.horaLimite || "";
    document.getElementById("estado").textContent = data.activa
      ? "🟢 Jornada activa"
      : "🔴 Jornada inactiva";
  }
}

const btnActivar = document.getElementById("btn-activar");
const btnDesactivar = document.getElementById("btn-desactivar");

if (btnActivar) {
  btnActivar.addEventListener("click", () => {
    const premio = document.getElementById("premio").value;
    const horaLimite = document.getElementById("hora-limite-input").value;

    if (!premio || !horaLimite) {
      alert("Por favor ingresa el premio y la hora límite.");
      return;
    }

    const config = {
      activa: true,
      premio,
      horaLimite,
    };
    localStorage.setItem("configJornada", JSON.stringify(config));
    document.getElementById("estado").textContent = "🟢 Jornada activa";
    alert("✅ Jornada activada con éxito");
  });
}

if (btnDesactivar) {
  btnDesactivar.addEventListener("click", () => {
    const config = {
      activa: false,
      premio: "",
      horaLimite: "",
    };
    localStorage.setItem("configJornada", JSON.stringify(config));
    document.getElementById("estado").textContent = "🔴 Jornada inactiva";
    alert("🚫 Jornada desactivada");
  });
}

// ============================
// PARTICIPANTE
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("configJornada"));
  if (!data) return;

  const premioEl = document.getElementById("premio-jornada");
  const horaEl = document.getElementById("hora-limite");
  const contador = document.getElementById("contador");
  const mensaje = document.getElementById("mensaje");
  const btnIngresar = document.getElementById("btn-ingresar");

  if (data.premio) premioEl.textContent = `🏆 Premio: ${data.premio}`;
  if (data.horaLimite) {
    const hora = new Date(data.horaLimite);
    horaEl.textContent = `⏰ Hora límite: ${hora.toLocaleString("es-CO", { timeZone: "America/Bogota" })}`;

    // Cuenta regresiva
    const countdown = setInterval(() => {
      const ahora = new Date();
      const diferencia = hora - ahora;
      if (diferencia <= 0) {
        clearInterval(countdown);
        contador.textContent = "⛔ Jornada finalizada.";
        if (btnIngresar) btnIngresar.disabled = true;
        return;
      }
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      contador.textContent = `⏳ Tiempo restante: ${horas}h ${minutos}m ${segundos}s`;
    }, 1000);
  }

  // Validar ingreso
  if (btnIngresar) {
    btnIngresar.addEventListener("click", () => {
      if (!data.activa) {
        mensaje.textContent = "🚫 La jornada no está activa.";
        return;
      }

      const ahora = new Date();
      if (data.horaLimite && ahora > new Date(data.horaLimite)) {
        mensaje.textContent = "⛔ La jornada ha finalizado.";
        return;
      }

      const codigo = document.getElementById("codigo").value.trim();
      if (!codigo) {
        mensaje.textContent = "Por favor ingresa un código válido.";
        return;
      }

      // Mostrar formulario de pronósticos (simulado)
      document.getElementById("ingreso-codigo").style.display = "none";
      document.getElementById("formulario-pronosticos").style.display = "block";
      mensaje.textContent = "";
    });
  }
});
