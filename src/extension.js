const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const PATCH_TAG_START = '<!-- acnh-background-start';
const PATCH_TAG_END = '<!-- acnh-background-end -->';
const PATCH_VERSION_RE = /<!-- acnh-background-start v([\d.]+) -->/;

let log;

// ---------------------------------------------------------------------------
// Workbench HTML path discovery
// ---------------------------------------------------------------------------

function getWorkbenchHtmlPath() {
    const roots = [];

    if (vscode.env.appRoot) {
        roots.push(path.join(vscode.env.appRoot, 'out'));
    }

    if (require.main?.filename) {
        roots.push(path.dirname(require.main.filename));
    }

    const subPaths = [
        path.join('vs', 'code', 'electron-browser', 'workbench', 'workbench.html'),
        path.join('vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html'),
    ];

    for (const root of roots) {
        for (const sub of subPaths) {
            const candidate = path.join(root, sub);
            log.appendLine(`  Checking: ${candidate}`);
            if (fs.existsSync(candidate)) {
                log.appendLine(`  Found: ${candidate}`);
                return candidate;
            }
        }
    }

    log.appendLine('  No workbench.html found in any candidate path.');
    return null;
}

// ---------------------------------------------------------------------------
// Asset helpers — base64 encoding for CSS data URIs
// ---------------------------------------------------------------------------

function fileToBase64DataUri(filePath, mimeType) {
    if (!fs.existsSync(filePath)) {
        log.appendLine(`  File NOT found: ${filePath}`);
        return null;
    }
    const data = fs.readFileSync(filePath);
    log.appendLine(`  Loaded ${filePath}: ${data.length} bytes`);
    return `data:${mimeType};base64,${data.toString('base64')}`;
}

function getBackgroundImageBase64(extensionPath) {
    return fileToBase64DataUri(
        path.join(extensionPath, 'Nook_Shopping_Background_Tan.png'),
        'image/png'
    );
}

function getDarkBackgroundImageBase64(extensionPath) {
    return fileToBase64DataUri(
        path.join(extensionPath, 'Nook_Shopping_Background_Black.png'),
        'image/png'
    );
}

function isDarkThemeActive() {
    const kind = vscode.window.activeColorTheme.kind;
    return kind === vscode.ColorThemeKind.Dark || kind === vscode.ColorThemeKind.HighContrast;
}

function getCursorBase64(extensionPath, filename) {
    return fileToBase64DataUri(
        path.join(extensionPath, filename),
        'image/png'
    );
}

// ---------------------------------------------------------------------------
// CSS builders — one per feature
// ---------------------------------------------------------------------------

function buildBackgroundCSS(imageDataUri) {
    return `
/* ACNH Theme — Empty Editor Background */
.editor-group-container.empty {
    position: relative !important;
}
.editor-group-container.empty::after {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background-image: url('${imageDataUri}') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    opacity: 0.3 !important;
    pointer-events: none !important;
    z-index: 0 !important;
}
/* Transparent panels — let background show through sidebar/panel views */
.pane-body,
.split-view-view,
.composite.viewlet,
.composite.panel,
.webview-container,
.monaco-list,
.monaco-list .monaco-list-rows {
    background-color: transparent !important;
}`;
}

function buildFontCSS(fontDataUris) {
    return `
/* ACNH Theme — Roboto Font (bundled woff2) */
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url('${fontDataUris.regular}') format('woff2');
}
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url('${fontDataUris.medium}') format('woff2');
}
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: url('${fontDataUris.bold}') format('woff2');
}

/* Base — apply Roboto to all VS Code UI (specificity 0,1,0) */
.monaco-workbench,
.monaco-workbench *:where(:not(.codicon):not(.codicon *):not(.editor-group-watermark):not(.editor-group-watermark *)) {
    font-family: 'Roboto', sans-serif !important;
    font-weight: 400 !important;
    font-size: 13px !important;
}

/* Medium (500) — tab labels, activity bar, menus, breadcrumbs, explorer */
.monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab .tab-label,
.monaco-workbench .activitybar .action-label,
.menubar-menu-title,
.monaco-breadcrumb-item,
.explorer-folders-view .explorer-item {
    font-weight: 500 !important;
    font-size: 13px !important;
}

/* Bold (700) — panel titles and pane section headers */
.monaco-workbench .part > .title > .title-label h2,
.monaco-workbench .pane-composite-part > .title .composite-bar .action-item,
.pane-header,
.pane-header *:where(:not(.codicon):not(.codicon *)) {
    font-weight: 700 !important;
    font-size: 11px !important;
}

/* Exclusions — cascade AFTER base rule to override via source order */

/* Editor — preserve editor.fontSize and cursor sizing */
.monaco-editor,
.monaco-editor *:where(:not(.codicon):not(.codicon *)) {
    font-family: inherit !important;
    font-weight: inherit !important;
    font-size: inherit !important;
}

/* Terminal — preserve monospace */
.terminal-wrapper,
.terminal-wrapper *:where(:not(.codicon):not(.codicon *)),
.xterm,
.xterm *:where(:not(.codicon):not(.codicon *)) {
    font-family: inherit !important;
    font-weight: inherit !important;
    font-size: inherit !important;
}

`;
}

