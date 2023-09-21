import "./App.css";
import { Timer, TimerBoard } from "./Timer";

function App() {
  return (
    <div className="w-screen h-screen bg-slate-900 flex justify-center items-center">
      <div>
        <TimerBoard />
      </div>
    </div>
  );
}

export default App;
