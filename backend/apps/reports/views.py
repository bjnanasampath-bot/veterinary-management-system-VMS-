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

        user = request.user
        role = user.role
        today = date.today()
        month_start = today.replace(day=1)

        # Base queries based on role
        if role == 'doctor':
            try:
                doctor_profile = user.doctor_profile
            except:
                from apps.doctors.models import Doctor
                doctor_profile, created = Doctor.objects.get_or_create(
                    email=user.email,
                    defaults={
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'phone': user.phone or '0000000000',
                        'license_number': f"DOC-{user.id}",
                        'user': user
                    }
                )
                if not created and not doctor_profile.user:
                    doctor_profile.user = user
                    doctor_profile.save()
            pets_q = Pet.objects.filter(appointments__doctor=doctor_profile).distinct()
            appts_q = Appointment.objects.filter(doctor=doctor_profile)
            bills_q = Bill.objects.filter(pet__appointments__doctor=doctor_profile).distinct()
        elif role == 'client':
            from django.db.models import Q
            from apps.owners.models import Owner
            owner_ids = list(Owner.objects.filter(Q(user=user) | Q(email=user.email)).values_list('id', flat=True))
            
            pets_q = Pet.objects.filter(owner_id__in=owner_ids)
            appts_q = Appointment.objects.filter(pet__owner_id__in=owner_ids)
            bills_q = Bill.objects.filter(pet__owner_id__in=owner_ids)
        else:
            # Admin and Receptionist see all
            pets_q = Pet.objects.all()
            appts_q = Appointment.objects.all()
            bills_q = Bill.objects.all()

        data = {
            'total_pets': pets_q.filter(is_active=True).count(),
            'total_owners': Owner.objects.filter(is_active=True).count() if role != 'client' else 1,
            'total_doctors': Doctor.objects.filter(is_active=True).count() if role != 'doctor' else 1,
            'today_appointments': appts_q.filter(appointment_date=today).count(),
            'pending_appointments': appts_q.filter(status__in=['scheduled', 'confirmed']).count(),
            'monthly_revenue': float(bills_q.filter(
                created_at__gte=month_start, status='paid'
            ).aggregate(total=Sum('total_amount'))['total'] or 0) if role != 'client' else 0,
            'pending_bills': bills_q.filter(status__in=['pending', 'partial']).count(),
            'total_revenue': float(bills_q.filter(status='paid').aggregate(total=Sum('total_amount'))['total'] or 0) if role != 'client' else 0,
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
