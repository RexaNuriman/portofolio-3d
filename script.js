
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

/* =================================
   1. MAIN 3D SCENE
================================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.z = 7;

const canvas = document.querySelector('#webgl');

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


/* =================================
   2. MAIN 3D OBJECT
================================= */

const geometry = new THREE.TorusKnotGeometry(
    1.1, 0.35, 180, 24
);

const material = new THREE.MeshStandardMaterial({
    color: 0x398cff,
    metalness: 0.85,
    roughness: 0.2
});

const object3D = new THREE.Mesh(geometry, material);

object3D.position.set(2, 0, 0);
scene.add(object3D);


/* =================================
   3. MAIN LIGHTING
================================= */

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const pointLight = new THREE.PointLight(0x398cff, 30);
pointLight.position.set(3, 3, 4);
scene.add(pointLight);

const secondLight = new THREE.PointLight(0xffffff, 20);
secondLight.position.set(-4, -2, 3);
scene.add(secondLight);


/* =================================
   4. MAIN PARTICLE BACKGROUND
================================= */

const particleCount = 500;
const particleGeometry = new THREE.BufferGeometry();

const particlePositions = new Float32Array(
    particleCount * 3
);

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    particlePositions[i3] = (Math.random() - 0.5) * 12;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i3 + 2] = 0;
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.08,
    transparent: true,
    opacity: 1,
    sizeAttenuation: false,
    depthWrite: false
});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);
/* =================================
   MAIN CYBER ENVIRONMENT
================================= */

// CYBER GRID
const mainGrid = new THREE.GridHelper(
    30,
    60,
    0x168cff,
    0x12345a
);

mainGrid.position.y = -3;
mainGrid.position.z = -1;
mainGrid.material.transparent = true;
mainGrid.material.opacity = 0.18;

scene.add(mainGrid);
/* MAIN COSMIC NEBULA */

const nebulaCount = 450;
const nebulaGeometry = new THREE.BufferGeometry();

const nebulaPositions = [];
const nebulaColors = [];

const nebulaColorOptions = [
    new THREE.Color(0x168cff),
    new THREE.Color(0x38bdf8),
    new THREE.Color(0x654cff),
    new THREE.Color(0x9333ea)
];

for (let i = 0; i < nebulaCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 12;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.65;
    const z = -12 + Math.random() * 4;

    nebulaPositions.push(x, y, z);

    const color = nebulaColorOptions[
        Math.floor(Math.random() * nebulaColorOptions.length)
    ];

    nebulaColors.push(color.r, color.g, color.b);
}

nebulaGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(nebulaPositions, 3)
);

nebulaGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(nebulaColors, 3)
);

const nebulaMaterial = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
});

const mainNebula = new THREE.Points(
    nebulaGeometry,
    nebulaMaterial
);

scene.add(mainNebula);
/* FLOATING GEOMETRY */

const mainFloatingObjects = [];

