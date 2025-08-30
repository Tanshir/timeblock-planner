
import React from 'react';
import { TimeBlock } from '@/components/TimeBlock';
import { PrintButton } from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TimeBlockData {
  hour: string;
  tasks: string[];
}

const defaultHours = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const Index = () => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlockData[]>(
    'timeBlockPlanner',
    defaultHours.map(hour => ({ hour, tasks: [''] }))
  );

  const updateTimeBlock = (index: number, updates: Partial<TimeBlockData>) => {
    const newTimeBlocks = [...timeBlocks];
    newTimeBlocks[index] = { ...newTimeBlocks[index], ...updates };
    setTimeBlocks(newTimeBlocks);
  };

  const clearAll = () => {
    if (window.confirm('Clear all data? This cannot be undone.')) {
      setTimeBlocks(defaultHours.map(hour => ({ hour, tasks: [''] })));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8 no-print">
          <h1 className="planner-title flex-1">Daily Time Blocks</h1>
          <button
            onClick={clearAll}
            className="ml-6 px-4 py-2 text-xs font-black text-gray-600 hover:text-black uppercase tracking-wide border-2 border-gray-300 hover:border-black transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="print:planner-title print:block hidden">
          Daily Time Blocks
        </div>

        <div className="border-4 border-black bg-white">
          {timeBlocks.map((block, index) => (
            <TimeBlock
              key={index}
              hour={block.hour}
              tasks={block.tasks}
              onTimeChange={(newTime) => 
                updateTimeBlock(index, { hour: newTime })
              }
              onTasksChange={(newTasks) => 
                updateTimeBlock(index, { tasks: newTasks })
              }
            />
          ))}
        </div>

        <div className="text-center mt-8 text-xs font-black text-gray-500 uppercase tracking-wide no-print">
          Your data is automatically saved locally
        </div>
      </div>

      <PrintButton />
    </div>
  );
};

export default Index;
