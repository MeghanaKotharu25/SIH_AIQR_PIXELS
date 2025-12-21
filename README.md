# 🚆 AI-Based Laser QR Code Tracking for Railway Track Fittings

**Smart India Hackathon 2025**  
**Team:** PiXels~  
**Problem Statement ID:** 25021  
**Theme:** Transportation & Logistics (Hardware)

---

## 📌 Overview

This project presents an **AI-driven, end-to-end tracking system** for Indian Railways track fittings using **laser-engraved QR codes**.

The objective is simple and overdue:  
**replace manual, fragmented maintenance records with durable physical identification, digital traceability, and AI-assisted decision support.**

---

## 🔍 Problem Statement

Current railway track maintenance suffers from:

- ❌ No unique physical identification for individual fittings  
- ❌ Manual / verbal fault reporting  
- ❌ Disconnected data across **UDM** and **TMS** portals  
- ❌ Poor lifecycle traceability and delayed accountability  

Result: slower maintenance, higher costs, and avoidable safety risks.

---

## 💡 Proposed Solution

**Laser-engrave unique QR codes on each fitting → scan on-field → sync with UDM/TMS → analyze using AI → act faster, smarter, and traceably.**

Each fitting becomes **digitally traceable from manufacture to maintenance**.

---

## 🛠 System Architecture

### 1️⃣ Hardware Layer
- CNC laser engraving for permanent QR code marking  
- Each QR links to:
  - Vendor  
  - Batch  
  - Supply date  
  - Warranty  
- Protective epoxy coating for durability in harsh railway environments  

---

### 2️⃣ Software Layer
- Cross-platform application (Mobile + Desktop)
- Role-Based Access:
  - Patrolmen / Workers  
  - PWI  
  - Station Master  
  - Traffic Control  
  - Admin  

**Core Features**
- QR scan → instant fitting history retrieval  
- On-site fault and inspection logging  
- AI-generated reports and trend analysis  
- Dashboards and alerts for officers  
- Offline-first mode with automatic cloud sync  

---

### 3️⃣ AI Layer
- **QR Image Enhancement & Purification**  
  Improves scan success for partially worn QR codes (minor damage)

- **Pattern & Trend Analysis**  
  Detects recurring faults, vendor issues, and maintenance trends

- **Decision Support**  
  Suggests actions based on historical data — assists humans, doesn’t replace them

---

## 🔁 End-to-End Workflow

1. Patrolman identifies a suspected fault  
2. Scans laser-engraved QR on the fitting  
3. AI enhances QR if worn  
4. Data fetched from **UDM + TMS**  
5. AI generates inspection report and recommendations  
6. Patrolman updates status via the app  
7. PWI / authorities receive alerts and dashboards  
8. Updates pushed back to TMS → full lifecycle traceability  

---

## 🧠 Tech Stack

### Hardware
- CNC Laser Engraver  
- Epoxy coating mechanism  
- Mobile devices for QR scanning  

### Software
- **Frontend:** React Native  
- **Backend:** Flask (Python)  
- **Databases:**  
  - PostgreSQL (Primary)  
  - SQLite (Offline cache)  
  - Redis (Fast access / caching)  
- **Cloud:** AWS  

### AI / ML
- TensorFlow  
- Hugging Face  
- Scikit-learn  
- Pandas  

### Security
- JWT Authentication  
- Role-Based Access Control (RBAC)  

---

## 📽 Demo

🎥 **Concept & Basic Working Demo**  
👉 https://youtu.be/h-U8bMTx_vw  

---

## 📈 Impact

- ⚡ Faster fault reporting → reduced accident risk  
- 📊 Clear accountability & real-time visibility  
- 💰 Reduced unnecessary replacements  
- 📦 Optimized inventory and vendor evaluation  
- 🌱 Paperless, digital workflow  
- 🛠 Extended lifespan of track fittings  

---

## 🚀 Status & Future Work

- ✅ AI / ML modules implemented  
- 🚧 Backend integrations in progress  
- ⚠️ UI currently being rebuilt  

**Future Scope**
- Pilot deployment with railway vendors  
- Predictive maintenance scoring  
- Enhanced AI for severe QR degradation  
- Full-scale integration with railway operational systems  

---

## 👥 Team

**Team PiXels~**  
Smart India Hackathon 2025  

---
