use rusty_leveldb::DB;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::state::AppState;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Todo {
    pub id: Uuid,
    pub title: String,
    pub finished: bool,
    pub is_current_term: bool,
}

const KEY: &str = "TODO_DATA";

impl Todo {
    pub fn new(id: Option<Uuid>, title: String, finished: bool, is_current_term: bool) -> Todo {
        let id = id.unwrap_or(Uuid::new_v4());
        Self {
            id,
            title, finished, is_current_term
        }
    }

    pub fn load_todos(db: &mut DB) -> Vec<Todo> {
        match db.get(KEY.as_bytes()) {
            Some(bytes) => {
                let s = String::from_utf8_lossy(bytes.as_slice()).to_string();
                serde_json::from_str::<Vec<Todo>>(&s).unwrap()
            },
            None => vec![],
        }
    }

    fn save_todos(todos: Vec<Todo>, db: &mut DB) {
        let s = serde_json::to_string(&todos).unwrap();
        db.put(KEY.as_bytes(), s.as_bytes()).unwrap();
        db.flush().unwrap();
    }

    pub fn add(&self, db: &mut DB) {
        let mut todos = Todo::load_todos(db);
        todos.push(self.clone());
        Todo::save_todos(todos, db);
    }

    pub fn remove(db: &mut DB, id: String) {
        let todos = Todo::load_todos(db);
        let todos2 = todos.iter().filter(|t|t.id.to_string() != id).map(|t|t.clone()).collect::<Vec<Todo>>();
        Todo::save_todos(todos2, db);
    }

    pub fn update(&self, db: &mut DB) {
        let todos = Todo::load_todos(db);
        let id = self.id.to_string();
        let todos2 = todos.iter().map(move |t|{
            if t.id.to_string() == id {
                return self.clone();
            }
            return t.clone()
        }).collect::<Vec<Todo>>();
        Todo::save_todos(todos2, db);
    }
}

#[tauri::command]
pub fn load_todos(state: tauri::State<AppState>) -> Vec<Todo> {
    let mut s = state.inner().0.lock().unwrap();
    let todos: Vec<Todo> = Todo::load_todos(&mut s.db).iter().filter(|t|t.is_current_term).map(|t|t.clone()).collect();
    todos
}

#[tauri::command]
pub fn add_todo(state: tauri::State<AppState>, title: String) -> String {
    let mut s = state.inner().0.lock().unwrap();
    let todo = Todo::new(None, title.clone(), false, true);
    todo.add(&mut s.db);
    return todo.id.to_string()
}

#[tauri::command]
pub fn update_todo(state: tauri::State<AppState>, todo: Todo) {
    let mut s = state.inner().0.lock().unwrap();
    todo.update(&mut s.db);
}

#[tauri::command]
pub fn delete_todo(state: tauri::State<AppState>, id: String) {
    let mut s = state.inner().0.lock().unwrap();
    Todo::remove(&mut s.db, id);
}

#[cfg(test)]
mod tests {
    use rusty_leveldb::DB;

    use super::Todo;

    #[test]
    pub fn test_add_todo() {
        let t = Todo::new(None, "Todo".to_string(), true, false);
        let opt = rusty_leveldb::in_memory();
        let mut db = DB::open("mydatabase", opt).unwrap();
        t.add(&mut db);
        let todos = Todo::load_todos(&mut db);
        assert_eq!(todos.len(), 1);
        assert_eq!(todos[0].title, t.title);
        let t2 = Todo::new(None, "Todo2".to_string(), true, false);
        t2.add(&mut db);
        let todos = Todo::load_todos(&mut db);
        assert_eq!(todos.len(), 2);
        assert_eq!(todos[1].title, t2.title);
        assert_eq!(todos[1].finished, true);
        assert_eq!(todos[1].is_current_term, false);
        // update t2
        let t3 = Todo::new(Some(t2.id.clone()), "Todo3".to_string(), false, true);
        t3.update(&mut db);
        let todos = Todo::load_todos(&mut db);
        assert_eq!(todos.len(), 2);
        assert_eq!(todos[1].title, t3.title);
        assert_eq!(todos[1].finished, false);
        assert_eq!(todos[1].is_current_term, true);

        // remove t
        Todo::remove(&mut db, t.id.to_string());
        let todos = Todo::load_todos(&mut db);
        println!("{:?}", todos);
        assert_eq!(todos.len(), 1);
        assert_eq!(todos[0].title, t3.title);
    }
}
