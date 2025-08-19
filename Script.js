// ========== CONFIGURAÇÕES GLOBAIS ==========
const VSL_CONFIG = {
    animationDuration: 800,
    tickerSpeed: 25000, // 25 segundos
    mobileTickerSpeed: 18000, // 18 segundos para mobile
    scrollThreshold: 0.1,
    isMobile: window.innerWidth <= 768
};

// ========== DETECÇÃO DE DISPOSITIVO ==========
function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTabletDevice() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// ========== TICKER OTIMIZADO COM PASSAGEM SUAVE ==========
function initAdvancedTicker() {
    const tickerSections = document.querySelectorAll('.ticker-section');
    
    tickerSections.forEach(tickerSection => {
        const ticker = tickerSection.querySelector('.ticker-content');
        if (!ticker) return;
        
        // Duplicar conteúdo para transição suave infinita
        const originalContent = ticker.innerHTML;
        ticker.innerHTML = originalContent + originalContent + originalContent;
        
        // Ajustar velocidade baseada no dispositivo
        const speed = VSL_CONFIG.isMobile ? 
                      VSL_CONFIG.mobileTickerSpeed : 
                      VSL_CONFIG.tickerSpeed;
        
        ticker.style.animationDuration = `${speed}ms`;
        
        // Controles de pausa apenas para desktop
        if (!VSL_CONFIG.isMobile) {
            tickerSection.addEventListener('mouseenter', () => {
                ticker.style.animationPlayState = 'paused';
            });
            
            tickerSection.addEventListener('mouseleave', () => {
                ticker.style.animationPlayState = 'running';
            });
        }
        
        // Controle de visibilidade da aba
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                ticker.style.animationPlayState = 'paused';
            } else {
                ticker.style.animationPlayState = 'running';
            }
        });
        
        // Reset suave quando a animação termina
        ticker.addEventListener('animationiteration', () => {
            // Garantir continuidade suave
            ticker.style.transform = 'translate3d(100%, 0, 0)';
            requestAnimationFrame(() => {
                ticker.style.transform = '';
            });
        });
    });
}

// ========== ANIMAÇÕES DE SCROLL ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: VSL_CONFIG.scrollThreshold,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== TRACKING E ANALYTICS ==========
function initCTATracking() {
    const mainCTA = document.getElementById('mainCTA');
    
    if (!mainCTA) return;

    mainCTA.addEventListener('click', function(e) {
        // Prevenir clique duplo
        if (this.classList.contains('processing')) {
            e.preventDefault();
            return;
        }

        this.classList.add('processing');
        
        // ADICIONE SEU CÓDIGO DE TRACKING AQUI
        console.log('🚀 CTA Principal clicado!', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            device: VSL_CONFIG.isMobile ? 'mobile' : 'desktop'
        });
        
        // Exemplo Google Analytics 4:
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                event_category: 'engagement',
                event_label: 'main_cta',
                device_type: VSL_CONFIG.isMobile ? 'mobile' : 'desktop'
            });
        }
        
        // Exemplo Facebook Pixel:
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'VSL Landing Page',
                device_type: VSL_CONFIG.isMobile ? 'mobile' : 'desktop'
            });
        }
        
        // Feedback visual
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
        
        // Remover classe processing e restaurar texto após um tempo
        setTimeout(() => {
            this.classList.remove('processing');
            this.innerHTML = originalText;
        }, 2000);
        
        // Exemplo de redirecionamento após tracking:
        // setTimeout(() => {
        //     window.location.href = 'https://seu-link-de-checkout.com';
        // }, 300);
    });
}

// ========== OTIMIZAÇÕES DE PERFORMANCE ==========
function optimizeForDevice() {
    const body = document.body;
    
    // Adicionar classes baseadas no dispositivo
    if (VSL_CONFIG.isMobile) {
        body.classList.add('mobile-device');
    }
    
    if (isTabletDevice()) {
        body.classList.add('tablet-device');
    }
    
    // Reduzir animações em dispositivos menos potentes
    if (VSL_CONFIG.isMobile || window.navigator.hardwareConcurrency <= 2) {
        body.classList.add('reduced-motion');
    }
    
    // Otimizar ticker para performance
    const tickers = document.querySelectorAll('.ticker-content');
    tickers.forEach(ticker => {
        if (VSL_CONFIG.isMobile) {
            ticker.style.willChange = 'transform';
        }
    });
}

