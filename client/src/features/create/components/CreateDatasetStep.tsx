import { motion } from 'framer-motion';

export interface CreateDatasetStepProps {
  children: React.ReactNode;
  step: 'upload' | 'form' | 'confirm';
}

export const CreateDatasetStep = ({ children, step }: CreateDatasetStepProps) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-grow h-full flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      key={step}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
