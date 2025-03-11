import { useState } from "react";
import { Todo } from "../App";

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  showNotification: (
    message: string,
    type: "added" | "completed" | "deleted"
  ) => void;
}

export default function TodoItem({
  todo,
  onToggleTodo,
  onDeleteTodo,
  showNotification,
}: TodoItemProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  function handleDelete() {
    onDeleteTodo(todo.id);
    setMenuOpen(false);
  }

  return (
    <li className="todo-list">
      <label className="todo">
        <input
          className="todo__state"
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={(e) => {
            onToggleTodo(todo.id);
            if (e.target.checked && !todo.completed) {
              showNotification(`Completed: ${todo.title}`, "completed");
            }
          }}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 350 25"
          className="todo__icon"
        >
          <use xlinkHref="#todo__line" className="todo__line" />
          <use xlinkHref="#todo__box" className="todo__box" />
          <use xlinkHref="#todo__check" className="todo__check" />
          <use xlinkHref="#todo__circle" className="todo__circle" />
        </svg>

        <span className="todo__text">{todo.title}</span>
      </label>

      <div className="menu-container">
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        ></button>
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
    </li>
  );
}
