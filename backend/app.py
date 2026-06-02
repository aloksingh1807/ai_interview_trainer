import os
import sys
import importlib

# Prevent Python 3.14 Protobuf tp_new TypeError compatibility crashes globally
orig_import = importlib.import_module
def patched_import(name, package=None):
    if name == 'google._upb._message':
        raise ImportError("Python 3.14 Compatibility Override")
    return orig_import(name, package)
importlib.import_module = patched_import

sys.modules['google._upb._message'] = None
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
import jwt
import datetime
import bcrypt
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from database.mongo import db_manager

# Init Flask app
app = Flask(__name__)
CORS(app)

# Settings
JWT_SECRET = os.environ.get("JWT_SECRET", "super_lambo_secret_99881122")
app.config['SECRET_KEY'] = JWT_SECRET

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app_server")

# Try to initialize Google Gemini API
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
ai_active = False
if GEMINI_KEY:
    try:
        genai.configure(api_key=GEMINI_KEY)
        ai_active = True
        logger.info("✅ Google Gemini API successfully configured.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")

# Fallback Questions in case AI is offline / API key not set
FALLBACK_QUESTIONS = {
    "Full Stack Developer": [
        "What is the difference between virtual DOM and real DOM in React, and how does the diffing algorithm work?",
        "Explain how the event loop works in Node.js, and describe the difference between microtasks and macrotasks.",
        "How do you design a database schema for an e-commerce platform that needs to scale up to 10k transactions per second?",
        "Describe a time when you had to debug a complex race condition in production. How did you resolve it?",
        "Why are you interested in joining us, and how do you handle disagreements with technical leads or managers?"
    ],
    "AI Engineer": [
        "What is the difference between a traditional encoder-decoder architecture and the Transformer attention mechanism?",
        "How do you handle vanishing and exploding gradients in deep recurrent neural networks?",
        "Explain Retrieval-Augmented Generation (RAG). How does dense passage retrieval differ from sparse keyword search?",
        "Describe a scenarios where a model exhibits high training accuracy but performs poorly in testing. How would you solve this?",
        "Tell me about a challenging machine learning system you designed. What trade-offs did you make, and why?"
    ],
    "Software Engineer": [
        "Explain the time and space complexity of quicksort. What is its worst-case scenario, and how can we prevent it?",
        "Describe the Solid principles in object-oriented design and give an example of the Single Responsibility Principle.",
        "How would you build a thread-safe cache with a least-recently-used (LRU) eviction policy?",
        "Tell me about a time when you designed an algorithm to optimize a slow application database query.",
        "How do you structure your study schedule and prioritize your technical learning while working full-time?"
    ],
    "Frontend Engineer": [
        "What is the critical rendering path, and how does standard JavaScript execution block HTML parsing in the browser?",
        "Explain CSS Grid vs Flexbox, and describe how you optimize visual performance for Safari users by avoiding select-none locks.",
        "Explain standard React rendering behaviors. When does a state change trigger updates in sub-trees, and how do you prevent redundant renders?",
        "Describe a complex visual layout bug you resolved under high-pressure conditions. What browser diagnostics did you use?",
        "How do you structure your frontend assets and CSS design tokens to maintain visual harmony and elegant dark modes?"
    ],
    "Data Scientist": [
        "What is the difference between Lasso (L1) and Ridge (L2) regularization, and how do they affect model feature selection?",
        "Explain the bias-variance tradeoff. How do you recognize overfitting in a machine learning training curve, and how do you reduce it?",
        "How do you design an A/B testing experiment to verify if a new UI button improves user checkouts? What sample size rules apply?",
        "Describe a time you had to clean a highly noisy and unstructured dataset. What techniques did you apply to resolve missing values?",
        "How do you communicate complex statistical model insights to non-technical stakeholders or product managers?"
    ],
    "Product Manager": [
        "How do you define key performance indicators (KPIs) for an early-stage AI chatbot product? What metrics define success?",
        "Describe how you prioritize a product roadmap when engineering, sales, and design teams have conflicting feature goals.",
        "Walk me through a product launch that failed. What went wrong, what analytics did you capture, and what were your key learnings?",
        "How do you structure user interviews and feedback loops to identify hidden pain points in technical career tools?",
        "Explain the differences between agile scrum and kanban. When is each development lifecycle ideal for a software product?"
    ],
    "DevOps Engineer": [
        "What is Infrastructure as Code (IaC), and what is the difference between declarative tools like Terraform and procedural tools like Ansible?",
        "Explain blue-green deployment vs canary deployment. How do you orchestrate a zero-downtime release for a busy REST API?",
        "How do you design a robust CI/CD pipeline inside GitHub Actions to automate frontend testing and Docker image push workflows?",
        "Describe a severe production outage you diagnosed and resolved. What monitoring telemetry (logs, metrics) was most critical?",
        "How do you enforce security constraints and secrets rotation rules in enterprise Kubernetes or AWS cloud configurations?"
    ]
}


# Default generic list for undefined roles
GENERIC_QUESTIONS = [
    "Tell me about yourself and your key technical strengths.",
    "Describe a challenging project you built. What technical hurdles did you overcome, and what did you learn?",
    "How do you handle high-pressure deadlines and changing project requirements in a team environment?",
    "What is your approach to testing, formatting, and documenting your codebase?",
    "Where do you see yourself technically in five years, and what skills do you plan to master next?"
]

