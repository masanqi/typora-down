use tauri::{
    AppHandle, Emitter, Wry,
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem, Submenu},
};

pub fn create_menu(app: &AppHandle) -> Result<Menu<Wry>, Box<dyn std::error::Error>> {
    let file_menu = Submenu::with_id(app, "file", "文件", true)?;
    file_menu.append_items(&[
        &MenuItem::with_id(app, "new_file", "新建", true, Some("CmdOrCtrl+N"))?,
        &MenuItem::with_id(app, "open_file", "打开...", true, Some("CmdOrCtrl+O"))?,
        &MenuItem::with_id(app, "open_folder", "打开文件夹...", true, Some("CmdOrCtrl+Shift+O"))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "save_file", "保存", true, Some("CmdOrCtrl+S"))?,
        &MenuItem::with_id(app, "save_as", "另存为...", true, Some("CmdOrCtrl+Shift+S"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::close_window(app, None)?,
    ])?;

    let edit_menu = Submenu::with_id(app, "edit", "编辑", true)?;
    edit_menu.append_items(&[
        &PredefinedMenuItem::undo(app, None)?,
        &PredefinedMenuItem::redo(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::cut(app, None)?,
        &PredefinedMenuItem::copy(app, None)?,
        &PredefinedMenuItem::paste(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "copy_as_markdown", "复制为 Markdown", true, Some("CmdOrCtrl+Shift+C"))?,
        &PredefinedMenuItem::select_all(app, None)?,
    ])?;

    let paragraph_menu = Submenu::with_id(app, "paragraph", "段落", true)?;
    paragraph_menu.append_items(&[
        &MenuItem::with_id(app, "heading_1", "标题 1", true, Some("CmdOrCtrl+1"))?,
        &MenuItem::with_id(app, "heading_2", "标题 2", true, Some("CmdOrCtrl+2"))?,
        &MenuItem::with_id(app, "heading_3", "标题 3", true, Some("CmdOrCtrl+3"))?,
        &MenuItem::with_id(app, "heading_4", "标题 4", true, Some("CmdOrCtrl+4"))?,
        &MenuItem::with_id(app, "heading_5", "标题 5", true, Some("CmdOrCtrl+5"))?,
        &MenuItem::with_id(app, "heading_6", "标题 6", true, Some("CmdOrCtrl+6"))?,
        &MenuItem::with_id(app, "increase_heading", "增加标题级别", true, Some("CmdOrCtrl+Plus"))?,
        &MenuItem::with_id(app, "decrease_heading", "减少标题级别", true, Some("CmdOrCtrl+Minus"))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "blockquote", "引用块", true, None::<&str>)?,
        &MenuItem::with_id(app, "ordered_list", "有序列表", true, None::<&str>)?,
        &MenuItem::with_id(app, "unordered_list", "无序列表", true, None::<&str>)?,
        &MenuItem::with_id(app, "task_list", "任务列表", true, None::<&str>)?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "table", "表格", true, None::<&str>)?,
        &MenuItem::with_id(app, "code_block", "代码块", true, None::<&str>)?,
        &MenuItem::with_id(app, "math_block", "数学块", true, None::<&str>)?,
        &MenuItem::with_id(app, "horizontal_rule", "分割线", true, None::<&str>)?,
    ])?;

    let format_menu = Submenu::with_id(app, "format", "格式", true)?;
    format_menu.append_items(&[
        &MenuItem::with_id(app, "bold", "加粗", true, Some("CmdOrCtrl+B"))?,
        &MenuItem::with_id(app, "italic", "斜体", true, Some("CmdOrCtrl+I"))?,
        &MenuItem::with_id(app, "underline", "下划线", true, Some("CmdOrCtrl+U"))?,
        &MenuItem::with_id(app, "strikethrough", "删除线", true, None::<&str>)?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "inline_code", "行内代码", true, None::<&str>)?,
        &MenuItem::with_id(app, "inline_math", "行内数学", true, None::<&str>)?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "hyperlink", "超链接", true, Some("CmdOrCtrl+K"))?,
        &MenuItem::with_id(app, "image", "图片", true, None::<&str>)?,
        &MenuItem::with_id(app, "highlight", "高亮", true, None::<&str>)?,
    ])?;

    let view_menu = Submenu::with_id(app, "view", "显示", true)?;
    view_menu.append_items(&[
        &CheckMenuItem::with_id(app, "source_mode", "源代码模式", true, false, Some("CmdOrCtrl+/"))?,
        &PredefinedMenuItem::separator(app)?,
        &CheckMenuItem::with_id(app, "toggle_sidebar", "切换侧边栏", true, false, Some("CmdOrCtrl+Shift+L"))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "focus_mode", "专注模式", true, None::<&str>)?,
        &MenuItem::with_id(app, "typewriter_mode", "打字机模式", true, None::<&str>)?,
    ])?;

    let theme_menu = Submenu::with_id(app, "theme", "主题", true)?;
    theme_menu.append_items(&[
        &MenuItem::with_id(app, "import_theme_dir", "导入主题目录...", true, None::<&str>)?,
        &PredefinedMenuItem::separator(app)?,
        &CheckMenuItem::with_id(app, "theme_default", "Default", true, true, None::<&str>)?,
    ])?;

    let window_menu = Submenu::with_id(app, "window", "窗口", true)?;
    window_menu.append_items(&[
        &PredefinedMenuItem::minimize(app, None)?,
        &PredefinedMenuItem::maximize(app, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::bring_all_to_front(app, None)?,
    ])?;

    let help_menu = Submenu::with_id(app, "help", "帮助", true)?;
    help_menu.append_items(&[
        &MenuItem::with_id(app, "about", "关于 Typora-Down", true, None::<&str>)?,
    ])?;

    let menu = Menu::new(app)?;
    menu.append_items(&[
        &file_menu,
        &edit_menu,
        &paragraph_menu,
        &format_menu,
        &view_menu,
        &theme_menu,
        &window_menu,
        &help_menu,
    ])?;

    Ok(menu)
}

