import { useEffect, useRef } from "react";
import tealBgImg from "../../../assets/events_parallax/1.png";

export default function LiquidBackground() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let app = null;
    let mounted = true;

    const initLiquid = async () => {
      if (!canvasRef.current || !mounted) return;

      try {
        const module = await import(
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js"
        );

        if (!mounted) return;

        const LiquidBg = module.default;
        app = LiquidBg(canvasRef.current);
        appRef.current = app;

        if (app.renderer) {
          app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          app.renderer.powerPreference = "high-performance";
        }

        app.loadImage(tealBgImg);

        app.liquidPlane.uniforms.displacementScale.value = 8.0;
        app.liquidPlane.material.roughness = 0.15;
        app.liquidPlane.material.metalness = 0.85;

        app.setRain(false);
      } catch (error) {
        console.error("Liquid background failed:", error);
      }
    };

    const timer = setTimeout(initLiquid, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (app?.renderer) {
        app.renderer.dispose();
        app.renderer.forceContextLoss();
      }
    };
  }, []);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e) => {
      if (!appRef.current || typeof appRef.current.addDrop !== "function")
        return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastX = e.clientX;
      lastY = e.clientY;

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (speed > 2) {
        const strength = Math.min(speed * 0.002, 0.15);
        const radius = 0.05 + Math.min(speed * 0.001, 0.05);

        appRef.current.addDrop(x, y, radius, strength);
      }
    };

    const ambientInterval = setInterval(() => {
      if (
        appRef.current &&
        typeof appRef.current.addDrop === "function" &&
        Math.random() > 0.6
      ) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        appRef.current.addDrop(x, y, 0.08, 0.02);
      }
    }, 2500);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(ambientInterval);
    };
  }, []);

  return (
    <div className="parallax-layer layer-bg">
      <canvas id="liquid-canvas" ref={canvasRef} />
    </div>
  );
}