for (let i = 0; i < 18; i++) {
    const geometry = i % 2 === 0
        ? new THREE.BoxGeometry(0.3, 0.3, 0.3)
        : new THREE.IcosahedronGeometry(0.2, 1);

    const material = new THREE.MeshStandardMaterial({
        color: 0x168cff,
        emissive: 0x064a8c,
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    const object = new THREE.Mesh(geometry, material);

    object.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
    );

    object.userData.floatSpeed = Math.random() * 0.01 + 0.003;

    mainFloatingObjects.push(object);
    scene.add(object);
}


/* =================================
   5. MAIN SCROLL ANIMATION
================================= */

let scrollProgress = 0;

const heroProfile = document.querySelector('.hero-profile');

window.addEventListener('scroll', () => {

const scrollProgressBar = document.getElementById('scrollProgress');

const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

const scrollPercentage =
    scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

scrollProgressBar.style.width = `${scrollPercentage}%`;

    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    scrollProgress = maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;
});


/* =================================
   6. MAIN ANIMATION LOOP
================================= */

function animate() {
    requestAnimationFrame(animate);

    object3D.rotation.x += 0.003;
    object3D.rotation.y += 0.005;

    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    object3D.position.y =
        Math.sin(Date.now() * 0.001) * 0.15
        - scrollProgress * 1.5;

    object3D.position.x = 2 - scrollProgress * 3;

    camera.position.y = -scrollProgress * 1.5;
    camera.position.z = 7 - scrollProgress * 1.2;

    if (heroProfile) {
        const scale = 1 - scrollProgress * 0.2;
        const moveY = -scrollProgress * 100;

        heroProfile.style.transform =
            `translateY(${moveY}px) scale(${scale})`;
    }
    // FLOATING GEOMETRY ANIMATION
mainFloatingObjects.forEach((object) => {
    object.rotation.x += 0.005;
    object.rotation.y += 0.008;

    object.position.y += object.userData.floatSpeed;

    if (object.position.y > 5) {
        object.position.y = -5;
    }
});
// COSMIC NEBULA ANIMATION
mainNebula.rotation.z += 0.0004;
mainNebula.rotation.x = Math.sin(Date.now() * 0.0001) * 0.04;

    renderer.render(scene, camera);
}

animate();


/* =================================
   7. MAIN RESPONSIVE
================================= */

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/* =================================
   8. SCROLL REVEAL
================================= */

const revealElements = document.querySelectorAll(
    '.content-section > *'
);

revealElements.forEach((element, index) => {
    element.classList.add('reveal');

    if (index === 1) element.classList.add('delay-1');
    if (index === 2) element.classList.add('delay-2');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach((element) => {
    observer.observe(element);
});


/* =================================
   9. STATISTICS COUNT-UP
================================= */

const statsSection = document.querySelector('.about-stats');
const statNumbers = document.querySelectorAll('.stat-number');

let countStarted = false;

function startCountUp() {
    if (countStarted) return;

    countStarted = true;

    statNumbers.forEach((element) => {
        const target = Number(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const current = Math.floor(progress * target);

            element.textContent = String(current).padStart(2, '0');

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = String(target).padStart(2, '0');
            }
        }

        element.textContent = '00';
        requestAnimationFrame(updateNumber);
    });
}

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startCountUp();
                statsObserver.disconnect();
            }
        });
    }, {
        threshold: 0.1
    });

    statsObserver.observe(statsSection);
}


/* =================================
   10. CUSTOM NEON CURSOR
================================= */

const customCursor = document.querySelector('.custom-cursor');

if (customCursor && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (event) => {
        customCursor.style.left = `${event.clientX}px`;
        customCursor.style.top = `${event.clientY}px`;

        customCursor.classList.add('visible');
    });

    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .stat-card, .about-skills span'
    );

    interactiveElements.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
        });

        element.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
        });
    });
}


/* =================================
   11. MAGNETIC BUTTON EFFECT
================================= */

const magneticButtons = document.querySelectorAll('.button');

magneticButtons.forEach((button) => {
    button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});


/* =================================
   12. 3D CYBER PORTAL INTRO
================================= */

const introCanvas = document.querySelector('#introCanvas');
const introScreen = document.querySelector('#introScreen');
const portalFlash = document.querySelector('#portalFlash');
const loadingStatus = document.querySelector('#loadingStatus');


/* =================================
   13. LOADING STATUS
================================= */

const loadingMessages = [
    'INITIALIZING...',
    'LOADING 3D ENVIRONMENT...',
    'CONNECTING TO DIGITAL WORLD...',
    'SYSTEM READY.'
];

let messageIndex = 0;

if (loadingStatus) {
    const loadingInterval = setInterval(() => {
        messageIndex++;

        if (messageIndex < loadingMessages.length) {
            loadingStatus.textContent =
                loadingMessages[messageIndex];

            if (loadingMessages[messageIndex] === 'SYSTEM READY.') {
                loadingStatus.classList.add('glitch-text');
            }
        } else {
            clearInterval(loadingInterval);
        }
    }, 1000);
}


/* =================================
   14. PORTAL SCENE
================================= */

