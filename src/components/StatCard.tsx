import type { FactIcon } from '../types';
import { FACT_ICON_COMPONENTS } from '../lib/factIcons';

interface StatCardProps {
  stat: string;
  caption: string;
  icon: FactIcon;
  /** 1..9 — selects the tinted color palette applied to the icon tile. */
  palette: number;
}

export default function StatCard({ stat, caption, icon, palette }: StatCardProps) {
  const Icon = FACT_ICON_COMPONENTS[icon];
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
