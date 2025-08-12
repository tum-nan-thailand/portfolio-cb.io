/* ===== THEME ===== */
const $html = document.documentElement;
const $themeBtn = document.getElementById('themeToggle');
$themeBtn?.addEventListener('click', () => {
  const cur = $html.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  $html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ===== I18N ===== */
const I18N = {
  lang: document.documentElement.getAttribute('lang') || 'th',
  dict: {},
  async load(lang){
    const url = `/i18n/${lang}.json`;
    const res = await fetch(url).catch(()=>null);
    I18N.dict = res && res.ok ? await res.json() : {};
  },
  apply(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const txt = key.split('.').reduce((o,k)=>o?.[k], I18N.dict);
      if(typeof txt === 'string') el.textContent = txt;
    });
  },
  async set(lang){
    I18N.lang = lang; localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
    await I18N.load(lang); I18N.apply();
  }
};
const $langBtn = document.getElementById('langToggle');
$langBtn?.addEventListener('click', async ()=>{
  const cur = localStorage.getItem('lang') || 'th';
  await I18N.set(cur === 'th' ? 'en' : 'th');
});
I18N.set(localStorage.getItem('lang') || 'th'); // init

/* ===== PDF.js MODAL ===== */
const pdfViewer = 'https://mozilla.github.io/pdf.js/web/viewer.html?file=';
function openPdfModal(pdfUrl){
  let backdrop = document.getElementById('pdfModalBackdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop'; backdrop.id = 'pdfModalBackdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <header><strong data-i18n="labels.certificate">Certificate</strong>
          <button class="btn" id="closePdf">Close</button></header>
        <iframe id="pdfFrame"></iframe>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.classList.remove('show'); });
    backdrop.querySelector('#closePdf').addEventListener('click', ()=>backdrop.classList.remove('show'));
  }
  const frame = backdrop.querySelector('#pdfFrame');
  frame.src = pdfViewer + encodeURIComponent(pdfUrl);
  backdrop.classList.add('show');
}
// hook all links like: <a class="open-cert" data-pdf="URL">
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a.open-cert');
  if(a){
    e.preventDefault();
    const url = a.getAttribute('data-pdf');
    if(url) openPdfModal(url);
  }
});

/* ===== CONTACT: COPY / VCF / QR ===== */
function makeVCard(info){
  const now = new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  return [
    'BEGIN:VCARD','VERSION:3.0',
    `N:${info.name};;;;`,
    `FN:${info.name}`,
    info.title?`TITLE:${info.title}`:'',
    info.org?`ORG:${info.org}`:'',
    `TEL;TYPE=CELL:${info.tel}`,
    `EMAIL;TYPE=INTERNET:${info.email}`,
    `URL:${info.url}`,
    `REV:${now}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');
}
(function initContact(){
  const root = document.getElementById('my-contact'); if(!root) return;
  const info = {
    name: root.dataset.name || '',
    title: root.dataset.title || '',
    org: root.dataset.org || '',
    email: root.dataset.email || '',
    tel: root.dataset.tel || '',
    url: root.dataset.url || location.href
  };
  const vcf = makeVCard(info);
  document.getElementById('copyEmail')?.addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(info.email); alert('คัดลอกอีเมลแล้ว');
  });
  document.getElementById('copyTel')?.addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(info.tel); alert('คัดลอกเบอร์แล้ว');
  });
  const $vcf = document.getElementById('downloadVcf');
  if($vcf){
    const blob = new Blob([vcf], {type:'text/vcard'});
    $vcf.href = URL.createObjectURL(blob);
  }
  document.getElementById('showQR')?.addEventListener('click', ()=>{
    const data = encodeURIComponent(vcf);
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
    openPdfModal(src.replace('pdf.js/web/viewer.html?file=',''));
    const frame = document.getElementById('pdfFrame');
    const parent = frame.parentElement; const img = new Image(); img.src = src; img.style.width='100%'; img.style.height='calc(100% - 50px)';
    frame.replaceWith(img);
  });
})();

/* ===== PROJECTS: FETCH + SEARCH + TAGS ===== */
const GH_USER = 'tum-nan-thailand';
const API = `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100`;
const $cards = document.getElementById('project-cards');
const $chips = document.getElementById('project-chips');
const $search = document.getElementById('search-projects');
let repos = [], activeTags = new Set();

function repoCard(r){
  const tags = new Set([r.language, ...(r.topics||[]), ...r.name.split('-')].filter(Boolean));
  const tagHtml = [...tags].slice(0,6).map(t=>`<span class="chip" data-chip readonly>${t}</span>`).join(' ');
  return `
  <a class="card" href="${r.html_url}" target="_blank" rel="noopener">
    <h3>${r.name}</h3>
    <p>${r.description||''}</p>
    <small>
      <i class="fa-solid fa-star"></i> ${r.stargazers_count}
      <i class="fa-solid fa-code"></i> ${r.language||'—'}
    </small>
    <div class="tags">${tagHtml}</div>
  </a>`;
}
function render(list){
  $cards && ($cards.innerHTML = list.map(repoCard).join(''));
}
function buildChips(fromRepos){
  const pool = new Set();
  fromRepos.forEach(r=>{
    (r.topics||[]).forEach(t=>pool.add(t));
    if(r.language) pool.add(r.language);
  });
  const arr = [...pool].sort();
  $chips && ($chips.innerHTML = arr.map(t=>`<span class="chip" data-tag="${t}">${t}</span>`).join(''));
}
function filterRepos(){
  const q = ($search?.value||'').toLowerCase().trim();
  return repos.filter(r=>{
    const hay = `${r.name} ${r.description||''} ${(r.topics||[]).join(' ')} ${r.language||''}`.toLowerCase();
    const matchQ = !q || hay.includes(q);
    const tags = new Set([r.language, ...(r.topics||[])].filter(Boolean));
    const matchTags = !activeTags.size || [...activeTags].every(t=>tags.has(t));
    return matchQ && matchTags;
  });
}
$chips?.addEventListener('click',(e)=>{
  const el = e.target.closest('.chip[data-tag]');
  if(!el) return;
  const tag = el.getAttribute('data-tag');
  if(activeTags.has(tag)){ activeTags.delete(tag); el.classList.remove('active'); }
  else { activeTags.add(tag); el.classList.add('active'); }
  render(filterRepos());
});
$search?.addEventListener('input', ()=> render(filterRepos()));

(async function initRepos(){
  const res = await fetch(API, {headers:{'Accept':'application/vnd.github+json'}});
  const data = await res.json();
  repos = (Array.isArray(data)?data:[]).filter(r=>!r.fork);
  buildChips(repos);
  render(repos);
})();

/* ===== Make inline chips clickable for filtering (inside cards) ===== */
document.addEventListener('click',(e)=>{
  const chip = e.target.closest('.chip[data-chip]');
  if(!chip || !chip.textContent) return;
  const tag = chip.textContent.trim();
  const chipFilter = [...document.querySelectorAll('.chip[data-tag]')].find(x=>x.textContent.trim()===tag);
  if(chipFilter) chipFilter.click();
});
