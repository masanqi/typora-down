# Typora-Down

Typora-Down is a desktop Markdown editor inspired by Typora. It is built with
Tauri 2, React, TypeScript, and Milkdown, with a focus on a clean writing
surface, local files, and Markdown-friendly editing.

## Features

- WYSIWYG Markdown editing powered by Milkdown.
- Source mode for editing raw Markdown directly.
- File and folder opening through native Tauri dialogs.
- Auto-save for opened files.
- Sidebar with file tree and document outline.
- Mermaid diagram rendering.
- Footnote navigation.
- Prism syntax highlighting for code blocks.
- Theme loading from local theme directories.
- Native application menu with file, edit, view, theme, and window actions.
- Copy as Markdown through the native clipboard plugin.

## Tech Stack

- Tauri 2
- React 19
- TypeScript
- Vite
- Milkdown
- Mermaid
- PrismJS

## Requirements

- Node.js
- npm
- Rust
- Tauri system dependencies for your platform

For platform-specific Tauri prerequisites, see the official Tauri setup guide:
https://tauri.app/start/prerequisites/

## Development

Install dependencies:

```bash
npm install
```

Run the web development server:

```bash
npm run dev
```

Run the Tauri desktop app during development:

```bash
npm exec tauri dev
```

Build the frontend:

```bash
npm run build
```

Build the desktop app bundle:

```bash
npm exec tauri build
```

## Project Structure

```text
src/
  components/      React UI components
  hooks/           File, editor, and theme state hooks
  services/        Tauri IPC wrappers
  styles/          App and Typora-compatible styles

src-tauri/
  src/             Rust commands, menu setup, and Tauri entry points
  capabilities/    Tauri permission configuration
  icons/           Application icons
```

## Status

This project is in early development. Core Markdown editing, local file IO,
theme loading, native menus, and desktop packaging are being actively built out.
