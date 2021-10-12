import os

PROJECT_NAME = "image-edit-fastapi-react"

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

API_V1_STR = "/api/v1"

S3_KEY = "AKIAZNQBUG7Y2OC4IO6R"
S3_SECRET = "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"
S3_BUCKET = "static-file-content"