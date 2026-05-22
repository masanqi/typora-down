use tauri::Manager;

mod commands;
mod menu;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            commands::file::read_file,
            commands::file::write_file,
            commands::file::read_dir,
            commands::file::get_recent_files,
            commands::file::add_recent_file,
            commands::theme::list_themes,
            commands::theme::load_theme,
            commands::theme::get_default_theme_dir,
            commands::image::save_image,
            menu::update_theme_menu,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            let menu = menu::create_menu(&handle)?;
            let window = app.get_webview_window("main").unwrap();
            window.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            menu::handle_menu_event(app, event.id().as_ref());
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
