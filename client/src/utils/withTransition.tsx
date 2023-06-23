import { motion } from 'framer-motion';

export function withTransition<T extends object>(Component: React.ComponentType<T>) {
  const Wrapper = (props: T) => {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="h-full w-full"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
  return Wrapper;
}
