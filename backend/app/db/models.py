from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from .session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    image_sets = relationship("ImageSet", back_populates="owner")

class ImageSet(Base):
    __tablename__ = "image_sets"

    id = Column(Integer, primary_key=True, index=True)
    raw_image_id = Column(String, ForeignKey('images.id'))
    mask_image_id = Column(String, ForeignKey('images.id'))
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="image_sets")
    raw_image = relationship("Image", foreign_keys=[raw_image_id])
    mask_image = relationship("Image", foreign_keys=[mask_image_id])


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    id_number = Column(String)
    cancer_type = Column(Integer, ForeignKey("cancer_types.id"))

    cancer = relationship("CancerType", back_populates="patients")

class CancerType(Base):
    __tablename__ = "cancer_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    patients = relationship("Patient", back_populates="cancer")

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    url = Column(String)