pub fn handle_menu_event(app: &AppHandle, id: &str) {
    let _ = app.emit("menu-event", id);
}

#[tauri::command]
pub async fn update_theme_menu(
    app: AppHandle,
    themes: Vec<String>,
    active_theme: String,
) -> Result<(), String> {
    let menu_manager = app.menu().ok_or("No menu found")?;
    let theme_entry = menu_manager
        .get("theme")
        .ok_or("Theme menu not found")?;
    let theme_submenu = theme_entry
        .as_submenu()
        .ok_or("Theme entry is not a submenu")?;

    // Remove old theme items (items whose id starts with "theme_")
    let items = theme_submenu.items();
    let theme_ids: Vec<String> = items
        .iter()
        .flatten()
        .filter(|item| item.id().as_ref().starts_with("theme_"))
        .map(|item| item.id().as_ref().to_string())
        .collect();

    for id in theme_ids {
        let idx = theme_submenu
            .items()
            .iter()
            .flatten()
            .position(|i| i.id().as_ref() == id)
            .unwrap();
        theme_submenu.remove_at(idx).map_err(|e| e.to_string())?;
    }

    // Add Default theme item
    let default_item = CheckMenuItem::with_id(
        &app,
        "theme_default",
        "Default",
        true,
        active_theme.is_empty(),
        None::<&str>,
    )
    .map_err(|e| e.to_string())?;
    theme_submenu
        .append(&default_item)
        .map_err(|e| e.to_string())?;

    // Add each theme as a checkable item
    for name in &themes {
        let id = format!("theme_{}", name.replace(' ', "_"));
        let item = CheckMenuItem::with_id(
            &app,
            &id,
            name,
            true,
            name == &active_theme,
            None::<&str>,
        )
        .map_err(|e| e.to_string())?;
        theme_submenu
            .append(&item)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
