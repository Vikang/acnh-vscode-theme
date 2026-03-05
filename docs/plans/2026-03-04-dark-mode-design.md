# ACNH Dark Mode Variant — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dark mode variant ("ACNH New Horizons Dark") so users can switch between light and dark ACNH themes, with the CSS-patched background image automatically matching the active theme.

**Architecture:** Register a second color theme in `package.json` pointing to a new dark theme JSON file. Modify `src/extension.js` to detect the active theme kind (`Light` vs `Dark`) and inject the corresponding background image (`Nook_Shopping_Background_Tan.png` or `Nook_Shopping_Background_Black.png`). Listen for theme changes to re-apply patches automatically.

**Tech Stack:** VS Code Extension API (JavaScript), JSON color theme files

---

### Task 1: Register dark theme variant in package.json

**Files:**
- Modify: `package.json:41-48`

**Step 1: Add dark theme entry to contributes.themes**

In `package.json`, replace the existing `contributes.themes` array:

```json
"themes": [
  {
    "label": "ACNH New Horizons",
    "uiTheme": "vs",
    "path": "./themes/acnh-new-horizons-color-theme.json"
  },
  {
    "label": "ACNH New Horizons Dark",
    "uiTheme": "vs-dark",
    "path": "./themes/acnh-new-horizons-dark-color-theme.json"
  }
]
```

Also update `package.json` keywords to include `"dark theme"` and update the description to mention both light and dark.

**Step 2: Commit**

```bash
git add package.json
git commit -m "feat: register ACNH New Horizons Dark theme variant"
```

---

### Task 2: Create dark color theme JSON

**Files:**
- Create: `themes/acnh-new-horizons-dark-color-theme.json`
- Reference: `themes/acnh-new-horizons-color-theme.json` (existing light theme)

**Step 1: Create the dark theme file**

Copy the light theme as a starting point, then apply these systematic color transformations:

**Core mapping (light → dark):**

| Light Color | Role | Dark Replacement |
|-------------|------|-----------------|
| `#FFFFF7` (Off-White) | Main backgrounds | `#0F1620` (Deep Blue) |
| `#253B52` (Navy) | Main foreground/text | `#D3FBF8` (Light Blue) |
| `#F8F4E8` (Light Off-White) | Secondary backgrounds (sidebar, panels, widgets) | `#1A2332` (lighter Deep Blue) |
| `#EEE9CA` (Tan) | Tertiary backgrounds (activity bar, borders, guides) | `#253B52` (Navy) |
| `#725C4E` (Brown) | Secondary foreground | `#8A9BB0` (muted light blue) |
| `#8A7B66` (Button Brown) | Muted text | `#7A8B9E` (slate) |

**Colors that stay the same (accent colors):**
- `#8AC68A` (App Green) — buttons, success
- `#FC736D` (App Red) — errors
- `#FF544A` (Notification Red) — badges
- `#04AFA6` (Teal) — info, functions
- `#B77DEE` (Purple) — types, constants
- `#E2826A` (Warm Pink) — keywords, tags
- `#E59266` (App Orange) — warnings, parameters
- `#FFB400` (Warm Yellow) — highlights, headings
- `#889DF0` (App Blue) — status bar (stays same)
- `#71681D` (Brown-Green) → `#A89C54` (lightened for dark bg) — strings

**Key dark-specific overrides:**
- `"type": "dark"` (was `"light"`)
- Title bar: `#253B52` background, `#D3FBF8` foreground
- Status bar: `#253B52` background, `#D3FBF8` foreground
- Terminal background: `#1A2332`
- Editor line highlight: `#253B5240`
- Selection: `#253B5280`
- Widget shadow: `#00000080`
- Scrollbar: `#D3FBF812`
- Comments (tokenColors): `#7A8B9E` italic (was `#253B52`)
- Strings: `#A89C54` (lightened Brown-Green for contrast)

**Token color changes for dark background:**
- Foreground text scopes using `#253B52` → change to `#D3FBF8`
- Comment scopes → change to `#7A8B9E`
- Brown `#725C4E` scopes → change to `#8A9BB0`
- `#71681D` string color → `#A89C54`
- All other accent colors (Teal, Purple, Pink, Orange, Yellow, Green, Red, Blue) remain unchanged

