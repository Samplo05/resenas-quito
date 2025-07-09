document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-recomendacion');
  const contenedorResenas = document.querySelector('.resenas-contenedor');
  const filtro = document.getElementById('filtroPuntuacion');
  const toggleOscuro = document.getElementById('modoOscuroToggle');
  const loader = document.getElementById('loader');
  let reseñas = [];

  const API_URL = 'https://resenas-quito.onrender.com/api/resenas';

  if (loader) loader.style.display = 'flex';

  // Cargar reseñas desde el backend
  async function cargarResenas() {
    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error('Error al cargar reseñas');
      reseñas = await resp.json();
      if (contenedorResenas) mostrarResenas(reseñas);
    } catch (error) {
      console.error(error);
      if (contenedorResenas)
        contenedorResenas.innerHTML = '<p>Error cargando reseñas.</p>';
    } finally {
      if (loader) loader.style.display = 'none';
    }
  }

  // Mostrar reseñas en pantalla
  function mostrarResenas(lista) {
  contenedorResenas.innerHTML = '';
  if (lista.length === 0) {
    contenedorResenas.innerHTML = '<p>No hay reseñas para mostrar.</p>';
    return;
  }
  lista.forEach(resena => {
    const resumenComentario = resena.comentario.length > 100
      ? resena.comentario.substring(0, 100) + '...'
      : resena.comentario;

    const article = document.createElement('article');
    article.classList.add('resena');
    article.innerHTML = `
      <a href="resena.html?id=${resena._id}">
        ${resena.imagen ? `<img src="${resena.imagen}" alt="Foto del lugar" />` : ''}
        <h3>${resena.nombre}</h3>
        <p><strong>Dirección:</strong> ${resena.direccion}</p>
        <p><strong>Comentario:</strong> ${resumenComentario}</p>
        <p><strong>Puntuación:</strong> ${'⭐'.repeat(resena.puntuacion)}</p>
      </a>
    `;
    contenedorResenas.appendChild(article);
  });
}


  // Filtro por puntuación
  if (filtro) {
    filtro.addEventListener('change', () => {
      const val = parseInt(filtro.value);
      if (val === 0) {
        mostrarResenas(reseñas);
      } else {
        const filtradas = reseñas.filter(r => parseInt(r.puntuacion) >= val);
        mostrarResenas(filtradas);
      }
    });
  }

  // Enviar nueva reseña
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form); // Incluye imagen si hay

      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          body: formData
        });

        if (!resp.ok) throw new Error('Error al enviar la reseña');

        const nuevaResena = await resp.json();
        reseñas.unshift(nuevaResena);
        mostrarResenas(reseñas);
        form.reset();
        alert('Reseña enviada correctamente');
      } catch (error) {
        console.error(error);
        alert('Error al enviar la reseña');
      }
    });
  }

  // Modo oscuro
  if (toggleOscuro) {
    toggleOscuro.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // Exportar JSON
  const btnExportar = document.getElementById('exportarJSON');
  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      const dataStr = JSON.stringify(reseñas, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'resenas_quito.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Borrar todas las reseñas
  const btnBorrar = document.getElementById('borrarTodo');
  if (btnBorrar) {
    btnBorrar.addEventListener('click', async () => {
      if (!confirm('¿Estás seguro de borrar todas las reseñas?')) return;

      try {
        const resp = await fetch(API_URL, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Error borrando reseñas');
        reseñas = [];
        mostrarResenas(reseñas);
        alert('Todas las reseñas fueron borradas');
      } catch (error) {
        console.error(error);
        alert('Error al borrar reseñas');
      }
    });
  }

  // Iniciar carga
  cargarResenas();

  window.addEventListener('load', () => {
    if (loader) loader.style.display = 'none';
  });
});
