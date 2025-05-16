from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Setează modulul de setări Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatbotProject.settings')

app = Celery('ChatbotProject')

# Folosește setările din Django pentru a configura Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Încărcăm toate task-urile din aplicațiile Django
app.autodiscover_tasks()
