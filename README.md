# Animal Crossing New Horizons Theme

A cozy light theme for VS Code inspired by Animal Crossing: New Horizons.

Warm cream backgrounds, soft greens, and gentle pastels bring island vibes to your editor.

## Installation

1. Open **Extensions** in VS Code (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for `Animal Crossing New Horizons Theme`
3. Click **Install**
4. Go to **Preferences > Color Theme** and select **ACNH New Horizons**

## Custom Font

This theme includes a bundled **Roboto** font that replaces the default VS Code UI font for a softer, more cozy look.

**To enable:**
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **ACNH: Enable Roboto Font**
3. Click **Reload Now** when prompted

**To disable:**
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **ACNH: Disable Roboto Font**
3. Click **Reload Now** when prompted

> **Note:** The font applies to the VS Code UI (sidebar, tabs, menus, etc.) — your editor font (`editor.fontFamily`) and terminal font are not affected. The terminal will be set to **Roboto Mono**, which you can install from [Google Fonts](https://fonts.google.com/specimen/Roboto+Mono) if it's not already on your system.

## Custom Cursors

Replace your default cursor with Animal Crossing-themed cursors! You'll get a custom select cursor throughout the UI and a grab cursor when dragging tabs and list items.

**To enable:**
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **ACNH: Enable Animal Crossing Cursors**
3. Click **Reload Now** when prompted

**To disable:**
1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **ACNH: Disable Animal Crossing Cursors**
3. Click **Reload Now** when prompted

## Important: "Corrupt Installation" Warning

This extension injects custom CSS into VS Code's internal `workbench.html` file to enable the background image, custom fonts, and cursors. Because of this, VS Code will detect that its installation files have been modified and show a warning:

> **Your Code installation appears to be corrupt. Please reinstall.**

**This is expected and harmless.** Your VS Code installation is not actually corrupt — the message appears because VS Code checksums its own files and notices the patch. You can safely dismiss the warning or click "Don't Show Again."

An `[Unsupported]` tag will also appear in the title bar while the patch is active. This is purely cosmetic and does not affect functionality.

## License

[MIT](LICENSE)
