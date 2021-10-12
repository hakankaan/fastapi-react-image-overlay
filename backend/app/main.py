from fastapi import FastAPI, Depends
from starlette.requests import Request
import uvicorn

from app.api.api_v1.routers.users import users_router
from app.api.api_v1.routers.images import images_router
from app.api.api_v1.routers.image_sets import image_sets_router
from app.api.api_v1.routers.patients import patients_router
from app.api.api_v1.routers.auth import auth_router
from app.core import config
from app.db.session import SessionLocal
from app.core.auth import get_current_active_user
from fastapi_pagination import add_pagination


app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    patients_router,
    prefix="/api/v1",
    tags=["patients"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    images_router,
    prefix="/api/v1",
    tags=["images"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(
    image_sets_router,
    prefix="/api/v1",
    tags=["image_sets"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, prefix="/api", tags=["auth"])

add_pagination(app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
