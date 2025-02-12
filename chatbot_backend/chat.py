#chat.py:

# Chatbot verificat ca model în linia de comandă, NU SE UTILIZEAZA ]N LOGICA APLICATIEI

from rule_based_module import get_rule_based_response
from generative_module import get_gpt_response


def chat():
    print("Let's chat! (type 'quit' to exit)")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "quit":
            break
        response = get_rule_based_response(user_input)
        if response:
            print(f"Bot (Rule-Based): {response}")
        else:
            print("Bot (GPT):", get_gpt_response(user_input))

if __name__ == "__main__":
    chat()