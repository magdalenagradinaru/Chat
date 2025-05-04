# companies/serializers.py

from rest_framework import serializers
from .models import CompanyJob

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyJob
        fields = '__all__'
