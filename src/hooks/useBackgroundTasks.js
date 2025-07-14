import { useEffect, useRef } from 'react';

export const useBackgroundTasks = () => {
  const tasksRef = useRef([]);

  const scheduleTask = (task, delay = 0) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setTimeout(task, delay);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(task, delay);
    }
  };

  const scheduleBackgroundTask = (task) => {
    tasksRef.current.push(task);
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const currentTask = tasksRef.current.shift();
        if (currentTask) {
          currentTask();
        }
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const currentTask = tasksRef.current.shift();
        if (currentTask) {
          currentTask();
        }
      }, 0);
    }
  };

  useEffect(() => {
    // Process any remaining tasks on component unmount
    return () => {
      tasksRef.current.forEach(task => task());
      tasksRef.current = [];
    };
  }, []);

  return { scheduleTask, scheduleBackgroundTask };
};