// SimpleToDo.tsx
import { useState } from "react";
import { Todo, Notification } from "./App";
import SvgDefs from "./components/SvgDefs";
import ProgressBar from "./components/ProgressBar";
import FilterHeader from "./components/FilterHeader";
import NewItemForm from "./components/NewItemForm";
import TodoList from "./components/TodoList";
import Notifications from "./components/Notifications";

interface SimpleToDoProps {
  todos: Todo[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  notifications: Notification[];
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
}

export default function SimpleToDo({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  notifications,
  showNotification,
}: SimpleToDoProps) {
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Done" | "Undone"
  >("All");

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-card">
      <SvgDefs />

      <ProgressBar completedCount={completedCount} totalCount={todos.length} />

      <FilterHeader
        selectedFilter={selectedFilter}
        onChangeFilter={(filter) => setSelectedFilter(filter)}
      />

      <NewItemForm onAddTodo={onAddTodo} showNotification={showNotification} />

      <TodoList
        todos={todos}
        selectedFilter={selectedFilter}
        onToggleTodo={onToggleTodo}
        onDeleteTodo={onDeleteTodo}
        showNotification={showNotification}
      />

      <Notifications notifications={notifications} />
    </div>
  );
}
