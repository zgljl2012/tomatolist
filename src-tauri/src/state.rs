use std::sync::Mutex;

use rusty_leveldb::DB;


pub struct InnerAppState {
    pub db: DB
}

pub struct AppState (pub Mutex<InnerAppState>);
