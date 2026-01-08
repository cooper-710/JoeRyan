import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <>
      {/* Simple cursor dot */}
      <div
        className="fixed w-3 h-3 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
          background: '#fff',
          transition: 'transform 0.1s ease-out',
        }}
      />
    </>
  );
}