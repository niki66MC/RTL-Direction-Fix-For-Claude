# Hebrew RTL Fix For Claude.ai
 
A Firefox extension that fixes the text direction of Hebrew responses on Claude.ai.
 
## The Problem
 
Claude.ai renders all responses left-to-right by default. When Claude responds in Hebrew, the text appears misaligned — letters are correct but the layout is backwards.
 
## What It Does
 
- Detects Hebrew text in Claude's responses and applies right-to-left direction
- Mixed content works correctly — Hebrew lines go RTL, English and math lines stay LTR
- Code blocks are always kept LTR regardless
- Watches for new messages in real time as Claude streams responses
 
## Installation
 
1. Clone or download this repository
2. Open Firefox and go to `about:debugging`
3. Click **This Firefox** → **Load Temporary Add-on**
4. Select `manifest.json` from the project folder
 
> Note: temporary add-ons are removed when Firefox closes. To install permanently, the extension needs to be signed via [addons.mozilla.org](https://addons.mozilla.org/developers/).
 
## Usage
 
Click the extension icon in the Firefox toolbar to open the popup. Use the toggle to turn RTL on or off. The setting is saved across sessions.
 
## Files
 
```
manifest.json   — extension config, permissions, and entry points
content.js      — runs on claude.ai, detects Hebrew text and applies RTL styling
popup.html      — toolbar popup UI
popup.js        — popup logic, toggle state, messaging to content script
icons/          — extension icon
```