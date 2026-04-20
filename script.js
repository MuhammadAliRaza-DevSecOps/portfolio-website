/* ============================================================
   ALI RAZA — PREMIUM PORTFOLIO SCRIPT
   Canvas Particles | Typing | 3D Card | Chatbot | Counters
   ============================================================ */

"use strict";

// ============================================================
// 1. INIT AOS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  initCanvas();
  initCustomCursor();
  initNavbar();
  initTypingEffect();
  initHero3DCard();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initTimeline();
  initChatbot();
  initContactForm();
  initCVUpload();
  initNavHighlight();
});

// ============================================================
// 2. CANVAS PARTICLE BACKGROUND
// ============================================================
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouseX = -999, mouseY = -999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  // Track mouse
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  // Particle class
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : H + 10;
      this.r   = Math.random() * 1.8 + 0.4;
      this.vx  = (Math.random() - 0.5) * 0.3;
      this.vy  = -(Math.random() * 0.5 + 0.1);
      this.alpha = Math.random() * 0.6 + 0.1;
      this.hue = Math.random() > 0.5 ? 195 : 270; // cyan or purple
    }
    update() {
      // subtle mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        this.vx += (dx / dist) * 0.04;
        this.vy += (dy / dist) * 0.04;
      }
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  const COUNT = Math.min(180, Math.floor(W * H / 8000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Connect nearby particles
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.save();
          ctx.globalAlpha = (1 - d/110) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00c8ff';
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  // Hexagonal grid overlay (very subtle)
  function drawHexGrid() {
    const size = 60;
    ctx.save();
    ctx.globalAlpha = 0.025;
    ctx.strokeStyle = '#0080ff';
    ctx.lineWidth = 0.8;
    const cols = Math.ceil(W / (size * 1.5)) + 2;
    const rows = Math.ceil(H / (size * Math.sqrt(3))) + 2;
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * size * 1.5;
        const y = row * size * Math.sqrt(3) + (col % 2 === 0 ? 0 : size * Math.sqrt(3) / 2);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + size * 0.9 * Math.cos(angle);
          const py = y + size * 0.9 * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawHexGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================================
// 3. CUSTOM CURSOR
// ============================================================
function initCustomCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });

  function smoothRing() {
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(smoothRing);
  }
  smoothRing();

  // Enlarge on hover of interactive elements
  document.querySelectorAll('a, button, .project-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '54px';
      ring.style.height = '54px';
      ring.style.background = 'rgba(0,200,255,0.08)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.background = 'transparent';
    });
  });
}

// ============================================================
// 4. NAVBAR
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ============================================================
// 5. TYPING EFFECT
// ============================================================
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'DevSecOps Engineer',
    'Cybersecurity Enthusiast',
    'Cloud & Automation',
    'Python | Django | Networking',
    'Building Secure Systems',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  type();
}

// ============================================================
// 6. HERO 3D CARD TILT
// ============================================================
function initHero3DCard() {
  const card = document.getElementById('heroCard');
  if (!card) return;
  const inner = card.querySelector('.card-inner');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -14;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  14;
    inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ============================================================
// 7. SKILL BARS
// ============================================================
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

// ============================================================
// 8. ANIMATED COUNTERS
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const target = +el.getAttribute('data-count');
        let current = 0;
        const step  = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          }
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ============================================================
// 9. PROJECT FILTER
// ============================================================
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card, i) => {
        const cats = card.getAttribute('data-category') || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = (i * 80) + 'ms';
          card.style.animation = 'none';
          void card.offsetWidth; // trigger reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================================
// 10. TIMELINE ANIMATION
// ============================================================
function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // Hack: add a style rule for tl-animate
  const style = document.createElement('style');
  style.textContent = '.tl-animate { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
}

// ============================================================
// 11. NAV HIGHLIGHT ON SCROLL
// ============================================================
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

