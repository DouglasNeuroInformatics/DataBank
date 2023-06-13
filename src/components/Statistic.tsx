'use client';

import React, { useEffect } from 'react';

import { type MotionValue, motion, useSpring, useTransform } from 'framer-motion';

interface StatisticProps {
  label: string;
  icon: React.ComponentType<Omit<React.SVGProps<SVGSVGElement>, 'ref'>>;
  value: number;
}

export const Statistic = (props: StatisticProps) => {
  const spring = useSpring(0, { bounce: 0 }) as MotionValue<number>;
  const rounded = useTransform(spring, (latest: number) => Math.floor(latest));

  useEffect(() => {
    spring.set(props.value);
  }, [spring, props.value]);

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg border shadow-md ring-1 ring-black ring-opacity-5 [&>svg]:h-16 [&>svg]:w-16">
      <props.icon className="mb-3 h-12 w-12" />
      <motion.h3 className="title-font text-3xl font-medium text-slate-900 sm:text-4xl">{rounded}</motion.h3>
      <p className="leading-relaxed">{props.label}</p>
    </div>
  );
};
