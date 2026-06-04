import React, { useEffect, useRef } from 'react';

const SatinRibbons: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  let time = 0;
  let lastFrameTime = performance.now();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      
      if (width === 0 || height === 0) return;
      
      // Set canvas size accounting for device pixel ratio
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Wave configuration - multiple layers covering entire panel
    const waves = [
      {
        amplitude: 100,
        frequency: 0.003,
        speed: 0.08,
        yOffset: height * 0.1,
        alpha: 0.15,
        phase: 0
      },
      {
        amplitude: 120,
        frequency: 0.002,
        speed: 0.06,
        yOffset: height * 0.25,
        alpha: 0.18,
        phase: Math.PI / 3
      },
      {
        amplitude: 90,
        frequency: 0.004,
        speed: 0.1,
        yOffset: height * 0.45,
        alpha: 0.12,
        phase: Math.PI / 2
      },
      {
        amplitude: 110,
        frequency: 0.0025,
        speed: 0.07,
        yOffset: height * 0.65,
        alpha: 0.14,
        phase: Math.PI
      },
      {
        amplitude: 85,
        frequency: 0.0035,
        speed: 0.09,
        yOffset: height * 0.85,
        alpha: 0.1,
        phase: Math.PI * 1.5
      }
    ];

    const render = () => {
      // Calculate delta time for smooth animation
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      
      // Increment time continuously for infinite movement
      time += deltaTime * 0.8;

      if (width === 0 || height === 0) {
        resize();
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // Update wave yOffsets based on current height to cover entire panel
      waves[0].yOffset = height * 0.1;
      waves[1].yOffset = height * 0.25;
      waves[2].yOffset = height * 0.45;
      waves[3].yOffset = height * 0.65;
      waves[4].yOffset = height * 0.85;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Enable anti-aliasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw each wave layer covering from top to bottom
      waves.forEach((wave) => {
        ctx.beginPath();
        
        // Start from left edge at top
        ctx.moveTo(0, 0);
        
        // Draw wave using sine function with multiple frequencies for organic feel
        for (let x = 0; x <= width; x += 2) {
          // Primary wave
          const primaryWave = Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
          
          // Secondary wave for more complex pattern
          const secondaryWave = Math.cos(x * wave.frequency * 1.5 + time * wave.speed * 0.7) * (wave.amplitude * 0.3);
          
          // Tertiary wave for fine detail
          const tertiaryWave = Math.sin(x * wave.frequency * 3 + time * wave.speed * 1.2) * (wave.amplitude * 0.15);
          
          const y = Math.max(0, Math.min(height, wave.yOffset + primaryWave + secondaryWave + tertiaryWave));
          ctx.lineTo(x, y);
        }
        
        // Complete the wave shape by closing at bottom
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Fill with white and transparency
        ctx.fillStyle = `rgba(255, 255, 255, ${wave.alpha})`;
        ctx.fill();
      });

      // Continue animation infinitely
      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start animation immediately
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay will-change-transform"
    />
  );
};

export default SatinRibbons;