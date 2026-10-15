/* ============================================================
   Web cho bà chã Man An — JS chính
   ------------------------------------------------------------
   👉 MUỐN THÊM ẢNH: bỏ file vào thư mục images/ rồi thêm 1 dòng
      vào mảng PHOTOS bên dưới. Xong. Album + khung 3D tự cập nhật.
   ============================================================ */

const PASSWORD = '0502';

const PHOTOS = [
  { src: 'images/manan-1.png', cap: 'cười híp mắt nè 🎀', alt: 'Bé Man An đang cười, tay chống cằm, ngồi trong quán cà phê' },
  // { src: 'images/manan-2.jpg', cap: 'đi chơi hôm đó', alt: 'Man An' },
  // { src: 'images/manan-3.jpg', cap: 'lúc bé giận', alt: 'Man An' },
];

const WRONG_MSGS = [
  'Sai rồi bà chã ơi 🙈 thử lại đi',
  'Hông phải số đó đâu, nghĩ kỹ coi 😏',
  'Ơ kìa, quên luôn hả? 🥲',
  'Gợi ý thêm nè: ngày gì đó quan trọng á 👀',
  'Thôi anh nói luôn nha: 0-5-0-2 😅',
];

const SMALL_NOTES = [
  'ủa coi kỹ ghê 👀',
  'bé xinh thiệt chứ anh hông nịnh',
  'nhớ bật nhạc nha 🎧',
  'còn thư ở tab cuối đó',
  'hôm nay 20/10 vui nha bé 💗',
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ------------------------------------------------------------
   Toast lời nhắn nhỏ
------------------------------------------------------------ */
let toastTimer;
function toast(msg, ms = 2200) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ------------------------------------------------------------
   Tim bay nền (nhẹ, số lượng ít để máy yếu không lag)
------------------------------------------------------------ */
(function bgHearts() {
  const box = $('#bg-hearts');
  const icons = ['💗', '🌸', '💞', '🤍', '🎀', '💖'];
  const small = matchMedia('(max-width: 640px)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const spawn = () => {
    if (document.hidden) return;
    if (box.childElementCount > (small ? 10 : 18)) return;
    const h = document.createElement('span');
    h.className = 'bg-heart';
    h.textContent = icons[(Math.random() * icons.length) | 0];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = 12 + Math.random() * 16 + 'px';
    h.style.setProperty('--sway', (Math.random() * 80 - 40) + 'px');
    const dur = 11 + Math.random() * 9;
    h.style.animationDuration = dur + 's';
    box.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  };
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 600);
  setInterval(spawn, small ? 1600 : 1100);
})();

/* ------------------------------------------------------------
   Tim rớt ra khi bấm bất kỳ đâu
------------------------------------------------------------ */
function burstHeart(x, y, n = 1) {
  const icons = ['💗', '💕', '🌸', '💖'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('span');
    h.className = 'click-heart';
    h.textContent = icons[(Math.random() * icons.length) | 0];
    h.style.left = x + (Math.random() * 30 - 15) + 'px';
    h.style.top = y + (Math.random() * 20 - 10) + 'px';
    h.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }
}
document.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  burstHeart(e.clientX, e.clientY, 1);
});

/* ------------------------------------------------------------
   MÀN HÌNH MẬT KHẨU
------------------------------------------------------------ */
(function lockScreen() {
  document.body.classList.add('locked');
  const input = $('#pin-input');
  const dots = $$('#pin-dots span');
  const msg = $('#lock-msg');
  const card = $('.lock-card');
  const toggle = $('#pin-toggle');
  let wrongCount = 0;
  let busy = false;

  const render = () => {
    dots.forEach((d, i) => d.classList.toggle('on', i < input.value.length));
  };

  const fail = () => {
    msg.textContent = WRONG_MSGS[Math.min(wrongCount, WRONG_MSGS.length - 1)];
    msg.classList.remove('ok');
    wrongCount++;
    card.classList.remove('shake');
    void card.offsetWidth; // restart animation
    card.classList.add('shake');
    if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
    setTimeout(() => { input.value = ''; render(); }, 450);
  };

  const unlock = () => {
    busy = true;
    msg.textContent = 'Đúng rồi 🎉 mở quà nha...';
    msg.classList.add('ok');
    const r = card.getBoundingClientRect();
    burstHeart(r.left + r.width / 2, r.top + r.height / 2, 14);
    setTimeout(() => {
      $('#lock-screen').classList.add('unlocking');
      $('#app').hidden = false;
      document.body.classList.remove('locked');
      setTimeout(() => $('#lock-screen').remove(), 800);
      // Nhạc: đã có tương tác người dùng (bấm mở khoá) nên thử phát luôn
      Music.tryAutoplay();
      setTimeout(() => toast('Chào bé Man An 👋 chúc 20/10 vui nha'), 900);
    }, 700);
  };

  const submit = () => {
    if (busy) return;
    if (input.value.length < 4) { msg.textContent = 'Nhập đủ 4 số đã nha 😗'; msg.classList.remove('ok'); return; }
    input.value === PASSWORD ? unlock() : fail();
  };

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
    render();
    if (input.value.length === 4) setTimeout(submit, 120);
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  $('#keypad').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || busy) return;
    const k = b.dataset.key;
    if (k === 'del') input.value = input.value.slice(0, -1);
    else if (k === 'ok') return submit();
    else if (input.value.length < 4) input.value += k;
    render();
    if (input.value.length === 4 && k !== 'del') setTimeout(submit, 120);
  });

  toggle.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.innerHTML = show ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    input.focus();
  });
})();

