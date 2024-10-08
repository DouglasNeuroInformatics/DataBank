import { motion } from 'framer-motion';

export type AnimatedCheckIconProps = {
  className: string;
  onComplete?: () => void;
};

export const AnimatedCheckIcon = ({ className, onComplete }: AnimatedCheckIconProps) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      animate={{ pathLength: 1 }}
      d="M4.5 12.75l6 6 9-13.5"
      initial={{ pathLength: 0 }}
      strokeLinecap="round"
      strokeLinejoin="round"
      transition={{
        duration: 0.3,
        ease: 'easeIn',
        type: 'tween'
      }}
      onAnimationComplete={onComplete}
    />
  </svg>
);
