use std::path::Path;

#[tauri::command]
pub async fn save_image(file_path: String, image_data: Vec<u8>, ext: String) -> Result<String, String> {
    let md_path = Path::new(&file_path);
    let assets_dir = md_path.parent()
        .ok_or("Cannot determine parent directory")?
        .join(".assets");

    tokio::fs::create_dir_all(&assets_dir)
        .await
        .map_err(|e| e.to_string())?;

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();

    let filename = format!("img-{}.{}", timestamp, ext);
    let img_path = assets_dir.join(&filename);

    tokio::fs::write(&img_path, image_data)
        .await
        .map_err(|e| e.to_string())?;

    Ok(format!(".assets/{}", filename))
}
