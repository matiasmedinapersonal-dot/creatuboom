// Control del menú desplegable en celulares
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });
}

// Configuración de Sanity (sin pt::text para evitar bloqueos)
const projectId = '0jh34002';
const dataset = 'production';

const query = encodeURIComponent(`*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc){
  title,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  author->{name}
}`);

const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?query=${query}`;

async function cargarArticulosDeSanity() {
  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    const posts = resultado.result;
    
    console.log("Artículos que llegaron de Sanity:", posts);
    
    const contenedor = document.querySelector('.articles-grid');
    if (!contenedor || !posts || posts.length === 0) return;

    contenedor.innerHTML = posts.map((post, index) => {
      const numeroStr = String(index + 1).padStart(2, '0');
      const fechaFormateada = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-ES') : '';
      const nombreAutor = post.author && post.author.name ? post.author.name : 'Redacción';

      return `
        <article class="article-card">
          <span class="article-num">${numeroStr}</span>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" style="width:100%; height:180px; object-fit:cover; margin-bottom:1rem;">` : ''}
          <h3 class="article-title">${post.title || ''}</h3>
          <div class="article-meta">Por ${nombreAutor} — ${fechaFormateada}</div>
        </article>
      `;
    }).join('');

  } catch (error) {
    console.error("Error al conectar con Sanity:", error);
  }
}

// Ejecutar la función de inmediato
cargarArticulosDeSanity();
