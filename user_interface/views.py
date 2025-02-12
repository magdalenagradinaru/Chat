from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages


# Logica formularului de înregistrare
def register(request):
    if request.user.is_authenticated:
        # Dacă utilizatorul este deja autentificat, îl redirecționezi către pagina welcome
        return redirect('welcome')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # După înregistrare, utilizatorul devine autentificat
            login(request, user)
            messages.success(request, 'Înregistrare reușită! Bine ai venit în aplicație.')
            return redirect('welcome')
    else:
        # Se curăță formularul pentru reintroducerea datelor
        form = UserCreationForm()

    return render(request, 'user_interface/register.html', {'form': form})

# Pagina de prezentare, de până la logare
def intro(request):
    return render(request, 'user_interface/intro.html')


# Redirectionare către paginile corespunzătoare din meniu
@login_required
def welcome(request):
    return render(request, 'user_interface/welcome.html')

@login_required
def forum(request):
    return render(request, 'user_interface/forum.html')

@login_required
def resources(request):
    return render(request, 'user_interface/resources.html')

@login_required
def contact(request):
    return render(request, 'user_interface/contact.html')

@login_required
def privacy_policy(request):
    return render(request, 'user_interface/privacy_policy.html')

@login_required
def terms_and_conditions(request):
    return render(request, 'user_interface/terms_and_conditions.html')

@login_required
def chatbot(request):
    return render(request, 'user_interface/chatbot.html')

# Funcția de delogare care redirecționează către intro
@login_required
def logout_view(request):
    logout(request)
    return redirect('intro')
