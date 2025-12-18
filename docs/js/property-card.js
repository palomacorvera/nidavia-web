import { db } from "./firebase-config.js";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ================= ICONOS ================= */
export const ICONS = {
  HOME: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3Z" stroke="currentColor" stroke-width="1.5"/></svg>',
  BED:  '<svg viewBox="0 0 24 24"><path d="M4 10h16M6 10v8m12-8v8M8 18h8" stroke="currentColor" stroke-width="1.5"/></svg>',
  BATH: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 10h10a2 2 0 0 1 2 2v6H5v-6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  AREA: '<svg viewBox="0 0 24 24"><path d="M4 20h16M4 4h16M4 12h16" stroke="currentColor" stroke-width="1.5"/></svg>',
  HEART: `
  <svg viewBox="0 0 24 24">
    <path d="M12 20.5C12 20.5 3.5 14.7 3.5 8.9
             C3.5 6.4 5.4 4.5 7.9 4.5
             C9.6 4.5 11 5.4 12 6.8
             C13 5.4 14.4 4.5 16.1 4.5
             C18.6 4.5 20.5 6.4 20.5 8.9
             C20.5 14.7 12 20.5 12 20.5Z"
          stroke="currentColor" stroke-width="1.6"/>
  </svg>`
};

/* ================= HELPERS ================= */
const euros = n => new Intl.NumberFormat('es-ES').format(n) + ' €';
const cap   = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const esc   = s => String(s ?? '').replace(/[&<>"']/g, m =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])
);

/* ================= TEMPLATE ================= */
export async function renderPropertyCard({
  property,
  templateHTML,
  isLogged,
  user,
  favorites
}) {
  const pid = String(property.id);

  const images = (property.gallery?.length ? property.gallery : [property.image])
    .map((src, i) =>
      `<img loading="lazy" src="${esc(src)}" alt="${esc(property.title)} ${i+1}">`
    ).join('');

  const arrows = property.gallery?.length > 1
    ? `<button class="media-nav media-prev">‹</button>
       <button class="media-nav media-next">›</button>`
    : '';

  const meta = [
    property.bedrooms && `${ICONS.BED} ${property.bedrooms} hab`,
    property.bathrooms && `${ICONS.BATH} ${property.bathrooms} baños`,
    property.area_m2 && `${ICONS.AREA} ${property.area_m2} m²`
  ].filter(Boolean).map(m => `<span>${m}</span>`).join('');

  const favBtn = isLogged ? `
    <button class="fav-btn ${favorites.has(pid) ? 'active' : ''}"
            data-id="${pid}">
      ${ICONS.HEART}
    </button>` : '';

  return templateHTML
    .replace('{{IMAGES}}', images)
    .replace('{{ARROWS}}', arrows)
    .replace('{{PRICE}}',
      property.operation === 'alquiler'
        ? euros(property.price) + ' /mes'
        : euros(property.price)
    )
    .replace('{{RIBBON}}',
      property.tag ? `<span class="ribbon">${cap(property.tag)}</span>` : ''
    )
    .replace('{{TITLE}}', esc(property.title))
    .replace('{{TITLE_URL}}', encodeURIComponent(property.title))
    .replace('{{OPERATION}}', cap(property.operation))
    .replace('{{ADDRESS}}', esc(property.address))
    .replace('{{META}}', meta)
    .replace('{{ICON_HOME}}', ICONS.HOME)
    .replace('{{ID}}', pid)
    .replace('{{FAV_BUTTON}}', favBtn);
}

/* ================= FAVORITOS ================= */
export function initFavoriteButtons({ user, favorites }) {
  if (!user) return;

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      e.stopPropagation(); 
      const id = btn.dataset.id;
      const ref = doc(db, "favorites", user.uid);
      if (favorites.has(id)) {
        favorites.delete(id);
        btn.classList.remove('active');
        await updateDoc(ref, { properties: arrayRemove(id) });
      } else {
        favorites.add(id);
        btn.classList.add('active');
        await setDoc(ref, { properties: arrayUnion(id) }, { merge:true });
      }
    });
  });
}

/* ================= CAROUSEL ================= */
export function initCarousels(scope){
  document.querySelectorAll(`${scope} .media-carousel`).forEach(c=>{
    const track = c.querySelector('.media-track');
    const slides = track.children;
    let i = 0;
    const update = ()=> track.style.transform = `translateX(-${i*100}%)`;
    c.querySelector('.media-prev')?.addEventListener('click',e=>{
      e.preventDefault(); i=(i-1+slides.length)%slides.length; update();
    });
    c.querySelector('.media-next')?.addEventListener('click',e=>{
      e.preventDefault(); i=(i+1)%slides.length; update();
    });
    update();
  });
}
