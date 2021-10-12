from .models import Image
from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    first_name: str = None
    last_name: str = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"

class CancerTypeBase(BaseModel):
    name: str
    
class CancerTypeCreate(CancerTypeBase):
    pass


class ImageBase(BaseModel):
    id: int
    name: str
    url: str
    class Config:
        orm_mode = True

class CreateRawImage(BaseModel):
    rawFile: bytes

class CreateMaskImage(BaseModel):
    maskFile: bytes

class ImageSetBase(BaseModel):
    raw_image_id: int
    mask_image_id: int
    user_id: int

class CreateImageSet(BaseModel):
    raw_image_id: int
    mask_image_id: int

class ImageSetOut(ImageSetBase):
    image_set_id: int
    raw_image_url: str
    mask_image_url: str

    class Config:
        orm_mode = True

class ImageSet(BaseModel):
    id: int
    raw_image_id: str
    mask_image_id: str
    user_id: int

    class Config:
        orm_mode = True


class PatientBase(BaseModel):
    first_name: str = "Hakan"
    last_name: str = "Akın"
    id_number: str = "12345678910"
    cancer_type: int = 1

class PatientCreate(PatientBase):
    pass

class PatientEdit(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    cancer_type_name: str
    pass

class Patient(PatientBase):
    id: int
    cancer_type_name: str

    class Config:
        orm_mode = True

class PatientUpdateResult(PatientBase):
    id: int

    class Config:
        orm_mode = True

class CancerType(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
