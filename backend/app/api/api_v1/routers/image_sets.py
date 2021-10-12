from fastapi import APIRouter, Request, Depends, Response, encoders
import typing as t

from app.db.session import get_db
from app.db.crud import (
    get_image_set,
    get_image_sets,
    create_image_set,
)
from app.db.schemas import CreateImageSet, ImageSetBase, ImageSetOut, ImageSet
from app.core.auth import get_current_active_user

image_sets_router = r = APIRouter()

@r.get(
    "/image_sets",
    response_model=t.List[ImageSetOut],
    response_model_exclude_none=True,
)
async def image_set_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get all image_sets
    """
    image_sets = get_image_sets(db)
    # response.headers["Content-Range"] = f"0-9/{len(image_sets)}"
    return image_sets

@r.get(
    "/image_sets/{image_set_id}",
    response_model=ImageSetOut,
    response_model_exclude_none=True,
)
async def image_details(
    request: Request,
    image_set_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get any image details
    """
    image_set = get_image_set(db, image_set_id)
    return image_set


@r.post("/image_sets", response_model=ImageSet, response_model_exclude_none=True)
async def image_create(
    request: Request,
    image_set: CreateImageSet,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Create a new image set
    """
    return create_image_set(db, image_set, current_user.id)