function buildCursorCSS(cursors) {
    return `
/* ACNH Theme — Animal Crossing Cursors */

/* === Default: AC select cursor everywhere === */
.monaco-workbench,
.monaco-workbench * {
    cursor: url('${cursors.select}') 4 0, default !important;
}

/* === Grab: hover over draggable elements === */
.tab[draggable="true"],
.monaco-list-row[draggable="true"] {
    cursor: url('${cursors.grab}') 4 0, grab !important;
}

/* === Grabbing: active drag states === */
.tab.dragged,
.monaco-list.dragging,
.monaco-list.dragging .monaco-list-row,
.monaco-sash.active {
    cursor: url('${cursors.grab}') 4 0, grabbing !important;
}

/* === Drag source feedback: dim the source element === */
.tab.dragged {
    opacity: 0.4 !important;
}

/* === Drop target indicators === */
.tab.dragged-over {
    background-color: rgba(139, 195, 74, 0.15) !important;
}
.tab.drop-target-left {
    border-left: 2px solid #8BC34A !important;
}
.tab.drop-target-right {
    border-right: 2px solid #8BC34A !important;
}

/* List drop targets */
.monaco-list-row.drop-target-before {
    border-top: 2px solid #8BC34A !important;
}
.monaco-list-row.drop-target-after {
    border-bottom: 2px solid #8BC34A !important;
}

/* Editor drop overlay */
#monaco-workbench-editor-drop-overlay {
    background-color: rgba(139, 195, 74, 0.1) !important;
}

/* Drag ghost styling */
.monaco-drag-image {
    background-color: #8BC34A !important;
    color: #fff !important;
    border-radius: 12px !important;
    padding: 2px 10px !important;
    font-size: 12px !important;
}`;
}

// ---------------------------------------------------------------------------
// Composable patch builder
// ---------------------------------------------------------------------------

function getExtensionVersion() {
    try {
        const pkg = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
        );
        return pkg.version || '0.0.0';
    } catch {
        return '0.0.0';
    }
}

function buildPatchCSS(options) {
    const version = getExtensionVersion();
    let css = '';
    if (options.background) css += buildBackgroundCSS(options.background.imageDataUri);
    if (options.font) css += buildFontCSS(options.font);
    if (options.cursor) css += buildCursorCSS(options.cursor);
    return `\n${PATCH_TAG_START} v${version} -->\n<style>${css}\n</style>\n${PATCH_TAG_END}`;
}

// ---------------------------------------------------------------------------
// Patch read / write / remove
// ---------------------------------------------------------------------------

function isPatched(html) {
    return html.includes(PATCH_TAG_START);
}

function removePatchFromHtml(html) {
    const startIdx = html.indexOf(PATCH_TAG_START);
    const endIdx = html.indexOf(PATCH_TAG_END);
    if (startIdx === -1 || endIdx === -1) {
        return html;
    }
    return html.substring(0, startIdx) + html.substring(endIdx + PATCH_TAG_END.length);
}

