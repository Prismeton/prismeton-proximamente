const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;
const connectionDistance = 150;
const mouseRange = 100;

let mouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    initCanvas();
});

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
}

initCanvas();
animate();

// Detección de Idioma Avanzada (ES / EN / PT)
const translations = {
    'es': {
        title: 'PRÓXIMAMENTE',
        desc: 'El nuevo estándar en comunicación visual y tecnológica.',
        footer: '© 2026 PRISMETON. TODOS LOS DERECHOS RESERVADOS.'
    },
    'en': {
        title: 'COMING SOON',
        desc: 'The new standard in visual and technological communication.',
        footer: '© 2026 PRISMETON. ALL RIGHTS RESERVED.'
    },
    'pt': {
        title: 'EM BREVE',
        desc: 'O novo padrão em comunicação visual e tecnológica.',
        footer: '© 2026 PRISMETON. TODOS OS DIREITOS RESERVADOS.'
    }
};

const spanishCountries = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'PR', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'UY', 'PA'];
const portugueseCountries = ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST'];

function applyTranslation(code) {
    const finalCode = translations[code] ? code : 'en';
    const content = translations[finalCode];
    
    document.getElementById('coming-soon-title').innerText = content.title;
    document.getElementById('coming-soon-desc').innerText = content.desc;
    document.getElementById('footer-text').innerText = content.footer;
    document.documentElement.lang = finalCode;

    // Actualizar UI de botones y body class
    document.body.className = `lang-${finalCode}`;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${finalCode}`);
    if (activeBtn) activeBtn.classList.add('active');
}

// Función para el selector manual
function setLanguage(code) {
    localStorage.setItem('user-lang', code);
    applyTranslation(code);
    
    // Cambiar la dirección de la URL a /es, /en o /pt
    if (window.location.pathname !== `/${code}`) {
        window.history.pushState({}, '', `/${code}`);
    }
}

async function initLanguage() {
    const path = window.location.pathname.replace(/\//g, '').toLowerCase();
    
    // Si la URL ya tiene /es, /en o /pt, respetarla (no hacer nada más)
    if (translations[path]) {
        applyTranslation(path);
        return;
    }

    // SI ESTÁ EN LA RAÍZ (/): Forzar detección por IP
    console.log("Detectando ubicación para redirección...");
    
    let countryCode = null;

    try {
        // Intento 1: ipwho.is
        const res1 = await fetch('https://ipwho.is/').then(r => r.json());
        if (res1.success) countryCode = res1.country_code;
        else {
            // Intento 2: ipapi.co (fallback)
            const res2 = await fetch('https://ipapi.co/json/').then(r => r.json());
            countryCode = res2.country_code;
        }
    } catch (e) {
        console.warn("Detección IP fallida:", e);
    }

    if (countryCode) {
        let detected = 'en';
        if (spanishCountries.includes(countryCode)) detected = 'es';
        else if (portugueseCountries.includes(countryCode)) detected = 'pt';
        
        console.log(`Redirigiendo a /${detected} basado en país: ${countryCode}`);
        setLanguage(detected);
        return;
    }

    // Si todo lo anterior falla, usar idioma del navegador
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
    const finalLang = translations[browserLang] ? browserLang : 'en';
    setLanguage(finalLang);
}

initLanguage();
