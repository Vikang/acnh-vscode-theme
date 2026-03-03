# Animal Crossing New Horizons VS Code Theme — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a light VS Code theme using the ACNH color palette, with real-time preview capability.

**Architecture:** Copy `src/monokai-standard.json` as baseline, remap all ~620 UI colors and ~163 token color rules to the ACNH palette using a systematic find-and-replace of the Monokai color constants, then add a VS Code extension manifest for F5 preview.

**Tech Stack:** VS Code Color Theme JSON, VS Code Extension API (package.json manifest)

---

### Task 1: Set up VS Code extension structure for real-time preview

**Files:**
- Create: `package.json`
- Create: `themes/` directory

**Step 1: Create package.json**

Create `package.json` at the repo root:

```json
{
  "name": "acnh-new-horizons-theme",
  "displayName": "Animal Crossing New Horizons Theme",
  "description": "A cozy light theme inspired by Animal Crossing: New Horizons",
  "version": "0.1.0",
  "publisher": "KristofferHopland",
  "engines": {
    "vscode": "^1.60.0"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "label": "ACNH New Horizons",
        "uiTheme": "vs",
        "path": "./themes/acnh-new-horizons-color-theme.json"
      }
    ]
  }
}
```

Note: `"uiTheme": "vs"` tells VS Code this is a light theme.

**Step 2: Create themes directory**

```bash
mkdir -p themes
```

**Step 3: Verify extension structure**

```bash
ls -la package.json themes/
```

Expected: Both exist.

**Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add VS Code extension manifest for ACNH theme"
```

---

### Task 2: Create the ACNH theme file — UI Colors section

**Files:**
- Create: `themes/acnh-new-horizons-color-theme.json`
- Reference: `src/monokai-standard.json` (lines 1-622 for colors section)

**Step 1: Copy baseline and change type to light**

Copy `src/monokai-standard.json` to `themes/acnh-new-horizons-color-theme.json`.

Change line 3 from `"type": "dark"` to `"type": "light"`.

**Step 2: Apply the systematic color replacement for UI colors**

The Monokai Standard uses these core color constants throughout the 620-line colors section. Replace them all using the mapping below.

**Background/Surface hierarchy (dark → light):**

| Monokai (find) | ACNH (replace) | Role |
|---|---|---|
| `#19181a` | `#EEE9CA` | Darkest surface → Tan (activity bar borders, deepest bg) |
| `#221f22` | `#F8F4E8` | Dark surface → Light Off-White (sidebar, secondary surfaces) |
| `#2d2a2e` | `#FFFFF7` | Editor bg → Off-White (main background) |
| `#403e41` | `#F8F4E8` | Widget/panel bg → Light Off-White (dropdowns, panels) |

**Foreground hierarchy (light → dark):**

| Monokai (find) | ACNH (replace) | Role |
|---|---|---|
| `#fcfcfa` | `#253B52` | Primary fg → Navy (main text, bright fg) |
| `#c1c0c0` | `#725C4E` | Secondary fg → Brown (medium emphasis) |
| `#939293` | `#8A7B66` | Tertiary fg → Button Brown (low emphasis) |
| `#727072` | `#8A7B66` | Muted fg → Button Brown (comments, inactive) |
| `#5b595c` | `#EEE9CA` | Dimmest fg → Tan (very subtle, rulers) |

**Accent colors:**

| Monokai (find) | ACNH (replace) | Role |
|---|---|---|
| `#ffd866` | `#FFB400` | Yellow accent → Warm Yellow (badges, active tabs, links) |
| `#ff6188` | `#FC736D` | Red/Pink → App Red (errors, keywords) |
| `#a9dc76` | `#8AC68A` | Green → App Green (success, added, functions) |
| `#78dce8` | `#04AFA6` | Cyan → Teal (info, types, links) |
| `#ab9df2` | `#B77DEE` | Purple → Purple (constants, hints) |
| `#fc9867` | `#E59266` | Orange → App Orange (warnings, modified) |

**Step 3: Override specific UI elements that need special treatment**

After the bulk replacement, manually set these specific overrides:

