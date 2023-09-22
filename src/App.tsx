import "./App.css";
import { Timer, TimerBoard } from "./Timer";
import { TodoList } from "./TodoList";

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 flex flex-col justify-center items-center gap-4">
      {/** Timer */}
      <TimerBoard />
      {/** TODO List */}
      <TodoList />
    </div>
  );
}

export default App;
