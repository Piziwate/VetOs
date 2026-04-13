# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.client import Client  # noqa
from app.models.patient import Patient  # noqa
from app.models.setting import Setting  # noqa
from app.models.clinic import Clinic  # noqa
from app.models.room import Room  # noqa
from app.models.hospitalization_slot import HospitalizationSlot  # noqa
from app.models.clinic_closure import ClinicClosure  # noqa
from app.models.user_clinic import user_clinic_association  # noqa
