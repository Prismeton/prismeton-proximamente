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
        desc: 'El nuevo estándar en comunicación visual y tecnológica.'
    },
    'en': {
        title: 'COMING SOON',
        desc: 'The new standard in visual and technological communication.'
    },
    'pt': {
        title: 'EM BREVE',
        desc: 'O novo padrão em comunicação visual e tecnológica.'
    }
};

const spanishCountries = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'PR', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'UY', 'PA'];
const portugueseCountries = ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST'];

function applyTranslation(code) {
    const finalCode = translations[code] ? code : 'en';
    const content = translations[finalCode];
    
    document.getElementById('coming-soon-title').innerText = content.title;
    document.getElementById('coming-soon-desc').innerText = content.desc;
    document.documentElement.lang = finalCode;

    // Actualizar UI de botones
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${finalCode}`);
    if (activeBtn) activeBtn.classList.add('active');
}

// Función para el selector manual
function setLanguage(code) {
    localStorage.setItem('user-lang', code);
    applyTranslation(code);
    // Simular "dirección" en la URL sin recargar
    window.history.pushState({}, '', `?lang=${code}`);
}

async function initLanguage() {
    // 1. Prioridad: URL (?lang=es o similar)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && translations[urlLang]) {
        applyTranslation(urlLang);
        return;
    }

    // 2. Prioridad: Selección previa guardada
    const savedLang = localStorage.getItem('user-lang');
    if (savedLang && translations[savedLang]) {
        applyTranslation(savedLang);
        return;
    }

    // 3. Prioridad: Detección por IP (Ubicación real)
    try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();
        
        if (data && data.success) {
            const countryCode = data.country_code;
            if (spanishCountries.includes(countryCode)) {
                applyTranslation('es');
                return;
            }
            if (portugueseCountries.includes(countryCode)) {
                applyTranslation('pt');
                return;
            }
        }
    } catch (e) {
        console.warn('IP check failed');
    }

    // 4. Prioridad: Idioma del Dispositivo/Navegador
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
    applyTranslation(browserLang);
}

initLanguage();
