
import os
from pathlib import Path
from dotenv import load_dotenv

root_env = Path(__file__).resolve().parents[1] / '.env'
backend_env = Path(__file__).resolve().parent / '.env'

if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env, override=True)


def get_env_var(name: str, default: str | None = None) -> str:
    value = os.getenv(name)
    if value is None:
        if default is not None:
            return default
        raise ValueError(f"{name} environment variable must be set")
    return value

DATABASE_URL = get_env_var("DATABASE_URL")
SECRET_KEY = get_env_var("SECRET_KEY", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(get_env_var("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
OPENAI_API_KEY = get_env_var("OPENAI_API_KEY", "")