// ============================================================
// 12. CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00b34a, #00ff88)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ============================================================
// 13. CV UPLOAD AREA
// ============================================================
function initCVUpload() {
  const area  = document.getElementById('cvUploadArea');
  const input = document.getElementById('cvFileInput');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  area.addEventListener('dragover', e => {
    e.preventDefault();
    area.style.borderColor = 'var(--clr-primary)';
    area.style.background  = 'rgba(0,200,255,0.07)';
  });
  area.addEventListener('dragleave', () => {
    area.style.borderColor = '';
    area.style.background  = '';
  });
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.style.borderColor = '';
    area.style.background  = '';
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
  });

  function handleFile(file) {
    area.querySelector('p').textContent = `✓ ${file.name} ready`;
    area.querySelector('span').textContent = 'Replace the assets/resume.pdf to make this permanent';
    area.style.borderColor = '#00ff88';
  }
}

// ============================================================
// 14. AI CHATBOT
// ============================================================
function initChatbot() {
  const toggle   = document.getElementById('chatbotToggle');
  const panel    = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const input    = document.getElementById('chatbotInput');
  const sendBtn  = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const quickBtns = document.querySelectorAll('.quick-btn');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      addUserMsg(q);
      setTimeout(() => addBotMsg(getResponse(q)), 500);
    });
  });

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

  function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    addUserMsg(text);
    input.value = '';
    setTimeout(() => addBotMsg(getResponse(text)), 600);
  }

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'user-msg';
    div.innerHTML = `<div class="msg-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMsg(html) {
    const div = document.createElement('div');
    div.className = 'bot-msg';
    div.innerHTML = `<div class="msg-bubble">${html}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getResponse(input) {
    const q = input.toLowerCase();

    if (contains(q, ['skill', 'tech', 'know', 'stack', 'language'])) {
      return `Ali's core skills include:<br>
        🛡️ <strong>DevSecOps</strong> (Docker, Kubernetes, CI/CD)<br>
        🔐 <strong>Cybersecurity</strong> (ethical hacking, pentesting)<br>
        ☁️ <strong>Cloud</strong> (AWS, automation)<br>
        🐍 <strong>Python & Django</strong><br>
        🐧 <strong>Linux, Git, Networking</strong>`;
    }
    if (contains(q, ['project', 'work', 'built', 'app', 'repo'])) {
      return `Ali's key projects:<br>
        🛒 <strong>Shopcart Pro</strong> — Full-stack e-commerce<br>
        🗄️ <strong>HTML JS Node Mongo App</strong> — Full-stack MERN<br>
        🗳️ <strong>Decentralized Voting System</strong> — Blockchain security<br>
        🐍 <strong>Python Tasks</strong> — Algorithms & logic<br>
        All on <a href="https://github.com/MuhammadAliRaza-DevSecOps" target="_blank" style="color:var(--clr-primary)">GitHub →</a>`;
    }
    if (contains(q, ['edu', 'degree', 'university', 'college', 'study', 'cgpa', 'gpa'])) {
      return `🎓 Ali is studying <strong>BS Computer Science</strong> at <strong>NCBA&E</strong>, Lahore.<br>CGPA: <strong>3.85 / 4.00</strong> 🌟`;
    }
    if (contains(q, ['cert', 'certif', 'course', 'license'])) {
      return `Ali's certifications:<br>
        🕵️ Ethical Hacking & Cybersecurity<br>
        🤖 AI Chatbot Development<br>
        🐍 Python Programming<br>
        🐧 Linux & DevOps Fundamentals<br>
        ☁️ Cloud & Automation`;
    }
    if (contains(q, ['contact', 'email', 'reach', 'hire', 'message'])) {
      return `You can reach Ali at:<br>
        📧 <a href="mailto:infoman55.it@gmail.com" style="color:var(--clr-primary)">infoman55.it@gmail.com</a><br>
        📍 Lahore, Pakistan`;
    }
    if (contains(q, ['github', 'repo', 'code', 'open source'])) {
      return `🐙 Ali's GitHub: <a href="https://github.com/MuhammadAliRaza-DevSecOps" target="_blank" style="color:var(--clr-primary)">MuhammadAliRaza-DevSecOps →</a><br>Find all his projects, repos, and contributions there!`;
    }
    if (contains(q, ['linkedin', 'profile', 'network', 'professional'])) {
      return `💼 Ali's LinkedIn: <a href="https://www.linkedin.com/in/ali-raza-0b9b52228" target="_blank" style="color:var(--clr-primary)">ali-raza-0b9b52228 →</a>`;
    }
    if (contains(q, ['platform', 'freelance', 'upwork', 'fiverr', 'tryhackme', 'htb'])) {
      return `Ali is active on:<br>
        💼 LinkedIn & GitHub<br>
        💻 Upwork, Fiverr, Freelancer<br>
        🎯 TryHackMe & Hack The Box<br>
        ✍️ Dev.to / Medium`;
    }
    if (contains(q, ['cv', 'resume', 'download', 'pdf'])) {
      return `📄 Download Ali's CV from the <a href="#cv" style="color:var(--clr-primary)">CV section ↑</a> on this portfolio! Click <strong>View CV</strong> or <strong>Download CV</strong>.`;
    }
    if (contains(q, ['hi', 'hello', 'hey', 'greet'])) {
      return `Hey there! 👋 I'm Ali's portfolio assistant. Ask me about his <strong>skills, projects, education, or contact info</strong>!`;
    }
    if (contains(q, ['goal', 'target', 'aim', 'google', 'microsoft', 'amazon'])) {
      return `🚀 Ali is targeting top global companies like <strong>Google, Microsoft, Amazon</strong> for DevSecOps, Cybersecurity, and Cloud roles. He's building skills specifically aligned with their hiring standards!`;
    }
    if (contains(q, ['location', 'where', 'country', 'city', 'pakistan', 'lahore'])) {
      return `📍 Ali is based in <strong>Lahore, Pakistan</strong> and is open to remote and international opportunities.`;
    }
    return `Great question! I can help with info about Ali's <strong>skills, projects, education, certifications, contact</strong>, or <strong>GitHub/LinkedIn</strong>. What would you like to know? 😊`;
  }

  function contains(str, arr) {
    return arr.some(kw => str.includes(kw));
  }
}

