import re
from companies.management.commands import scrape_companies
from companies.models import CompanyJob

def extract_company_name(user_input):
    """
    Extrage un nume de companie din input-ul utilizatorului.
    Se presupune că numele companiilor sunt cuvinte sau fraze cu litere mari (ex. 'Google Inc.').
    """
    matches = re.findall(r'\b[A-Z][a-z]+\s(?:[A-Z][a-z]+)?\b', user_input)
    if matches:
        return matches[0]  # presupune primul ca fiind numele companiei
    return None

def get_company_info_from_scraper(user_input):
    """
    Căutăm informațiile despre companie, iar dacă nu le găsim în baza de date,
    rulăm scraper-ul pentru a le adăuga.
    """
    company_name = extract_company_name(user_input)

    if company_name:
        # Verificăm în baza de date dacă compania există deja
        company = CompanyJob.objects.filter(company_name__icontains=company_name).first()

        if company:
            return (
                f"{company.company_name} este o companie cu următoarea descriere:\n"
                f"{company.description or 'Nedisponibil'}\n\n"
                f"Website: {company.website or 'Nedisponibil'}\n"
                f"Job-urile disponibile asociate sunt:\n{company.available_jobs or 'Nedisponibil'}"
            )

        # Dacă nu o găsim, rulăm scraper-ul pentru a actualiza datele
        companies = scrape_companies()  # Poți implementa mai multe funcții de scraping dacă este necesar
        if companies:
            for company_data in companies:
                # Adăugăm sau actualizăm compania
                obj, created = CompanyJob.objects.get_or_create(
                    company_name=company_data['name'],
                    defaults={
                        'description': company_data.get('description', ''),
                        'website': company_data.get('website', ''),
                        'available_jobs': company_data.get('available_jobs', '[]'),  # Joburile ca JSON
                        'published_date': company_data.get('published_date', None),
                        'location': company_data.get('location', ''),
                    }
                )
                if created:
                    return f"Am adăugat informațiile despre compania {company_data['name']} în baza de date."
                else:
                    return f"Compania {company_data['name']} există deja în baza de date."

    return None