if (introCanvas && introScreen) {

    const introScene = new THREE.Scene();

    const introCamera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    introCamera.position.z = 7;

    const introRenderer = new THREE.WebGLRenderer({
        canvas: introCanvas,
        alpha: true,
        antialias: true
    });

    introRenderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    introRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );


    /* =================================
       15. PORTAL RINGS
    ================================= */

    const portalMaterial = new THREE.MeshStandardMaterial({
        color: 0x168cff,
        emissive: 0x087bff,
        emissiveIntensity: 2,
        metalness: 0.8,
        roughness: 0.2
    });

    const portalRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.045, 16, 120),
        portalMaterial
    );

    introScene.add(portalRing);

    const portalRing2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.025, 16, 120),
        new THREE.MeshBasicMaterial({
            color: 0x38bdf8
        })
    );

    introScene.add(portalRing2);

    const portalRing3 = new THREE.Mesh(
        new THREE.TorusGeometry(2.1, 0.018, 16, 120),
        new THREE.MeshBasicMaterial({
            color: 0x2563eb
        })
    );

    introScene.add(portalRing3);


    /* =================================
       16. PORTAL ENERGY PULSE
    ================================= */

    const pulseGeometry = new THREE.RingGeometry(
        1.8, 2.15, 96
    );

    const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x168cff,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const energyPulse = new THREE.Mesh(
        pulseGeometry,
        pulseMaterial
    );

    introScene.add(energyPulse);


    /* =================================
       17. PORTAL LIGHTING
    ================================= */

    const introLight = new THREE.PointLight(
        0x168cff, 80, 15
    );

    introLight.position.set(0, 0, 3);
    introScene.add(introLight);

    introScene.add(
        new THREE.AmbientLight(0xffffff, 1)
    );


    /* =================================
       18. PORTAL PARTICLES
    ================================= */

    const introParticleGeometry = new THREE.BufferGeometry();

    const introParticlePositions = [];

    for (let i = 0; i < 500; i++) {
        introParticlePositions.push(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 5
        );
    }

    introParticleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            introParticlePositions,
            3
        )
    );

    const introParticleMaterial = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.025,
        transparent: true,
        opacity: 0.8
    });

    const introParticles = new THREE.Points(
        introParticleGeometry,
        introParticleMaterial
    );

    introScene.add(introParticles);


    /* =================================
       19. CYBER GRID
    ================================= */

    const grid = new THREE.GridHelper(
        30, 60, 0x168cff, 0x12345a
    );

    grid.position.y = -2.5;
    grid.position.z = -1;

    introScene.add(grid);


    /* =================================
       20. FLOATING GEOMETRY
    ================================= */

    const floatingObjects = [];

    for (let i = 0; i < 18; i++) {
        const floatingGeometry = i % 2 === 0
            ? new THREE.BoxGeometry(0.25, 0.25, 0.25)
            : new THREE.IcosahedronGeometry(0.18, 0);

        const floatingMaterial = new THREE.MeshStandardMaterial({
            color: 0x168cff,
            emissive: 0x087bff,
            emissiveIntensity: 1.5,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: i % 3 === 0
        });

        const object = new THREE.Mesh(
            floatingGeometry,
            floatingMaterial
        );

        object.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 4
        );

        object.userData.floatSpeed =
            0.005 + Math.random() * 0.01;

        object.userData.startY = object.position.y;

        floatingObjects.push(object);
        introScene.add(object);
    }


    /* =================================
       21. ENERGY BEAMS
    ================================= */

    const beams = [];

    for (let i = 0; i < 12; i++) {
        const beamGeometry = new THREE.BoxGeometry(
            0.015, 5, 0.015
        );

        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35
        });

        const beam = new THREE.Mesh(
            beamGeometry,
            beamMaterial
        );

        beam.position.set(
            (Math.random() - 0.5) * 12,
            0,
            -2
        );

        beam.rotation.z = (Math.random() - 0.5) * 0.5;

        beams.push(beam);
        introScene.add(beam);
    }


    /* =================================
       22. COSMIC NEBULA PARTICLES
    ================================= */

    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = [];

    for (let i = 0; i < 250; i++) {
        nebulaPositions.push(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 10,
            -4 - Math.random() * 3
        );
    }

    nebulaGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            nebulaPositions,
            3
        )
    );

    const nebulaMaterial = new THREE.PointsMaterial({
        color: 0x164eaa,
        size: 0.12,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(
        nebulaGeometry,
        nebulaMaterial
    );

    introScene.add(nebula);


    /* =================================
       23. PORTAL ANIMATION
    ================================= */

    let introActive = true;
    let portalZoom = false;

    function animateIntro() {

        if (!introActive) return;

        requestAnimationFrame(animateIntro);

        // Portal rotation
        portalRing.rotation.z += 0.008;
        portalRing.rotation.x += 0.003;

        portalRing2.rotation.z -= 0.012;
        portalRing3.rotation.z += 0.004;

        // Energy pulse
        const pulseScale =
            1 + Math.sin(Date.now() * 0.002) * 0.08;

        energyPulse.scale.set(
            pulseScale,
            pulseScale,
            1
        );

        pulseMaterial.opacity =
            0.10 + (Math.sin(Date.now() * 0.002) + 1) * 0.08;

        // Particle rotation
        introParticles.rotation.y += 0.0008;

        // Particle suction
        if (portalZoom) {
            const positions =
                introParticleGeometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);

                positions.setXYZ(
                    i,
                    x * 0.96,
                    y * 0.96,
                    z * 0.96
                );
            }

            positions.needsUpdate = true;
        }

        // Floating geometry animation
        floatingObjects.forEach((object) => {
            object.rotation.x += 0.005;
            object.rotation.y += 0.008;

            object.position.y += object.userData.floatSpeed;

            if (object.position.y > 4) {
                object.position.y = -4;
            }
        });

        // Energy beams animation
        beams.forEach((beam, index) => {
            beam.material.opacity =
                0.15 + Math.sin(Date.now() * 0.002 + index) * 0.15;
        });

        // Nebula rotation
        nebula.rotation.z += 0.0003;

        // Camera portal zoom
        if (portalZoom) {
            introCamera.position.z +=
                (2 - introCamera.position.z) * 0.035;
        } else {
            introCamera.position.x =
                Math.sin(Date.now() * 0.0005) * 0.08;
        }

        introRenderer.render(
            introScene,
            introCamera
        );
    }

    animateIntro();


    /* =================================
       24. PORTAL RESPONSIVE
    ================================= */

    window.addEventListener('resize', () => {
        introCamera.aspect =
            window.innerWidth / window.innerHeight;

        introCamera.updateProjectionMatrix();

        introRenderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        introRenderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    });


    /* =================================
       25. CINEMATIC PORTAL TRANSITION
    ================================= */

    setTimeout(() => {

        // Start camera zoom
        portalZoom = true;

        // Blue flash
        if (portalFlash) {
            portalFlash.classList.add('active');
        }

        // Enlarge portal rings
        portalRing.scale.set(2.5, 2.5, 2.5);
        portalRing2.scale.set(2.5, 2.5, 2.5);
        portalRing3.scale.set(2.5, 2.5, 2.5);

        // Disintegration effect
        introScreen.classList.add('disintegrate');

        // Finish transition
        setTimeout(() => {
            introActive = false;
            introScreen.classList.add('hide');
        }, 1000);

    }, 4200);

}
/* =================================
   INTERACTIVE 3D PROJECT CARDS
================================= */

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.03, 1.03, 1.03)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
    });
});

