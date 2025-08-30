
import React from 'react';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print fixed bottom-6 right-6 z-50">
      <button
        onClick={handlePrint}
        className="print-btn shadow-lg"
      >
        Print Planner
      </button>
    </div>
  );
}
