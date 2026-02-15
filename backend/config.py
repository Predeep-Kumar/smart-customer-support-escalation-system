import os
from dotenv import load_dotenv

# Load .env.example file
load_dotenv()

# Database URL
DB_URL = os.getenv("DATABASE_URL", "sqlite:///./tickets.db")

# Get Hugging Face Api
HF_TOKEN = os.getenv("HUGGINGFACE_API_KEY")
