/* 3D-ish floating particles background
   - Creates a full-screen canvas behind content
   - Uses gentle motion and additive blending for glow
   - Respects prefers-reduced-motion
   - No external libs
*/
(function(){
  const canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  document.body.appendChild(canvas);

  const overlay = document.createElement('div');
  overlay.className = 'bg-overlay';
  document.body.appendChild(overlay);
  // gradient layer (behind canvas)
  const grad = document.createElement('div');
  grad.className = 'bg-gradient';
  document.body.appendChild(grad);

  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, ratio = 1;

  function resize(){
    ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(window.innerWidth * ratio));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * ratio));
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(ratio,0,0,ratio,0,0);
    w = window.innerWidth; h = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  ctx.globalCompositeOperation = 'lighter';

  const particles = [];
  function makeParticles(){
    particles.length = 0;
    const base = Math.round((w + h) / 30);
    const count = Math.max(24, base);
    for(let i=0;i<count;i++){
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * Math.max(w,h) / 2 + 20,
        radius: 6 + Math.random() * 36,
        speed: 0.0008 + Math.random() * 0.0028,
        z: (Math.random() * 2 - 1) * 800,
        hue: 190 + Math.random() * 120
      });
    }
  }
  makeParticles();

  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e)=>{ mx = (e.clientX / Math.max(1,w) - 0.5); my = (e.clientY / Math.max(1,h) - 0.5); });

  // pointer interaction for a subtle burst
  window.addEventListener('pointerdown', ()=>{ for(const p of particles) p.speed *= 1.8; setTimeout(()=>{ for(const p of particles) p.speed /= 1.8; }, 420); });

  let last = performance.now();
  function frame(t){
    const dt = t - last; last = t;
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.angle += p.speed * dt;
      const cx = w/2 + mx * 120;
      const cy = h/2 + my * 60;
      const x3 = cx + Math.cos(p.angle) * p.distance;
      const y3 = cy + Math.sin(p.angle) * p.distance * 0.6;
      const perspective = 900 / (900 + p.z);
      const x = (x3 - cx) * perspective + cx;
      const y = (y3 - cy) * perspective + cy;
      const r = p.radius * perspective;
      const g = ctx.createRadialGradient(x,y,0,x,y,r*2);
      g.addColorStop(0, `hsla(${p.hue},80%,60%,0.95)`);
      g.addColorStop(0.5, `hsla(${p.hue+20},80%,50%,0.35)`);
      g.addColorStop(1, `hsla(${p.hue+40},80%,40%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // regenerate particles on resize (throttled)
  let regenTimer;
  window.addEventListener('resize', ()=>{ clearTimeout(regenTimer); regenTimer = setTimeout(()=>{ makeParticles(); }, 120); });

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    canvas.style.display = 'none';
    overlay.style.display = 'none';
  }

})();