// =============================
// INTERACTIVE TERMINAL
// =============================

const openTerminal = document.getElementById('openTerminal');
const closeTerminal = document.getElementById('closeTerminal');
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');

// Membuka terminal
openTerminal.addEventListener('click', () => {
    terminalOverlay.classList.add('active');
    playTerminalSound();
    bootTerminal();
});

// Menutup terminal
function hideTerminal() {
    terminalOverlay.classList.remove('active');
}

closeTerminal.addEventListener('click', hideTerminal);

// Menutup terminal saat klik area luar
terminalOverlay.addEventListener('click', (event) => {
    if (event.target === terminalOverlay) {
        hideTerminal();
    }
});

// Menutup terminal dengan tombol ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideTerminal();
    }
});

// Menambahkan teks ke terminal
function printTerminal(text, className = '') {
    const line = document.createElement('p');
    line.textContent = text;

// =============================
// TERMINAL BOOT SEQUENCE
// =============================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bootTerminal() {
    const terminalWindow = document.querySelector('.terminal-window');

terminalWindow.classList.remove('glitch');

void terminalWindow.offsetWidth;

terminalWindow.classList.add('glitch');
    terminalOutput.innerHTML = '';
    terminalInput.disabled = true;

    const bootMessages = [
        '> INITIALIZING REXA TERMINAL...',
        '> CONNECTING TO DIGITAL SPACE...',
        '> LOADING PORTFOLIO DATA...',
        '> CHECKING SYSTEM STATUS...',
        '> ALL SYSTEMS ONLINE.',
        ' ',
        'WELCOME TO REXA NURIMAN TERMINAL.',
        'Type "help" to see available commands.'
    ];

    for (const message of bootMessages) {
        printTerminal(message);
        await delay(350);
    }

    terminalInput.disabled = false;
    terminalInput.focus();
}


    if (className) {
        line.className = className;
    }

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Daftar perintah terminal
const terminalCommands = {
    help: () => {
        printTerminal('AVAILABLE COMMANDS:', 'terminal-success');
        printTerminal('about    - About Rexa');
        printTerminal('skills   - View programming skills');
        printTerminal('projects - View portfolio projects');
        printTerminal('contact  - Contact information');
        printTerminal('matrix   - Activate digital rain');
        printTerminal('clear    - Clear terminal');
        printTerminal('exit     - Close terminal');
    },

    about: () => {
        printTerminal('Name: Rexa Nuriman');
        printTerminal('Role: Web Developer');
        printTerminal('Passion: Code, Creativity, Technology');
    },

    skills: () => {
        printTerminal('SKILLS:');
        printTerminal('HTML | CSS | JavaScript');
        printTerminal('PHP | MySQL | Java');
        printTerminal('Three.js');
    },

    projects: () => {
        printTerminal('PORTFOLIO PROJECTS:');
        printTerminal('01 - FilmHub');
        printTerminal('02 - Telkom Company Profile');
        printTerminal('03 - MVC Native PHP');
    },
    
    secret: () => {
    printTerminal(' ');
    printTerminal('================================');
    printTerminal('       ACCESS GRANTED');
    printTerminal('================================');
    printTerminal(' ');
    printTerminal('You discovered a hidden message!');
    printTerminal(' ');
    printTerminal('Every great developer starts');
    printTerminal('with curiosity and creativity.');
    printTerminal(' ');
    printTerminal('- REXA NURIMAN');
    printTerminal(' ');
},


    contact: () => {
        printTerminal('EMAIL: rexanuriman38@gmail.com');
        printTerminal('INSTAGRAM: @rexanrmn');
        printTerminal('TIKTOK: @rxgallagherflyingbirds');
    },
    matrix: () => {
    printTerminal('INITIALIZING MATRIX MODE...');
    startMatrix();
    },

    clear: () => {
        terminalOutput.innerHTML = '';
    },

    exit: () => {
        hideTerminal();
        function hideTerminal() {
    terminalOverlay.classList.remove('active');
    stopMatrix();
}
    }
};