/* ------------------------------------------------------------
   ĐIỀU HƯỚNG GIỮA CÁC TRANG
------------------------------------------------------------ */
const Nav = (() => {
  const pages = $$('.page');
  const btns = $$('.nav-btn');
  let current = 'home';
  const visited = new Set(['home']);

  function go(id) {
    if (!$('#' + id) || id === current) return;
    current = id;
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    btns.forEach(b => b.classList.toggle('active', b.dataset.nav === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'frames') Ring.layout();
    if (!visited.has(id)) {
      visited.add(id);
      const hint = { album: SMALL_NOTES[1], frames: 'kéo qua kéo lại thử nha', letter: 'bấm vô phong bì đó' }[id];
      if (hint) setTimeout(() => toast(hint), 500);
    }
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nav]');
    if (t) { e.preventDefault(); go(t.dataset.nav); }
  });
  return { go };
})();

/* ------------------------------------------------------------
   ALBUM + LIGHTBOX
------------------------------------------------------------ */
const Lightbox = (() => {
  const box = $('#lightbox');
  const img = $('#lb-img');
  const cap = $('#lb-cap');
  const count = $('#lb-count');
  let idx = 0;

  function show(i) {
    idx = (i + PHOTOS.length) % PHOTOS.length;
    const p = PHOTOS[idx];
    img.classList.remove('swap'); void img.offsetWidth; img.classList.add('swap');
    img.src = p.src; img.alt = p.alt || 'Man An';
    cap.textContent = p.cap || '';
    count.textContent = `${idx + 1} / ${PHOTOS.length}`;
    const single = PHOTOS.length < 2;
    $('#lb-prev').hidden = single; $('#lb-next').hidden = single;
  }
  function open(i) { show(i); box.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { box.hidden = true; document.body.style.overflow = ''; }

  $('#lb-close').addEventListener('click', close);
  $('#lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  $('#lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // Vuốt trên điện thoại
  let sx = 0, sy = 0;
  box.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(dx < 0 ? idx + 1 : idx - 1);
  }, { passive: true });

  return { open, close };
})();

(function buildAlbum() {
  const grid = $('#album-grid');
  PHOTOS.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'album-item';
    fig.style.animationDelay = (i * 0.07) + 's';
    fig.style.margin = '0';
    fig.innerHTML = `
      <img src="${p.src}" alt="${p.alt || 'Man An'}" loading="lazy">
      <span class="zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
      <figcaption>${p.cap || ''}</figcaption>`;
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Xem ảnh ' + (p.cap || ''));
    fig.addEventListener('click', () => Lightbox.open(i));
    fig.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Lightbox.open(i); } });
    grid.appendChild(fig);
  });
})();

/* ------------------------------------------------------------
   VÒNG XOAY ẢNH 3D (kéo chuột / vuốt tay)
------------------------------------------------------------ */
const Ring = (() => {
  const stage = $('#stage-3d');
  const ring = $('#ring-3d');
  const MIN_ITEMS = 7; // ít ảnh thì lặp lại cho đầy vòng
  let items = [];
  let angle = 0, radius = 320, step = 0;
  let auto = true, rafId = 0, last = 0;
  let dragging = false, startX = 0, startAngle = 0, moved = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build() {
    ring.innerHTML = '';
    items = [];
    const list = [];
    let k = 0;
    while (list.length < Math.max(MIN_ITEMS, PHOTOS.length)) {
      list.push({ ...PHOTOS[k % PHOTOS.length], realIndex: k % PHOTOS.length });
      k++;
    }
    step = 360 / list.length;
    list.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'ring-item';
      el.innerHTML = `<img src="${p.src}" alt="${p.alt || 'Man An'}" draggable="false" loading="lazy"><span>${p.cap || ''}</span>`;
      el.addEventListener('click', () => { if (!moved) Lightbox.open(p.realIndex); });
      ring.appendChild(el);
      items.push(el);
    });
    layout();
  }

  function layout() {
    const w = stage.clientWidth || 600;
    const itemW = matchMedia('(max-width: 640px)').matches ? 170 : 220;
    const n = items.length;
    // bán kính để các khung không đè nhau
    radius = Math.max((itemW + 28) / (2 * Math.tan(Math.PI / n)), Math.min(w * 0.42, 340));
    items.forEach((el, i) => {
      el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
    apply();
  }

  function apply() {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
  }

  function tick(t) {
    if (auto && !dragging && !reduce && !document.hidden) {
      const dt = Math.min(40, t - last);
      angle -= dt * 0.012;
      apply();
    }
    last = t;
    rafId = requestAnimationFrame(tick);
  }

  // Kéo / vuốt
  stage.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; startX = e.clientX; startAngle = angle;
    stage.classList.add('dragging'); ring.classList.add('no-anim');
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    angle = startAngle + dx * 0.35;
    apply();
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('dragging'); ring.classList.remove('no-anim');
    // snap về khung gần nhất
    angle = Math.round(angle / step) * step;
    apply();
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('lostpointercapture', end);

  $('#ring-prev').addEventListener('click', () => { angle += step; apply(); });
  $('#ring-next').addEventListener('click', () => { angle -= step; apply(); });
  const autoBtn = $('#ring-auto');
  autoBtn.addEventListener('click', () => {
    auto = !auto;
    autoBtn.innerHTML = auto ? '<i class="fa-solid fa-pause"></i> Tự xoay' : '<i class="fa-solid fa-play"></i> Tự xoay';
    toast(auto ? 'xoay tiếp nè' : 'dừng lại ngắm cho kỹ hả 😏');
  });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 150); });

  build();
  rafId = requestAnimationFrame(tick);
  return { layout };
})();

