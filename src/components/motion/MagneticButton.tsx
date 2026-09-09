import React, { useRef } from 'react';
import gsap from 'gsap';
import { useMotion } from '../../motion/MotionProvider';
import { motionTokens } from '../../motion/motionTokens';
import { easing } from '../../motion/easing';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.2,
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isReducedMotion, isTouch } = useMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isReducedMotion || isTouch || disabled) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * strength,
      y: y * strength,
      duration: motionTokens.duration.fast,
      ease: easing.premium,
    });

    const icon = btn.querySelector('svg');
    if (icon) {
      gsap.to(icon, {
        x: 3,
        duration: motionTokens.duration.fast,
        ease: easing.premium,
      });
    }
  };

  const handleMouseLeave = () => {
    if (isReducedMotion || isTouch || disabled) return;
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: motionTokens.duration.fast,
      ease: easing.premium,
    });

    const icon = btn.querySelector('svg');
    if (icon) {
      gsap.to(icon, {
        x: 0,
        duration: motionTokens.duration.fast,
        ease: easing.premium,
      });
    }
  };

  const handleMouseDown = () => {
    if (isReducedMotion || disabled) return;
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.to(btn, {
      scale: motionTokens.scale.press,
      duration: motionTokens.duration.micro,
      ease: easing.subtleOut,
    });
  };

  const handleMouseUp = () => {
    if (isReducedMotion || disabled) return;
    const btn = buttonRef.current;
    if (!btn) return;

    gsap.to(btn, {
      scale: 1,
      duration: motionTokens.duration.fast,
      ease: easing.premium,
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      disabled={disabled}
      className={`will-change-transform active:scale-[0.975] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