// ============================================================
// 15. SMOOTH SECTION REVEALS (fallback for AOS)
// ============================================================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.section-header, .glass-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ============================================================
// 16. GLOW CURSOR TRAIL (subtle)
// ============================================================
(function trailEffect() {
  const trail = [];
  const trailCount = 8;

  for (let i = 0; i < trailCount; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed; border-radius:50%;
      pointer-events:none; z-index:9990;
      transform:translate(-50%,-50%);
      transition: opacity 0.4s;
    `;
    document.body.appendChild(d);
    trail.push({ el: d, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    let lx = mx, ly = my;
    trail.forEach((t, i) => {
      const dx = lx - t.x;
      const dy = ly - t.y;
      t.x += dx * (0.35 - i * 0.03);
      t.y += dy * (0.35 - i * 0.03);
      const size = Math.max(1, (trailCount - i) * 0.8);
      const alpha = ((trailCount - i) / trailCount) * 0.25;
      t.el.style.cssText += `
        left:${t.x}px; top:${t.y}px;
        width:${size}px; height:${size}px;
        background:rgba(0,200,255,${alpha});
        box-shadow: 0 0 ${size * 2}px rgba(0,200,255,${alpha});
      `;
      lx = t.x; ly = t.y;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ============================================================
// 17. PLATFORM CARDS HOVER GLOW
// ============================================================
document.querySelectorAll('.platform-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(0,200,255,0.15)';
  });
  card.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
  });
});

// ============================================================
// 18. SECTION SEPARATOR EFFECT
// ============================================================
(function sectionSeparators() {
  document.querySelectorAll('.section').forEach(section => {
    const sep = document.createElement('div');
    sep.style.cssText = `
      position:absolute; bottom:0; left:0; right:0; height:1px;
      background:linear-gradient(90deg, transparent, rgba(0,200,255,0.15), rgba(168,85,247,0.15), transparent);
      pointer-events:none; z-index:0;
    `;
    section.style.position = 'relative';
    section.appendChild(sep);
  });
})();
