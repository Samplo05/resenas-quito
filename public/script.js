document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-recomendacion');
  const contenedorResenas = document.querySelector('.resenas-contenedor');
  const filtro = document.getElementById('filtroPuntuacion');
  const toggleOscuro = document.getElementById('modoOscuroToggle');
  const loader = document.getElementById('loader');
  const API_URL = 'https://resenas-quito.onrender.com/api/resenas ';
  let reseñas = [];

  loader.style.display = 'flex';

  async function cargarResenas() {
    try {
      const resp = await fetch(API_URL);
      if (!resp.ok) throw new Error('Error al cargar reseñas');
      reseñas = await resp.json();
      mostrarResenas(reseñas);
    } catch (error) {
      console.error(error);
      contenedorResenas.innerHTML = '<p>Error cargando reseñas.</p>';
    } finally {
      loader.style.display = 'none';
    }
  }

  function recortarTexto(texto, max) {
    return texto.length > max ? texto.slice(0, max) + '[...] </em>' : texto;
  }

  function mostrarResenas(lista) {
    contenedorResenas.innerHTML = '';
    if (lista.length === 0) {
      contenedorResenas.innerHTML = '<p>No hay reseñas para mostrar.</p>';
      return;
    }

    lista.forEach(resena => {
      const article = document.createElement('article');
      article.classList.add('resena');

      const comentarioCorto = recortarTexto(resena.comentario, 120); // recorta si pasa de 120 caracteres
      const direccionCorta = recortarTexto(resena.direccion, 120); // recorta si pasa de 120 caracteres	  ${resena.imagen ? `<img src="${resena.imagen}" alt="Foto del lugar" />` : ''}

      article.innerHTML = `
        
        <h3>${resena.nombre}</h3>
        <p><strong>Dirección:</strong> ${direccionCorta}</p>
   		<p><strong>Comentario:</strong> ${resena.comentario.length > 100 
  ? resena.comentario.substring(0, 100) + '... <a href="resena.html?id=' + resena._id + '">Ver más</a>' 
  : resena.comentario}</p>
        <p><strong>Puntuación:</strong> ${'⭐'.repeat(resena.puntuacion)}</p>
      `;

      contenedorResenas.appendChild(article);
    });
  }

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

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

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

  if (toggleOscuro) {
    toggleOscuro.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

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

  cargarResenas();
console.log('Imagen subida:', imagenUrl);

  window.addEventListener('load', () => {
    loader.style.display = 'none';
  });
});
