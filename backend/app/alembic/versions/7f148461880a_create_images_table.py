"""create_images_table

Revision ID: 7f148461880a
Revises: 
Create Date: 2021-10-10 08:26:52.765821-07:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7f148461880a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "images",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String),
        sa.Column("url", sa.String)
    )


def downgrade():
    op.drop_table('images')
