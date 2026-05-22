mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::file::read_file,
            commands::file::write_file,
            commands::file::read_dir,
            commands::file::get_recent_files,
            commands::theme::list_themes,
            commands::theme::load_theme,
            commands::image::save_image,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
