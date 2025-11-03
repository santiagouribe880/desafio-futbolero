// =========================
// 🔹 RUTAS DE JORNADAS
// =========================

// Obtener todas las jornadas
app.get("/api/jornadas", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  res.json(jornadas);
});

// Crear nueva jornada
app.post("/api/jornada", (req, res) => {
  const { nombre, premio, partidos } = req.body;

  // Validaciones mínimas
  if (!nombre || !premio || !partidos || partidos.length === 0) {
    return res.status(400).json({ message: "Datos incompletos para crear la jornada." });
  }

  const jornadas = readJSON(jornadasPath);

  // Nueva jornada
  const nuevaJornada = {
    id: Date.now(),
    nombre,
    premio,
    partidos,
    activa: false,
  };

  jornadas.push(nuevaJornada);
  writeJSON(jornadasPath, jornadas);

  res.json({ message: "Jornada creada con éxito 🎉", jornada: nuevaJornada });
});

// Activar jornada (solo una activa a la vez)
app.post("/api/activar/:id", (req, res) => {
  const { id } = req.params;
  let jornadas = readJSON(jornadasPath);

  if (!jornadas || jornadas.length === 0) {
    return res.status(400).json({ message: "No hay jornadas disponibles para activar." });
  }

  jornadas = jornadas.map((j) => ({
    ...j,
    activa: j.id.toString() === id,
  }));

  writeJSON(jornadasPath, jornadas);
  res.json({ message: "Jornada activada correctamente ✅" });
});

// Obtener la jornada activa
app.get("/api/jornada-activa", (req, res) => {
  const jornadas = readJSON(jornadasPath);
  const activa = jornadas.find((j) => j.activa);
  res.json(activa || null);
});
