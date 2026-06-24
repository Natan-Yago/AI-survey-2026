import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BoltIcon,
  CpuChipIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';
import type { FactIcon } from '../types';

const ICONS: Record<FactIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  chart: ArrowTrendingUpIcon,
  bolt: BoltIcon,
  rocket: RocketLaunchIcon,
  cash: BanknotesIcon,
  refresh: ArrowPathIcon,
  users: UserGroupIcon,
  cpu: CpuChipIcon,
  bulb: LightBulbIcon,
  sparkles: SparklesIcon,
};

interface StatCardProps {
  stat: string;
  caption: string;
  icon: FactIcon;
  /** 1..9 — selects the tinted color palette applied to the icon tile. */
  palette: number;
}

export default function StatCard({ stat, caption, icon, palette }: StatCardProps) {
  const Icon = ICONS[icon];
  return (
    <div className={`option-card surface-card stat-card palette-${palette}`}>
      <div className="stat-body">
        <span className="stat-figure font-latin">{stat}</span>
        <p className="stat-caption">{caption}</p>
      </div>
      <span className="stat-icon-tile" aria-hidden="true">
        <Icon className="stat-icon-svg" strokeWidth={1.75} />
      </span>
    </div>
  );
}
