from fastapi import APIRouter, Request, Depends, Response, encoders, UploadFile, File
import typing as t

from app.db.session import get_db
from app.db.crud import (
    create_mask_image,
    create_raw_image,
    get_image,
)
from app.db.schemas import CreateMaskImage, CreateRawImage, ImageBase
from app.core.auth import get_current_active_user

images_router = r = APIRouter()


@r.get(
    "/images/{image_id}",
    response_model=ImageBase,
    response_model_exclude_none=True,
)
async def image_details(
    request: Request,
    image_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get any image details
    """
    image = get_image(db, image_id)
    return image


@r.post("/images/raw", response_model=ImageBase, response_model_exclude_none=True)
async def image_create(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Create a new image
    """
    return create_raw_image(db, file)

@r.post("/images/mask", response_model=ImageBase, response_model_exclude_none=True)
async def image_create(
    request: Request,
    file: UploadFile = File(...),
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Create a new image
    """
    return create_mask_image(db, file)



