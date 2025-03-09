import { useState } from "react";
import SimpleToDo from "./SimpleToDo";
import GamifiedView from "./GamifiedView";
import "./styles.css";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  birdIndex: number;
  positionX: number;
  positionY: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "added" | "completed" | "deleted";
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  function addTodo(title: string) {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      birdIndex: Math.floor(Math.random() * 4),
      positionX: Math.random() * 35 + 25,
      positionY: Math.random() * 60 + 20,
    };
    setTodos((current) => [...current, newTodo]);
    showNotification(`Added: ${title}`, "added");
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    );
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
    }

    showNotification(`Deleted: ${deletedTodo.title}`, "deleted");
  }

  function showNotification(
    message: string,
    type: "added" | "completed" | "deleted"
  ) {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 2000);
  }

  const handleMinimizeToggle = () => {
    setMinimized(!minimized);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {showGame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            // If you want it behind, no pointer events
            pointerEvents: minimized ? "auto" : "none",
          }}
        >
          <GamifiedView todos={todos} />
        </div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          // If the game is shown, slightly reduce opacity
          opacity: showGame ? 0.95 : 1,
          // If minimized, hide it visually (or shrink it)
          display: minimized ? "none" : "block",
          transition: "opacity 0.3s",
        }}
      >
        <SimpleToDo
          todos={todos}
          onAddTodo={addTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          notifications={notifications}
          showNotification={showNotification}
        />
      </div>
      <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 999 }}>
        <button className="btn" onClick={() => setShowGame(!showGame)}>
          {showGame ? "Hide Game" : "Show Game"}
        </button>
        {showGame && (
          <button
            onClick={handleMinimizeToggle}
            style={{ marginLeft: "1rem" }}
            className="btn"
          >
            {minimized ? "Show To-Do" : "Minimize To-Do"}
          </button>
        )}
      </div>
    </div>
  );
}
