import openai

openai.api_key = "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"

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
