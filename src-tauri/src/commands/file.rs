use serde::Serialize;
use std::path::Path;

#[derive(Serialize, Clone)]
pub struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
    children: Vec<DirEntry>,
}

fn walk_dir<'a>(path: &'a Path) -> std::pin::Pin<Box<dyn std::future::Future<Output = Result<Vec<DirEntry>, String>> + Send + 'a>> {
    Box::pin(async move {
        let mut entries = Vec::new();
        let mut read_dir = tokio::fs::read_dir(path)
            .await
            .map_err(|e| e.to_string())?;

        while let Some(entry) = read_dir.next_entry().await.map_err(|e| e.to_string())? {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue;
            }
            let path_str = entry.path().to_string_lossy().to_string();
            let is_dir = entry
                .file_type()
                .await
                .map_err(|e| e.to_string())?
                .is_dir();

            let children = if is_dir {
                walk_dir(entry.path().as_path()).await.unwrap_or_default()
            } else {
                vec![]
            };

            entries.push(DirEntry {
                name,
                path: path_str,
                is_dir,
                children,
            });
        }

        entries.sort_by(|a, b| {
            b.is_dir.cmp(&a.is_dir).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
        });

        Ok(entries)
    })
}

#[tauri::command]
pub async fn read_file(path: String) -> Result<String, String> {
    tokio::fs::read_to_string(&path)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_file(path: String, content: String) -> Result<(), String> {
    if let Some(parent) = Path::new(&path).parent() {
        tokio::fs::create_dir_all(parent)
            .await
            .map_err(|e| e.to_string())?;
    }
    tokio::fs::write(&path, content)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn read_dir(path: String) -> Result<Vec<DirEntry>, String> {
    walk_dir(Path::new(&path)).await
}

#[tauri::command]
pub async fn get_recent_files() -> Result<Vec<String>, String> {
    let config_dir = dirs::config_dir()
        .ok_or("Cannot determine config directory")?;
    let recent_path = config_dir.join("typora-down").join("recent.json");
    if recent_path.exists() {
        let content = tokio::fs::read_to_string(&recent_path)
            .await
            .map_err(|e| e.to_string())?;
        let files: Vec<String> = serde_json::from_str(&content)
            .unwrap_or_default();
        Ok(files)
    } else {
        Ok(vec![])
    }
}

#[tauri::command]
pub async fn add_recent_file(path: String) -> Result<(), String> {
    let config_dir = dirs::config_dir()
        .ok_or("Cannot determine config directory")?;
    let dir_path = config_dir.join("typora-down");
    tokio::fs::create_dir_all(&dir_path)
        .await
        .map_err(|e| e.to_string())?;
    let recent_path = dir_path.join("recent.json");

    let mut files = get_recent_files().await.unwrap_or_default();
    files.retain(|f| f != &path);
    files.insert(0, path);
    files.truncate(20);

    let content = serde_json::to_string_pretty(&files)
        .map_err(|e| e.to_string())?;
    tokio::fs::write(&recent_path, content)
        .await
        .map_err(|e| e.to_string())
}
