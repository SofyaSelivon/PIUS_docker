import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
load_dotenv()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://user_service_api:8000/api/v1/auth/login")
SECRET_KEY = os.getenv("SECRET_KEY")


async def get_admin_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)

        if not user_id:
            raise HTTPException(status_code=401, detail="Неверный токен")
        if not is_admin:
            raise HTTPException(status_code=403, detail="Только для админов.")
            
        return {"userId": user_id, "isAdmin": True, "token": token} 
        
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Токен истек или невалиден")
