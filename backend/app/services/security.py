"""
Переписать в класс потом...
"""
import logging

from fastapi import HTTPException
from fastapi.security import SecurityScopes
from schemas.token import TokenData

from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from config import secret_key, algorithm, access_token_expires_minutes

#load_dotenv(path)

#SECRET_KEY = os.getenv("SECRET_KEY")
#ALGORITHM = os.getenv("ALGORITHM")
#ACCESS_TOKEN_EXPIRE_MINUTES = float(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)


SECRET_KEY = secret_key
ALGORITHM = algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = access_token_expires_minutes

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, scopes: list[str], expires_delta: int = None):
    to_encode = data.copy()
    if expires_delta:
        expires_delta = timedelta(minutes=expires_delta)
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "scopes": scopes})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_access_token(token: str, security_scopes: SecurityScopes, credentials_exception) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        is_superuser: bool = payload.get("is_superuser")
        is_premium: bool = payload.get("is_premium")
        token_scopes = payload.get("scopes", [])

        if user_id is None or is_superuser is None or is_premium is None:
            raise credentials_exception

        logger.debug(security_scopes.scopes)
        for scope in security_scopes.scopes:
            if scope not in token_scopes:
                raise HTTPException(
                    status_code=403,
                    detail=f"Not enough permissions. Required scope: {scope}",
                    headers={"WWW-Authenticate": f"Bearer scope=\"{security_scopes.scope_str}\""},
                )
        return TokenData(
            user_id=user_id,
            is_superuser=is_superuser,
            is_premium=is_premium,
            scopes=token_scopes
        )
    except JWTError:
        raise credentials_exception
