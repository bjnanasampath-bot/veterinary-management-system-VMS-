import django_filters
from .models import Appointment

class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass

class AppointmentFilter(django_filters.FilterSet):
    status = CharInFilter(field_name='status', lookup_expr='in')
    appointment_type = CharInFilter(field_name='appointment_type', lookup_expr='in')

    class Meta:
        model = Appointment
        fields = ['status', 'appointment_type', 'doctor', 'appointment_date']
