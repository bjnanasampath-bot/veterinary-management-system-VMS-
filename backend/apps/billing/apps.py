from django.apps import AppConfig

class BillingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    def ready(self):
        import apps.billing.signals
