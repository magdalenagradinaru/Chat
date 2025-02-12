# chatbot_backend/views.py
from django.http import JsonResponse
from .chatbot_logic import get_chatbot_response

# Funcție care preia cererile de la user și oefra răspuns
def chat(request):
    print("Request Method:", request.method)
    if request.method == 'POST':
        user_message = request.POST.get('message')
        print("User Message:", user_message)
        if user_message:
            bot_response = get_chatbot_response(user_message)
            return JsonResponse({'response': bot_response})
        else:
            return JsonResponse({'error': 'No message provided'}, status=400)
    elif request.method == 'GET':
        return JsonResponse({'message': 'This is a GET request. Send a POST request with a message.'}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)
