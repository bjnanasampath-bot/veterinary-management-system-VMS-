from django.db import models
from common.models import BaseModel
from apps.owners.models import Owner


class Pet(BaseModel):
    SPECIES_CHOICES = [
        ('dog', 'Dog'), ('cat', 'Cat'), ('bird', 'Bird'),
        ('rabbit', 'Rabbit'), ('hamster', 'Hamster'), ('other', 'Other'),
    ]
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female'), ('unknown', 'Unknown')]
    BLOOD_GROUP_CHOICES = [
        ('DEA 1.1+', 'DEA 1.1+'), ('DEA 1.1-', 'DEA 1.1-'),
        ('DEA 1.2+', 'DEA 1.2+'), ('DEA 1.2-', 'DEA 1.2-'),
        ('unknown', 'Unknown'),
    ]

    owner = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES)
    breed = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    color = models.CharField(max_length=100, blank=True)
    blood_group = models.CharField(max_length=20, choices=BLOOD_GROUP_CHOICES, default='unknown')
    microchip_id = models.CharField(max_length=100, blank=True, unique=True, null=True)
    photo = models.ImageField(upload_to='pets/', blank=True, null=True)
    allergies = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    is_neutered = models.BooleanField(default=False)
    is_deceased = models.BooleanField(default=False)

    class Meta:
        db_table = 'pets'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.species}) - {self.owner.full_name}"

    @property
    def age(self):
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            delta = today - self.date_of_birth
            years = delta.days // 365
            months = (delta.days % 365) // 30
            if years > 0:
                return f"{years}y {months}m"
            return f"{months}m"
        return "Unknown"
