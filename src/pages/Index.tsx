
import React, { useState, useEffect } from 'react';
import { TimeBlock } from '@/components/TimeBlock';
import { PrintButton } from '@/components/PrintButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Task {
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface TimeBlockData {
  startTime: string;
  endTime: string;
  tasks: Task[];
}

interface Template {
  name: string;
  blocks: TimeBlockData[];
}

const defaultTimeBlocks: TimeBlockData[] = [
  { startTime: '06:00', endTime: '07:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '07:00', endTime: '08:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '08:00', endTime: '09:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '09:00', endTime: '10:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '10:00', endTime: '11:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '11:00', endTime: '12:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '12:00', endTime: '13:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '13:00', endTime: '14:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '14:00', endTime: '15:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '15:00', endTime: '16:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '16:00', endTime: '17:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '17:00', endTime: '18:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '18:00', endTime: '19:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '19:00', endTime: '20:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '20:00', endTime: '21:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '21:00', endTime: '22:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '22:00', endTime: '23:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
  { startTime: '23:00', endTime: '00:00', tasks: [{ text: '', completed: false, priority: 'medium' }] },
];

const Index = () => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlockData[]>(
    'timeBlockPlanner',
    defaultTimeBlocks
  );
  const [focusMode, setFocusMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [templates, setTemplates] = useLocalStorage<Template[]>('timeBlockTemplates', []);
  const [dailyNotes, setDailyNotes] = useLocalStorage<string>('dailyNotes', '');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStats, setShowStats] = useState(true);

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
      tasks: [{ text: '', completed: false, priority: 'medium' }]
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

  // Template management
  const saveAsTemplate = () => {
    const name = window.prompt('Enter template name:');
    if (name) {
      const newTemplate: Template = {
        name,
        blocks: JSON.parse(JSON.stringify(timeBlocks))
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const loadTemplate = (template: Template) => {
    if (window.confirm(`Load template "${template.name}"? This will replace your current schedule.`)) {
      setTimeBlocks(JSON.parse(JSON.stringify(template.blocks)));
      setShowTemplates(false);
    }
  };

  const deleteTemplate = (index: number) => {
    if (window.confirm('Delete this template?')) {
      setTemplates(templates.filter((_, i) => i !== index));
    }
  };

  // Time calculations
  const calculateTotalHours = (): number => {
    let total = 0;
    timeBlocks.forEach(block => {
      const [startHour, startMin] = block.startTime.split(':').map(Number);
      const [endHour, endMin] = block.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      let endMinutes = endHour * 60 + endMin;
      if (endMinutes <= startMinutes) endMinutes += 24 * 60;
      total += (endMinutes - startMinutes) / 60;
    });
    return total;
  };

  const calculateRemainingHours = (): number => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let remaining = 0;
    
    timeBlocks.forEach(block => {
      const [startHour, startMin] = block.startTime.split(':').map(Number);
      const [endHour, endMin] = block.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      let endMinutes = endHour * 60 + endMin;
      if (endMinutes <= startMinutes) endMinutes += 24 * 60;
      
      if (endMinutes > currentMinutes) {
        const blockStart = Math.max(startMinutes, currentMinutes);
        remaining += (endMinutes - blockStart) / 60;
      }
    });
    
    return remaining;
  };

  const getTaskStats = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    let highPriority = 0;
    
    timeBlocks.forEach(block => {
      block.tasks.forEach(task => {
        if (task?.text?.trim()) {
          totalTasks++;
          if (task.completed) completedTasks++;
          if (task.priority === 'high') highPriority++;
        }
      });
    });
    
    return { totalTasks, completedTasks, highPriority };
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

        {/* Daily Notes Section */}
        <div className={`mb-8 no-print transition-all ${focusMode ? 'opacity-30' : ''}`}>
          <div className="border-4 border-black bg-yellow-50 p-6">
            <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-3">📝 Daily Goals & Notes</h2>
            <textarea
              value={dailyNotes}
              onChange={(e) => setDailyNotes(e.target.value)}
              placeholder="What are your main goals for today?"
              className="w-full p-4 border-2 border-gray-300 bg-white font-medium text-gray-800 resize-none focus:outline-none focus:border-black transition-colors"
              rows={3}
            />
          </div>
        </div>

        {/* Stats Dashboard */}
        {showStats && (
          <div className={`mb-8 no-print transition-all ${focusMode ? 'opacity-30' : ''}`}>
            <div className="grid grid-cols-4 gap-4">
              <div className="border-4 border-black bg-blue-50 p-4 text-center">
                <div className="text-3xl font-black text-black">{calculateTotalHours().toFixed(1)}h</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">Total Hours</div>
              </div>
              <div className="border-4 border-black bg-green-50 p-4 text-center">
                <div className="text-3xl font-black text-black">{calculateRemainingHours().toFixed(1)}h</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">Remaining</div>
              </div>
              <div className="border-4 border-black bg-purple-50 p-4 text-center">
                <div className="text-3xl font-black text-black">{getTaskStats().completedTasks}/{getTaskStats().totalTasks}</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">Tasks Done</div>
              </div>
              <div className="border-4 border-black bg-red-50 p-4 text-center">
                <div className="text-3xl font-black text-black">🔥 {getTaskStats().highPriority}</div>
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">High Priority</div>
              </div>
            </div>
          </div>
        )}

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
            <button
              onClick={saveAsTemplate}
              className="px-6 py-3 text-sm font-black text-blue-700 hover:text-blue-900 uppercase tracking-wide border-2 border-blue-300 hover:border-blue-700 transition-colors"
            >
              💾 Save Template
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-6 py-3 text-sm font-black text-blue-700 hover:text-blue-900 uppercase tracking-wide border-2 border-blue-300 hover:border-blue-700 transition-colors"
            >
              📂 Templates ({templates.length})
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

        {/* Templates Panel */}
        {showTemplates && templates.length > 0 && (
          <div className="mb-8 no-print">
            <div className="border-4 border-blue-500 bg-blue-50 p-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-4">Saved Templates</h2>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border-2 border-gray-300 p-4">
                    <span className="font-bold text-black">{template.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 uppercase tracking-wide transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteTemplate(index)}
                        className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 uppercase tracking-wide transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
