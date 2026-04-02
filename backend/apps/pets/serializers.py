from rest_framework import serializers
from .models import Pet
from apps.owners.serializers import OwnerListSerializer


class PetSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Pet
        fields = '__all__'


class PetDetailSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    owner = OwnerListSerializer(read_only=True)
    owner_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Pet
        fields = '__all__'


class PetListSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)

    class Meta:
        model = Pet
        fields = ['id', 'name', 'species', 'breed', 'gender', 'age', 'owner_name', 'photo', 'is_neutered', 'created_at']
