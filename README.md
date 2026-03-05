# Animal Crossing New Horizons Theme

A cozy VS Code theme inspired by Animal Crossing: New Horizons. Three variants bring different island vibes to your editor — from bright daylight to deep-night museum halls to a warm café corner.

## Theme Variants

This extension includes **three theme variants**, each inspired by a beloved character and location:

| Variant | Style | Vibe |
|---------|-------|------|
| **Tom Nook** | Light | Warm cream backgrounds, soft greens, and gentle pastels — island daytime |
| **Blathers** | Dark | Deep navy with neon accents — late-night museum vibes |
| **Brewster** | Dark (cozy) | Coffee brown with warm parchment tones — The Roost café |

### Switching Between Variants

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type **Preferences: Color Theme**
3. Select one of:
   - `ACNH New Horizons — Tom Nook`
   - `ACNH New Horizons — Blathers`
   - `ACNH New Horizons — Brewster`

The background image automatically changes to match the selected variant (tan for Tom Nook, black for Blathers, brown for Brewster). No extra configuration needed.

## Installation

1. Open **Extensions** in VS Code (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for `Animal Crossing New Horizons Theme`
3. Click **Install**
4. Go to **Preferences > Color Theme** and select any **ACNH New Horizons** variant

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

[Apache-2.0](LICENSE)
