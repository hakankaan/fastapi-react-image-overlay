from fastapi import HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
import typing as t

from . import models, schemas
from app.core.security import get_password_hash
from app.core import config
import boto3
import urllib

s3 = boto3.resource(
    's3',
    aws_access_key_id=config.S3_KEY,
    aws_secret_access_key=config.S3_SECRET,
)


def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str) -> schemas.UserBase:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(
    db: Session, skip: int = 0, limit: int = 100
) -> t.List[schemas.UserOut]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return user


def edit_user(
    db: Session, user_id: int, user: schemas.UserEdit
) -> schemas.User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = user.dict(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(user.password)
        del update_data["password"]

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# CANCER TYPE

def create_cancer_type(db: Session, cancer_type: schemas.CancerTypeCreate):
    db_cancer_type = models.CancerType(
        name=cancer_type.name,
    )
    db.add(db_cancer_type)
    db.commit()
    db.refresh(db_cancer_type)
    return db_cancer_type

# IMAGE

def create_raw_image(db: Session, file: UploadFile):
    s3.Bucket(config.S3_BUCKET).upload_fileobj(
                file.file, file.filename)

    url = f'''https://static-file-content.s3.eu-central-1.amazonaws.com/{urllib.parse.quote(file.filename, safe="~()*!.'")}'''
    db_image = models.Image(
        name = file.filename,
        url = url
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def create_mask_image(db: Session, file: UploadFile):
    s3.Bucket(config.S3_BUCKET).upload_fileobj(
                file.file, file.filename)

    url = f'''https://static-file-content.s3.eu-central-1.amazonaws.com/{urllib.parse.quote(file.filename, safe="~()*!.'")}'''
    db_image = models.Image(
        name = file.filename,
        url = url
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_image(db: Session, image_id: int):
    image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image

def edit_image(
    db: Session, image_id: int, image: schemas.ImageBase
) -> schemas.User:
    db_image = get_image(db, image_id)
    if not db_image:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = image.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_image, key, value)

    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

# IMAGE SET

def create_image_set(db: Session, image_set: schemas.CreateImageSet, user_id: int):
    db_image_set = models.ImageSet(
        raw_image_id = image_set.raw_image_id,
        mask_image_id = image_set.mask_image_id,
        user_id = user_id
    )
    db.add(db_image_set)
    db.commit()
    db.refresh(db_image_set)

    return db_image_set

def get_image_set(db: Session, image_set_id: int):
    image_set = db.query(models.ImageSet).filter(models.Image.id == image_set_id).first()
    if not image_set:
        raise HTTPException(status_code=404, detail="Image not found")
    return image_set

def get_image_sets(
    db: Session, skip: int = 0, limit: int = 100
) -> t.List[schemas.ImageSetOut]:

    raw_image = aliased(models.Image)
    mask_image = aliased(models.Image)
    result = db.query(func.distinct(models.ImageSet.id).label('image_set_id'), models.ImageSet.raw_image_id, models.ImageSet.mask_image_id, models.ImageSet.user_id, raw_image.url.label('raw_image_url'), mask_image.url.label('mask_image_url')).\
        join(raw_image, models.ImageSet.raw_image_id == raw_image.id).\
            join(mask_image, models.ImageSet.mask_image_id == mask_image.id).order_by(models.ImageSet.id.desc()).offset(skip).limit(limit).all()
    return result


# PATIENTS

def get_patient(db: Session, patient_id: int):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


def get_patients(
    db: Session, skip: int = 0, limit: int = 100
) -> t.List[schemas.Patient]:
    cancer_type = aliased(models.CancerType)
    return db.query(func.distinct(models.Patient.id).label('id'), models.Patient.first_name, models.Patient.last_name, models.Patient.id_number, cancer_type.name.label('cancer_type_name')).join(cancer_type, models.Patient.cancer_type == cancer_type.id).order_by(models.Patient.id.desc()).offset(skip).limit(limit).all()


def create_patient(db: Session, patient: schemas.PatientUpdateResult):
    db_patient = models.Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        id_number=patient.id_number,
        cancer_type=patient.cancer_type,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_patient(db: Session, patient_id: int):
    patient = get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return patient


def edit_patient(
    db: Session, patient_id: int, patient: schemas.PatientEdit
) -> schemas.PatientUpdateResult:
    db_patient = get_patient(db, patient_id)
    if not db_patient:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Patient not found")
    update_data = patient.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_patient, key, value)

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_cancer_types(
    db: Session
) -> t.List[schemas.CancerType]:
    return db.query(models.CancerType).all()