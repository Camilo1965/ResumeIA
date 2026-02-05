'use client';

import { X, CheckCircle, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';
import { ATSAnalysisResult } from '@/types';

interface ATSAnalysisPanelProps {
  analysis: ATSAnalysisResult;
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestions?: () => void;
}

export function ATSAnalysisPanel({
  analysis,
  isOpen,
  onClose,
  onApplySuggestions,
}: ATSAnalysisPanelProps) {
  if (!isOpen) return null;

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return <CheckCircle size={18} className="text-green-600" />;
    if (percentage >= 70) return <CheckCircle size={18} className="text-yellow-600" />;
    if (percentage >= 50) return <AlertTriangle size={18} className="text-orange-600" />;
    return <XCircle size={18} className="text-red-600" />;
  };

  const getProgressBarColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const renderScoreSection = (
    title: string,
    score: number,
    max: number,
    details: string[]
  ) => {
    const percentage = (score / max) * 100;

    return (
      <div className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getScoreIcon(score, max)}
            <h3 className={`font-semibold text-lg ${getScoreColor(score, max)}`}>
              {title} ({score}/{max})
            </h3>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-full rounded-full ${getProgressBarColor(score, max)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Details */}
        <ul className="space-y-1 text-sm text-gray-700">
          {details.map((detail, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">ATS Compatibility Analysis</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Overall Score */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Overall Score</h3>
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-blue-600">
                {analysis.overallScore}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${getProgressBarColor(analysis.overallScore, 100)}`}
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Score Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h3>

            {renderScoreSection(
              'Keyword Match',
              analysis.breakdown.keywordMatch.score,
              analysis.breakdown.keywordMatch.max,
              analysis.breakdown.keywordMatch.details
            )}

            {renderScoreSection(
              'Format Score',
              analysis.breakdown.formatScore.score,
              analysis.breakdown.formatScore.max,
              analysis.breakdown.formatScore.details
            )}

            {renderScoreSection(
              'Experience Relevance',
              analysis.breakdown.experienceRelevance.score,
              analysis.breakdown.experienceRelevance.max,
              analysis.breakdown.experienceRelevance.details
            )}

            {renderScoreSection(
              'Skills Match',
              analysis.breakdown.skillsMatch.score,
              analysis.breakdown.skillsMatch.max,
              analysis.breakdown.skillsMatch.details
            )}

            {renderScoreSection(
              'Education',
              analysis.breakdown.education.score,
              analysis.breakdown.education.max,
              analysis.breakdown.education.details
            )}
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Keywords Section */}
          {(analysis.keywords.found.length > 0 || analysis.keywords.missing.length > 0) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Keywords Analysis</h3>
              
              {analysis.keywords.found.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Found Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.found.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.keywords.missing.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                    <XCircle size={16} className="mr-2" />
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.missing.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <hr className="my-6 border-gray-300" />

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Lightbulb size={24} className="mr-2 text-yellow-500" />
                Recommendations
              </h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <ol className="space-y-2 list-decimal list-inside">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-gray-800">
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            {onApplySuggestions && (
              <button
                onClick={onApplySuggestions}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply Suggestions
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
