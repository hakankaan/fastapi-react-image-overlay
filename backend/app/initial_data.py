#!/usr/bin/env python3

from app.db.session import get_db
from app.db.crud import create_user, create_cancer_type
from app.db.schemas import UserCreate, CancerTypeCreate
from app.db.session import SessionLocal


def init() -> None:
    db = SessionLocal()

    create_user(
        db,
        UserCreate(
            email="admin@admin.com",
            password="admin",
            is_active=True,
        ),
    )


    for type in ['Breast', 'Prostate', 'Stomach', 'Liver']:
        create_cancer_type(
            db,
            CancerTypeCreate(
                name=type
            )
        )



if __name__ == "__main__":
    print("Creating user admin@admin.com and filling cancer types")
    init()
    print("User created then cancer types filled")
