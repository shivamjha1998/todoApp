import { Todo } from "./App";
import "./styles/Gameified.css";

import Bird1 from "./assets/bird1.svg";
import Bird2 from "./assets/bird2.svg";
import Bird3 from "./assets/bird3.svg";
import Bird4 from "./assets/bird4.svg";

import TreeSVG from "./assets/tree.svg";

const BIRD_ASSETS = [Bird1, Bird2, Bird3, Bird4];

interface GamifiedViewProps {
  todos: Todo[];
}

export default function GamifiedView({ todos }: GamifiedViewProps) {
  return (
    <div className="game-container">
      <div className="tree-container">
        <img src={TreeSVG} alt="Tree" className="tree" />

        {todos.map((todo) => {
          const birdImage = BIRD_ASSETS[todo.birdIndex];
          const isCompleted = todo.completed;

          return (
            <img
              key={todo.id}
              src={birdImage}
              alt="Bird"
              className={`bird ${isCompleted ? "bird-static" : ""}`}
              style={
                {
                  "--bird-left": `${todo.positionX}%`,
                  "--bird-top": `${todo.positionY}%`,
                  "--bird-opacity": isCompleted ? 0.5 : 1,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
