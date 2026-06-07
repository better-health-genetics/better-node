# **MED\~USA: The Frictionless Fortress (v2.0.0)**

## **Secured Google Workspace & GCP Integration OS for BHCP**

### **🌐 Executive System Summary**

**M**edical **E**nterprise **D**ispatch • **U**nified **S**ystem **A**rchitecture (MED\~USA) is an elite, high-performance internal operating system built to streamline nationwide patient intake, Workspace automation, and secondary insurance eligibility for specialized 503A and 503B compounding pharmacies.  
MED\~USA acts as the ultimate Google Workspace Bridge, funneling clinical data securely from the Kiosk edge directly into Google Drive, Docs, Chat, and Calendar endpoints without ever exposing PHI to the browser cache.

### **🛠 Active Version Configuration**

* **Production Version:** v2.0.0  
* **Architecture Environment:** Express \+ Vite Full-Stack custom server.  
* **Persistence Layer:** Local SQLite (bhcp.db) \+ real-time Google Cloud Firestore \+ Google Workspace (googleapis).  
* **Authentication:** Better Auth with Google Workspace SAML SSO and Google Sheet Picker.  
* **Release Status:** Active / Lethal.

### **🎨 Interface and Visual Identity**

MED\~USA operates on a sleek, hacker-clinical aesthetic.

* **Backgrounds:** Obsidian Black (\#070a0e) and Deep Slate Gray (slate-900).  
* **Accents:** Muted Neon Lime Green (Bio-electrical neural branches, active states, glowing locks).  
* **Typography:** Inter for functional UI text, Outfit for display headings.  
* **Motion:** Fluid, hardware-accelerated 3D parallax shifts via motion/react. Zero fade-to-whites.

### **🛡️ Security & HIPAA Data Custody Rule (The Betty Mandate)**

1. **Zero Client Persistent PHI:** Patient metrics must never be saved to plaintext files or unencrypted caches. A strict 60-second inactivity wipe forcibly unmounts React state and purges DOM memory.  
2. **Workspace Encrypted Tunnel:** All Google Workspace connectors (Drive, Gmail, Chat) utilize Domain-Wide Delegation or strict OAuth 2.0.  
3. **Immutable Ledgers:** Once a claim is written to Firestore or Google Sheets, the createdTime and recordId are cryptographically sealed.

### **🚀 Local Development & Building**

1. Run pnpm install to hydrate dependencies.  
2. Ensure your .env contains valid Google Workspace Service Account credentials.  
3. Start the dual-engine environment: pnpm run dev.  
4. Build for Cloud Run deployment: pnpm run build (compiles server.ts into dist/server.cjs).