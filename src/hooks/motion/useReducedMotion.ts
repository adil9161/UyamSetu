import { useMotion } from '../../motion/MotionProvider';

export const useReducedMotion = (): boolean => {
  const { isReducedMotion } = useMotion();
  return isReducedMotion;
};
