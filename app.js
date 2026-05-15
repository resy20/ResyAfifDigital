/* ================================================
   RESY & AFIF WEDDING – app.js
   Features: Scroll reveal, Countdown, Music,
             QR Code, RSVP, Wishes, Supabase Backend
   ================================================ */

// ============================================================
// SUPABASE CONFIG
// Ganti dengan URL dan anon key dari project Supabase Anda
// ============================================================
const SUPABASE_URL = 'https://bijessmsedrtfxbnieza.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mmiBBx94Ri1-PjFQE6DyHQ_oElTvxJG';

// Simple Supabase REST helper (no SDK needed)
const sb = {
  async select(table, order = 'created_at') {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=*&order=${order}.desc`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn('Supabase select error:', e.message);
      return null;
    }
  },
  async insert(table, data) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn('Supabase insert error:', e.message);
      return null;
    }
  }
};

// ============================================================
// STATE
// ============================================================
let musicPlaying = false;
let guestName = '';
let qrInstance = null;
let rsvpChoice = 'hadir';

// Fallback data (when Supabase not connected)
const fallbackRsvps = [
  { name: 'Keluarga H. Dadan', count: 4, status: 'hadir', message: 'InsyaAllah kami hadir', created_at: new Date(Date.now()-86400000*2).toISOString() },
  { name: 'Siti Rahayu', count: 2, status: 'hadir', message: '', created_at: new Date(Date.now()-86400000).toISOString() },
  { name: 'Pak Asep Gunawan', count: 3, status: 'ragu', message: 'Insyaallah kami usahakan hadir', created_at: new Date(Date.now()-3600000*5).toISOString() },
];
const fallbackWishes = [
  { name: 'Keluarga Besar Sonjaya', text: 'Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Barakallahu lakuma!', created_at: new Date(Date.now()-86400000*3).toISOString() },
  { name: 'Teh Sari & Kang Ujang', text: 'Semoga pernikahan kalian menjadi awal yang indah untuk perjalanan panjang yang penuh berkah. Aamiin ya Rabbal Alamiin.', created_at: new Date(Date.now()-86400000).toISOString() },
  { name: 'Komunitas Pengajian Al-Hidayah', text: 'Doa kami mengiringi hari bahagia kalian. Semoga menjadi pasangan yang saling menguatkan dalam iman dan amal. 🤲', created_at: new Date(Date.now()-3600000*8).toISOString() },
];

// ============================================================
// UTILITY
// ============================================================
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} hari lalu`;
  if (h > 0) return `${h} jam lalu`;
  if (m > 0) return `${m} menit lalu`;
  return 'Baru saja';
}

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ============================================================
// OPEN INVITATION (cover → main)
// ============================================================
function openInvitation() {
  const cover = document.getElementById('cover');
  const main  = document.getElementById('main');
  const player = document.getElementById('music-player');

  cover.classList.add('hide');
  setTimeout(() => {
    cover.style.display = 'none';
    main.style.display = 'block';
    player.style.display = 'flex';
    initMain();
    // Try autoplay music
    setTimeout(() => tryPlayMusic(), 600);
  }, 800);
}

// ============================================================
// MUSIC
// ============================================================
function tryPlayMusic() {
  const audio = document.getElementById('bg-music');
  audio.volume = 0.55;
  audio.play().then(() => {
    musicPlaying = true;
    updateMusicUI();
  }).catch(() => {
    // Autoplay blocked – user must tap
  });
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
  } else {
    audio.play();
    musicPlaying = true;
  }
  updateMusicUI();
}

function updateMusicUI() {
  document.getElementById('music-icon-play').style.display  = musicPlaying ? 'none' : 'block';
  document.getElementById('music-icon-pause').style.display = musicPlaying ? 'block' : 'none';
}

