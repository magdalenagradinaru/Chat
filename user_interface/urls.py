from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [


# Pagina de prezentare până la logare
    path('', views.intro, name='intro'),

# Pagina de bază
    path('welcome/', views.welcome, name='welcome'),

# Pagini de navigare, din nav-bar
    #path('chatbot/', views.chatbot, name='chatbot'),

    path('forum/', views.forum, name='forum'),
    path('resources/', views.resources, name='resources'),
    path('contact/', views.contact, name='contact'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms-and-conditions/', views.terms_and_conditions, name='terms_and_conditions'),

# Paginile de logare, înregistrare, delogare
    path('register/', views.register, name='register'),
    path('login/', LoginView.as_view(template_name='user_interface/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

# Pagina de loading, de până la logare
    path('intro/', views.intro, name='intro')

]
