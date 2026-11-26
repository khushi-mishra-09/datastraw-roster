import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables from backend/.env
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Check credentials
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials are missing!")

# Create Supabase connection
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("Supabase client initialized successfully!")