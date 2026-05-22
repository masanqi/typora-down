#[tauri::command]
pub async fn read_file(path: String) -> Result<String, String> {
    tokio::fs::read_to_string(&path)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_file(path: String, content: String) -> Result<(), String> {
    tokio::fs::write(&path, content)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn read_dir(path: String) -> Result<serde_json::Value, String> {
    // Will implement in Task 3
    Ok(serde_json::Value::Null)
}

#[tauri::command]
pub async fn get_recent_files() -> Result<Vec<String>, String> {
    // Will implement in Task 3
    Ok(vec![])
}
