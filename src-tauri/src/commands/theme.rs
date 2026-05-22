#[tauri::command]
pub async fn list_themes(dir: String) -> Result<Vec<String>, String> {
    // Will implement in Task 4
    Ok(vec![])
}

#[tauri::command]
pub async fn load_theme(dir: String, name: String) -> Result<String, String> {
    // Will implement in Task 4
    Ok(String::new())
}
