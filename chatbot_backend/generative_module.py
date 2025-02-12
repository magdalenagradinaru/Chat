#generative_module.py:

import openai
import torch
from dotenv import load_dotenv


# Setează cheia API OpenAI
openai.api_key = "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"


# Funcție pentru obținerea răspunsului de la modelul GPT
def get_gpt_response(user_input):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        return response['choices'][0]['message']['content']
    except openai.OpenAIError as e:
        return f"Error: {e}"


