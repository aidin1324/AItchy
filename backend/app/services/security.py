"""
Переписать в класс потом...
"""

from schemas.token import TokenData

from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

#load_dotenv(path)

#SECRET_KEY = os.getenv("SECRET_KEY")
#ALGORITHM = os.getenv("ALGORITHM")
#ACCESS_TOKEN_EXPIRE_MINUTES = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


SECRET_KEY = "test_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 * 3

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()
    if expires_delta:
        expires_delta = timedelta(minutes=expires_delta)
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode |= {"exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_access_token(token: str, credentials_exception) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        is_superuser: bool = payload.get("is_superuser")
        is_premium: bool = payload.get("is_premium")
        print(payload)
        if user_id is None or is_superuser is None or is_premium is None:
            raise credentials_exception
        return TokenData(
            user_id=user_id,
            is_superuser=is_superuser,
            is_premium=is_premium
        )
    except JWTError:
        raise credentials_exception
