
import React, { useState, useEffect } from 'react';
import { TimeBlock } from '@/components/TimeBlock';
import { PrintButton } from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Task {
  text: string;
  completed: boolean;
}

interface TimeBlockData {
  startTime: string;
  endTime: string;
  tasks: Task[];
}

const defaultTimeBlocks: TimeBlockData[] = [
  { startTime: '06:00', endTime: '07:00', tasks: [{ text: '', completed: false }] },
  { startTime: '07:00', endTime: '08:00', tasks: [{ text: '', completed: false }] },
  { startTime: '08:00', endTime: '09:00', tasks: [{ text: '', completed: false }] },
  { startTime: '09:00', endTime: '10:00', tasks: [{ text: '', completed: false }] },
  { startTime: '10:00', endTime: '11:00', tasks: [{ text: '', completed: false }] },
  { startTime: '11:00', endTime: '12:00', tasks: [{ text: '', completed: false }] },
  { startTime: '12:00', endTime: '13:00', tasks: [{ text: '', completed: false }] },
  { startTime: '13:00', endTime: '14:00', tasks: [{ text: '', completed: false }] },
  { startTime: '14:00', endTime: '15:00', tasks: [{ text: '', completed: false }] },
  { startTime: '15:00', endTime: '16:00', tasks: [{ text: '', completed: false }] },
  { startTime: '16:00', endTime: '17:00', tasks: [{ text: '', completed: false }] },
  { startTime: '17:00', endTime: '18:00', tasks: [{ text: '', completed: false }] },
  { startTime: '18:00', endTime: '19:00', tasks: [{ text: '', completed: false }] },
  { startTime: '19:00', endTime: '20:00', tasks: [{ text: '', completed: false }] },
  { startTime: '20:00', endTime: '21:00', tasks: [{ text: '', completed: false }] },
  { startTime: '21:00', endTime: '22:00', tasks: [{ text: '', completed: false }] },
  { startTime: '22:00', endTime: '23:00', tasks: [{ text: '', completed: false }] },
  { startTime: '23:00', endTime: '00:00', tasks: [{ text: '', completed: false }] },
];

const Index = () => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlockData[]>(
    'timeBlockPlanner',
    defaultTimeBlocks
  );
  const [focusMode, setFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Check if a time block is currently active
  const isTimeBlockActive = (startTime: string, endTime: string): boolean => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    
    const [endHour, endMin] = endTime.split(':').map(Number);
    let endMinutes = endHour * 60 + endMin;
    
    // Handle midnight crossover
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

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
      tasks: [{ text: '', completed: false }]
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: Add new time block
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addTimeBlock();
      }
      
      // Ctrl/Cmd + K: Clear all
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearAll();
      }
      
      // Ctrl/Cmd + F: Toggle focus mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setFocusMode(!focusMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header Section */}
        <div className={`text-center mb-8 no-print transition-all ${focusMode ? 'opacity-30' : ''}`}>
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
        <div className={`flex items-center justify-between mb-8 no-print transition-all ${focusMode ? 'opacity-0 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={addTimeBlock}
              className="px-6 py-3 text-sm font-black text-white bg-black hover:bg-gray-800 uppercase tracking-wide border-2 border-black transition-colors"
              title="Ctrl/Cmd + N"
            >
              + Add Time Block
            </button>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="px-6 py-3 text-sm font-black text-gray-700 hover:text-black uppercase tracking-wide border-2 border-gray-300 hover:border-gray-700 transition-colors"
              title="Ctrl/Cmd + F"
            >
              {focusMode ? '👁 Exit Focus' : '🎯 Focus Mode'}
            </button>
          </div>
          <button
            onClick={clearAll}
            className="px-6 py-3 text-sm font-black text-gray-600 hover:text-black uppercase tracking-wide border-2 border-gray-300 hover:border-black transition-colors"
            title="Ctrl/Cmd + K"
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
              isActive={isTimeBlockActive(block.startTime, block.endTime)}
              focusMode={focusMode}
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
