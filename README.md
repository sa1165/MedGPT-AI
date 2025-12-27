# 🩺 MedGPT: Advanced AI Medical Companion

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

MedGPT is a state-of-the-art medical triage and consultation application. Built with a focus on speed, safety, and an exceptional user experience, it leverages the power of Large Language Models (Gemini/Ollama) to provide structured medical insights, symptom triage, and educational explanations.

> [!IMPORTANT]
> **Medical Disclaimer:** MedGPT is an experimental tool for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition.

---

## ✨ Key Features

### 🚀 Performance & UI
- **Smooth Streaming UI:** Real-time character-by-character generation similar to industry-leading AI interfaces.
- **Glassmorphic Design:** A premium, dark-mode aesthetic with interactive gradients and subtle micro-animations.
- **Responsive Sidebar:** Manage chat history, start new sessions, and access user profiles seamlessly.
- **Micro-Animations:** Fluid transitions and hover effects for a delightful user experience.

### 🔐 Safety & Triage
- **Embedded Medical Disclaimer:** Mandatory agreement for all users before accessing the platform.
- **Emergency Detection:** Real-time analysis of user input to detect life-threatening situations, providing immediate emergency guidance.
- **Urgency Levels:** AI-driven categorization (Low, Moderate, High) of medical queries.

### 👤 User-Centric Onboarding
- **Smart Onboarding Flow:** Collects essential details (Name, Age, Gender) to personalize the AI context.
- **Guest Access:** A "Sign in as Guest" feature for users who wish to explore the app immediately without registration.
- **Profile Management:** Easily identifiable user indicators in the chat and sidebar.

### 🛠 Tech Stack & Intelligence
- **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons.
- **Backend:** FastAPI (Python), Uvicorn, Pydantic.
- **LLM Integration:** 
  - **Gemini Pro:** Powered by Google's cutting-edge Gemini API.
  - **Local Fallback:** Automatic failover to local **Ollama** (`llama3.2:1b`) if the cloud API is unavailable or rate-limited.
- **Multimodal Support:** Ability to process medical images for deeper analysis (e.g., skin conditions, lab reports).
- **Speech-to-Text:** Integrated browser STT for hands-free medical consultation.

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- [Ollama](https://ollama.ai/) (for local model support)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/medgpt.git
cd medgpt
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
Medgpt/
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── core/       # LLM logic, Safety Layer, STT
│   │   ├── main.py     # Main API entry point
│   │   └── schemas.py  # Pydantic data models
│   └── .env            # Environment variables
├── frontend/           # Next.js Application
│   ├── app/            # App router, components, styles
│   ├── public/         # Static assets (logos, images)
│   └── tailwind.config.ts
└── README.md
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**MedGPT** — *Your Health, Powered by Intelligence.*
