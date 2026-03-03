# Animal Crossing New Horizons VS Code Theme — Design

## Overview
A light VS Code theme inspired by the Animal Crossing: New Horizons color palette, built as a new variant in the monokaiTheme project. Uses the Monokai Standard JSON as the structural baseline, with all colors remapped to the ACNH palette.

## Theme Type
Light theme (`"type": "light"`) — full inversion from the dark Monokai baseline.

## Color Palette (from Figma ACNH UI Kit)

### UI Shell Colors
| Element | Color Name | Hex |
|---|---|---|
| Title Bar bg | App Green | `#8AC68A` |
| Title Bar fg | Off-White | `#FFFFF7` |
| Status Bar bg | App Blue | `#889DF0` |
| Status Bar fg | Off-White | `#FFFFF7` |
| Editor bg | Off-White | `#FFFFF7` |
| Editor fg | Navy | `#253B52` |
| Sidebar bg | Light Off-White | `#F8F4E8` |
| Activity Bar bg | Tan | `#EEE9CA` |
| Activity Bar fg | Brown | `#725C4E` |
| Tab active bg | Off-White | `#FFFFF7` |
| Tab inactive bg | Light Off-White | `#F8F4E8` |
| Tab active border | App Green | `#8AC68A` |
| Panel/Terminal bg | Light Off-White | `#F8F4E8` |
| Badges | Notification Red | `#FF544A` |
| Buttons | App Green | `#8AC68A` |
| Selection | Tan semi-transparent | `#EEE9CA80` |
| Widget/Dropdown bg | Off-White | `#FFFFF7` |
| Widget border | Tan | `#EEE9CA` |
| Focus border | App Green | `#8AC68A` |

### Syntax Highlighting Colors
| Token | ACNH Color | Hex | Contrast on #FFFFF7 |
|---|---|---|---|
| Comments | Button Brown | `#8A7B66` | ~4.0:1 |
| Keywords/Operators | Warm Pink | `#E2826A` | ~3.4:1 |
| Strings | Brown-Green | `#71681D` | ~5.9:1 |
| Functions | Teal | `#04AFA6` | ~3.7:1 |
| Types/Classes | Purple | `#B77DEE` | ~3.5:1 |
| Constants/Numbers | Purple | `#B77DEE` | ~3.5:1 |
| Tags (HTML) | Warm Pink | `#E2826A` | ~3.4:1 |
| Attributes | Teal | `#04AFA6` | ~3.7:1 |
| Symbols/Special | App Orange | `#E59266` | ~3.0:1 |

### Semantic Colors
| Purpose | Color | Hex |
|---|---|---|
| Error | App Red | `#FC736D` |
| Warning | App Orange | `#E59266` |
| Info | Teal | `#04AFA6` |
| Success/Added | App Green | `#8AC68A` |
| Modified | Warm Yellow | `#FFB400` |
| Deleted | App Red | `#FC736D` |

## File Structure
- `src/acnh-new-horizons.json` — Theme definition (VS Code color-theme schema)
- `package.json` — VS Code extension manifest with `contributes.themes`
- `themes/` — symlink or copy for VS Code extension loading

## Real-Time Preview
Press F5 in VS Code to launch Extension Development Host with the theme active. Edits to the JSON auto-reload.
