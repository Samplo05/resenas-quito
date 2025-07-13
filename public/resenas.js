const API_URL = 'https://resenas-quito.onrender.com/api/resenas';

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.querySelector('.resenas-contenedor');
  const buscador = document.getElementById('buscador');
  const loader = document.getElementById('loader');
  const promedioEstrellas = document.getElementById('promedioEstrellas');
  const btnVolver = document.getElementById('btn-volver');
  const toggleOscuro = document.getElementById('modoOscuroToggle');

  let reseñas = [];

  // Botón volver
  btnVolver.addEventListener('click', () => {
    window.location.href = 'principal.html';
  });

  // Modo oscuro
  toggleOscuro.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggleOscuro.checked);
    localStorage.setItem('modoOscuro', toggleOscuro.checked);
  });

  // Persistir estado de modo oscuro
  if (localStorage.getItem('modoOscuro') === 'true') {
    toggleOscuro.checked = true;
    document.body.classList.add('dark-mode');
  }

  // Cargar reseñas desde API
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      reseñas = data;
      mostrarReseñas(reseñas);
      loader.style.display = 'none';
      calcularPromedio(reseñas);
    })
    .catch(err => {
      console.error('Error al cargar reseñas:', err);
      loader.textContent = 'No se pudieron cargar las reseñas.';
    });

  // Buscador por nombre
  buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtradas = reseñas.filter(r =>
      r.nombre?.toLowerCase().includes(texto)
    );
    mostrarReseñas(filtradas);
    calcularPromedio(filtradas);
  });

  // Mostrar reseñas
  function mostrarReseñas(lista) {
    contenedor.innerHTML = '';
    if (lista.length === 0) {
      contenedor.innerHTML = '<p>No hay coincidencias.</p>';
      return;
    }

    lista.forEach(r => {
      const div = document.createElement('div');
      div.classList.add('resena');

      const estrellas = Number(r.puntuacion) || 0;

      div.innerHTML = `
        <h3>${r.nombre || 'Sin título'}</h3>
        <p><strong>Comentario:</strong> ${r.comentario || 'Sin comentario'}</p>
        <p><strong>Estrellas:</strong> ${'⭐'.repeat(estrellas)}</p>
        ${r.imagen ? `<img src="${r.imagen}" alt="Imagen de ${r.nombre}">` : ''}
        <p><strong>Dirección:</strong> ${r.direccion || 'No disponible'}</p>
      `;

      contenedor.appendChild(div);
    });
  }

  // Calcular promedio
  function calcularPromedio(lista) {
    if (lista.length === 0) {
      promedioEstrellas.textContent = 'Promedio de estrellas: ⭐ --';
      return;
    }

    const suma = lista.reduce((acc, r) => acc + (Number(r.puntuacion) || 0), 0);
    const promedio = (suma / lista.length).toFixed(1);
    promedioEstrellas.textContent = `Promedio de estrellas: ⭐ ${promedio}`;
  }
});