function removePatch() {
    log.appendLine('--- Removing all patches ---');

    const htmlPath = getWorkbenchHtmlPath();
    if (!htmlPath) return false;

    let html;
    try {
        html = fs.readFileSync(htmlPath, 'utf-8');
    } catch {
        return false;
    }

    if (!isPatched(html)) {
        log.appendLine('  No patch found, already clean.');
        return true;
    }

    html = removePatchFromHtml(html);

    try {
        fs.writeFileSync(htmlPath, html, 'utf-8');
        log.appendLine('  Patch removed.');
    } catch (err) {
        vscode.window.showErrorMessage(
            `ACNH Theme: Could not remove patch from workbench HTML: ${err.message}`
        );
        return false;
    }

    return true;
}

// ---------------------------------------------------------------------------
// Shared apply — rebuilds the entire patch from current feature states
// ---------------------------------------------------------------------------

function applyAllPatches(context) {
    log.appendLine('--- Applying all enabled patches ---');

    const htmlPath = getWorkbenchHtmlPath();
    if (!htmlPath) {
        vscode.window.showErrorMessage(
            'ACNH Theme: Could not locate VS Code workbench HTML.'
        );
        return false;
    }

    // Build options from feature states
    const options = {};

    const imageDataUri = isDarkThemeActive()
        ? getDarkBackgroundImageBase64(context.extensionPath)
        : getBackgroundImageBase64(context.extensionPath);
    if (imageDataUri) {
        options.background = { imageDataUri };
    } else {
        log.appendLine('  Background image not found, skipping.');
    }

    if (context.globalState.get('fontEnabled')) {
        const regular = fileToBase64DataUri(
            path.join(context.extensionPath, 'Roboto-Regular.woff2'), 'font/woff2'
        );
        const medium = fileToBase64DataUri(
            path.join(context.extensionPath, 'Roboto-Medium.woff2'), 'font/woff2'
        );
        const bold = fileToBase64DataUri(
            path.join(context.extensionPath, 'Roboto-Bold.woff2'), 'font/woff2'
        );
        if (regular && medium && bold) {
            options.font = { regular, medium, bold };
        } else {
            log.appendLine('  Font enabled but woff2 file(s) not found, skipping.');
        }
    }

    if (context.globalState.get('cursorEnabled')) {
        const select = getCursorBase64(context.extensionPath, 'cursor_select.png');
        const grab = getCursorBase64(context.extensionPath, 'cursor_grab.png');
        if (select && grab) {
            options.cursor = { select, grab };
        } else {
            log.appendLine('  Cursors enabled but image(s) not found, skipping.');
        }
    }

    // If nothing enabled, remove patch entirely
    if (Object.keys(options).length === 0) {
        log.appendLine('  No features enabled, removing patch.');
        return removePatch();
    }

    let html;
    try {
        html = fs.readFileSync(htmlPath, 'utf-8');
    } catch (err) {
        log.appendLine(`  Read error: ${err.message}`);
        vscode.window.showErrorMessage(
            `ACNH Theme: Could not read workbench HTML: ${err.message}`
        );
        return false;
    }

    // Remove existing patch first
    if (isPatched(html)) {
        log.appendLine('  Existing patch found, removing first.');
        html = removePatchFromHtml(html);
    }

    const patchCSS = buildPatchCSS(options);
    html = html.replace('</html>', `${patchCSS}\n</html>`);

    try {
        fs.writeFileSync(htmlPath, html, 'utf-8');
        log.appendLine(`  Patch written to: ${htmlPath}`);
    } catch (err) {
        log.appendLine(`  Write error: ${err.message}`);
        vscode.window.showErrorMessage(
            `ACNH Theme: Could not write to workbench HTML. You may need to run VS Code with elevated permissions. Error: ${err.message}`
        );
        return false;
    }

    // Verify the write
    try {
        const verify = fs.readFileSync(htmlPath, 'utf-8');
        if (verify.includes(PATCH_TAG_START)) {
            log.appendLine('  Verified: patch is in the file.');
        } else {
            log.appendLine('  WARNING: patch NOT found after write!');
        }
    } catch {
        log.appendLine('  Could not verify write.');
    }

    return true;
}

// ---------------------------------------------------------------------------
// Reload prompt
// ---------------------------------------------------------------------------

