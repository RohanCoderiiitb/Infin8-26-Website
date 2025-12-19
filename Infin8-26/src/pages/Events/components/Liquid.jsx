import React, { useEffect, useRef } from "react";
import tealBgImg from "../../../assets/events_parallax/1.png";

export default function LiquidBackground() {
  const canvasRef = useRef(null);

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

        if (app.renderer) {
          app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          app.renderer.powerPreference = "high-performance";
        }

        app.loadImage(tealBgImg);
        app.liquidPlane.uniforms.displacementScale.value = 4;
        app.liquidPlane.material.roughness = 0.5;
        app.liquidPlane.material.metalness = 0.7;
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

  return (
    <div className="parallax-layer layer-bg">
      <canvas id="liquid-canvas" ref={canvasRef} />
    </div>
  );
}
