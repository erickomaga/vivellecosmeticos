document.addEventListener('DOMContentLoaded', () => {

  // 1. Atualização do Ano
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Cursor Personalizado (Apenas Desktop)
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    document.querySelectorAll('a, button, .orbit-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { width: 55, height: 55, borderColor: '#C25975', duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { width: 38, height: 38, borderColor: 'rgba(194, 89, 117, 0.4)', duration: 0.3 });
      });
    });
  }

  // 3. Menu Mobile
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileItems = document.querySelectorAll('.mobile-item');
  let isOpen = false;

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        mobileDrawer.classList.remove('opacity-0', 'pointer-events-none');
        mobileToggle.textContent = 'Fechar';
      } else {
        mobileDrawer.classList.add('opacity-0', 'pointer-events-none');
        mobileToggle.textContent = 'Menu';
      }
    });

    mobileItems.forEach(item => {
      item.addEventListener('click', () => {
        isOpen = false;
        mobileDrawer.classList.add('opacity-0', 'pointer-events-none');
        mobileToggle.textContent = 'Menu';
      });
    });
  }

  // 4. LÓGICA DO CARROSSEL INTELIGENTE (AUTO-PLAY + OCULTAÇÃO DE SETAS QUANDO HOUVER SÓ 1 FOTO)
  document.querySelectorAll('.insta-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = carousel.querySelector('.next-btn');
    const prevBtn = carousel.querySelector('.prev-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let autoPlayTimer = null;

    // Se houver apenas 1 foto, esconde totalmente os botões e bolinhas
    if (slides.length <= 1) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      if (dotsContainer) dotsContainer.style.display = 'none';
      return;
    }

    // Criar os marcadores (bolinhas) para produtos com múltiplas fotos
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    const updateCarousel = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');

      prevBtn.style.opacity = index === 0 ? '0' : '1';
      prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = index === slides.length - 1 ? '0' : '1';
      nextBtn.style.pointerEvents = index === slides.length - 1 ? 'none' : 'auto';
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel(currentIndex);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, 4000); // Passa a foto automaticamente a cada 4 segundos
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel(currentIndex);
      }
      startAutoPlay();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel(currentIndex);
      }
      startAutoPlay();
    });

    // Pausa o auto-play ao passar o mouse em cima
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Suporte a Touch no Celular
    let startX = 0;
    let endX = 0;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0 && currentIndex < slides.length - 1) {
          currentIndex++;
        } else if (diffX < 0 && currentIndex > 0) {
          currentIndex--;
        }
        updateCarousel(currentIndex);
      }
      startAutoPlay();
    }, { passive: true });

    updateCarousel(0);
    startAutoPlay();
  });

  // 5. Elemento 3D de Cosméticos em Esfera Sensorial (Three.js Super Otimizado)
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const detailLevel = window.innerWidth < 768 ? 20 : 40;
  const geometry = new THREE.IcosahedronGeometry(1.8, detailLevel);

  const positionAttribute = geometry.attributes.position;
  const originalPositions = [];
  for (let i = 0; i < positionAttribute.count; i++) {
    originalPositions.push(
      positionAttribute.getX(i),
      positionAttribute.getY(i),
      positionAttribute.getZ(i)
    );
  }

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xC25975,
    emissive: 0xFCD9E0,
    roughness: 0.18,
    metalness: 0.08,
    transmission: 0.55,
    thickness: 1.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const dropMesh = new THREE.Mesh(geometry, material);
  scene.add(dropMesh);

  const ambientLight = new THREE.AmbientLight(0xFFF0F3, 1.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xC25975, 2.2, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  let clock = new THREE.Clock();

  function animateDrop() {
    requestAnimationFrame(animateDrop);
    const elapsedTime = clock.getElapsedTime();

    dropMesh.rotation.x = elapsedTime * 0.07;
    dropMesh.rotation.y = elapsedTime * 0.11;

    for (let i = 0; i < positionAttribute.count; i++) {
      const u = originalPositions[i * 3];
      const v = originalPositions[i * 3 + 1];
      const w = originalPositions[i * 3 + 2];

      const distortion = Math.sin(u * 2.2 + elapsedTime * 1.4) * 0.07 + Math.cos(v * 2.2 + elapsedTime * 1.4) * 0.07;

      positionAttribute.setXYZ(
        i,
        u + u * distortion * 0.14,
        v + v * distortion * 0.14,
        w + w * distortion * 0.14
      );
    }
    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animateDrop();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 6. GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  gsap.to(camera.position, {
    z: 1.8,
    ease: 'none',
    scrollTrigger: {
      trigger: '#viewport-content',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  document.querySelectorAll('.orbit-card').forEach(card => {
    const speed = card.getAttribute('data-speed') || 1;
    gsap.to(card, {
      y: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

});