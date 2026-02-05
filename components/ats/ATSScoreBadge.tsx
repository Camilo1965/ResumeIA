'use client';

import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ATSScoreBadgeProps {
  score: number;
  onViewDetails?: () => void;
}

export function ATSScoreBadge({ score, onViewDetails }: ATSScoreBadgeProps) {
  // Determine color and icon based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle size={20} className="text-green-600" />;
    if (score >= 70) return <CheckCircle size={20} className="text-yellow-600" />;
    if (score >= 50) return <AlertTriangle size={20} className="text-orange-600" />;
    return <XCircle size={20} className="text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Critical Issues';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressPercentage = Math.min(100, score);

  return (
    <div className={`rounded-lg border-2 p-4 ${getScoreColor(score)} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getScoreIcon(score)}
          <span className="font-bold text-lg">ATS Score: {score}/100</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`h-full ${getProgressColor(score)} transition-all duration-500 ease-out`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{getScoreLabel(score)}</span>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-sm underline hover:no-underline font-medium"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
