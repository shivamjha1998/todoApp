import { Todo } from "./App";
import "./Gameified.css";

// Import your SVG assets or bird images
import Bird1 from "./assets/001.svg";
import Bird2 from "./assets/002.svg";
import Bird3 from "./assets/003.svg";
import Bird4 from "./assets/004.svg";

// Import a tree
import TreeSVG from "./assets/tree.svg";

// Put all birds in an array for easy random indexing
const BIRD_ASSETS = [Bird1, Bird2, Bird3, Bird4];

interface GamifiedViewProps {
  todos: Todo[];
}

export default function GamifiedView({ todos }: GamifiedViewProps) {
  return (
    <div
      style={{
        // This outer container can be absolute if you want it pinned in place
        // or just relative to normal flow.
        position: "absolute", // or remove if you want normal flow
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%", // choose your desired size
        height: "100vh", // or use another approach
        overflow: "hidden",
      }}
    >
      {/* Inner container: position relative so the tree and birds
            can be absolutely placed inside it */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Tree image (fills the container) */}
        <img
          src={TreeSVG}
          alt="Tree"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 1,
          }}
        />

        {todos.map((todo) => {
          const birdImage = BIRD_ASSETS[todo.birdIndex];
          const isCompleted = todo.completed;

          return (
            <img
              key={todo.id}
              src={birdImage}
              alt="Bird"
              className={`bird ${isCompleted ? "bird-static" : ""}`}
              style={{
                position: "absolute",
                left: `${todo.positionX}%`,
                top: `${todo.positionY}%`,
                width: "10rem",
                opacity: isCompleted ? 0.5 : 1,
                transition: "opacity 0.5s",
                zIndex: 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
