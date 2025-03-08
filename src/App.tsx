import { useState } from "react";
import "./styles.css";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: "added" | "completed" | "deleted";
}

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "Done" | "Undone"
  >("All");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newTodo = {
      id: crypto.randomUUID(),
      title: newItem,
      completed: false,
    };

    setTodos((currentTodos) => {
      return [...currentTodos, newTodo];
    });
    showNotification(`Added: ${newItem}`, "added");

    setNewItem("");
  }

  function toggleTodo(id: string, completed: boolean) {
    const currentTodo = todos.find((todo) => todo.id === id);

    if (currentTodo && completed && !currentTodo.completed) {
      showNotification(`Completed: ${currentTodo.title}`, "completed");
    }

    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        return todo.id === id ? { ...todo, completed } : todo;
      });
    });
  }

  function toggleMenu(id: string) {
    setMenuOpen(menuOpen === id ? null : id);
  }

  function deleteTodo(id: string) {
    const deletedTodo = todos.find((todo) => todo.id === id);
    if (!deletedTodo) return;

    const isConfirmed = window.confirm(
      `Are you sure you want to delete: ${deletedTodo.title}?`
    );

    if (isConfirmed) {
      setTodos((currentTodos) => {
        return currentTodos.filter((todo) => todo.id !== id);
      });

      setMenuOpen(null);

      showNotification(`Deleted: ${deletedTodo.title}`, "deleted");
    }
  }

  let completedPercentage;
  if (todos.length > 0) {
    completedPercentage = Math.round(
      (todos.filter((todo) => todo.completed).length / todos.length) * 100
    );
  } else completedPercentage = 0;

  const filteredTodos = todos.filter((todo) => {
    if (selectedFilter === "Done") return todo.completed;
    if (selectedFilter === "Undone") return !todo.completed;
    return true;
  });

  function showNotification(
    message: string,
    type: "added" | "completed" | "deleted"
  ) {
    const newNotification = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setNotifications((prev) => {
      return [...prev, newNotification];
    });

    const timer = setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 2000);

    return () => clearTimeout(timer);
  }

  return (
    <div className="app-card">
      <div className="progress-container">
        <div className="progress-text">Progress</div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${
              completedPercentage === 100 ? "complete" : ""
            }`}
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
        <div>{todos.filter((t) => t.completed).length} completed</div>
      </div>

      <div className="header-container">
        <h1 className="header">To-dos</h1>
        <select
          value={selectedFilter}
          onChange={(e) =>
            setSelectedFilter(e.target.value as "All" | "Done" | "Undone")
          }
          className="filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Undone">Undone</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <div className="input-with-button">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              type="text"
              id="item"
              placeholder="Add your to-do…"
            />
            <button className="btn inside-button" type="submit">
              Add
            </button>
          </div>
        </div>
      </form>

      <ul className="list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
              />
              <span>{todo.title}</span>
            </label>

            <div className="menu-container">
              <button
                className="menu-button"
                onClick={() => toggleMenu(todo.id)}
              />
              {menuOpen === todo.id && (
                <div className="dropdown-menu">
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification notification-${notification.type}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
