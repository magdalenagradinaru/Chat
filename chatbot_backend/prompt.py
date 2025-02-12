# Model de verificare a chatbotului generativ
import openai

# Setează cheia API OpenAI
openai.api_key = "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"

# Funcție pentru obținerea răspunsului de la modelul GPT
def get_gpt_response(user_input):
    try:
        # Utilizează metoda corectă pentru versiunea 1.0.0 și mai sus
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Specifică modelul (ex: gpt-3.5-turbo sau gpt-4)
            messages=[
                {"role": "user", "content": user_input}  # Mesajul utilizatorului
            ]
        )
        # Returnează conținutul răspunsului generat de model
        return response['choices'][0]['message']['content']
    except openai.OpenAIError as e:
        # Gestionează erorile care apar
        return f"Error: {e}"

# Solicită input de la utilizator
user_input = input("You: ")
response = get_gpt_response(user_input)
print(f"Bot: {response}")
