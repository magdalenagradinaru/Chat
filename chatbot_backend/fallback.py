# chatbot/fallback.py
from companies.models import CompanyJob


def chatbot_fallback_response(user_input):
    user_input_lower = user_input.lower()
    for company in CompanyJob.objects.all():
        if company.name.lower() in user_input_lower:
            return f"{company.name}:  {company.source}. Website: {company.website or 'Nedisponibil'}"

    return None
