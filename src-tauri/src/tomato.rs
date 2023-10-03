// tomato

use chrono::{DateTime, Utc, TimeZone, Duration};
use rusty_leveldb::DB;
use serde::{Serialize, Deserialize};

use crate::state::AppState;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tomato {
    pub start_at: DateTime<Utc>,
    pub end_at: DateTime<Utc>,
    pub task: String
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TomatosPerDay {
    pub day: String,
    pub tomatos: Vec<Tomato>
}

impl Tomato {
    pub fn new(start_unix_secs: u64, task: String, end_unix_secs: u64) -> Self {
        let start_at = Utc.timestamp_opt(start_unix_secs as i64, 0).unwrap();
        let end_at = Utc.timestamp_opt(end_unix_secs as i64, 0).unwrap();
        Self { start_at, end_at, task }
    }

    pub fn submit(&self, db: &mut DB) {
        // 按天存储 tomato
        let key = self.start_at.format("TOMATO$%Y-%m-%d").to_string();
        let mut arr = match db.get(key.as_bytes()) {
            Some(r) => {
                let values: Vec<Tomato> = serde_json::from_slice(&r).unwrap();
                values
            },
            None => vec![],
        };
        arr.push(self.clone());
        db.put(key.as_bytes(), &serde_json::to_vec(&arr).unwrap()).unwrap();
    }

    pub fn load(db: &mut DB) -> Vec<TomatosPerDay> {
        // 获取近一个月的 tasks
        let mut today = Utc::now().date_naive();
        let mut count = 30;
        let mut tomatos: Vec<TomatosPerDay> = vec![];
        while count > 0 {
            let day = today.format("%Y-%m-%d").to_string();
            let key = today.format("TOMATO$%Y-%m-%d").to_string();
            today = today - Duration::days(1);
            count -= 1;
            match db.get(key.as_bytes()) {
                Some(r) => {
                    let mut arr: Vec<Tomato> = serde_json::from_slice(&r).unwrap();
                    // reverse
                    arr.reverse();
                    tomatos.push(TomatosPerDay { day, tomatos: arr })
                },
                None => {},
            }
        }
        tomatos
    }
}

#[tauri::command]
pub fn add_tomato(state: tauri::State<AppState>, start_at: u64, end_at: u64, task: String) {
    let t = Tomato::new(start_at, task, end_at);
    let mut s = state.inner().0.lock().unwrap();
    t.submit(&mut s.db);
}

#[tauri::command]
pub fn load_tomatos(state: tauri::State<AppState>) -> Vec<TomatosPerDay> {
    let mut s = state.inner().0.lock().unwrap();
    Tomato::load(&mut s.db)
}

#[cfg(test)]
mod tests {
    use rusty_leveldb::DB;

    use super::Tomato;

    #[test]
    fn test_tomato() {
        let opt = rusty_leveldb::in_memory();
        let mut db = DB::open("mydatabase", opt).unwrap();
        let t = Tomato::new(1696054889, "Task1".to_string(), 1696054889 + 60);
        t.submit(&mut db);
        let t = Tomato::new(1695054889, "Task1".to_string(), 1696054889 + 60);
        t.submit(&mut db);
        let t = Tomato::new(1694054889, "Task1".to_string(), 1696054889 + 60);
        t.submit(&mut db);
        let tomatos = Tomato::load(&mut db);
        println!("{:?}", tomatos);
    }
}
