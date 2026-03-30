// ========== SECURITY & PROTECTIONS ==========
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => {
    if(e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
    }
});
document.addEventListener('selectstart', e => {
    if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});
window._sanitize = function(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
};


// ========== SCROLL (LENIS) ==========
if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    
    // Performance improvement during scroll
    lenis.on('scroll', ({ scroll, velocity }) => {
        if (Math.abs(velocity) > 0.5) {
            document.body.style.pointerEvents = 'none';
        } else {
            document.body.style.pointerEvents = 'auto';
        }
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                if(navbar) navbar.classList.add('scrolled');
            } else {
                if(navbar) navbar.classList.remove('scrolled');
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ========== INTERSECTION OBSERVERS ==========
// Reveal Animations
const revealElements = document.querySelectorAll('.reveal-up, .reveal-slide-up, .reveal-slide-down, .reveal-fade');
const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Number Counters
const counters = document.querySelectorAll('.counter');
const speed = 200;
const animateCounters = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const inc = target / speed;
    if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(() => animateCounters(counter), 30);
    } else {
        counter.innerText = target;
    }
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            animateCounters(el);
            observer.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));


// ========== MOBILE MENU ==========
const mobileToggle = document.querySelector('.mobile-toggle');
const desktopMenu = document.querySelector('.desktop-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileToggle && desktopMenu) {
    mobileToggle.addEventListener('click', () => {
        if (desktopMenu.style.display === 'flex') {
            desktopMenu.style.display = 'none';
            mobileToggle.innerHTML = '<i class="ph ph-list"></i>';
        } else {
            desktopMenu.style.display = 'flex';
            desktopMenu.style.flexDirection = 'column';
            desktopMenu.style.position = 'absolute';
            desktopMenu.style.top = '80px';
            desktopMenu.style.left = '0';
            desktopMenu.style.width = '100%';
            desktopMenu.style.background = 'var(--bg-color)';
            desktopMenu.style.padding = '2rem';
            desktopMenu.style.boxShadow = 'var(--shadow-md)';
            mobileToggle.innerHTML = '<i class="ph ph-x"></i>';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                desktopMenu.style.display = 'none';
                mobileToggle.innerHTML = '<i class="ph ph-list"></i>';
            }
        });
    });
}


// ========== WHATSAPP FORM ==========
const waForm = document.getElementById('whatsappForm');
if (waForm) {
    waForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nomeEl = document.getElementById('wa-nome');
        const empresaEl = document.getElementById('wa-empresa');
        const servicoEl = document.getElementById('wa-servico');
        const mensagemEl = document.getElementById('wa-mensagem');
        const politicaEl = document.getElementById('wa-politica');
        
        if (!nomeEl || !empresaEl || !servicoEl || !mensagemEl || !politicaEl) return;
        
        const nome = window._sanitize(nomeEl.value.trim());
        const empresa = window._sanitize(empresaEl.value.trim());
        const servico = window._sanitize(servicoEl.value);
        const mensagem = window._sanitize(mensagemEl.value.trim());
        const aceitouPolitica = politicaEl.checked;
        
        if (aceitouPolitica && nome && empresa && servico && mensagem) {
            const textMessage = `Olá, meu nome é ${nome}.\nEmpresa: ${empresa}\nServiço: ${servico}\nMensagem: ${mensagem}`;
            
            // Format phone number (example placeholder number)
            const phoneNumber = "5511992827016"; 
            
            // Generate WhatsApp URL securely
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
    });
}