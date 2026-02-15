# 🧠 Smart Customer Support & Escalation System

An AI-powered customer support automation system that classifies tickets, analyzes sentiment, generates solutions, escalates high-risk issues, and provides a real-time tracking interface with an admin dashboard.

---

## 📌 Problem Statement

Modern customer support systems face several operational challenges:

- Large volume of support tickets  
- Delayed responses  
- Poor issue prioritization  
- Lack of intelligent escalation  
- Manual tracking inefficiencies  
- Inconsistent resolution quality  

Organizations need an intelligent system that can:

- Automatically understand customer issues  
- Prioritize tickets accurately  
- Provide AI-generated troubleshooting  
- Escalate critical issues instantly  
- Allow real-time tracking  
- Maintain structured workflow automation  

---

## 🎯 Objective

The objective of this project is to build:

- ✅ A fully automated AI-driven ticket processing system  
- ✅ Real-time ticket tracking interface  
- ✅ Intelligent escalation engine  
- ✅ Sentiment & risk detection system  
- ✅ Structured AI solution generation pipeline  
- ✅ Scalable FastAPI backend  
- ✅ Clean, modern Next.js frontend  

---

## 🏗 System Architecture

```
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
AI Workflow Engine
   ├── Classifier Agent
   ├── Sentiment Agent
   ├── Troubleshooter Agent
   └── Escalation Agent
        ↓
SQLite Database
```

---

## ⚙️ Functional Workflow

### 1️⃣ Ticket Creation

User submits:
- Subject
- Description

Backend runs the AI pipeline **once** and stores structured results.

---

### 2️⃣ Classification Agent  
📄 `classifier_agent.py`

- Uses HuggingFace Zero-Shot model  
- Has rule-based fallback logic  
- Determines:
  - Category
  - Priority  

---

### 3️⃣ Sentiment Agent  
📄 `sentiment_agent.py`

Uses **VADER Sentiment Analyzer** to detect:

- Sentiment (Positive / Neutral / Negative / Urgent)
- Risk level (Low / Medium / High)
- Confidence score
- Urgency keywords

---

### 4️⃣ Troubleshooter Agent  
📄 `troubleshooter_agent.py`

Generates:

- Step-by-step troubleshooting guide  
- Friendly human-like response  
- Resolution probability flag  

---

### 5️⃣ Escalation Agent  
📄 `escalation_agent.py`

Triggers when:

- Priority = Critical  
- Risk = High  
- Sentiment = Negative or Urgent  

Generates:

- Structured escalation object  
- Escalation reason  
- Action plan  
- Professional escalation summary  

---

### 6️⃣ Status Flow Logic

Possible ticket states:

- Open  
- In Progress  
- Escalated  
- Resolved  

Status is automatically determined by:

- Resolution probability  
- Sentiment risk  
- Priority  
- Escalation logic  

Users can manually mark issues as resolved.

---

### 7️⃣ Real-Time Ticket Tracking (Frontend)

Features include:

- Live polling every 5 seconds  
- Timeline progression UI  
- Category & Priority pills  
- 🔴 Critical badge  
- Escalation alert box  
- AI solution display  
- Manual resolve button  
- Rating system  
- Admin dashboard view  

---


## 🧠 AI / LLM Models Used

### 🔹 HuggingFace Zero-Shot Text Classification  
Model: `facebook/bart-large-mnli`  
Type: NLI-based Zero Shot Text Classification  

Purpose:
- Dynamic ticket category detection  
- Context-aware classification  
- Works without task-specific training data  

This model allows flexible classification into categories such as:
- Billing  
- Technical  
- Account  
- Refund  
- Security  
- Order  
- General  

---

### 🔹 HuggingFace Text Generation Model  

Type: Transformer-based Text Generation  

Purpose:
- Generate step-by-step troubleshooting solutions  
- Create human-friendly support responses  
- Predict resolution likelihood  
- Produce structured JSON output  

This model powers the **Troubleshooter Agent**.

---

### 🔹 VADER Sentiment Analyzer  

Type: Rule-based Sentiment Analysis Model  

Purpose:
- Detect emotional tone (Positive / Neutral / Negative / Urgent)  
- Measure risk level (Low / Medium / High)  
- Identify urgency keywords  
- Compute sentiment confidence score  

Used by the **Sentiment Agent**.


## ✨ Key Features

- AI-powered ticket classification  
- Intelligent priority detection  
- Sentiment & urgency analysis  
- Automated escalation engine  
- Structured AI JSON outputs  
- Real-time frontend polling  
- Timeline visualization  
- Critical issue badge  
- Manual resolution override  
- Persistent structured database storage  
- Admin dashboard  
- Search, filter & pagination  
- Modern clean UI  
- Scalable modular backend  

---

## 🛠 Tech Stack

### Backend
- FastAPI  
- SQLAlchemy  
- SQLite  
- Pydantic  
- Requests  
- VADER Sentiment  
- HuggingFace Inference API  

### Frontend
- Next.js  
- React  
- Axios  
- Custom CSS  
- Real-time polling  

---

## 📂 Project Structure