// ========== GERENCIAMENTO DE UTM PARAMETERS ==========
function handleUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    // Capturar parâmetros UTM
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
        if (urlParams.get(param)) {
            utmParams[param] = urlParams.get(param);
        }
    });
    
    // Salvar UTMs para uso posterior (sem localStorage)
    window.utmData = utmParams;
    
    // Adicionar UTMs aos links de CTA se existirem
    if (Object.keys(utmParams).length > 0) {
        document.querySelectorAll('.btn-cta').forEach(link => {
            if (link.href && link.href !== '#' && link.href.startsWith('http')) {
                const url = new URL(link.href);
                Object.keys(utmParams).forEach(key => {
                    url.searchParams.set(key, utmParams[key]);
                });
                link.href = url.toString();
            }
        });
    }
    
    console.log('📊 UTM Parameters:', utmParams);
}

// ========== LAZY LOADING PARA VÍDEOS ==========
function initVideoLazyLoading() {
    const videoContainer = document.querySelector('.video-wrapper');
    const placeholder = document.querySelector('.video-placeholder');
    
    if (!videoContainer || !placeholder) return;
    
    // Observer para carregar vídeo quando estiver próximo da viewport
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('🎥 Vídeo na viewport - pode carregar agora');
                videoObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    videoObserver.observe(videoContainer);
}

// ========== CONTROLE DE ORIENTAÇÃO MOBILE ==========
function handleOrientationChange() {
    if (!VSL_CONFIG.isMobile) return;
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Reajustar elementos após mudança de orientação
            const tickers = document.querySelectorAll('.ticker-content');
            tickers.forEach(ticker => {
                ticker.style.animationPlayState = 'paused';
                setTimeout(() => {
                    ticker.style.animationPlayState = 'running';
                }, 100);
            });
        }, 500);
    });
}

// ========== REDIMENSIONAMENTO DA JANELA ==========
function handleWindowResize() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Redetectar se é mobile
            VSL_CONFIG.isMobile = window.innerWidth <= 768;
            
            // Reinicializar ticker com nova velocidade se necessário
            const tickers = document.querySelectorAll('.ticker-content');
            const speed = VSL_CONFIG.isMobile ? 
                          VSL_CONFIG.mobileTickerSpeed : 
                          VSL_CONFIG.tickerSpeed;
            
            tickers.forEach(ticker => {
                ticker.style.animationDuration = `${speed}ms`;
            });
        }, 250);
    });
}

// ========== MELHORIA DA ANIMAÇÃO CSS DO TICKER ==========
function enhanceTickerCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ticker-smooth {
            0% {
                transform: translate3d(100%, 0, 0);
            }
            100% {
                transform: translate3d(-100%, 0, 0);
            }
        }
        
        .ticker-content {
            animation-name: ticker-smooth;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            transform: translate3d(100%, 0, 0);
        }
        
        .ticker-wrapper {
            mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
            -webkit-mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
        }
        
        @media (prefers-reduced-motion: reduce) {
            .ticker-content {
                animation: none;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== INICIALIZAÇÃO ==========
function initVSLLandingPage() {
    console.log('🚀 Inicializando VSL Landing Page...');
    
    // Aguardar DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        enhanceTickerCSS();
        optimizeForDevice();
        initAdvancedTicker();
        initScrollAnimations();
        initSmoothScroll();
        initCTATracking();
        handleUTMParams();
        initVideoLazyLoading();
        handleOrientationChange();
        handleWindowResize();
        
        console.log('✅ VSL Landing Page inicializada!');
    }
}

// ========== INICIAR APLICAÇÃO ==========
initVSLLandingPage();