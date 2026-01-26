import { useEffect, useRef } from 'react';

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 星星
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }

    // 星云粒子
    interface NebulaParticle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
      vx: number;
      vy: number;
    }

    // 能量环
    interface EnergyRing {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      color: string;
    }

    // 流星
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      active: boolean;
    }

    const stars: Star[] = [];
    const nebulaParticles: NebulaParticle[] = [];
    const energyRings: EnergyRing[] = [];
    const meteors: Meteor[] = [];

    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(200, 220, 255,',
      'rgba(255, 200, 200,',
      'rgba(200, 255, 255,',
      'rgba(255, 230, 200,',
    ];

    const nebulaColors = [
      'rgba(100, 50, 150,',
      'rgba(50, 100, 150,',
      'rgba(150, 50, 100,',
      'rgba(80, 120, 180,',
    ];

    // 初始化星星
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 初始化星云粒子
    for (let i = 0; i < 50; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 150 + 50,
        opacity: Math.random() * 0.08 + 0.02,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    // 创建能量环
    const createEnergyRing = () => {
      if (energyRings.length >= 3) return;
      energyRings.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2 + (Math.random() - 0.5) * 200,
        radius: 0,
        maxRadius: Math.random() * 200 + 100,
        opacity: 0.3,
        color: `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 100}, ${200 + Math.random() * 55},`,
      });
    };

    // 创建流星
    const createMeteor = () => {
      if (meteors.filter((m) => m.active).length >= 2) return;
      meteors.push({
        x: Math.random() * canvas.width,
        y: -50,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 12 + 8,
        opacity: 1,
        active: true,
      });
    };

    const meteorInterval = setInterval(() => {
      if (Math.random() > 0.8) createMeteor();
    }, 3000);

    const ringInterval = setInterval(() => {
      if (Math.random() > 0.6) createEnergyRing();
    }, 5000);

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.016;

      // 深空渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, '#0a0515');
      gradient.addColorStop(0.3, '#0d0a20');
      gradient.addColorStop(0.6, '#08061a');
      gradient.addColorStop(1, '#030208');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制星云
      nebulaParticles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界循环
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        const nebulaGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );
        nebulaGradient.addColorStop(0, particle.color + (particle.opacity * 1.5) + ')');
        nebulaGradient.addColorStop(0.5, particle.color + (particle.opacity * 0.5) + ')');
        nebulaGradient.addColorStop(1, particle.color + '0)');

        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(
          particle.x - particle.size,
          particle.y - particle.size,
          particle.size * 2,
          particle.size * 2
        );
      });

      // 绘制能量环
      energyRings.forEach((ring, index) => {
        ring.radius += 1;
        ring.opacity = 0.3 * (1 - ring.radius / ring.maxRadius);

        if (ring.radius < ring.maxRadius) {
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color + ring.opacity + ')';
          ctx.lineWidth = 2;
          ctx.stroke();

          // 内环
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = ring.color + (ring.opacity * 0.5) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          energyRings.splice(index, 1);
        }
      });

      // 绘制星星
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const currentOpacity = star.opacity * (0.4 + twinkle * 0.6);

        // 星星本体
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color + currentOpacity + ')';
        ctx.fill();

        // 光晕效果
        if (star.size > 1.2) {
          const glowGradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 4
          );
          glowGradient.addColorStop(0, star.color + (currentOpacity * 0.5) + ')');
          glowGradient.addColorStop(1, star.color + '0)');
          ctx.fillStyle = glowGradient;
          ctx.fillRect(
            star.x - star.size * 4,
            star.y - star.size * 4,
            star.size * 8,
            star.size * 8
          );
        }

        // 十字星芒
        if (star.size > 1.8 && currentOpacity > 0.6) {
          const rayLength = star.size * 6;
          ctx.strokeStyle = star.color + (currentOpacity * 0.4) + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - rayLength, star.y);
          ctx.lineTo(star.x + rayLength, star.y);
          ctx.moveTo(star.x, star.y - rayLength);
          ctx.lineTo(star.x, star.y + rayLength);
          ctx.stroke();
        }
      });

      // 绘制流星
      meteors.forEach((meteor, index) => {
        if (!meteor.active) return;

        const tailX = meteor.x - meteor.length * 0.5;
        const tailY = meteor.y - meteor.length;

        const meteorGradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          tailX,
          tailY
        );
        meteorGradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        meteorGradient.addColorStop(0.3, `rgba(200, 220, 255, ${meteor.opacity * 0.6})`);
        meteorGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

        ctx.strokeStyle = meteorGradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // 流星头部光晕
        const headGlow = ctx.createRadialGradient(
          meteor.x,
          meteor.y,
          0,
          meteor.x,
          meteor.y,
          10
        );
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        headGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = headGlow;
        ctx.fillRect(meteor.x - 10, meteor.y - 10, 20, 20);

        meteor.x += meteor.speed * 0.5;
        meteor.y += meteor.speed;
        meteor.opacity -= 0.008;

        if (meteor.y > canvas.height + 100 || meteor.opacity <= 0) {
          meteor.active = false;
          meteors.splice(index, 1);
        }
      });

      // 中心微弱光晕（宇宙之眼）
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.4,
        0,
        canvas.width / 2,
        canvas.height * 0.4,
        300
      );
      const pulseOpacity = 0.03 + Math.sin(time * 0.5) * 0.02;
      centerGlow.addColorStop(0, `rgba(120, 100, 200, ${pulseOpacity})`);
      centerGlow.addColorStop(0.5, `rgba(80, 60, 150, ${pulseOpacity * 0.5})`);
      centerGlow.addColorStop(1, 'rgba(50, 30, 100, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(meteorInterval);
      clearInterval(ringInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
