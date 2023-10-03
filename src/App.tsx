import { RecoilRoot } from "recoil";
import "./App.css";
import { TimerBoard } from "./Timer";
import { TodoList } from "./TodoList";
import { Tomatos } from "./Tomatos";

function App() {
  return (
    <RecoilRoot>
      <div className="w-screen h-screen overflow-hidden bg-slate-900 flex flex-col justify-center items-center gap-4">
        {/** Timer */}
        <TimerBoard />
        <div className="flex flex-row gap-2 w-full justify-center overflow-scroll">
          {/** TODO List */}
          <TodoList />
          {/** Tomatos */}
          <Tomatos />
        </div>
      </div>
    </RecoilRoot>
  );
}

export default App;
