from fastapi import APIRouter, Request, Depends, Response, encoders, UploadFile, File
import typing as t

from app.db.session import get_db
from app.db.crud import (
    get_patients,
    get_patient,
    create_patient,
    delete_patient,
    edit_patient,
    get_cancer_types
)
from app.db.schemas import PatientBase, PatientOut, PatientEdit, PatientCreate, Patient, CancerType, PatientUpdateResult
from app.core.auth import get_current_active_user

patients_router = r = APIRouter()



@r.get(
    "/patients",
    response_model=t.List[Patient],
    response_model_exclude_none=True,
)
async def patients_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get all patients
    """
    patients = get_patients(db)
    return patients


@r.get(
    "/patients/{patient_id}",
    response_model=Patient,
    response_model_exclude_none=True,
)
async def patient_details(
    request: Request,
    patient_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get any patient details
    """
    patient = get_patient(db, patient_id)
    return patient


@r.post("/patients", response_model=PatientUpdateResult, response_model_exclude_none=True)
async def patient_create(
    request: Request,
    patient: PatientCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Create a new patient
    """
    return create_patient(db, patient)


@r.put(
    "/patients/{patient_id}", response_model=PatientUpdateResult, response_model_exclude_none=True
)
async def patient_edit(
    request: Request,
    patient_id: int,
    patient: PatientEdit,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Update existing patient
    """
    return edit_patient(db, patient_id, patient)


@r.delete(
    "/patients/{patient_id}", response_model=Patient, response_model_exclude_none=True
)
async def patient_delete(
    request: Request,
    patient_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Delete existing patient
    """
    return delete_patient(db, patient_id)



@r.get(
    "/cancer_types",
    response_model=t.List[CancerType],
    response_model_exclude_none=True,
)
async def cancer_types_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """
    Get all cancer_types
    """
    cancer_types = get_cancer_types(db)
    return cancer_types