```json
"titleBar.activeBackground": "#8AC68A",
"titleBar.activeForeground": "#FFFFF7",
"titleBar.border": "#8AC68A",
"titleBar.inactiveBackground": "#7ab67a",
"titleBar.inactiveForeground": "#F8F4E8",

"statusBar.background": "#889DF0",
"statusBar.foreground": "#FFFFF7",
"statusBar.border": "#889DF0",
"statusBar.debuggingBackground": "#E59266",
"statusBar.debuggingForeground": "#FFFFF7",
"statusBar.debuggingBorder": "#E59266",
"statusBar.noFolderBackground": "#889DF0",
"statusBar.noFolderForeground": "#FFFFF7",
"statusBar.noFolderBorder": "#889DF0",

"activityBar.background": "#EEE9CA",
"activityBar.foreground": "#725C4E",
"activityBar.border": "#EEE9CA",
"activityBar.inactiveForeground": "#8A7B66",
"activityBar.activeBorder": "#8AC68A",
"activityBarBadge.background": "#FF544A",
"activityBarBadge.foreground": "#FFFFF7",

"sideBar.background": "#F8F4E8",
"sideBar.foreground": "#725C4E",
"sideBar.border": "#EEE9CA",

"tab.activeBackground": "#FFFFF7",
"tab.activeBorder": "#8AC68A",
"tab.activeForeground": "#253B52",
"tab.inactiveBackground": "#F8F4E8",
"tab.inactiveForeground": "#8A7B66",
"tab.border": "#EEE9CA",

"editor.background": "#FFFFF7",
"editor.foreground": "#253B52",
"editorCursor.foreground": "#253B52",
"editorCursor.background": "#FFFFF7",
"editor.selectionBackground": "#EEE9CA80",
"editor.lineHighlightBackground": "#F8F4E8",
"editorLineNumber.foreground": "#EEE9CA",
"editorLineNumber.activeForeground": "#725C4E",

"badge.background": "#FF544A",
"badge.foreground": "#FFFFF7",

"button.background": "#8AC68A",
"button.foreground": "#FFFFF7",
"button.hoverBackground": "#7ab67a",

"focusBorder": "#8AC68A",

"terminal.background": "#F8F4E8",
"terminal.foreground": "#253B52",

"panel.background": "#F8F4E8",
"panel.border": "#EEE9CA",
"panelTitle.activeBorder": "#8AC68A",
"panelTitle.activeForeground": "#253B52",
"panelTitle.inactiveForeground": "#8A7B66",

"scrollbar.shadow": "#EEE9CA",
"widget.shadow": "#EEE9CA80",

"list.activeSelectionBackground": "#EEE9CA",
"list.activeSelectionForeground": "#253B52",
"list.hoverBackground": "#F8F4E8",
"list.hoverForeground": "#253B52",
"list.inactiveSelectionBackground": "#F8F4E8",

"editorBracketHighlight.foreground1": "#FFB400",
"editorBracketHighlight.foreground2": "#B77DEE",
"editorBracketHighlight.foreground3": "#04AFA6",
"editorBracketHighlight.foreground4": "#8AC68A",
"editorBracketHighlight.foreground5": "#E59266",
"editorBracketHighlight.foreground6": "#E2826A",

"editorInlayHint.background": "#EEE9CA99",
"editorInlayHint.foreground": "#725C4E",

"textLink.foreground": "#04AFA6",
"textLink.activeForeground": "#04AFA6",

"progressBar.background": "#8AC68A",

"menu.background": "#FFFFF7",
"menu.foreground": "#253B52",
"menu.selectionBackground": "#EEE9CA",
"menu.selectionForeground": "#253B52",

"quickInput.background": "#FFFFF7",
"quickInput.foreground": "#253B52",
"quickInputList.focusBackground": "#EEE9CA",
"quickInputList.focusForeground": "#253B52",

"input.background": "#FFFFF7",
"input.border": "#EEE9CA",
"input.foreground": "#253B52",
"input.placeholderForeground": "#8A7B66",

"dropdown.background": "#FFFFF7",
"dropdown.border": "#EEE9CA",
"dropdown.foreground": "#253B52"
```

**Step 4: Verify the JSON is valid**

```bash
python3 -c "import json; json.load(open('themes/acnh-new-horizons-color-theme.json'))"
```

