import { Todo } from "../App";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  selectedFilter: "All" | "Done" | "Undone";
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
  isLoading: boolean;
}

export default function TodoList({
  todos,
  selectedFilter,
  onToggleTodo,
  onDeleteTodo,
  showNotification,
  isLoading,
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === "Done") return todo.completed;
    if (selectedFilter === "Undone") return !todo.completed;
    return true;
  });

  return (
    <ul className="list">
      {isLoading ? (
        <div className="loading-text">Loading...</div>
      ) : (
        filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
            showNotification={showNotification}
          />
        ))
      )}
    </ul>
  );
}
