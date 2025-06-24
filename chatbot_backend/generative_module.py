import openai

openai.api_key = "sk..."

def get_gpt_response(user_input):
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {e}"

print(get_gpt_response("Salut!"))
