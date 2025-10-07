
import React from 'react';
import { Task } from '@/pages/Index';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const addTask = () => {
    const newTask: Task = { text: '', completed: false, priority: 'medium' };
    const newTasks = [...tasks, newTask];
    onTasksChange(newTasks);
  };

  const updateTaskPriority = (index: number, priority: 'high' | 'medium' | 'low') => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], priority };
    onTasksChange(newTasks);
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], text: value };
    
    // Auto-add new task when user starts typing in the last empty task
    if (index === tasks.length - 1 && value.trim() !== '' && (tasks[tasks.length - 1]?.text || '') === '') {
      newTasks.push({ text: '', completed: false, priority: 'medium' });
    }
    
    onTasksChange(newTasks);
  };

  const toggleTaskCompletion = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
    onTasksChange(newTasks);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      const newTasks = tasks.filter((_, i) => i !== index);
      onTasksChange(newTasks);
    }
  };

  const getPriorityColor = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-400 bg-white';
    }
  };

  const getPriorityIcon = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '🔥';
      case 'low': return '❄️';
      default: return '⚪';
    }
  };

  return (
    <div>
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center group mb-2">
          <button
            onClick={() => toggleTaskCompletion(index)}
            className="mr-3 w-4 h-4 border-2 border-gray-400 hover:border-black transition-colors flex-shrink-0 no-print"
            style={{
              backgroundColor: task.completed ? '#000' : 'transparent'
            }}
          >
            {task.completed && (
              <span className="text-white text-xs leading-none">✓</span>
            )}
          </button>
          <div className={`flex-1 flex items-center gap-2 border-2 p-2 ${getPriorityColor(task.priority)}`}>
            <select
              value={task.priority || 'medium'}
              onChange={(e) => updateTaskPriority(index, e.target.value as 'high' | 'medium' | 'low')}
              className="text-xs font-bold bg-transparent border-0 outline-none no-print cursor-pointer"
              title="Set priority"
            >
              <option value="high">🔥 High</option>
              <option value="medium">⚪ Medium</option>
              <option value="low">❄️ Low</option>
            </select>
            <span className="print:inline hidden text-xs">{getPriorityIcon(task.priority)}</span>
            <textarea
              value={task?.text || ''}
              onChange={(e) => updateTask(index, e.target.value)}
              className={`flex-1 bg-transparent outline-none resize-none font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
              placeholder="Start typing to add a task..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (task?.text?.trim()) {
                    addTask();
                  }
                }
              }}
            />
          </div>
          <button
            onClick={() => removeTask(index)}
            className="ml-2 text-xs text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 no-print font-black"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
