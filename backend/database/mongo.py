import os
import time
import logging
from pymongo import MongoClient
import bcrypt

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("db_mongo")

# Preseed candidate profiles
DEMO_USERS = [
    {
        "name": "Alok Singh",
        "email": "demo@interview.ai",
        "password": "demo1234",
        "target_role": "Full Stack Developer",
        "skills": "React, Node.js, Python, Flask, MongoDB, SQL"
    },
    {
        "name": "Alok Singh",
        "email": "alok123@gmail.in",
        "password": "alok1234",
        "target_role": "AI Engineer",
        "skills": "Python, Gemini API, PyTorch, LangChain, vector databases"
    }
]

class MemoryDatabase:
    """Robust In-Memory fallback database when MongoDB is not running"""
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.resumes = {}
        self.doubt_chats = {}
        self._seed_data()
        logger.info("⚠️ MongoDB not connected. Activated secure in-memory mock storage.")

    def _seed_data(self):
        for user_data in DEMO_USERS:
            pw_hash = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            self.users[user_data["email"]] = {
                "_id": f"usr_{int(time.time() * 1000) + len(self.users)}",
                "name": user_data["name"],
                "email": user_data["email"],
                "password_hash": pw_hash,
                "target_role": user_data["target_role"],
                "skills": user_data["skills"],
                "created_at": time.time()
            }

class MongoDatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.use_fallback = True
        self.mem_db = None
        
        # Connection settings
        mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/interview_trainer")
        try:
            logger.info("Attempting MongoDB Connection...")
            # 2 second timeout for connection check
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
            self.client.server_info()  # Forces connection test
            self.db = self.client.get_database()
            self.use_fallback = False
            logger.info("✅ Successfully connected to MongoDB.")
            self._seed_mongo()
        except Exception as e:
            logger.warning(f"Failed to connect to MongoDB: {e}")
            self.mem_db = MemoryDatabase()

    def _seed_mongo(self):
        """Seed demo users into MongoDB collection if empty"""
        try:
            users_coll = self.db['users']
            if users_coll.count_documents({}) == 0:
                for user_data in DEMO_USERS:
                    pw_hash = bcrypt.hashpw(user_data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                    users_coll.insert_one({
                        "name": user_data["name"],
                        "email": user_data["email"],
                        "password_hash": pw_hash,
                        "target_role": user_data["target_role"],
                        "skills": user_data["skills"],
                        "created_at": time.time()
                    })
                logger.info("Seeded default accounts in MongoDB successfully.")
        except Exception as e:
            logger.error(f"Error seeding MongoDB: {e}")

    # --- User Operations ---
    def get_user_by_email(self, email):
        if self.use_fallback:
            return self.mem_db.users.get(email)
        return self.db['users'].find_one({"email": email})

    def create_user(self, name, email, password_hash, target_role="", skills=""):
        user_doc = {
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "target_role": target_role,
            "skills": skills,
            "created_at": time.time()
        }
        if self.use_fallback:
            user_id = f"usr_{int(time.time() * 1000)}"
            user_doc["_id"] = user_id
            self.mem_db.users[email] = user_doc
            return user_id
        
        res = self.db['users'].insert_one(user_doc)
        return str(res.inserted_id)

    # --- Session Operations ---
    def save_session(self, session_id, user_email, role, session_type, status="active", exchanges=None, overall_score=0):
        session_doc = {
            "session_id": session_id,
            "user_email": user_email,
            "role": role,
            "type": session_type,
            "status": status,
            "exchanges": exchanges or [],
            "overall_score": overall_score,
            "updated_at": time.time()
        }
        if self.use_fallback:
            self.mem_db.sessions[session_id] = session_doc
            return True
        
        self.db['sessions'].replace_one({"session_id": session_id}, session_doc, upsert=True)
        return True

    def get_session(self, session_id):
        if self.use_fallback:
            return self.mem_db.sessions.get(session_id)
        return self.db['sessions'].find_one({"session_id": session_id})

    def get_user_sessions(self, user_email):
        if self.use_fallback:
            return [s for s in self.mem_db.sessions.values() if s["user_email"] == user_email]
        return list(self.db['sessions'].find({"user_email": user_email}))

# Instantiate global DB connection
db_manager = MongoDatabaseManager()
