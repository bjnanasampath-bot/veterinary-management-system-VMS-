from rest_framework import serializers
from .models import Owner


class OwnerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    pet_count = serializers.SerializerMethodField()

    class Meta:
        model = Owner
        fields = '__all__'

    def get_pet_count(self, obj):
        return obj.pets.filter(is_active=True).count()


class OwnerListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    pet_count = serializers.SerializerMethodField()

    class Meta:
        model = Owner
        fields = ['id', 'full_name', 'email', 'phone', 'city', 'photo', 'pet_count', 'created_at']

    def get_pet_count(self, obj):
        return obj.pets.filter(is_active=True).count()
