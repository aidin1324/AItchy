
import os
from dotenv import load_dotenv


load_dotenv()

connection_string = os.getenv("CONNECTION_STRING")
secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")
access_token_expires_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))