// admin/admin.js

const contenedor = document.getElementById('admin-resenas');

fetch('/api/resenas')
  .then(res => res.json())
  .then(resenas => {
    resenas.forEach(resena => {
      const card = document.createElement('article');
      card.classList.add('resena');

      card.innerHTML = `
        <img src="${resena.imagen}" alt="Imagen del lugar">
        <h3>${resena.nombre}</h3>
        <p><strong>Dirección:</strong> ${resena.direccion}</p>
        <p><strong>Comentario:</strong> ${resena.comentario}</p>
        <p><strong>Puntuación:</strong> ${'⭐'.repeat(resena.puntuacion)}</p>
        <button class="eliminar" data-id="${resena._id}">🗑️ Eliminar</button>
      `;

      card.querySelector('.eliminar').addEventListener('click', async () => {
        const id = resena._id;
        if (confirm('¿Seguro que deseas eliminar esta reseña?')) {
          const res = await fetch(`/api/resenas/${id}`, { method: 'DELETE' });
          if (res.ok) {
            card.remove();
          } else {
            alert('Error al eliminar la reseña');
          }
        }
      });

      contenedor.appendChild(card);
    });
  })
  .catch(err => {
    contenedor.innerHTML = `<p>Error al cargar reseñas</p>`;
  });
