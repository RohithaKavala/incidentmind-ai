# ⚡ Nexora — AI Incident Intelligence & Institutional Memory

> **Nexora transforms production incident history into institutional memory, helping engineering teams understand incidents, recall previous solutions, and improve incident resolution.**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)


> **Remember the incident. Learn from it. Resolve the next one faster.**

Nexora is an AI-powered incident intelligence system designed to help engineering teams understand production incidents, connect them with historical events, and generate actionable resolution guidance.

Instead of treating every incident as an isolated event, Nexora creates a memory-driven workflow where previous incidents, root causes, and resolutions can inform future incident analysis.

---

##  Why Nexora?

Modern engineering teams generate large amounts of incident data, logs, symptoms, and troubleshooting knowledge.

The challenge is not only identifying what went wrong.

The bigger challenge is:

- Have we seen this before?
- What caused it previously?
- What resolution worked?
- Can that knowledge be reused?
- How can future incidents be resolved faster?

Nexora addresses these challenges through an AI-assisted incident intelligence workflow.

---

## 🧠 Core Concept

```text
CURRENT INCIDENT
       │
       ▼
INCIDENT ANALYSIS
       │
       ▼
MEMORY RECALL
       │
       ▼
HISTORICAL INCIDENTS
       │
       ▼
SIMILARITY ANALYSIS
       │
       ▼
ROOT CAUSE + PREVIOUS RESOLUTION
       │
       ▼
ACTIONABLE GUIDANCE
       │
       ▼
RESOLUTION
       │
       ▼
KNOWLEDGE RETENTION
```

---

# ✨ Key Capabilities

## 1. 🔍 AI Incident Analysis

Nexora captures structured information about an incident, including:

- Incident title
- Service name
- Environment
- Severity
- Reported symptoms
- Business impact
- Error logs
- Stack traces

This information becomes the context for incident analysis and memory retrieval.

---

## 2. 🧠 Hindsight Memory Agent

Nexora uses a persistent memory layer to recall relevant historical incidents.

Instead of treating every incident as a completely new problem, the system can connect the current incident with previously resolved incidents.

```text
Current Incident
       ↓
Memory Recall
       ↓
Historical Incident
       ↓
Similarity Analysis
       ↓
Previous Root Cause
       ↓
Previous Resolution
       ↓
Relevant Guidance
```

This enables previously acquired operational knowledge to influence future incident investigation.

---

## 3. 🔥 Warm & Cold Memory

Nexora supports different memory states during incident analysis.

### Cold Recall

Used for broader historical memory retrieval.

```text
Current Incident
       ↓
Historical Memory
       ↓
Relevant Past Incidents
```

### Warm Recall

Used when retrieved information becomes directly relevant to the current investigation.

```text
Current Investigation
       ↓
Relevant Memory
       ↓
Contextual Guidance
       ↓
Resolution
```

This allows useful incident knowledge to remain available throughout the investigation process.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      Nexora UI       │
                         │   React + TypeScript │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     FastAPI API      │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌────────────┐  ┌────────────┐  ┌────────────┐
             │  Incident  │  │   Memory   │  │    LLM     │
             │   Engine   │  │   Agent    │  │  Service   │
             └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
                   │               │               │
                   └───────────────┼───────────────┘
                                   ▼
                         ┌──────────────────────┐
                         │     Persistence      │
                         │   SQLite / Database  │
                         └──────────────────────┘
```

---

# 🔄 Incident Intelligence Workflow

Nexora follows a continuous knowledge workflow:

```text
┌─────────────────────┐
│   INCIDENT OCCURS   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   CAPTURE CONTEXT   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    ANALYZE EVENT    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    RECALL MEMORY    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ COMPARE HISTORICAL  │
│     INCIDENTS       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ IDENTIFY ROOT CAUSE │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ GENERATE GUIDANCE   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      RESOLVE        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   RETAIN KNOWLEDGE  │
└──────────┬──────────┘
           │
           └──────────────► NEXT INCIDENT
```

### The Knowledge Loop

```text
OBSERVE
   ↓
REMEMBER
   ↓
ANALYZE
   ↓
RESOLVE
   ↓
RETAIN
   ↓
NEXT INCIDENT
```

Over time, resolved incidents become reusable operational knowledge.

---

# 🧩 Project Structure

```text
Nexora/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── demo.py
│   │   │       │   ├── health.py
│   │   │       │   ├── incidents.py
│   │   │       │   └── memory.py
│   │   │       │
│   │   │       └── router.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── incident.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── incident.py
│   │   │   └── memory.py
│   │   │
│   │   ├── services/
│   │   │   ├── agent_service.py
│   │   │   ├── hindsight_service.py
│   │   │   └── llm_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   │   └── test_agent_flow.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts
│   │   │
│   │   ├── components/
│   │   │   ├── DemoBanner.tsx
│   │   │   ├── IncidentAnalysisCard.tsx
│   │   │   ├── IncidentForm.tsx
│   │   │   ├── IncidentHistory.tsx
│   │   │   ├── MemoryExplorer.tsx
│   │   │   ├── MemoryInfluencePanel.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ResolutionModal.tsx
│   │   │   └── StatsBar.tsx
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── pytest.ini
└── README.md
```

---

# 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| AI | LLM-powered analysis |
| Memory | Hindsight-based memory |
| Database | SQLite |
| Testing | Pytest |
| Package Management | npm, pip |
| Version Control | Git, GitHub |

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/RohithaKavala/Nexora.git
cd Nexora
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

```powershell
Copy-Item .env.example .env
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# 🔐 Environment Configuration

Nexora includes an environment template:

```text
backend/.env.example
```

Create your local `.env` file from this template.

Keep private credentials and API keys inside `.env`.

Never commit secrets to the repository.

---

# 🧪 Testing

Run the backend test suite:

```bash
pytest
```

Run tests with detailed output:

```bash
pytest -v
```

---

# 🔌 API Overview

Nexora exposes APIs for health checks, incident operations, memory operations, and demonstration flows.

### Health

```text
GET /api/v1/health
```

### Incidents

Incident creation, retrieval, analysis, and resolution operations are exposed through the incident API.

### Memory

Memory retrieval and historical incident exploration are exposed through the memory API.

### Demo

The demo API provides a convenient way to demonstrate the incident intelligence workflow.

For the complete interactive API reference, run the backend and open:

```text
http://127.0.0.1:8000/docs
```

---

# 📐 Design Principles

## Context Over Isolation

An incident is analyzed using its surrounding operational context instead of treating it as an isolated event.

## Memory Over Repetition

Previously resolved incidents can provide useful information for future investigations.

## Evidence Over Assumptions

Historical incidents, symptoms, logs, and retrieved context provide the basis for analysis.

## Resolution Over Diagnosis Alone

The system focuses not only on identifying possible causes but also on producing actionable resolution guidance.

## Learning Over Time

Resolved incidents become part of the organization's operational knowledge.

---

# 📌 Repository

**Nexora**

GitHub:

https://github.com/RohithaKavala/Nexora

---

# ⚡ Nexora

> **Remember the incident. Learn from it. Resolve the next one faster.**

**From incident response to institutional intelligence.**