function promptReload() {
    vscode.window
        .showInformationMessage(
            'ACNH Theme: Reload VS Code to see changes.',
            'Reload Now'
        )
        .then((choice) => {
            if (choice === 'Reload Now') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
}

// ---------------------------------------------------------------------------
// Activation
// ---------------------------------------------------------------------------

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    log = vscode.window.createOutputChannel('ACNH Theme');
    log.appendLine('ACNH Theme extension activated.');
    log.appendLine(`  appRoot: ${vscode.env.appRoot}`);
    log.appendLine(`  extensionPath: ${context.extensionPath}`);
    if (require.main?.filename) {
        log.appendLine(`  require.main.filename: ${require.main.filename}`);
    }

    // --- Font commands ---
    const enableFont = vscode.commands.registerCommand('acnh.enableFont', async () => {
        context.globalState.update('fontEnabled', true);
        const success = applyAllPatches(context);
        if (success) {
            // Set terminal font via VS Code settings (canvas rendering ignores CSS)
            const termConfig = vscode.workspace.getConfiguration('terminal.integrated');
            const originalFont = termConfig.get('fontFamily');
            context.globalState.update('originalTerminalFont', originalFont || '');
            await termConfig.update('fontFamily', 'Roboto Mono', vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(
                'ACNH Theme: Roboto font enabled. Terminal uses Roboto Mono — install it from Google Fonts if not already installed.'
            );
            promptReload();
        }
    });

    const disableFont = vscode.commands.registerCommand('acnh.disableFont', async () => {
        context.globalState.update('fontEnabled', false);
        const success = applyAllPatches(context);
        if (success) {
            // Restore original terminal font
            const termConfig = vscode.workspace.getConfiguration('terminal.integrated');
            const original = context.globalState.get('originalTerminalFont', '');
            await termConfig.update('fontFamily', original || undefined, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('ACNH Theme: Roboto font disabled.');
            promptReload();
        }
    });

    // --- Cursor commands ---
    const enableCursor = vscode.commands.registerCommand('acnh.enableCursor', () => {
        context.globalState.update('cursorEnabled', true);
        const success = applyAllPatches(context);
        if (success) {
            vscode.window.showInformationMessage(
                'ACNH Theme: Animal Crossing cursors enabled!'
            );
            promptReload();
        }
    });

    const disableCursor = vscode.commands.registerCommand('acnh.disableCursor', () => {
        context.globalState.update('cursorEnabled', false);
        const success = applyAllPatches(context);
        if (success) {
            vscode.window.showInformationMessage('ACNH Theme: Custom cursors disabled.');
            promptReload();
        }
    });

    context.subscriptions.push(
        enableFont, disableFont,
        enableCursor, disableCursor,
        log
    );

    // --- First-run prompt ---
    const hasBeenPrompted = context.globalState.get('backgroundPrompted', false);
    if (!hasBeenPrompted) {
        context.globalState.update('backgroundPrompted', true);
        vscode.window
            .showInformationMessage(
                'ACNH Theme: The background image is enabled by default. Would you also like to enable Roboto font and custom cursors? (These modify VS Code internal files and show an [Unsupported] tag in the title bar.)',
                'Enable All',
                'Choose Later'
            )
            .then((choice) => {
                if (choice === 'Enable All') {
                    context.globalState.update('fontEnabled', true);
                    context.globalState.update('cursorEnabled', true);
                    const success = applyAllPatches(context);
                    if (success) promptReload();
                }
            });
    }

    // --- Stale patch detection ---
    // Re-apply patches when the extension version changes, so updated CSS
    // (e.g. removed features, bug fixes) replaces the old baked-in patch.
    const htmlPath = getWorkbenchHtmlPath();
    if (htmlPath) {
        try {
            const html = fs.readFileSync(htmlPath, 'utf-8');
            if (isPatched(html)) {
                const match = html.match(PATCH_VERSION_RE);
                const patchedVersion = match ? match[1] : null;
                const currentVersion = getExtensionVersion();
                if (patchedVersion !== currentVersion) {
                    log.appendLine(`  Stale patch detected (patched: ${patchedVersion || 'unknown'}, current: ${currentVersion}). Re-applying.`);
                    const success = applyAllPatches(context);
                    if (success) promptReload();
                }
            }
        } catch {
            // Silently ignore — non-critical
        }
    }
}

function deactivate() {
    // Intentionally not auto-removing — user should explicitly disable via command
}

module.exports = { activate, deactivate };
