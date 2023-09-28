import clsx from "clsx";
import { useEffect, useState } from "react";
import { addTodo, deleteTodo, listTodos, updateTodo } from "./services/todo";

export interface Todo {
  id: string;
  title: string;
  finished: boolean;
  is_current_term: boolean
}

function TodoComp({
  todo,
  onDelete,
  onUpdate,
  onSelected,
}: {
  todo: Todo;
  onDelete?: () => void;
  onUpdate?: (title: string) => void;
  onSelected?: () => void;
}) {
  const [editable, setEditable] = useState(false);
  return (
    <div className="group text-white hover:bg-slate-500 py-1 px-1 rounded-lg flex flex-row justify-between items-center w-full">
      <div className="flex flex-row gap-2 items-center">
        {/** Checkbox */}
        <input
          checked={todo.finished}
          onChange={() => {
            onSelected && onSelected();
          }}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          type="checkbox"
        />
        {/** title */}
        <div
          className={clsx(
            todo.finished && "text-slate-400 line-through select-none"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.blur();
              setEditable(false);
              const text = (e.target as any).innerHTML;
              if (text && text !== "<br>") {
                onUpdate && onUpdate(text);
              } else if (!text || text === "<br>") {
                onDelete && onDelete();
              }
            }
          }}
          contentEditable={!todo.finished && editable}
          onDoubleClick={() => {
            setEditable(true);
          }}
        >
          {todo.title}
        </div>
      </div>
      {!todo.finished && (
        <div className="invisible group-hover:visible">
          <button
            onClick={() => {
              onDelete && onDelete();
            }}
            className="text-red-500"
          >
            Del
          </button>
        </div>
      )}
    </div>
  );
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [val, setVal] = useState<string>("");
  function reload() {
    listTodos()
      .then((values) => {
        setTodos(values);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    reload()
  }, []);
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-400/50 px-4 py-2 w-1/3 overflow-scroll">
      {/** Buttons */}
      <div className="flex flex-row justify-end border-b pb-2 border-slate-100/20">
        {/** 只有使用 form 才能解决输入法 Enter 的问题 */}
        <form
          onSubmit={(e) => {
            if (val.trim()) {
              addTodo(val)
                .then((id) => {
                  setTodos([...todos, { id, title: val, finished: false, is_current_term: true }]);
                  setVal(() => "");
                })
                .catch((err) => {
                  console.error(err);
                });
            }
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <input
            value={val}
            placeholder="Enter new task"
            onChange={(e) => setVal(e.target.value)}
            className="bg-black/50 text-white outline-slate-400 rounded-md px-2 py-1 text-lg"
          ></input>
        </form>
      </div>
      <div className="text-xs text-slate-400">Tasks:</div>
      {/** Unsolved Todos */}
      {todos.map((todo, i) => {
        if (!todo.finished) {
          return (
            <div className="flex flex-row justify-between" key={i}>
              {/** Todo */}
              <TodoComp
                todo={todo}
                onSelected={() => {
                  updateTodo({ ...todo, finished: true}).then(() => {
                    reload()
                  }).catch(err => {
                    console.error(err)
                  })
                }}
                onUpdate={(title) => {
                  updateTodo({ ...todo, title}).then(() => {
                    reload()
                  }).catch(err => {
                    console.error(err)
                  })
                }}
                onDelete={() => {
                  deleteTodo(todo.id).then(() => {
                    reload()
                  }).catch(err => {
                    console.error(err)
                  })
                }}
              />
            </div>
          );
        }
      })}
      {/** Finished */}
      <hr className="border-slate-200/20" />
      <div>
        <div className="text-slate-400 text-xs">Finished:</div>
        {todos.map((todo, i) => {
          if (todo.finished) {
            return (
              <TodoComp
                key={i}
                onSelected={() => {
                  setTodos(() => {
                    return todos.map((todo, j) => {
                      if (i === j) {
                        return { ...todo, finished: false };
                      }
                      return todo;
                    });
                  });
                }}
                todo={todo}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
