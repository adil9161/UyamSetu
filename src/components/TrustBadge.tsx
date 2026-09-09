import React from 'react';
import { TrustState, SourceTier } from '../data/schemes';
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock, ExternalLink } from 'lucide-react';

interface TrustBadgeProps {
  trustState: TrustState;
  sourceName: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  sourceTier?: SourceTier;
  showDetails?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustState,
  sourceName,
  sourceUrl,
  lastVerifiedAt,
  showDetails = true
}) => {
  const getBadgeStyle = () => {
    switch (trustState) {
      case 'verified':
        return {
          border: 'border-l-4 border-l-[#F97316]', // Non-negotiable Saffron Accent = Government Source
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-[#16A34A]',
          label: 'Verified Official Source'
        };
      case 'stale':
        return {
          border: 'border-l-4 border-l-amber-500',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          label: 'Verification Pending / Stale'
        };
      case 'flagged':
        return {
          border: 'border-l-4 border-l-red-500',
          badgeBg: 'bg-red-50 text-red-900 border-red-200',
          icon: AlertOctagon,
          iconColor: 'text-red-600',
          label: 'Flagged for Review'
        };
      default:
        return {
          border: 'border-l-4 border-l-slate-400',
          badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Clock,
          iconColor: 'text-slate-500',
          label: 'Archived Record'
        };
    }
  };

  const config = getBadgeStyle();
  const Icon = config.icon;

  return (
    <div className={`bg-white rounded-md p-3 border border-[#E2E8F0] shadow-2xs ${config.border}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
          <span className="text-xs font-bold text-[#0F172A]">{sourceName}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
            {config.label}
          </span>
        </div>

        {showDetails && (
          <div className="flex items-center gap-3 text-[11px] text-[#475569]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              Verified: {lastVerifiedAt}
            </span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1E3A5F] hover:underline"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