Expected: No output (valid JSON).

**Step 5: Commit**

```bash
git add themes/acnh-new-horizons-color-theme.json
git commit -m "feat: add ACNH theme UI colors"
```

---

### Task 3: Remap token colors (syntax highlighting)

**Files:**
- Modify: `themes/acnh-new-horizons-color-theme.json` (lines 623+, tokenColors section)

**Step 1: Apply token color replacements**

The tokenColors section uses these Monokai hex constants. Replace throughout:

| Monokai Token Color | ACNH Replacement | Syntax Role |
|---|---|---|
| `#727072` | `#8A7B66` | Comments |
| `#C1C0C0` | `#725C4E` | Comment variables, secondary |
| `#FCFCFA` | `#253B52` | Plain text, default foreground |
| `#FFD866` | `#FFB400` | Headings, sections, strings (find-in-files) |
| `#FF6188` | `#E2826A` | Keywords, operators, tags, deleted |
| `#A9DC76` | `#04AFA6` | Functions, links, inserted, CSS classes |
| `#78DCE8` | `#B77DEE` | Types, classes, attributes (now purple) |
| `#AB9DF2` | `#B77DEE` | Constants, numbers, labels |
| `#FC9867` | `#E59266` | Orange accents, symbols, special chars |
| `#939293` | `#8A7B66` | Delimiters, braces, punctuation |
| `#5B595C` | `#EEE9CA` | Very muted (line numbers in search) |

**Step 2: Special token overrides**

Strings need the high-contrast Brown-Green color. After bulk replacement, update:

```json
{
  "scope": [
    "string",
    "string.quoted",
    "string.quoted.double",
    "string.quoted.single",
    "string.template"
  ],
  "settings": {
    "foreground": "#71681D"
  }
}
```

Add this rule near the top of tokenColors (after comments but before constants).

**Step 3: Terminal ANSI colors**

Replace the terminal colors in the UI colors section for a light-friendly palette:

```json
"terminal.ansiBlack": "#253B52",
"terminal.ansiRed": "#FC736D",
"terminal.ansiGreen": "#8AC68A",
"terminal.ansiYellow": "#FFB400",
"terminal.ansiBlue": "#889DF0",
"terminal.ansiMagenta": "#B77DEE",
"terminal.ansiCyan": "#04AFA6",
"terminal.ansiWhite": "#FFFFF7",
"terminal.ansiBrightBlack": "#8A7B66",
"terminal.ansiBrightRed": "#E2826A",
"terminal.ansiBrightGreen": "#04AFA6",
"terminal.ansiBrightMagenta": "#B77DEE",
"terminal.ansiBrightRed": "#FC736D",
"terminal.ansiBrightWhite": "#F8F4E8",
"terminal.ansiBrightYellow": "#FFB400",
"terminal.ansiBrightCyan": "#82D5BB"
```

**Step 4: Validate JSON**

```bash
python3 -c "import json; json.load(open('themes/acnh-new-horizons-color-theme.json'))"
```

**Step 5: Commit**

```bash
git add themes/acnh-new-horizons-color-theme.json
git commit -m "feat: remap syntax highlighting to ACNH palette"
```

---

### Task 4: Test the theme with real-time preview

**Step 1: Open the repo in VS Code and launch Extension Development Host**

```bash
code /Users/vicky/Documents/Github/monokaiTheme
```

Then press F5 (or Run → Start Debugging). In the new VS Code window that opens, go to:
- Command Palette (Cmd+Shift+P) → "Preferences: Color Theme"
- Select "ACNH New Horizons"

**Step 2: Open a sample file and verify**

Open any code file (e.g., a .ts, .py, or .json file) and verify:
- Title bar is green (#8AC68A)
- Status bar is blue (#889DF0)
- Editor background is off-white (#FFFFF7)
- Syntax colors are visible and readable
- Sidebar is light off-white (#F8F4E8)

**Step 3: Adjust any colors that don't look right**

Edit `themes/acnh-new-horizons-color-theme.json` — the Extension Development Host will auto-detect changes.

**Step 4: Final commit**

```bash
git add themes/acnh-new-horizons-color-theme.json
git commit -m "feat: finalize ACNH New Horizons theme"
```
