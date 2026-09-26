# SaveIQ – AI Savings Goal Tracker

> **Save Smarter. Reach Your Goals Faster.**  
> A minimal, elegant, AI-powered personal finance management system designed to help users set savings targets, track progress visually, receive personalized AI recommendations, and stay disciplined through automated reminders.

---

## 🚀 Key Features

- **Smart Savings Goals**: Create custom financial goals with target amounts, initial savings, deadlines, categories, and automated reminder alerts.
- **AI Financial Insights**: Intelligent pacing and behavioral recommendations powered by **Groq AI (Llama 3.3)** and **Google Gemini 3.8 Flash**.
- **Automated Deadline Alerts & Daily Audit**: Simulates/runs automated daily audits inspired by **Google Apps Script** cron jobs to detect approaching deadlines and overdue targets.
- **Interactive Financial Dashboard**:
  - Live portfolio metrics: Total Goals, Total Savings, Active Goals, and Overdue status.
  - Overall progress bar with remaining pacing requirements.
  - Interactive SVG analytics (cumulative savings growth, status distribution donut, monthly contributions bar chart).
- **Interactive Savings Calculator**: Test daily, weekly, and monthly saving requirements directly on the marketing website without signing up.
- **Google Sheets Database Integration**: Transparent 16-column spreadsheet representation of all financial goals with one-click export to CSV and copyable Google Apps Script automation code.
- **Confetti Celebrations**: Celebratory milestone animations when goals hit 100%.
- **Dark & Light Mode**: Accessible financial emerald and slate themes.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Express, Node.js (`server.ts`)
- **AI Engine**: `@google/genai` (Gemini 3.8 Flash) & Groq Cloud API (Llama 3.3)
- **Database Architecture**: Google Sheets data structure & Google Apps Script time-driven triggers

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarthakgate7-del/SaveIQ-AI.git
   cd SaveIQ-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini or Groq API keys (optional):
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📊 Google Sheets 16-Column Schema

SaveIQ structures goal data into 16 portable columns:
1. `Goal ID`
2. `User Name`
3. `Email`
4. `Goal Name`
5. `Target Amount`
6. `Initial Savings`
7. `Current Savings`
8. `Remaining Amount`
9. `Deadline`
10. `Purpose`
11. `Status`
12. `Progress Percentage`
13. `Email Alerts`
14. `Last Reminder Sent`
15. `Created Date`
16. `Updated Date`

---

## 📄 License

MIT License © 2026 SaveIQ. All rights reserved.
