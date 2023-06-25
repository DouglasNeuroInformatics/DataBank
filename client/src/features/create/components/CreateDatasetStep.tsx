import { motion } from 'framer-motion';

export interface CreateDatasetStepProps {
  children: React.ReactNode;
  step: 'upload' | 'form' | 'confirm';
}

export const CreateDatasetStep = ({ children, step }: CreateDatasetStepProps) => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <motion.div
        animate={{ opacity: 1 }}
        className="flex flex-grow items-center justify-center"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={step}
        transition={{ duration: 5 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
