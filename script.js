
// Datos de la malla
const malla = {
  "Semestre 1": [
    "Taller de comprensión lectora",
    "Constitución Política",
    "Cálculo Diferencial",
    "Fundamentos de Administración",
    "Fundamentos de Economía",
    "Desarrollo Universitario",
    "TIC Aplicada a los Negocios"
  ],
  "Semestre 2": [
    "Lengua Extranjera I",
    "Taller de Escritura Académica",
    "Electiva de Humanidades I",
    "Cálculo Integral",
    "Contabilidad Financiera",
    "Microeconomía I"
  ],
  "Semestre 3": [
    "Lengua Extranjera II",
    "Estadística y Probabilidad",
    "Álgebra Lineal",
    "Creatividad y Emprendimiento",
    "Costo para la Toma de Decisiones",
    "Fundamentos de Marketing"
  ],
  "Semestre 4": [
    "Lengua Extranjera III",
    "Electivas De Humanidades II",
    "Estadística Inferencial",
    "Organizaciones I",
    "Macroeconomía I",
    "International Marketing",
    "Gerencia Financiera"
  ],
  "Semestre 5": [
    "Lengua Extranjera IV",
    "Ecommerce",
    "Digital Marketing",
    "Digital Media",
    "Gerencia De Servicios",
    "Marketing Analytics"
  ],
  "Semestre 6": [
    "Lengua Extranjera V",
    "Ciudadanía Global",
    "Nueva Tecnología y Marketing",
    "Gerencia Comportamiento del Consumidor",
    "Branding",
    "Estrategias de Marketing Digital",
    "Seminario Integrador"
  ],
  "Semestre 7": [
    "Ética",
    "Gerencia Estratégica de Marketing",
    "Electiva I",
    "Electiva II",
    "Electiva III",
    "Opción De Grado",
    "Consultoría Empresarial"
  ],
  "Semestre 8": [
    "Electiva Internacional",
    "Práctica Profesional"
  ]
};

// Requisitos
const requisitos = {
  "Cálculo Integral": ["Cálculo Diferencial"],
  "Contabilidad Financiera": ["TIC Aplicada a los Negocios"],
  "Microeconomía I": ["Fundamentos de Economía", "Cálculo Diferencial"],
  "Lengua Extranjera II": ["Lengua Extranjera I"],
  "Costo para la Toma de Decisiones": ["Contabilidad Financiera"],
  "Lengua Extranjera III": ["Lengua Extranjera II"],
  "Estadística Inferencial": ["Estadística y Probabilidad"],
  "Organizaciones I": ["Fundamentos de Administración"],
  "Macroeconomía I": ["Fundamentos de Economía", "Cálculo Diferencial"],
  "International Marketing": ["Fundamentos de Marketing"],
  "Lengua Extranjera IV": ["Lengua Extranjera III"],
  "Ecommerce": ["Fundamentos de Marketing"],
  "Digital Media": ["TIC Aplicada a los Negocios", "Fundamentos de Marketing"],
  "Marketing Analytics": ["Fundamentos de Marketing"],
  "Lengua Extranjera V": ["Lengua Extranjera IV"],
  "Nueva Tecnología y Marketing": ["Fundamentos de Marketing"],
  "Gerencia Comportamiento del Consumidor": ["Fundamentos de Marketing"],
  "Estrategias de Marketing Digital": ["Digital Marketing"]
};

// Recuperar estado del localStorage
let aprobadas = JSON.parse(localStorage.getItem("materiasAprobadas")) || [];

function guardarEstado() {
  localStorage.setItem("materiasAprobadas", JSON.stringify(aprobadas));
}

// Mensajes motivacionales kawaii
const mensajes = [
  "¡Sigue así, cada día más cerca! 🌸",
  "¡Ya falta poquito! 💪✨",
  "¡Eres increíble, no te detengas! 🌟",
  "¡Estás brillando con cada paso! 💖",
  "¡Ya casi terminas! 🎓💜"
];

// Calcular progreso y mostrar mensaje
function actualizarProgreso() {
  const total = document.querySelectorAll('.asignatura').length;
  const aprobadasAhora = document.querySelectorAll('.asignatura.aprobada').length;
  const porcentaje = Math.round((aprobadasAhora / total) * 100);
  document.getElementById("porcentaje").textContent = `${porcentaje}%`;
  document.getElementById("barraProgreso").style.width = `${porcentaje}%`;
  const mensaje = mensajes[Math.min(Math.floor(porcentaje / 20), mensajes.length - 1)];
  document.getElementById("motivacional").textContent = mensaje;
}

// Crear la malla
function crearMalla() {
  const contenedor = document.getElementById("malla");
  for (const [semestre, materias] of Object.entries(malla)) {
    const columna = document.createElement("div");
    columna.classList.add("semestre");
    const titulo = document.createElement("h2");
    titulo.textContent = semestre;
    columna.appendChild(titulo);

    materias.forEach(materia => {
      const div = document.createElement("div");
      div.textContent = materia;
      div.classList.add("asignatura");
      if (aprobadas.includes(materia)) {
        div.classList.add("aprobada");
      }
      columna.appendChild(div);
    });

    contenedor.appendChild(columna);
  }
  actualizarBloqueos();
  actualizarProgreso();
}

// Verificar si cumple requisitos
function cumpleRequisitos(materia) {
  const reqs = requisitos[materia] || [];
  return reqs.every(req => aprobadas.includes(req));
}

function obtenerFaltantes(materia) {
  const reqs = requisitos[materia] || [];
  return reqs.filter(req => !aprobadas.includes(req));
}

// Marcar y actualizar
document.addEventListener("click", e => {
  if (e.target.classList.contains("asignatura")) {
    const materia = e.target.textContent;
    if (e.target.classList.contains("aprobada")) {
      e.target.classList.remove("aprobada");
      aprobadas = aprobadas.filter(m => m !== materia);
    } else {
      if (!cumpleRequisitos(materia)) {
        const faltan = obtenerFaltantes(materia);
        alert(`No puedes aprobar "${materia}" aún.\nFaltan: ${faltan.join(", ")}`);
        return;
      }
      e.target.classList.add("aprobada");
      aprobadas.push(materia);
    }
    guardarEstado();
    actualizarBloqueos();
    actualizarProgreso();
  }
});

// Bloquear asignaturas
function actualizarBloqueos() {
  document.querySelectorAll('.asignatura').forEach(div => {
    const materia = div.textContent;
    if (!aprobadas.includes(materia) && !cumpleRequisitos(materia)) {
      div.classList.add("bloqueada");
    } else {
      div.classList.remove("bloqueada");
    }
  });
}

crearMalla();
