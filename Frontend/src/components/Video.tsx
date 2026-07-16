import { useRef, useEffect } from "react";

interface GrainyVideoCarouselProps {
  videos: { url: string; title: string }[];
  height?: number;
  cardWidth?: number;
  speed?: number;
  fadeColor?: string;
}

export function GrainyVideoCarousel({
  videos,
  height = 480,
  cardWidth = 200,
  speed = 0.6,
  fadeColor = "#f3f4f6",
}: GrainyVideoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPos = useRef(0);

  const GAP = 16;
  const ITEM_W = cardWidth + GAP;
  // One full set width — we reset by exactly this amount for seamless loop
  const SET_W = videos.length * ITEM_W;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!isDragging.current) {
        posRef.current += speed;
        // When we've scrolled a full set, reset — visually seamless because
        // the track has 3 identical copies so the pattern just continues
        if (posRef.current >= SET_W) {
          posRef.current -= SET_W;
        }
      }
      track.style.transform = `translateX(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [speed, SET_W]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startPos.current = posRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = startX.current - e.clientX;
    posRef.current = startPos.current + dx;
    // keep within [0, SET_W) so loop stays intact
    posRef.current = ((posRef.current % SET_W) + SET_W) % SET_W;
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  // 3 copies = always enough content to fill any screen width seamlessly
  const loopedVideos = [...videos, ...videos, ...videos];

  return (
    <div
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        position: "relative",
        cursor: "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Left/right fade edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 9,
          pointerEvents: "none",
          background: `linear-gradient(to right, ${fadeColor} 0%, transparent 10%, transparent 90%, ${fadeColor} 100%)`,
        }}
      />

      {/* Infinite scroll track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: `${GAP}px`,
          padding: "12px 0",
          willChange: "transform",
          userSelect: "none",
          // No width constraint — let it be as wide as all cards need
        }}
      >
        {loopedVideos.map((v, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: `${cardWidth}px`,
              height: `${height - 24}px`,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
            }}
          >
            <video
              src={v.url}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
