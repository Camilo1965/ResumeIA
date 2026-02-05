'use client';

import { HistoryDataTable } from '@/components/history-viewer/HistoryDataTable';

export default function CVHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">CV History</h1>
      <HistoryDataTable />
    </div>
  );
}
