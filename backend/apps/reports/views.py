from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from common.responses import success_response
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDate
from datetime import date, timedelta


class DashboardStatsView(APIView):
    def get(self, request):
        from apps.pets.models import Pet
        from apps.owners.models import Owner
        from apps.doctors.models import Doctor
        from apps.appointments.models import Appointment
        from apps.billing.models import Bill

        today = date.today()
        month_start = today.replace(day=1)

        data = {
            'total_pets': Pet.objects.filter(is_active=True).count(),
            'total_owners': Owner.objects.filter(is_active=True).count(),
            'total_doctors': Doctor.objects.filter(is_active=True).count(),
            'today_appointments': Appointment.objects.filter(appointment_date=today).count(),
            'pending_appointments': Appointment.objects.filter(status__in=['scheduled', 'confirmed']).count(),
            'monthly_revenue': float(Bill.objects.filter(
                created_at__gte=month_start, status='paid'
            ).aggregate(total=Sum('total_amount'))['total'] or 0),
            'pending_bills': Bill.objects.filter(status__in=['pending', 'partial']).count(),
            'total_revenue': float(Bill.objects.filter(status='paid').aggregate(total=Sum('total_amount'))['total'] or 0),
        }
        return success_response(data=data)


class RevenueReportView(APIView):
    def get(self, request):
        from apps.billing.models import Bill
        months = int(request.query_params.get('months', 6))
        start_date = date.today() - timedelta(days=30 * months)

        monthly_revenue = Bill.objects.filter(
            created_at__gte=start_date,
            status='paid'
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(
            total=Sum('total_amount'),
            count=Count('id')
        ).order_by('month')

        data = [
            {
                'month': item['month'].strftime('%b %Y'),
                'total': float(item['total']),
                'count': item['count']
            }
            for item in monthly_revenue
        ]
        return success_response(data=data)


class AppointmentReportView(APIView):
    def get(self, request):
        from apps.appointments.models import Appointment
        days = int(request.query_params.get('days', 30))
        start_date = date.today() - timedelta(days=days)

        by_status = Appointment.objects.filter(
            appointment_date__gte=start_date
        ).values('status').annotate(count=Count('id'))

        by_type = Appointment.objects.filter(
            appointment_date__gte=start_date
        ).values('appointment_type').annotate(count=Count('id'))

        daily = Appointment.objects.filter(
            appointment_date__gte=start_date
        ).values('appointment_date').annotate(count=Count('id')).order_by('appointment_date')

        data = {
            'by_status': list(by_status),
            'by_type': list(by_type),
            'daily': [{'date': str(d['appointment_date']), 'count': d['count']} for d in daily],
        }
        return success_response(data=data)


class PetSpeciesReportView(APIView):
    def get(self, request):
        from apps.pets.models import Pet
        by_species = Pet.objects.filter(is_active=True).values('species').annotate(count=Count('id'))
        return success_response(data=list(by_species))