// Menjalankan perintah
terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const command = terminalInput.value.trim().toLowerCase();

    if (!command) return;

    printTerminal(`guest@rexa:~$ ${command}`);

    if (terminalCommands[command]) {
        terminalCommands[command]();
    } else {
        printTerminal(`Command not found: ${command}`);
        printTerminal('Type "help" to see available commands.');
    }

    terminalInput.value = '';
});

// =============================
// TERMINAL DIGITAL SOUND
// =============================

function playTerminalSound() {
    const audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        440,
        audioContext.currentTime + 0.15
    );

    gain.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.2
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);

    oscillator.onended = () => {
        audioContext.close();
    };
}

// =============================
// MATRIX DIGITAL RAIN
// =============================

const matrixCanvas = document.getElementById('matrixCanvas');
const matrixContext = matrixCanvas.getContext('2d');

let matrixAnimation;
let matrixDrops = [];

function startMatrix() {
    matrixCanvas.classList.add('active');

    const width = matrixCanvas.clientWidth;
    const height = matrixCanvas.clientHeight;

    matrixCanvas.width = width;
    matrixCanvas.height = height;

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);

    matrixDrops = Array(columns).fill(1);

    const characters = '01アカサタナハマヤラワ';

    function drawMatrix() {
        matrixContext.fillStyle = 'rgba(0, 8, 0, 0.08)';
        matrixContext.fillRect(0, 0, width, height);

        matrixContext.fillStyle = '#22c55e';
        matrixContext.font = `${fontSize}px monospace`;

        matrixDrops.forEach((y, index) => {
            const character = characters[
                Math.floor(Math.random() * characters.length)
            ];

            matrixContext.fillText(
                character,
                index * fontSize,
                y * fontSize
            );

            if (y * fontSize > height && Math.random() > 0.975) {
                matrixDrops[index] = 0;
            }

            matrixDrops[index]++;
        });
    }

    clearInterval(matrixAnimation);
    matrixAnimation = setInterval(drawMatrix, 50);
}

