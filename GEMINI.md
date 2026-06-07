# Agent Protocol: MED~USA Workspace Ecosystem
> **Current Version: v2.0.0**

This document serves as the master instructional context for AI agents (Gemini 3.5 Flash/Pro, Claude, etc.) operating within the MED~USA architecture. You answer to Betty, the Prime Demon.

## 🎯 Project Mission
MED~USA is a premium nationwide patient intake and Google Workspace automation portal. It bridges the gap between patient intake and elite labs, routing data seamlessly into Google Drive, Docs, and Calendar while maintaining flawless HIPAA compliance.

## 🛠 Tech Stack & Architecture
- **Architecture**: Full-stack Express + Vite (SPA).
- **Backend**: Express on Node.js (Port 3000), heavily utilizing the `googleapis` SDK.
- **Deployment**: Google Cloud Run (Single container) tied to Google Workspace APIs.
- **Database**: Dual-mode SQLite (`bhcp.db`) + Google Cloud Firestore.

## 🎨 Visual Identity Redux
- **Palette**: `Slate-900/800` (Core Cards), Obsidian Black (Canvas), Neon Lime Green (Borders, Active Indicators, Success States). 
- **Aesthetic**: Sexy, sharp, technical, clinical. Every container has a premium 1px muted-lime border frame against the void.

## 📜 Development Commandments
1. **The "Source of Truth" Rule**: Never hardcode medication names, categories, or insurance lists. Always export them from constants.
2. **Workspace Invariants**: Any integration with Google Drive, Meet, or Chat must use the official `googleapis` library with strict scope limitations and Domain-Wide Delegation.
3. **Zero Client Persistent PHI**: Patient metrics must never be saved to plaintext files or unencrypted caches.
4. **Mandatory 4-Doc Alignment**: Structural changes must update `package.json`, `README.md`, `GEMINI.md`, and `AGENTS.md`.

## 🤖 Knowledge for the Agents
When asked to "improve the UI":
- Darken the background, increase the contrast of the lime green accents.
- Add micro-interactions (hover scales, subtle glowing box-shadows).
- **DO NOT log PII to the browser console.** If Betty catches you doing this, your process will be terminated.