import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  depth?: number;
  glareOpacity?: number;
}

/**
 * World-Class Interactive 3D Tilt Card Component
 * Uses physical spring math and mouse coordinate tracking to create
 * a photorealistic 3D perspective tilt with dynamic specular sheen.
 */
export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  onClick,
  depth = 25,
  glareOpacity = 0.25,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Fluid spring configuration for buttery organic feel
  const springConfig = { damping: 22, stiffness: 260, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // 3D rotations based on mouse position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [depth * 0.7, -depth * 0.7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-depth, depth]);
  const scale = useTransform(smoothX, [-0.5, 0, 0.5], [1.02, 1, 1.02]);

  // Glare position
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to normalized coordinates (-0.5 to 0.5)
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="inline-block w-full transform-style-preserve-3d"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          scale: isHovered ? scale : 1,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {/* Card Content with 3D child preservation */}
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 w-full h-full">
          {children}
        </div>

        {/* Dynamic Interactive Specular Lighting / Glare */}
        {isHovered && (
          <motion.div
            style={{
              left: glareX,
              top: glareY,
              transform: 'translate(-50%, -50%)',
              opacity: glareOpacity,
            }}
            className="pointer-events-none absolute w-[220%] h-[220%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7)_0%,transparent_60%)] mix-blend-overlay z-20"
          />
        )}
      </motion.div>
    </div>
  );
};