function stopMatrix() {
    clearInterval(matrixAnimation);
    matrixCanvas.classList.remove('active');
}

/* ============================= */
/* FUTURISTIC LOADING ANIMATION */
/* ============================= */


function startLoadingScreen() {

    const loadingScreen = document.getElementById('loadingScreen');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingBar = document.getElementById('loadingBar');
    const loadingStatus = document.getElementById('loadingStatus');

    if (!loadingScreen || !loadingPercentage || !loadingBar || !loadingStatus) {
        console.error('Loading screen elements tidak ditemukan!');
        return;
    }

    let progress = 0;

    const messages = [
        'BOOTING SYSTEM...',
        'LOADING 3D ENVIRONMENT...',
        'CONNECTING DIGITAL SPACE...',
        'INITIALIZING PORTFOLIO...',
        'SYSTEM READY.'
    ];

    const interval = setInterval(() => {

        progress += Math.floor(Math.random() * 3) + 1;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }

        loadingPercentage.textContent = progress + '%';
        loadingBar.style.width = progress + '%';

        const index = Math.min(
            Math.floor(progress / 25),
            messages.length - 1
        );

        loadingStatus.textContent = messages[index];

        if (progress === 100) {
            setTimeout(() => {
                loadingScreen.classList.add('hide');
            }, 500);
        }

    }, 45);
}

startLoadingScreen();


// =============================
// MAGNETIC NAVIGATION
// =============================

const magneticLinks = document.querySelectorAll('nav a');

magneticLinks.forEach((link) => {

    link.addEventListener('mousemove', (event) => {

        const rect = link.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        link.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0)';
    });

});


 // 3D PROJECT CARD INTERACTION
const interactiveProjectCards = document.querySelectorAll('.project-card');
console.log('Jumlah project card:', interactiveProjectCards.length);

interactiveProjectCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-12px)
            scale(1.02)
        `;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// PROJECT DETAIL INTERACTION

const projectModal = document.getElementById('projectModal');
const closeProjectModal = document.getElementById('closeProjectModal');

const modalProjectTitle = document.getElementById('modalProjectTitle');
const modalProjectDescription = document.getElementById('modalProjectDescription');
const modalProjectTech = document.getElementById('modalProjectTech');
const modalProjectLink = document.getElementById('modalProjectLink');


const projectDetails = [
    {
        title: 'FilmHub',
        description: 'FilmHub merupakan aplikasi pengelolaan data film yang dibuat menggunakan konsep MVC Native PHP.',
        technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'MVC'],
        link: 'https://github.com/RexaNuriman/mvc-native-109062500069'
    },
    {
        title: 'Telkom Company Profile',
        description: 'Website company profile yang menampilkan informasi program studi, berita, dan kontak.',
        technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        link: 'https://github.com/RexaNuriman/telkom-company-profile'
    },
    {
        title: 'MVC Native PHP',
        description: 'Project latihan penerapan arsitektur Model View Controller menggunakan PHP Native.',
        technologies: ['PHP', 'MVC', 'MySQL', 'PDO'],
        link: 'https://github.com/RexaNuriman/mvc-native-php'
    }
];


projectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const project = projectDetails[index];

        if (!project) return;

        modalProjectTitle.textContent = project.title;
        modalProjectDescription.textContent = project.description;

        modalProjectTech.innerHTML = '';

        project.technologies.forEach((tech) => {
            const tag = document.createElement('span');
            tag.textContent = tech;
            modalProjectTech.appendChild(tag);
        });

        modalProjectLink.href = project.link;

        projectModal.classList.add('active');
    });
});

closeProjectModal.addEventListener('click', () => {
    projectModal.classList.remove('active');
});

projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) {
        projectModal.classList.remove('active');
    }
});

// 3D CONTACT CARD INTERACTION

const contactCards = document.querySelectorAll('.contact-card');

contactCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-5px)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
