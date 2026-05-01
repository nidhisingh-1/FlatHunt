import { useRef, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import gsap from 'gsap';
import { TransitionContext } from '../context/TransitionContext';

// Which direction a given route is "deeper" in the flow
const ROUTE_DEPTH: Record<string, number> = {
  '/': 0,
  '/flat-type': 1,
  '/amenities': 2,
  '/location': 3,
  '/search-active': 4,
  '/selected-locations': 5,
  '/preferences': 6,
  '/listings': 7,
};

function depthOf(path: string) {
  if (path.startsWith('/listings/')) return 8;
  return ROUTE_DEPTH[path] ?? 5;
}

export function AnimatedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<'forward' | 'back'>('forward');
  const isAnimatingRef = useRef(false);
  const prevDepthRef = useRef(depthOf(location.pathname));

  // Animate IN whenever the pathname changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const dir = directionRef.current;
    // Softer: slide from a shorter distance, fade-weighted
    const xFrom    = dir === 'forward' ? '32%' : '-14%';
    const scaleFrom = dir === 'forward' ? 0.97 : 1;

    gsap.killTweensOf(el);
    gsap.set(el, { x: xFrom, scale: scaleFrom, opacity: 0 });
    const tween = gsap.to(el, {
      x: 0,
      scale: 1,
      opacity: 1,
      duration: 0.36,
      ease: 'power2.out',
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /** Navigate forward — fade + subtle slide out to the left */
  const go = useCallback(
    (path: string) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      directionRef.current = 'forward';
      prevDepthRef.current = depthOf(location.pathname);

      const el = containerRef.current;
      if (!el) { navigate(path); return; }

      gsap.killTweensOf(el);
      gsap.to(el, {
        x: '-14%',
        scale: 0.98,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(el, { scale: 1, opacity: 1 });
          navigate(path);
        },
      });
    },
    [navigate, location.pathname]
  );

  /** Navigate backward — fade + subtle slide out to the right */
  const goBack = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    directionRef.current = 'back';

    const el = containerRef.current;
    if (!el) { navigate(-1); return; }

    gsap.killTweensOf(el);
    gsap.to(el, {
      x: '22%',
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(el, { opacity: 1 });
        navigate(-1);
      },
    });
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ go, goBack, containerRef }}>
      <div ref={containerRef} className="w-full h-full" style={{ willChange: 'transform, opacity' }}>
        <Outlet />
      </div>
    </TransitionContext.Provider>
  );
}