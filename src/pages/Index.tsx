
import React from 'react';
import { TimeBlock } from '@/components/TimeBlock';
import { PrintButton } from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TimeBlockData {
  startTime: string;
  endTime: string;
  tasks: string[];
}

const defaultTimeBlocks = [
  { startTime: '06:00', endTime: '07:00', tasks: [''] },
  { startTime: '07:00', endTime: '08:00', tasks: [''] },
  { startTime: '08:00', endTime: '09:00', tasks: [''] },
  { startTime: '09:00', endTime: '10:00', tasks: [''] },
  { startTime: '10:00', endTime: '11:00', tasks: [''] },
  { startTime: '11:00', endTime: '12:00', tasks: [''] },
  { startTime: '12:00', endTime: '13:00', tasks: [''] },
  { startTime: '13:00', endTime: '14:00', tasks: [''] },
  { startTime: '14:00', endTime: '15:00', tasks: [''] },
  { startTime: '15:00', endTime: '16:00', tasks: [''] },
  { startTime: '16:00', endTime: '17:00', tasks: [''] },
  { startTime: '17:00', endTime: '18:00', tasks: [''] },
  { startTime: '18:00', endTime: '19:00', tasks: [''] },
  { startTime: '19:00', endTime: '20:00', tasks: [''] },
  { startTime: '20:00', endTime: '21:00', tasks: [''] },
  { startTime: '21:00', endTime: '22:00', tasks: [''] },
  { startTime: '22:00', endTime: '23:00', tasks: [''] },
  { startTime: '23:00', endTime: '00:00', tasks: [''] },
];

const Index = () => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlockData[]>(
    'timeBlockPlanner',
    defaultTimeBlocks
  );

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const updateTimeBlock = (index: number, updates: Partial<TimeBlockData>) => {
    const newTimeBlocks = [...timeBlocks];
    newTimeBlocks[index] = { ...newTimeBlocks[index], ...updates };
    setTimeBlocks(newTimeBlocks);
  };

  const addTimeBlock = () => {
    const lastBlock = timeBlocks[timeBlocks.length - 1];
    const lastEndTime = lastBlock.endTime;
    
    // Calculate next hour
    const [hours, minutes] = lastEndTime.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    const newStartTime = `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const newEndTime = `${((nextHour + 1) % 24).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const newBlock: TimeBlockData = {
      startTime: newStartTime,
      endTime: newEndTime,
      tasks: ['']
    };
    
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const removeTimeBlock = (index: number) => {
    if (timeBlocks.length > 1) {
      const newTimeBlocks = timeBlocks.filter((_, i) => i !== index);
      setTimeBlocks(newTimeBlocks);
    }
  };

  const clearAll = () => {
    if (window.confirm('Clear all data? This cannot be undone.')) {
      setTimeBlocks(defaultTimeBlocks);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-5xl font-black text-black uppercase tracking-wider mb-4">
            Daily Time Blocks
          </h1>
          <div className="flex items-center justify-center gap-8 text-lg font-bold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span>{dateString}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕐</span>
              <span>Current Time: {timeString}</span>
            </div>
          </div>
        </div>

        {/* Print Header */}
        <div className="print:block hidden text-center mb-8">
          <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-4">
            Daily Time Blocks
          </h1>
          <div className="text-lg font-bold text-black mb-2">{dateString}</div>
          <div className="text-base font-medium text-black">Generated at: {timeString}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8 no-print">
          <button
            onClick={addTimeBlock}
            className="px-6 py-3 text-sm font-black text-white bg-black hover:bg-gray-800 uppercase tracking-wide border-2 border-black transition-colors"
          >
            + Add Time Block
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 text-sm font-black text-gray-600 hover:text-black uppercase tracking-wide border-2 border-gray-300 hover:border-black transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Time Blocks Grid */}
        <div className="border-4 border-black bg-white shadow-lg">
          {timeBlocks.map((block, index) => (
            <TimeBlock
              key={index}
              startTime={block.startTime}
              endTime={block.endTime}
              tasks={block.tasks}
              onTimeChange={(field, newTime) => 
                updateTimeBlock(index, { [field]: newTime })
              }
              onTasksChange={(newTasks) => 
                updateTimeBlock(index, { tasks: newTasks })
              }
              onRemove={timeBlocks.length > 1 ? () => removeTimeBlock(index) : undefined}
            />
          ))}
        </div>

        <div className="text-center mt-8 text-sm font-bold text-gray-500 uppercase tracking-wide no-print">
          ✨ Your data is automatically saved locally ✨
        </div>
      </div>

      <PrintButton />
    </div>
  );
};

export default Index;
