import requests
from bs4 import BeautifulSoup


# Exemplu simplu pentru scraping, adaptabil la site-urile țintă
def scrape_companies():
    url = "https://www.endava.com/"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        companies = []

        # extragere a datelor despre companii (adaptat pentru site-ul respectiv)
        for company in soup.find_all('div', class_='company-info'):
            name = company.find('h3').text.strip()
            website = company.find('a', href=True)['href']
            source = url
            companies.append({
                'name': name,
                'website': website,
                'source': source
            })

        return companies
    return None
