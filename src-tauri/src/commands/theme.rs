use std::path::Path;

#[tauri::command]
pub async fn list_themes(dir: String) -> Result<Vec<String>, String> {
    let path = Path::new(&dir);
    if !path.exists() {
        return Ok(vec![]);
    }

    let mut entries = tokio::fs::read_dir(path)
        .await
        .map_err(|e| e.to_string())?;

    let mut themes = Vec::new();
    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let file_name = entry.file_name().to_string_lossy().to_string();
        if file_name.ends_with(".css") {
            let theme_name = file_name.trim_end_matches(".css").to_string();
            themes.push(theme_name);
        }
    }

    themes.sort();
    Ok(themes)
}

#[tauri::command]
pub async fn load_theme(dir: String, name: String) -> Result<String, String> {
    let file_name = if name.ends_with(".css") {
        name.clone()
    } else {
        format!("{}.css", name)
    };
    let path = Path::new(&dir).join(&file_name);
    tokio::fs::read_to_string(&path)
        .await
        .map_err(|e| format!("Failed to load theme '{}': {}", file_name, e))
}

#[tauri::command]
pub async fn get_default_theme_dir() -> Result<String, String> {
    let home = std::env::var("HOME").map_err(|e| e.to_string())?;
    let default_path = Path::new(&home)
        .join("Library")
        .join("Application Support")
        .join("abnerworks.typedpad")
        .join("themes");

    if default_path.exists() {
        Ok(default_path.to_string_lossy().to_string())
    } else {
        Ok(String::new())
    }
}
