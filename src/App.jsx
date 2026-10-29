import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from "./components/functional/Header";
import CardWrapper from "./components/functional/CardWrapper";
import TaskForm from "./components/functional/TaskForm";
import TaskList from "./components/functional/TaskList";
import Filters from "./components/functional/Filters";
import useLocalStorage from "./hooks/useLocalStorage";
import MetricsSummary from "./components/functional/MetricsSummary";
import ActivityLogger from "./components/class/ActivityLogger";

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [latestEvent, setLatestEvent] = useState(null);

  // Sends an event to the class-based ActivityLogger via props
  const logEvent = useCallback((message) => {
    setLatestEvent({
      id: crypto.randomUUID(),
      message,
      time: new Date().toISOString(),
    });
  }, []);

  // useCallback keeps these references stable, so memo'd children don't re-render
  const addTask = useCallback((title, priority) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logEvent(`Added task "${title}" (${priority})`);
  }, [setTasks, logEvent]);

  const toggleTask = useCallback((id, title) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    logEvent(`Toggled task "${title}"`);
  }, [setTasks, logEvent]);

  const deleteTask = useCallback((id, title) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    logEvent(`Deleted task "${title}"`);
  }, [setTasks, logEvent]);

  const changeStatus = useCallback((value) => {
    setStatusFilter(value);
    logEvent(`Status filter changed to "${value}"`);
  }, [logEvent]);

  const changePriority = useCallback((value) => {
    setPriorityFilter(value);
    logEvent(`Priority filter changed to "${value}"`);
  }, [logEvent]);

  // useMemo: only recompute when tasks or filters change
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const statusOk =
        statusFilter === 'all' ||
        (statusFilter === 'completed' ? t.completed : !t.completed);
      const priorityOk = priorityFilter === 'all' || t.priority === priorityFilter;
      return statusOk && priorityOk;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const metrics = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return { total: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  // useEffect: update the document title
  useEffect(() => {
    document.title =
      metrics.pending > 0
        ? `(${metrics.pending}) pending | Task Dashboard`
        : 'All done! | Task Dashboard';
  }, [metrics.pending]);

  return (
    <div className="container">
      <Header />
      <MetricsSummary {...metrics} />

      <div className="layout">
        <div>
          <CardWrapper title="Add a New Task">
            <TaskForm onAddTask={addTask} />
          </CardWrapper>

          <CardWrapper title="Your Tasks">
            <Filters
              status={statusFilter}
              priority={priorityFilter}
              onStatusChange={changeStatus}
              onPriorityChange={changePriority}
            />
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </CardWrapper>
        </div>

        <CardWrapper title="Activity Log">
          <ActivityLogger latestEvent={latestEvent} />
        </CardWrapper>
      </div>
    </div>
  );
}

export default App;