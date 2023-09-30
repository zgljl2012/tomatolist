import { RecoilRoot } from "recoil";
import "./App.css";
import { TimerBoard } from "./Timer";
import { TodoList } from "./TodoList";

function App() {
  return (
    <RecoilRoot>
      <div className="w-screen h-screen overflow-hidden bg-slate-900 flex flex-col justify-center items-center gap-4">
        {/** Timer */}
        <TimerBoard />
        {/** TODO List */}
        <TodoList />
      </div>
    </RecoilRoot>
  );
}

export default App;