/* ------------------------------------------------------------
   PHONG BÌ / THƯ
------------------------------------------------------------ */
(function envelope() {
  const env = $('#envelope');
  const wrap = $('.envelope-wrap');
  const closeBtn = $('#env-close');
  let opened = false;

  function open() {
    if (opened) return;
    opened = true;
    env.classList.add('open'); wrap.classList.add('opened');
    env.setAttribute('aria-expanded', 'true');
    const r = env.getBoundingClientRect();
    burstHeart(r.left + r.width / 2, r.top + r.height * 0.3, 10);
    setTimeout(() => { closeBtn.hidden = false; }, 900);
    setTimeout(() => $('.letter-paper').scrollTop = 0, 50);
  }
  function close() {
    opened = false;
    env.classList.remove('open'); wrap.classList.remove('opened');
    env.setAttribute('aria-expanded', 'false');
    closeBtn.hidden = true;
    toast('đọc lại lúc nào cũng được nha 💌');
  }
  env.addEventListener('click', (e) => {
    if (opened && e.target.closest('.letter-paper')) return; // cho phép cuộn thư
    opened ? null : open();
  });
  env.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opened ? close() : open(); } });
  closeBtn.addEventListener('click', close);
})();

/* ------------------------------------------------------------
   NHẠC NỀN — đúng file bạn gửi (music/nhac-nen.mp4)
------------------------------------------------------------ */
const Music = (() => {
  const audio = $('#bgm');
  const player = $('#music-player');
  const playBtn = $('#music-play');
  const muteBtn = $('#music-mute');
  const status = $('#music-status');
  const eq = $('#eq');
  audio.volume = 0.8;

  function setUI() {
    const playing = !audio.paused && !audio.ended;
    playBtn.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    eq.classList.toggle('playing', playing && !audio.muted);
    muteBtn.innerHTML = audio.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    status.textContent = playing ? (audio.muted ? 'Đang phát (đã tắt tiếng)' : 'Đang phát ♪') : 'Tạm dừng';
  }

  async function play() {
    try {
      await audio.play();
      player.classList.remove('pulse');
    } catch (err) {
      // Trình duyệt chặn tự phát → nhắc bấm nút, KHÔNG phát bất ngờ
      status.textContent = 'Bấm ▶ để nghe nhạc';
      player.classList.add('pulse');
      toast('Bấm nút ▶ ở dưới để nghe nhạc nha 🎧', 3000);
    }
    setUI();
  }
  function pause() { audio.pause(); setUI(); }

  playBtn.addEventListener('click', () => (audio.paused ? play() : pause()));
  muteBtn.addEventListener('click', () => { audio.muted = !audio.muted; setUI(); toast(audio.muted ? 'tắt tiếng rồi' : 'mở tiếng lại nè 🎵'); });
  ['play', 'pause', 'ended', 'volumechange'].forEach(ev => audio.addEventListener(ev, setUI));
  audio.addEventListener('error', () => {
    status.textContent = 'Không tải được nhạc';
    toast('Không tìm thấy file nhạc (music/nhac-nen.mp4) 😢', 4000);
  });

  setUI();
  return { tryAutoplay: play, play, pause };
})();

/* ------------------------------------------------------------
   Lời nhắn nhỏ thỉnh thoảng hiện (không spam)
------------------------------------------------------------ */
(function randomNotes() {
  let i = 0;
  setInterval(() => {
    if (document.hidden || document.body.classList.contains('locked')) return;
    if (!$('#lightbox').hidden) return;
    toast(SMALL_NOTES[i % SMALL_NOTES.length]);
    i++;
  }, 45000);
})();
