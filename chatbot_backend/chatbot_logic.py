from .rule_based_module import get_rule_based_response
from .generative_module import get_gpt_response

def get_chatbot_response(user_input):
    response = get_rule_based_response(user_input)
    return response if response else get_gpt_response(user_input)
