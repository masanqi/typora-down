#[tauri::command]
pub async fn save_image(file_path: String, image_data: Vec<u8>, ext: String) -> Result<String, String> {
    // Will implement in Task 9
    Ok(String::new())
}
