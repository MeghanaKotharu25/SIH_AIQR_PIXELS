AI-Based Laser QR Code Tracking for Railway Track Fittings 🚆

Smart India Hackathon 2025 | Team PiXels~ | PS ID: 25021

This project proposes an AI-driven, end-to-end tracking system for Indian Railways track fittings using laser-engraved QR codes.
The goal: replace manual, disconnected maintenance records with durable physical identification + digital traceability + AI-assisted decision support.

🔍 Problem Statement

Railway track fittings currently:
* Lack unique physical identifiers
* Rely on manual / verbal fault reporting
* Have disconnected records across UDM & TMS portals
* Make lifecycle tracking and accountability painful (and slow)

💡 Our Solution
Laser-engrave unique QR codes on each fitting → scan on field → sync with UDM/TMS → analyze using AI → act faster, smarter, and traceably.

🛠 System Overview
1️⃣ Hardware Layer
CNC laser engraving to mark unique QR codes on track fittings
QR encodes a unique ID linked to:
Vendor
Batch
Supply date
Warranty
Protective epoxy coating for long-term durability in harsh environments

2️⃣ Software Layer
Cross-platform application (mobile + desktop)
Role-based access:
  - Patrolmen / Workers
  - PWI
  - Station Master
  - Traffic Control
  - Admin
Core features:
  - Scan QR → fetch fitting history instantly
  - Log faults & inspections on-site
  - AI-generated reports and trend analysis
  - Alerts and dashboards for officers
  - Offline mode with auto cloud sync
    
3️⃣ AI Layer
QR image enhancement & purification
→ Improves scan success for partially worn QR codes (minor damage)
Pattern & trend analysis
→ Detects recurring faults, vendor issues, and maintenance patterns
Decision support
→ Suggests actions based on historical data (not blind automation)

🔁 End-to-End Workflow
1. Patrolman identifies a suspected fault
2. Scans laser-engraved QR on fitting
3. AI enhances QR if worn
4. Data pulled from UDM + TMS
5. AI generates inspection report & recommendations
6. Patrolman updates status via app
7. PWI / authorities receive alerts & dashboards
8. Updates pushed back to TMS → full lifecycle traceability

🧠 Tech Stack
Hardware
  1. CNC Laser Engraver
  2. Epoxy coating mechanism
  3. Mobile devices for scanning
Software
  1. Frontend: React Native
  2. Backend: Flask (Python)
  3. Databases:
      - PostgreSQL (primary)
      - SQLite (offline cache)
      - Redis (fast access / caching)
      - Cloud: AWS
AI / ML
  1. TensorFlow
  2. Hugging Face
  3. Scikit-learn
  4. Pandas
Security
  1. JWT Authentication
  2. Role-Based Access Control (RBAC)

📽 Concept & Basic Working Demo:
https://youtu.be/h-U8bMTx_vw

📈 Impact
Faster fault reporting → reduced accident risk
Clear accountability
Real-time visibility across departments
Reduced unnecessary replacements
Optimized inventory & vendor evaluation
Lower maintenance costs, Paperless, digital workflow
Extended lifespan of fittings