// ============================================================
// COUNTDOWN
// ============================================================
function startCountdown() {
  const target = new Date('2026-12-27T08:00:00+07:00');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '0');
      return;
    }
    document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children
          const children = entry.target.querySelectorAll('.reveal');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 120);
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ============================================================
// QR CODE
// ============================================================
function initQR(name) {
  const container = document.getElementById('qr-container');
  container.innerHTML = '';
  const qrText = name
    ? `WEDDING:RESY_AFIF|DATE:27122026|GUEST:${name}`
    : 'WEDDING:RESY_AFIF|DATE:27122026';

  if (typeof QRCode !== 'undefined') {
    new QRCode(container, {
      text: qrText,
      width: 180,
      height: 180,
      colorDark: '#4A2E10',
      colorLight: '#FAF3E0',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  const nameDisplay = name || 'Tamu Undangan';
  document.getElementById('qr-name-display').textContent = nameDisplay;
}

// ============================================================
// RSVP
// ============================================================
function selectOpt(el, hiddenId) {
  const row = el.closest('.radio-row');
  row.querySelectorAll('.radio-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById(hiddenId).value = el.dataset.val;
  rsvpChoice = el.dataset.val;
}

async function submitRsvp() {
  const name  = document.getElementById('rsvp-name').value.trim();
  const count = parseInt(document.getElementById('rsvp-count').value) || 1;
  const msg   = document.getElementById('rsvp-msg').value.trim();
  const status = document.getElementById('rsvp-choice').value;

  if (!name) { showToast('⚠️ Mohon isi nama Anda terlebih dahulu'); return; }

  const btn = document.querySelector('#section-rsvp .btn-gold');
  btn.textContent = 'Mengirim...';
  btn.disabled = true;

  const record = { name, count, status, message: msg };
  const result = await sb.insert('rsvp', record);

  if (result) {
    fallbackRsvps.unshift({ ...record, created_at: new Date().toISOString() });
    showToast('✅ Konfirmasi kehadiran terkirim!');
  } else {
    fallbackRsvps.unshift({ ...record, created_at: new Date().toISOString() });
    showToast('✅ Konfirmasi tercatat!');
  }

  document.getElementById('rsvp-name').value = '';
  document.getElementById('rsvp-count').value = '1';
  document.getElementById('rsvp-msg').value = '';
  btn.textContent = 'Kirim Konfirmasi';
  btn.disabled = false;

  await loadRsvps();
}

async function loadRsvps() {
  const container = document.getElementById('rsvp-list');
  const data = (await sb.select('rsvp')) || fallbackRsvps;

  if (!data || data.length === 0) {
    container.innerHTML = '<div class="loading-state">Belum ada konfirmasi. Jadilah yang pertama!</div>';
    return;
  }

  container.innerHTML = data.map(r => `
    <div class="rsvp-item">
      <div>
        <div class="rsvp-name-text">${r.name}</div>
        <div class="rsvp-detail-text">${r.count} tamu · ${timeAgo(r.created_at)}${r.message ? ' · "' + r.message + '"' : ''}</div>
      </div>
      <span class="badge badge-${r.status}">
        ${r.status === 'hadir' ? '✓ Hadir' : r.status === 'tidak' ? '✗ Tidak' : '? Belum Pasti'}
      </span>
    </div>
  `).join('');
}

// ============================================================
// WISHES
// ============================================================
async function submitWish() {
  const name = document.getElementById('wish-name').value.trim();
  const text = document.getElementById('wish-text').value.trim();

  if (!name || !text) { showToast('⚠️ Mohon isi nama dan ucapan Anda'); return; }

  const btn = document.querySelector('#section-wishes .btn-gold');
  btn.textContent = 'Mengirim...';
  btn.disabled = true;

  const record = { name, text };
  const result = await sb.insert('wishes', record);

  if (result) {
    fallbackWishes.unshift({ ...record, created_at: new Date().toISOString() });
    showToast('✅ Ucapan terkirim! Terima kasih 🙏');
  } else {
    fallbackWishes.unshift({ ...record, created_at: new Date().toISOString() });
    showToast('✅ Ucapan tercatat!');
  }

  document.getElementById('wish-name').value = '';
  document.getElementById('wish-text').value = '';
  btn.textContent = 'Kirim Ucapan';
  btn.disabled = false;

  await loadWishes();
}

async function loadWishes() {
  const container = document.getElementById('wishes-list');
  const data = (await sb.select('wishes')) || fallbackWishes;

  if (!data || data.length === 0) {
    container.innerHTML = '<div class="loading-state light">Belum ada ucapan. Jadilah yang pertama! 🌸</div>';
    return;
  }

  container.innerHTML = data.map(w => `
    <div class="wish-card">
      <div class="wish-card-name">${w.name}</div>
      <div class="wish-card-text">"${w.text}"</div>
      <div class="wish-card-time">${timeAgo(w.created_at)}</div>
    </div>
  `).join('');
}

// ============================================================
// INIT MAIN
// ============================================================
async function initMain() {
  startCountdown();
  initScrollReveal();
  await Promise.all([loadRsvps(), loadWishes()]);
  initQR(guestName);
}

// ============================================================
// BOOTSTRAP (on DOM ready)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Read guest name from URL (?to=NamaTamu)
  guestName = getParam('to') || '';

  // Show guest name on cover
  if (guestName) {
    document.getElementById('guest-label').style.display = 'block';
    document.getElementById('guest-name-cover').textContent = guestName;
    // Hero
    document.getElementById('hero-guest').textContent = guestName;
  } else {
    document.getElementById('hero-guest').textContent = 'Bapak/Ibu/Saudara/i';
  }

  // Prefill RSVP name
  if (guestName) {
    const rsvpInput = document.getElementById('rsvp-name');
    if (rsvpInput) rsvpInput.value = guestName;
  }
});
