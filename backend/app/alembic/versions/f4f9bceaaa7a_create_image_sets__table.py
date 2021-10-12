"""create image_sets _table

Revision ID: f4f9bceaaa7a
Revises: 91979b40eb38
Create Date: 2021-10-10 06:15:34.647434-07:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f4f9bceaaa7a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "image_sets",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("raw_image_id", sa.Integer, sa.ForeignKey('images.id')),
        sa.Column("mask_image_id", sa.Integer, sa.ForeignKey('images.id')),
        sa.Column("user_id", sa.Integer, sa.ForeignKey('users.id'))
    )


def downgrade():
    op.drop_table('image_sets')