```
backend/
│
├── __pycache__/
├── agents/
│   ├── __pycache__/
│   ├── __init__.py
│   ├── classifier_agent.py
│   ├── escalation_agent.py
│   ├── sentiment_agent.py
│   └── troubleshooter_agent.py
│
├── services/
│   ├── __pycache__/
│   ├── __init__.py
│   └── workflow.py
│
├── venv/
├── .env.example
├── config.py
├── database.py
├── main.py
├── models.py
├── requirements.txt
└── tickets.db

frontend/
│
├── public/
│
├── src/
│   └── app/
│       ├── admin/
│       │   └── tickets/
│       │       ├── [id]/
│       │       │   └── page.js
│       │       └── page.js
│       │
│       ├── components/
│       │   ├── StatusBadge.js
│       │   ├── TicketForm.js
│       │   ├── TicketList.js
│       │   ├── TicketStatus.js
│       │   └── TicketTracker.js
│       │
│       ├── lib/
│       │   └── api.js
│       │
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── page.js
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/Predeep-Kumar/smart-customer-support-escalation-system.git
```
```
cd smart-customer-support-escalation-system
```

---

## 🔹 Backend Setup

```
cd backend
```

#### Create Virtual Environment

For window 
```
py -m venv venv  
```
For mac
```
python3 -m venv venv 
```

#### Activate Virtual Environment
For window 
```
venv\Scripts\activate   
```
For mac
```
source venv/bin/activate     
```
#### Install Dependencies

```
pip install --upgrade pip
```
```
pip install -r requirements.txt
```

#### 🔐 Environment Variables Setup

This project uses the Hugging Face Inference API for model access.

For security reasons, API tokens are not stored in the repository.
You must provide your own Hugging Face access token to run the backend.

##### 📌 Step 1: Generate a Hugging Face Token

-  Go to: https://huggingface.co/settings/tokens
- Click New token
- Select Read access
- Copy the generated token

##### 📌 Step 2: Create the .env File

Inside the backend/ folder, create a file named:

```.env```


Replace your_huggingface_token_here with your actual Hugging Face token.``` HUGGINGFACE_TOKEN=your_huggingface_token_here```



### Run Backend Server

```
uvicorn main:app --reload
```

If uvicorn is not recognized:
For Windows
```
py -m uvicorn main:app --reload       
```

For mac
```
python3 -m uvicorn main:app --reload     
```

#### Backend URL::

```
http://127.0.0.1:8000
```

### Swagger UI URL:

```
http://127.0.0.1:8000/docs
```

---

## 🔹 Frontend Setup

```
cd frontend
```
#### Install Dependencies

```
npm install
```
#### Run Development Server
```
npm run dev
```

#### Frontend User Side URL::

```
http://localhost:3000
```

#### Frontend Admin Dashboard URL:
```
http://localhost:3000/admin/tickets
```
---

## 📊 Sample Output

Example processed ticket:

```json
{
    "id": 11,
    "subject": "App crashes while uploading files",
    "description": "Every time I try to upload a PDF file, the application crashes and shows a 500 internal server error. I have tried restarting the app but the issue still persists.",
    "category": "Technical",
    "priority": "High",
    "sentiment": "Neutral",
    "status": "In Progress",
    "solution": {
      "steps": [
        "Verify the PDF file size does not exceed the server’s upload limit (e.g., 10 MB). If it does, compress or split the file.",
        "Check the server logs (e.g., /var/log/apache2/error.log or the application’s log file) to identify the exact error message that occurs"
      ],
      "message": "Please try the above steps. If your issue is resolved, click the Mark as 'Resolved' button below. If the problem persists, our support team will contact you shortly for further assistance.",
      "resolved": false
    },
    "escalation": null,
    "timeline": [
      {
        "step": "Ticket Submitted",
        "status": "completed"
      },
      {
        "step": "AI Processing",
        "status": "completed"
      },
      {
        "step": "Resolution",
        "status": "pending"
      },
      {
        "step": "Escalation",
        "status": "skipped"
      }
    ]
  }
```

---

## 📈 System Capabilities

- Automatically resolves low-risk issues  
- Escalates critical security issues  
- Generates professional escalation summaries  
- Maintains consistent status lifecycle  
- Stores structured JSON solution data  
- Allows manual user resolution override  
- Provides admin-level visibility  

---

## 🔮 Future Work

- JWT-based authentication  
- Role-based admin system  
- SLA monitoring engine  
- Email notifications for escalations  
- WebSocket real-time updates (remove polling)  
- Multi-language support  
- LLM fine-tuning  
- Advanced risk prediction model  
- Feedback-based retraining  
- Cloud deployment (AWS / GCP / Azure)  
- Vector database for solution memory  

---

## 🎯 Conclusion

This project demonstrates how AI can:

- Automate customer support workflows  
- Reduce human workload  
- Improve response speed  
- Detect urgency and risk intelligently  
- Provide structured escalation mechanisms  
- Enhance customer experience  

It combines:

- LLM intelligence  
- Sentiment analysis  
- Rule-based safeguards  
- Real-time frontend tracking  
- Scalable backend architecture  

This system serves as a strong foundation for building enterprise-grade intelligent support platforms.

---

## 👨‍💻 Author

### Predeep Kumar
Creator of the Smart Support System – An AI-driven intelligent support automation platform.
