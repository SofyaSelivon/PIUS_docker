from datetime import datetime, timedelta
from uuid import uuid4

from jose import jwt

SECRET_KEY = "super-secret-key-for-local-dev"
ALGORITHM = "HS256"

payload = {"sub": str(uuid4()), "exp": datetime.utcnow() + timedelta(hours=10)}

token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
print(token)