**Step 2: Verify the JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('themes/acnh-new-horizons-dark-color-theme.json', 'utf8')); console.log('Valid JSON')"`
Expected: `Valid JSON`

**Step 3: Commit**

```bash
git add themes/acnh-new-horizons-dark-color-theme.json
git commit -m "feat: add ACNH New Horizons Dark color theme"
```

---

### Task 3: Add theme-aware background image selection

**Files:**
- Modify: `src/extension.js:60-65` (getBackgroundImageBase64)
- Modify: `src/extension.js:324-422` (applyAllPatches)

**Step 1: Add dark background image helper**

After the existing `getBackgroundImageBase64` function (line 65), add:

```javascript
function getDarkBackgroundImageBase64(extensionPath) {
    return fileToBase64DataUri(
        path.join(extensionPath, 'Nook_Shopping_Background_Black.png'),
        'image/png'
    );
}
```

**Step 2: Add theme detection helper**

After the new function, add:

```javascript
function isDarkThemeActive() {
    const kind = vscode.window.activeColorTheme.kind;
    return kind === vscode.ColorThemeKind.Dark || kind === vscode.ColorThemeKind.HighContrast;
}
```

**Step 3: Modify applyAllPatches to use theme-aware background**

In `applyAllPatches` (around line 338), replace:

```javascript
const imageDataUri = getBackgroundImageBase64(context.extensionPath);
```

with:

```javascript
const imageDataUri = isDarkThemeActive()
    ? getDarkBackgroundImageBase64(context.extensionPath)
    : getBackgroundImageBase64(context.extensionPath);
```

**Step 4: Commit**

```bash
git add src/extension.js
git commit -m "feat: select background image based on active theme kind"
```

---

### Task 4: Add theme change listener for automatic re-patching

**Files:**
- Modify: `src/extension.js:448-512` (activate function)

**Step 1: Add onDidChangeActiveColorTheme listener**

Inside the `activate` function, after the `context.subscriptions.push(...)` block (after line 512), add:

```javascript
// --- Theme change listener ---
const themeChangeDisposable = vscode.window.onDidChangeActiveColorTheme(() => {
    log.appendLine('Theme changed, re-applying patches with new background.');
    const success = applyAllPatches(context);
    if (success) promptReload();
});
context.subscriptions.push(themeChangeDisposable);
```

**Step 2: Commit**

```bash
git add src/extension.js
git commit -m "feat: re-apply patches when user switches between light/dark theme"
```

---

### Task 5: Update package.json metadata

**Files:**
- Modify: `package.json`

**Step 1: Update description and keywords**

Change `description` to:
```
"A cozy theme for VS Code inspired by Animal Crossing: New Horizons. Available in light and dark variants with warm cream, soft green, and deep blue tones for a relaxing coding experience."
```

Add `"dark theme"` to keywords array.

**Step 2: Commit**

```bash
git add package.json
git commit -m "docs: update description and keywords for dark theme variant"
```

---

### Task 6: Manual testing checklist

**No files to modify — verification only.**

**Step 1: Load extension in dev mode**

Run: `code --extensionDevelopmentPath=/Users/vicky/Documents/Github/vscode-acnh-theme`

**Step 2: Verify light theme works**

1. Open Command Palette → "Preferences: Color Theme"
2. Select "ACNH New Horizons"
3. Verify light colors (off-white bg, navy text)
4. Verify tan background image appears in empty editor

**Step 3: Verify dark theme works**

1. Switch to "ACNH New Horizons Dark"
2. Verify dark colors (deep blue bg, light blue text)
3. Reload when prompted
4. Verify dark background image appears in empty editor

**Step 4: Verify theme switching re-patches**

1. Switch from Dark → Light
2. Confirm reload prompt appears
3. After reload, verify correct (tan) background image

**Step 5: Verify syntax highlighting contrast**

1. Open a JS/TS file in dark theme
2. Verify: keywords (pink), functions (teal), strings (lightened green), types (purple) are all readable
3. Verify comments are visible but muted
