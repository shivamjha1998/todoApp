import { Todo } from "../App";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  selectedFilter: "All" | "Done" | "Undone";
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
}

export default function TodoList({
  todos,
  selectedFilter,
  onToggleTodo,
  onDeleteTodo,
  showNotification,
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === "Done") return todo.completed;
    if (selectedFilter === "Undone") return !todo.completed;
    return true;
  });

  return (
    <ul className="list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          showNotification={showNotification}
        />
      ))}
    </ul>
  );
}
