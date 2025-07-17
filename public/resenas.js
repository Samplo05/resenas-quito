const API_URL = 'https://resenas-quito.onrender.com/api/resenas';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-editar');
  const inputNombre = document.getElementById('editar-nombre');
  const inputComentario = document.getElementById('editar-comentario');
  const inputDireccion = document.getElementById('editar-direccion');
  const inputPuntuacion = document.getElementById('editar-puntuacion');
  const inputImagen = document.getElementById('editar-imagen');
  const btnGuardar = document.getElementById('guardar-edicion');
  const btnCancelar = document.getElementById('cancelar-edicion');

let reseñaActual = null;

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

    div.innerHTML = `
      <h3>${r.nombre}</h3>
      <p><strong>Comentario:</strong> ${r.comentario}</p>
      <p><strong>Estrellas:</strong> ${'⭐'.repeat(r.puntuacion)}</p>
      ${r.imagen ? `<img src="${r.imagen}" alt="Imagen de ${r.nombre}" class="resena-img">` : ''}
      <p><strong>Dirección:</strong> ${r.direccion || 'No disponible'}</p>
      <button class="eliminar-btn" data-id="${r._id}">🗑️ Eliminar</button>
	  <button class="editar-btn" data-id="${r._id}">✏️ Editar</button>
    `;

    contenedor.appendChild(div);
  });

  // Agregar eventos a los botones de eliminar
  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (confirm('¿Estás seguro de eliminar esta reseña?')) {
        try {
          const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            // Eliminar del array local y recargar vista
            reseñas = reseñas.filter(r => r._id !== id);
            mostrarReseñas(reseñas);
            calcularPromedio(reseñas);
          } else {
            alert('Error al eliminar la reseña.');
          }
        } catch (err) {
          console.error(err);
          alert('Error al conectar con el servidor.');
        }
      }
    });
  });
  document.querySelectorAll('.editar-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    reseñaActual = reseñas.find(r => r._id === id);

    // Rellenar campos
    inputNombre.value = reseñaActual.nombre;
    inputComentario.value = reseñaActual.comentario;
	inputDireccion.value = reseñaActual.direccion || '';
	inputPuntuacion.value = reseñaActual.puntuacion || 3;

    modal.style.display = 'flex';
  });
});
btnCancelar.addEventListener('click', () => {
  modal.style.display = 'none';
  reseñaActual = null;
});

btnGuardar.addEventListener('click', async () => {
  if (!reseñaActual) return;

  const nuevoNombre = inputNombre.value.trim();
  const nuevoComentario = inputComentario.value.trim();
  const nuevaDireccion = inputDireccion.value.trim();
  const nuevaPuntuacion = parseInt(inputPuntuacion.value);
  const nuevaImagen = inputImagen.files[0];

  if (!nuevoNombre || !nuevoComentario || !nuevaDireccion) {
    alert('Nombre, dirección y comentario no pueden estar vacíos');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('nombre', nuevoNombre);
    formData.append('comentario', nuevoComentario);
    formData.append('direccion', nuevaDireccion);
    formData.append('puntuacion', nuevaPuntuacion);
    if (nuevaImagen) {
      formData.append('imagen', nuevaImagen);
    }

    const res = await fetch(`${API_URL}/${reseñaActual._id}`, {
      method: 'PUT',
      body: formData
    });

    if (res.ok) {
      const actualizada = await res.json();
      const i = reseñas.findIndex(r => r._id === reseñaActual._id);
      reseñas[i] = actualizada;
      mostrarReseñas(reseñas);
      calcularPromedio(reseñas);
      modal.style.display = 'none';
    } else {
      alert('Error al actualizar la reseña');
    }
  } catch (err) {
    console.error(err);
    alert('Error de conexión');
  }
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
  // Modal para ampliar imagen
const imgModal = document.getElementById('img-modal');
const modalImg = document.getElementById('modal-img');

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('resena-img')) {
    modalImg.src = e.target.src;
    imgModal.style.display = 'flex';
  } else if (e.target === imgModal) {
    imgModal.style.display = 'none';
  }
});
// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imgModal.style.display === 'flex') {
    imgModal.style.display = 'none';
  }
});

});
