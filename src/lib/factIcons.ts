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

/**
 * Shared token → Heroicon component map used by both the Summary stat card
 * (`StatCard`) and the per-question popup (`FactModal`). Keeping this in one
 * place ensures both surfaces render the same glyph for a given fact.
 */
export const FACT_ICON_COMPONENTS: Record<FactIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
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