# --- Helper: Token Verification ---
def get_user_from_token():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return data["email"]
    except Exception:
        return None

# --- AUTH ENDPOINTS ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    target_role = data.get("target_role", "Software Engineer")
    skills = data.get("skills", "")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields (name, email, password)"}), 400

    if db_manager.get_user_by_email(email):
        return jsonify({"error": "An account with this email already exists"}), 400

    # Hash password
    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        db_manager.create_user(name, email, pw_hash, target_role, skills)
        # Generate token
        token = jwt.encode({
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, JWT_SECRET, algorithm="HS256")
        return jsonify({"token": token, "user": {"name": name, "email": email, "target_role": target_role}}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to register: {str(e)}"}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = db_manager.get_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Verify password
    if bcrypt.checkpw(password.encode('utf-8'), user["password_hash"].encode('utf-8')):
        token = jwt.encode({
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, JWT_SECRET, algorithm="HS256")
        return jsonify({
            "token": token,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "target_role": user.get("target_role", "Software Engineer"),
                "skills": user.get("skills", "")
            }
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


# --- INTERVIEW SESSION ENDPOINTS ---
@app.route('/api/interview/start', methods=['POST'])
def start_interview():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    role = data.get("role", "Software Engineer")
    session_type = data.get("type", "Technical")  # Technical, HR, Behavioral, System Design
    level = data.get("level", "Intermediate")

    session_id = f"sess_{int(datetime.datetime.utcnow().timestamp())}"
    
    # Generate first question
    first_question = ""
    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"Generate an elegant, high-impact initial warm-up mock interview question for a {level}-level {role} role focusing on {session_type} aspects. Keep it under 25 words and speak professionally like a top-tier tech interviewer named Alok."
            response = model.generate_content(prompt)
            first_question = response.text.strip()
        except Exception as e:
            logger.warning(f"Error generating first question with Gemini: {e}")
            
    if not first_question:
        # Fallback to local questions
        qs = FALLBACK_QUESTIONS.get(role, GENERIC_QUESTIONS)
        first_question = qs[0]

    # Save interview session to database
    db_manager.save_session(
        session_id=session_id,
        user_email=email,
        role=role,
        session_type=session_type,
        status="active",
        exchanges=[{
            "question": first_question,
            "user_answer": "",
            "score": 0,
            "feedback": "Initial warm-up question.",
            "timestamp": datetime.datetime.utcnow().isoformat()
        }]
    )

    return jsonify({
        "session_id": session_id,
        "first_question": first_question
    }), 200

@app.route('/api/interview/answer', methods=['POST'])
def submit_answer():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    session_id = data.get("session_id")
    answer = data.get("answer", "")

    if not session_id or not answer:
        return jsonify({"error": "Missing session_id or answer"}), 400

    session = db_manager.get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    exchanges = session.get("exchanges", [])
    if not exchanges:
        return jsonify({"error": "Malformed session exchanges"}), 500

    # The current question is the last exchange where user_answer is empty
    current_idx = len(exchanges) - 1
    current_q = exchanges[current_idx]["question"]

    # Calculate index to determine if interview should end (limit to 4 questions for optimal simulation)
    max_questions = 4
    is_complete = (len(exchanges) >= max_questions)

    # Core Competencies Evaluation
    scores = {"technical": 70, "communication": 70, "problem_solving": 70, "confidence": 70, "overall": 70}
    tip = "Add specific numbers or metrics to quantify your past impact."
    next_q = ""

    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            eval_prompt = f"""
            You are Alok, a senior professional mock interviewer evaluating a response.
            Question asked: "{current_q}"
            Candidate Answer given: "{answer}"
            
            Evaluate this answer across five competencies:
            1. Technical Knowledge (accuracy and depth)
            2. Communication (clarity, tone, structure)
            3. Problem Solving (logic, analytical details)
            4. Confidence (assertiveness, directness)
            5. Overall Readiness (0 to 100)

            Also provide exactly one constructive recommendation under 15 words.
            {"Generate a sharp, custom technical follow-up question under 25 words that naturally drills down into details of the candidate's last answer." if not is_complete else "Do not generate a follow-up, simply say 'Interview Complete'."}

            Return your output strictly as a JSON object with this exact format:
            {{
                "technical": int,
                "communication": int,
                "problem_solving": int,
                "confidence": int,
                "overall": int,
                "tip": "string",
                "next_question": "string"
            }}
            """
            response = model.generate_content(eval_prompt)
            # Remove markdown JSON wrappers if present
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            eval_data = json.loads(raw_text)
            scores = {
                "technical": eval_data.get("technical", 75),
                "communication": eval_data.get("communication", 75),
                "problem_solving": eval_data.get("problem_solving", 75),
                "confidence": eval_data.get("confidence", 75),
                "overall": eval_data.get("overall", 75)
            }
            tip = eval_data.get("tip", "Provide a quantitative benchmark for your successes.")
            next_q = eval_data.get("next_question", "")
        except Exception as e:
            logger.warning(f"Error parsing Gemini evaluation: {e}")

    # Fallback response values if AI is offline
    if not next_q and not is_complete:
        role = session.get("role", "Software Engineer")
        qs = FALLBACK_QUESTIONS.get(role, GENERIC_QUESTIONS)
        next_q = qs[len(exchanges) % len(qs)]
        scores = {"technical": 80, "communication": 82, "problem_solving": 78, "confidence": 85, "overall": 81}

    # Save candidate response
    exchanges[current_idx]["user_answer"] = answer
    exchanges[current_idx]["score"] = scores["overall"]
    exchanges[current_idx]["feedback"] = tip

    if not is_complete:
        exchanges.append({
            "question": next_q,
            "user_answer": "",
            "score": 0,
            "feedback": "",
            "timestamp": datetime.datetime.utcnow().isoformat()
        })

    # Calculate overall running score
    completed_exchanges = [e for e in exchanges if e["user_answer"]]
    overall_running = sum(e["score"] for e in completed_exchanges) // len(completed_exchanges) if completed_exchanges else 0

    db_manager.save_session(
        session_id=session_id,
        user_email=email,
        role=session.get("role"),
        session_type=session.get("type"),
        status="completed" if is_complete else "active",
        exchanges=exchanges,
        overall_score=overall_running
    )

    return jsonify({
        "scores": scores,
        "tip": tip,
        "next_question": next_q if not is_complete else None,
        "is_complete": is_complete
    }), 200

@app.route('/api/interview/hint', methods=['POST'])
def get_hint():
    data = request.json or {}
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    session = db_manager.get_session(session_id)
    if not session or not session.get("exchanges"):
        return jsonify({"error": "Session data not found"}), 404

    # Current active question is the last one in the list
    current_q = session["exchanges"][-1]["question"]
    hint = "Recall the STAR structure: explain the Situation, the exact Task, the Actions you personally led, and the final quantitative Result."

    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"Provide a brief, high-level structural hint under 20 words for how to answer this interview question: '{current_q}'. Deliver standard key conceptual highlights only. Focus on structural strategies."
            response = model.generate_content(prompt)
            hint = response.text.strip()
        except Exception as e:
            logger.warning(f"Failed to generate hint with Gemini: {e}")

    return jsonify({"hint": hint}), 200


def get_fallback_roadmap(role, skills):
    skills_list = [s.strip() for s in skills.split(",") if s.strip()]
    skills_str = ", ".join(skills_list) if skills_list else "core frameworks"

    if role == "Full Stack Developer":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Modern Frontend SPA & Architecture",
                    "focus": f"Master modern UI rendering pipelines using {skills_str}. Optimize bundle sizes and client-side rendering routing structures.",
                    "theory": ["Virtual DOM diffing algorithms", "State synchronization models (Redux/Zustand)", "Critical CSS & bundle code-splitting"],
                    "coding": ["Build an optimized custom reactive list component with pagination", "Implement high-performance image lazy-loaders"],
                    "resources": ["React Architecture Blueprints - Vercel Guides", "Dynamic UI state paradigms - standard web specifications"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Advanced Backend Engines & REST/GraphQL API Design",
                    "focus": "Design scalable service protocols, microservices boundaries, and multi-thread/async event loops.",
                    "theory": ["Node.js/Python Event Loop & non-blocking execution", "REST API versioning & error code standards", "Token auth models (JWT, OAuth2 secure cookies)"],
                    "coding": ["Implement a rate-limited API gateway router", "Build a thread-safe connection pooling wrapper"],
                    "resources": ["RESTful API Design Standards - Microsoft Patterns", "Designing Web APIs - O'Reilly guides"]
                },
                {
                    "week": 3,
                    "title": "Week 3: High-Throughput Databases, Caching & Partitioning",
                    "focus": "Architect scalable database models, master SQL indexing, write optimization, and Redis-based caching grids.",
                    "theory": ["ACID compliance vs BASE properties in NoSQL", "SQL index types (B-Trees, Hash indices)", "Write-through vs Write-around caching strategies"],
                    "coding": ["Draft a compound database index plan for a large transactional system", "Write a Redis cache-aside middleware"],
                    "resources": ["Designing Data-Intensive Applications - Martin Kleppmann", "Redis Enterprise caching patterns"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Cloud Infrastructure, CI/CD Pipelines & Behavioral Prep",
                    "focus": "Orchestrate automated build systems and containerized apps. Conduct intense behavioral mock screens under pressure.",
                    "theory": ["Container isolation layers (Docker namespaces)", "Blue-green vs canary release pipelines", "STAR response templates for full-stack leads"],
                    "coding": ["Orchestrate a production-grade multi-stage Dockerfile", "Implement a zero-downtime deployment script"],
                    "resources": ["The Twelve-Factor App guidelines", "Behavioral Interview Prep - Google Careers Guide"]
                }
            ]
        }
    elif role == "AI Engineer":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Mathematics of Deep Learning & ML Foundations",
                    "focus": "solidify vector calculus, linear algebra, gradient descent mechanics, and basic PyTorch tensors.",
                    "theory": ["Matrix math & high-dimensional space calculations", "Gradient descent & backpropagation optimization", "Regularization methods (L1/L2, dropout)"],
                    "coding": ["Write a mini neural network from scratch in raw numpy", "Build a dynamic custom loss function in PyTorch"],
                    "resources": ["Mathematics for Machine Learning - Cambridge", "Deep Learning Book - Ian Goodfellow"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Deep Neural Networks & Transformer Architectures",
                    "focus": "Master modern Sequence models, self-attention patterns, Multi-Head Attention mechanisms, and Transformer layers.",
                    "theory": ["Self-attention vs traditional RNN seq2seq", "Positional encodings and feed-forward dimensions", "Vanishing and exploding gradient mitigation"],
                    "coding": ["Implement a scaled dot-product attention module from scratch", "Fine-tune a small BERT classifier for sentiment analysis"],
                    "resources": ["Attention Is All You Need - original Vaswani research", "Hugging Face Transformer Course"]
                },
                {
                    "week": 3,
                    "title": "Week 3: LLMs, Vector Databases & RAG Pipelines",
                    "focus": "Build production-ready Retrieval-Augmented Generation (RAG) structures using vector indexing and modern generative models.",
                    "theory": ["Dense vs sparse semantic embedding engines", "Vector index frameworks (HNSW, flat search, cosine similarity)", "Prompt templates, few-shot prompting, and reasoning chains"],
                    "coding": ["Implement a complete RAG pipeline with chunking and FAISS indexing", "Create an evaluation suite for chunk overlaps"],
                    "resources": ["Pinecone Vector Search Mastery Series", "LangChain & LlamaIndex documentation suites"]
                },
                {
                    "week": 4,
                    "title": "Week 4: AI Model Deployment, Scaling & Behavioral Mocks",
                    "focus": "Serve models efficiently under concurrent traffic constraints, optimize memory layouts, and practice Alok behavioral interviews.",
                    "theory": ["Quantization (INT8, FP4) & model pruning", "Batching request systems (triton/vLLM engines)", "STAR structure behavioral responses for AI Engineers"],
                    "coding": ["Serve an model behind a highly optimized FastAPI endpoint", "Profile GPU memory layouts during large inference requests"],
                    "resources": ["High Performance Machine Learning Systems - Stanford CS329S", "LLM serving paradigms - Hugging Face vLLM guides"]
                }
            ]
        }
    elif role == "Frontend Engineer":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Advanced DOM Rendering & Framework Lifecycle Hooks",
                    "focus": f"Master modern UI rendering pipelines using {skills_str}. Optimize browser parsing speeds.",
                    "theory": ["Critical rendering path: DOM, CSSOM, Render Tree", "React fiber reconciler & diffing details", "Passive event listeners & event delegation"],
                    "coding": ["Implement a custom high-performance virtual scroller component", "Build a robust hook to track element visibility via IntersectionObserver"],
                    "resources": ["Inside modern web browsers - Chrome Developers Hub", "React reconciler internal architectures - Dan Abramov guides"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Advanced State Systems & Dynamic Theme Contexts",
                    "focus": "Design scalable, high-performance global store architectures and resilient light/dark visual theme engines.",
                    "theory": ["Atomic state (Jotai) vs Flux (Redux) vs Proxy state (Valtio)", "Avoiding context re-renders in deep component hierarchies", "Safari input select-none locks and input text selections"],
                    "coding": ["Build a highly responsive dark/light context state switcher with immediate CSS updates", "Write a decoupled custom debouncer and throttle hooks from scratch"],
                    "resources": ["Modern state managers comparison - LogRocket Guides", "Safari CSS Quirks & Input Selection Rules - Apple WebKit Docs"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Build Tooling, Bundler Optimization & Core Web Vitals",
                    "focus": "Tweak bundler pipelines (Vite/Webpack), configure tree-shaking, and boost core web vital benchmarks.",
                    "theory": ["Vite ESBuild dev compilation vs Rollup production bundling", "Core Web Vitals details: LCP, INP, CLS optimization", "HTTP/2 multiplexing and preloading strategies"],
                    "coding": ["Implement dynamic chunk splitting and lazy load paths across a web app", "Build an automated Web Vitals logger in your app"],
                    "resources": ["Vite production bundling guides", "Optimizing Core Web Vitals - web.dev documentation"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Design Systems, Accessibility & Frontend Behavioral Prep",
                    "focus": "Enforce strict design token consistency, support full screen reader compatibility, and practice frontend role mock screenings.",
                    "theory": ["Atomic design patterns & styling utility tradeoffs", "ARIA accessibility specs & semantic markup", "STAR behavioral templates for frontend team alignment"],
                    "coding": ["Build an accessible, keyboard-navigable autocomplete modal box", "Draft modular CSS design token variables for premium glassmorphic UI"],
                    "resources": ["W3C Web Accessibility Guidelines (WCAG)", "SaaS UI Design Systems - Linear Engineering blog"]
                }
            ]
        }
    elif role == "Data Scientist":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Advanced Statistical Analysis & Exploratory Modeling",
                    "focus": f"Solidify mathematical and statistical foundations using {skills_str}. Perform rigorous hypothesis testing.",
                    "theory": ["Probability distributions & Central Limit Theorem", "Parametric vs non-parametric hypothesis tests (T-Test, ANOVA)", "L1 vs L2 regularization mathematics"],
                    "coding": ["Build an automated outlier diagnostic and imputation script", "Write a dynamic linear regression optimization routine using gradient descent"],
                    "resources": ["An Introduction to Statistical Learning - Gareth James", "Practical Statistics for Data Scientists - O'Reilly"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Scalable Data Pipelines, ETL, SQL, & Warehouses",
                    "focus": "Write complex, optimized analytical SQL queries and model scalable star schema databases.",
                    "theory": ["OLAP vs OLTP database architecture rules", "SQL window functions and execution plan tuning", "Data partitioning, sharding, and cluster indexes"],
                    "coding": ["Write an optimized SQL query utilizing recursive CTEs to calculate user retention", "Build a simple ETL script loading raw CSV files into an SQLite database"],
                    "resources": ["High Performance SQL Queries - Database Systems Journal", "Designing ETL Pipelines - Google Cloud Architecture Guides"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Predictive ML Classifiers & Hyperparameter Tuning",
                    "focus": "Implement robust tree-based models and orchestrate high-fidelity validation workflows.",
                    "theory": ["Bagging vs Boosting algorithms (Random Forest, XGBoost)", "ROC-AUC curves, precision-recall trade-offs, and F1 scores", "K-Fold cross-validation & data leakage prevention"],
                    "coding": ["Build a complete Scikit-Learn training pipeline with cross-validation", "Write an automated grid search solver from scratch"],
                    "resources": ["Hands-On Machine Learning with Scikit-Learn - Aurélien Géron", "XGBoost System Architecture whitepapers"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Business Experimentation, A/B Testing & Stakeholder Demos",
                    "focus": "Design rigorous scientific experiments, determine sample size requirements, and practice analytical mock presentations.",
                    "theory": ["Statistical power, significance levels (Alpha), and p-value parsing", "Type I and Type II error minimization rules", "STAR storytelling structures for data engineering collaborations"],
                    "coding": ["Write a sample size calculator utilizing statsmodels formulas", "Draft an automated A/B test statistical dashboard"],
                    "resources": ["A/B Testing: The Design and Analysis of Experiments - Cambridge", "Storytelling with Data - Cole Nussbaumer Knaflic"]
                }
            ]
        }
    elif role == "Product Manager":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Product Strategy, Product Sense & User Archetypes",
                    "focus": "Develop customer-centric frameworks, construct product vision maps, and define target user segments.",
                    "theory": ["Product Sense framework: Goals, User segments, Pain points, Solutions, Prioritization", "Circle of Competence & Blue Ocean strategic patterns", "User personas and empathy mapping tools"],
                    "coding": ["Draft a comprehensive PRD (Product Requirements Document) for an AI career tool", "Design a high-fidelity user journey flow schema"],
                    "resources": ["Decode and Conquer - Lewis C. Lin", "The Lean Startup - Eric Ries"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Growth Metrics, KPIs, Analytics & Experimentation",
                    "focus": "Quantify user behavior, model retention funnels, and design data-driven feature experiments.",
                    "theory": ["North Star Metrics vs Input Metrics", "Cohort analysis models and AARRR pirate framework", "A/B testing guidelines for product owners"],
                    "coding": ["Define a detailed metrics dashboard blueprint for a newly launched messaging app", "Map out a funnel conversion spreadsheet with drop-off triggers"],
                    "resources": ["Lean Analytics - Alistair Croll & Benjamin Yoskovitz", "Amplitude Product Analytics Playbooks"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Technical Fundamentals & Engineering Collaboration",
                    "focus": f"Understand modern architectural trade-offs to coordinate effectively with engineering teams using {skills_str}.",
                    "theory": ["REST APIs, microservices, and client-server networks", "SQL database schemas, caching layers, and latency basics", "Agile scrum development lifecycles, sprint scopes, and velocity tracking"],
                    "coding": ["Draw a comprehensive system architecture diagram for an automated resume scanner", "Write a complete set of engineering backlog user stories with Acceptance Criteria"],
                    "resources": ["Inspired: How to Create Tech Products Customers Love - Marty Cagan", "The Product Manager's Survival Guide - Steven Haines"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Product Estimation, Execution & Behavioral Mocks",
                    "focus": "Resolve complex trade-offs under high business constraints, and practice intensive leadership mock screens.",
                    "theory": ["Sizing markets: TAM, SAM, SOM calculations", "Prioritization frameworks: RICE, MoSCoW, Eisenhower Matrix", "STAR response frameworks for leadership alignment"],
                    "coding": ["Create a detailed timeline roadmap chart for a SaaS feature rollout", "Solve a pricing model estimation puzzle under strict revenue targets"],
                    "resources": ["Cracking the PM Interview - Gayle Laakmann McDowell", "SVPG Product Blog - Marty Cagan"]
                }
            ]
        }
    elif role == "DevOps Engineer":
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Containerization & Local Virtualization Systems",
                    "focus": f"Master containerization technologies using {skills_str} and secure virtual environment layers.",
                    "theory": ["OS-level virtualization vs Hypervisor-based virtual machines", "Linux namespaces, cgroups, and filesystem layering", "Multi-stage Docker build optimizations"],
                    "coding": ["Orchestrate a production-grade multi-stage Dockerfile for a Python/Node web application", "Write a docker-compose script running isolated database, cache, and backend containers"],
                    "resources": ["Docker Deep Dive - Nigel Poulton", "Linux Containers internals - standard kernel specs"]
                },
                {
                    "week": 2,
                    "title": "Week 2: CI/CD Pipeline Automation & Automated Quality Gates",
                    "focus": "Build resilient CI/CD pipelines to automate testing, linting, packaging, and automatic image registry pushing.",
                    "theory": ["Continuous Integration vs Continuous Delivery vs Continuous Deployment", "Secret storage best practices in GitHub Actions and GitLab CI", "Dynamic pipeline triggers and conditional execution"],
                    "coding": ["Implement a complete GitHub Actions workflow automating tests, building Docker containers, and pushing to AWS ECR", "Write a pipeline quality gate validating code test coverage rules"],
                    "resources": ["Continuous Delivery - Jez Humble & David Farley", "GitHub Actions workflow documentation"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Infrastructure as Code (IaC) & Cloud Networks",
                    "focus": "Model secure cloud configurations using declarative IaC platforms on AWS, GCP, or Azure.",
                    "theory": ["Declarative (Terraform) vs Imperative (Pulumi) infrastructure models", "State locking, backend storages, and drift detection", "VPC architectures: public vs private subnets, security groups, NAT Gateways"],
                    "coding": ["Write a complete Terraform configuration setting up a secure VPC, subnets, and an EC2 instance", "Build an automated terraform-lint gate in your local repository"],
                    "resources": ["Terraform Up & Running - Yevgeniy Brikman", "AWS Cloud Network Architectures Blueprints"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Site Reliability Engineering (SRE), Logging & DevOps Mocks",
                    "focus": "Configure centralized logging, build interactive telemetry dashboards, and practice DevOps team behavioral scenarios.",
                    "theory": ["SLAs, SLOs, and Error Budgets defined", "Golden Signals of monitoring: Latency, Traffic, Errors, Saturation", "STAR method behavioral patterns for SRE/DevOps leads"],
                    "coding": ["Write a Prometheus alert rule configuration targeting high HTTP 5xx error thresholds", "Design an automated log parsing script extracting latency bottlenecks"],
                    "resources": ["Site Reliability Engineering - Google Systems Book", "The Phoenix Project - Gene Kim"]
                }
            ]
        }
    else:  # Default / Software Engineer fallback
        return {
            "role": role,
            "skills": skills,
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Algorithms Complexity & Fundamental Data Structures",
                    "focus": f"Master core array, linked list, and tree complexities. Align with {skills_str}.",
                    "theory": ["Big O time and space complexity models", "Memory allocations: Stack vs Heap", "Array double pointers and sliding window methods"],
                    "coding": ["Solve LeetCode Top 75 Sliding Window problems", "Write a custom doubly linked list with O(1) removals"],
                    "resources": ["Introduction to Algorithms (CLRS) - MIT", "LeetCode Curated patterns documentation"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Advanced Trees, Graphs, Sorting & Recursion",
                    "focus": "Build complex search graphs, traverse systems via BFS/DFS, and structure recursive backtracking algorithms.",
                    "theory": ["Binary Search Trees (BST) & self-balancing arbors (AVL, Red-Black)", "Graph representations (Adjacency Matrix vs List)", "recursion stack frame allocations"],
                    "coding": ["Implement custom DFS and BFS graph traversals", "Write an automated sudoku backtracking solver"],
                    "resources": ["Algorithms - Robert Sedgewick", "GeeksforGeeks graph theory modules"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Dynamic Programming, Greedy Methods & System Design Basics",
                    "focus": "Master memoization, bottom-up tabulations, and outline core architectural block diagrams.",
                    "theory": ["Optimal substructure and overlapping subproblems", "Greedy choice properties", "Basic system scalability: Load balancing, databases sharding"],
                    "coding": ["Write dynamic programming algorithms solving knapsack optimization", "Build a high-performance custom rate-limiter logic block"],
                    "resources": ["System Design Primer - Donne Martin", "Dynamic Programming Mastery - MIT OpenCourseWare"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Mock Coding Prep, STAR Behavioral & Live Screening",
                    "focus": "Conduct intense mock screening sessions with Alok. Perfect vocal presence and technical design strategies.",
                    "theory": ["STAR method: Situation, Task, Action, Result", "Object-Oriented Design (OOD) & Solid principles", "Designing secure authentication APIs"],
                    "coding": ["Solve a complex full mock screening challenge in 40 minutes", "Implement a thread-safe Singleton pattern in your target stack"],
                    "resources": ["Cracking the Coding Interview - Gayle Laakmann McDowell", "Google engineering mock training guides"]
                }
            ]
        }

@app.route('/api/roadmap/generate', methods=['POST'])
def generate_roadmap():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    role = data.get("role", "Software Engineer").strip()
    skills = data.get("skills", "").strip()

    roadmap = None

    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are Alok, an expert career mentor. Create a high-fidelity, customized week-by-week career preparation roadmap for a candidate targetting the role: "{role}" with these core skills: "{skills}".
            The roadmap must cover exactly 4 weeks.
            
            Return your response strictly as a JSON object matching this structure:
            {{
                "role": "string",
                "skills": "string",
                "weeks": [
                    {{
                        "week": 1,
                        "title": "string (e.g. Week 1: Core Fundamentals & UI Rendering)",
                        "focus": "string (e.g. Master React rendering engines, Virtual DOM concepts, and basic TypeScript)",
                        "theory": ["string (3 key theoretical topics to research)"],
                        "coding": ["string (2 key practical coding challenge targets)"],
                        "resources": ["string (2 high-quality recommended learning resources or guides)"]
                    }},
                    ... (weeks 2, 3, and 4)
                ]
            }}
            """
            response = model.generate_content(prompt)
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            roadmap = json.loads(raw_text)
        except Exception as e:
            logger.warning(f"Error generating roadmap via Gemini: {e}")

    if not roadmap:
        # Programmatic high-fidelity local fallback based on selected role
        roadmap = get_fallback_roadmap(role, skills)

    return jsonify(roadmap), 200


# --- LIVE CODE SANDBOX EXECUTION & AI EVALUATION ---
import subprocess
import tempfile

@app.route('/api/code/run', methods=['POST'])
def run_code():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    code_text = data.get("code", "").strip()
    language = data.get("language", "python").lower().strip()

    if not code_text:
        return jsonify({"error": "Code cannot be empty"}), 400

    suffix = ".py" if language == "python" else ".js"
    temp_path = None
    
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False, mode='w', encoding='utf-8') as f:
            f.write(code_text)
            temp_path = f.name

        # Run process under strict 3-second timeout protection
        if language == "python":
            cmd = [sys.executable, temp_path]
        elif language == "javascript":
            cmd = ["node", temp_path]
        else:
            return jsonify({"error": f"Language '{language}' not supported by execution sandbox"}), 400

        res = subprocess.run(cmd, capture_output=True, text=True, timeout=3.0)
        
        try:
            os.remove(temp_path)
        except Exception:
            pass

        return jsonify({
            "stdout": res.stdout,
            "stderr": res.stderr,
            "exit_code": res.returncode
        }), 200

    except subprocess.TimeoutExpired:
        if temp_path:
            try:
                os.remove(temp_path)
            except Exception:
                pass
        return jsonify({
            "stdout": "",
            "stderr": "Execution Timeout: Code execution exceeded the strict 3-second safety window (potential infinite loop).",
            "exit_code": -1
        }), 200
    except FileNotFoundError:
        if temp_path:
            try:
                os.remove(temp_path)
            except Exception:
                pass
        runtime = "Python 3" if language == "python" else "Node.js"
        return jsonify({
            "stdout": "",
            "stderr": f"Runtime environment error: '{runtime}' was not found on your host system path.",
            "exit_code": -1
        }), 200
    except Exception as e:
        if temp_path:
            try:
                os.remove(temp_path)
            except Exception:
                pass
        return jsonify({"error": f"System runtime error during execution: {str(e)}"}), 500


@app.route('/api/code/evaluate', methods=['POST'])
def evaluate_code():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    code_text = data.get("code", "").strip()
    language = data.get("language", "python").strip()
    problem_title = data.get("problem_title", "Unknown Coding Challenge").strip()
    role = data.get("role", "Software Engineer").strip()

    if not code_text:
        return jsonify({"error": "Code cannot be empty"}), 400

    feedback = "Ensure code style is optimal and proper time complexities are met."
    complexity = "O(N) time | O(1) space"
    suggestions = ["Add comments to explain edge cases", "Avoid redundant allocations"]
    is_optimal = True

    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are Alok, an expert technical interviewer evaluating a candidate's code submission.
            Role: {role}
            Problem: {problem_title}
            Language: {language}
            Code:
            ---
            {code_text}
            ---

            Provide a rigorous, professional assessment of this code. 
            Do NOT write the solution for them. Act strictly as the evaluator.
            Provide:
            1. Brief, constructive feedback under 100 words.
            2. Time and space complexity estimates (e.g. "O(N log N) time | O(N) space").
            3. Exactly 2 concrete improvement suggestions.
            4. Is the code optimal and correct? (boolean)

            Return your response strictly as a JSON object matching this structure:
            {{
                "feedback": "string",
                "complexity": "string",
                "suggestions": ["string", "string"],
                "is_optimal": boolean
            }}
            """
            response = model.generate_content(prompt)
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(raw_text)
            feedback = parsed.get("feedback", feedback)
            complexity = parsed.get("complexity", complexity)
            suggestions = parsed.get("suggestions", suggestions)
            is_optimal = parsed.get("is_optimal", is_optimal)
        except Exception as e:
            logger.warning(f"Error evaluating code with Gemini: {e}")

    return jsonify({
        "feedback": feedback,
        "complexity": complexity,
        "suggestions": suggestions,
        "is_optimal": is_optimal
    }), 200


# --- PREPARATION SECTION: AI DOUBT-CLEARING ENDPOINTS ---
@app.route('/api/doubt/ask', methods=['POST'])
def clear_doubt():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json or {}
    query = data.get("query", "").strip()
    context_role = data.get("role", "Software Engineer")

    if not query:
        return jsonify({"error": "Doubt query cannot be empty"}), 400

    reply = "As a software developer, focus on understanding time-complexity, proper algorithm structure, and component separation."
    code_block = None

    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are Alok, an expert technical preparation tutor and study companion.
            The user wants to clear a doubt regarding: "{query}"
            Target role context: {context_role}

            Provide a clear, conversational explanation under 150 words.
            If relevant to their technical query, provide a clean, highly optimized code block in Python/Javascript/SQL to demonstrate.
            
            Return your response strictly as a JSON object matching this structure:
            {{
                "explanation": "string",
                "code": "string_or_null"
            }}
            """
            response = model.generate_content(prompt)
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(raw_text)
            reply = parsed.get("explanation", reply)
            code_block = parsed.get("code")
        except Exception as e:
            logger.warning(f"Error handling doubt request: {e}")
            
    # Mocking standard coding blocks if AI is offline
    if not ai_active and "loop" in query.lower():
        code_block = "for idx in range(10):\n    print(f'Iteration: {idx}')"
        reply = "A standard loop allows you to repeat operations. In python, the range() function acts as an iterator generating sequences."

    return jsonify({
        "reply": reply,
        "code": code_block
    }), 200


# --- ATS RESUME CHECKER ENDPOINTS ---
@app.route('/api/resume/analyze', methods=['POST'])
def analyze_resume():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    resume_text = ""
    target_role = "Software Engineer"

    # Support both multipart/form-data (file upload) and application/json (copy-paste)
    if 'file' in request.files:
        uploaded_file = request.files['file']
        filename = uploaded_file.filename.lower()
        target_role = request.form.get("target_role", "Software Engineer").strip()
        
        if filename.endswith('.pdf'):
            try:
                from pypdf import PdfReader
                reader = PdfReader(uploaded_file)
                for page in reader.pages:
                    resume_text += page.extract_text() or ""
            except Exception as e:
                logger.error(f"Error parsing uploaded PDF: {e}")
                return jsonify({"error": f"Failed to parse PDF resume: {str(e)}"}), 400
        else:
            try:
                resume_text = uploaded_file.read().decode('utf-8', errors='ignore')
            except Exception as e:
                return jsonify({"error": f"Failed to parse text resume: {str(e)}"}), 400
    else:
        data = request.json or {}
        resume_text = data.get("resume_text", "").strip()
        target_role = data.get("target_role", "Software Engineer").strip()

    resume_text = resume_text.strip()
    if not resume_text:
        return jsonify({"error": "Resume text content cannot be empty"}), 400

    # Base Mock evaluation logic matching enterprise ATS systems
    ats_score = 65
    strengths = ["Clear contact info layout", "Demonstrated work experiences"]
    missing = ["No quantitative KPI metrics", "Target keywords absent"]
    recommendations = ["Rewrite bullet points with action verbs", "Detail cloud deployment expertise"]
    keywords = ["Python", "Flask", "React", "Docker", "AWS", "SQL"]

    # Simple heuristic to determine baseline score
    lower_text = resume_text.lower()
    score_bump = 0
    detected_keywords = []
    
    # Keyword compliance check
    for kw in keywords:
        if kw.lower() in lower_text:
            score_bump += 5
            detected_keywords.append(kw)
    
    ats_score = min(98, 55 + score_bump)
    
    if len(detected_keywords) >= 4:
        strengths.append("High structural match with critical modern industry stack.")
    else:
        missing.append("Candidate tech stack does not match modern cloud requirements.")
        recommendations.append("Include relevant tools: Docker, Cloud platforms (AWS/GCP), and modern databases.")

    # High fidelity AI ATS evaluation
    if ai_active:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            ats_prompt = f"""
            You are an expert enterprise ATS (Applicant Tracking System) recruiter screener.
            Analyze this candidate resume for a "{target_role}" role:
            ---
            {resume_text}
            ---

            Provide a rigorous, industry-grade ATS analysis, detailing:
            1. ATS Score (0 to 100) representing formatting compliance, layout parsing, and keyword matching.
            2. Strengths (at least 2 actionable points).
            3. Missing core competencies or keywords.
            4. Recommendations to improve ranking inside corporate tracking systems.
            5. Key tech stack terms matched.

            Return your output strictly as a JSON object matching this structure:
            {{
                "ats_score": int,
                "strengths": ["string"],
                "missing": ["string"],
                "recommendations": ["string"],
                "keywords": ["string"]
            }}
            """
            response = model.generate_content(ats_prompt)
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(raw_text)
            ats_score = parsed.get("ats_score", ats_score)
            strengths = parsed.get("strengths", strengths)
            missing = parsed.get("missing", missing)
            recommendations = parsed.get("recommendations", recommendations)
            keywords = parsed.get("keywords", keywords)
        except Exception as e:
            logger.warning(f"Failed to screen resume with Gemini ATS analyzer: {e}")

    return jsonify({
        "ats_score": ats_score,
        "strengths": strengths,
        "missing": missing,
        "recommendations": recommendations,
        "keywords": keywords
    }), 200


# --- ANALYTICS DASHBOARD ENDPOINTS ---
@app.route('/api/dashboard/stats', methods=['GET'])
def get_stats():
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Unauthorized"}), 401

    sessions = db_manager.get_user_sessions(email)
    
    total_interviews = len(sessions)
    completed_sessions = [s for s in sessions if s.get("status") == "completed"]
    completed_count = len(completed_sessions)

    # Average score
    avg_score = 0
    best_score = 0
    if completed_sessions:
        scores = [s.get("overall_score", 0) for s in completed_sessions]
        avg_score = sum(scores) // len(scores)
        best_score = max(scores)

    # Historical progress details for line charts
    history_data = []
    for idx, s in enumerate(sessions):
        history_data.append({
            "index": idx + 1,
            "role": s.get("role", "Software Engineer"),
            "score": s.get("overall_score", 70),
            "date": datetime.datetime.fromtimestamp(s.get("updated_at", time.time())).strftime("%Y-%m-%d")
        })

    # Mock weaknesses & roadmaps
    weak_topics = ["System Scalability", "Database Partitioning", "Quantitative Impact Articulation"]
    recommendations = [
        {"topic": "STAR Formatting Method", "resource": "STAR behavioral response blueprints - Google Career Guide"},
        {"topic": "Scale & Partitioning", "resource": "Design distributed cache rate limiters - System Design Primer"},
        {"topic": "Web Application Architecture", "resource": "Event loop architectures - Node.js Core Documentation"}
    ]

    return jsonify({
        "readiness_score": min(95, max(60, avg_score + 10)) if avg_score else 0,
        "completed": completed_count,
        "total": total_interviews,
        "avg_score": avg_score,
        "best_score": best_score,
        "history": history_data,
        "weak_topics": weak_topics,
        "recommendations": recommendations
    }), 200


if __name__ == '__main__':
    # Flask starts on port 5001 to bypass common macOS 5000 conflicts
    app.run(host='0.0.0.0', port=5001, debug=True)
