from .rule_based_module import get_rule_based_response
from .generative_module import get_gpt_response
from .utils import get_company_info_from_scraper


def get_chatbot_response(user_input):
    try:
        # Încercăm să obținem informațiile despre companie
        company_info = get_company_info_from_scraper(user_input)

        if company_info:
            return company_info  # Dacă găsim compania în scraping, returnăm informațiile

        # Dacă nu găsim compania, încercăm să generăm un răspuns pe baza regulilor
        response = get_rule_based_response(user_input)

        if response:
            return response

        # Dacă nici răspunsul pe baza regulilor nu există, apelăm GPT pentru un răspuns generativ
        return get_gpt_response(user_input)

    except Exception as e:
        print(f"Error while getting response: {str(e)}")
        return "Îmi pare rău, am întâmpinat o problemă la procesarea cererii tale. Încearcă din nou mai târziu."
