// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;

use rusty_leveldb::DB;
use state::{AppState, InnerAppState};
use tauri::{api::path::app_data_dir, Config};

use crate::{
    todo::{add_todo, delete_todo, load_todos, update_todo},
    tomato::{add_tomato, load_tomatos},
};

mod state;
mod todo;
mod tomato;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let identifier = "com.zgljl2012.tomatolist";
    let mut cfg = Config::default();
    cfg.tauri.bundle.identifier = identifier.to_string();
    // Mac: ~/Library/Application\ Support/com.zgljl2012.tomatolist
    let path = app_data_dir(&cfg).unwrap();
    let opt = rusty_leveldb::Options::default();
    let db = DB::open(path, opt).unwrap();
    let state = AppState(Mutex::new(InnerAppState { db }));
    
    tauri::Builder::default().manage(state)
        .invoke_handler(tauri::generate_handler![
            greet,
            load_todos,
            add_todo,
            update_todo,
            delete_todo,
            add_tomato,
            load_tomatos
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
