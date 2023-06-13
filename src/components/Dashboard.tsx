'use client';

import React from 'react';

import { TableCellsIcon } from '@heroicons/react/24/outline';

import { Statistic } from '@/components/Statistic';

export const Dashboard = () => {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Statistic icon={TableCellsIcon} label="Statistic A" value={43} />
      <Statistic icon={TableCellsIcon} label="Statistic B" value={59} />
      <Statistic icon={TableCellsIcon} label="Statistic C" value={84} />
      <Statistic icon={TableCellsIcon} label="Statistic D" value={11} />
    </div>
  );
};
