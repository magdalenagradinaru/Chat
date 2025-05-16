import requests
from bs4 import BeautifulSoup
from datetime import datetime
import os
import django
import json

# Inițializare Django pentru script standalone
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ChatbotProject.settings")
django.setup()

from companies.models import CompanyJob  # import ABSOLUT

def scrape_allied_testing():
    url = "https://www.rabota.md/ro/companies/allied-testing"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    company_name = "Allied Testing"

    # Extrage descrierea companiei
    desc_block = soup.find("div", class_="company-description")
    description = desc_block.get_text(strip=True) if desc_block else None

    # Caută website-ul companiei
    website_link = None
    info_blocks = soup.find_all("div", class_="company-info__item")
    for block in info_blocks:
        if block.a and ("http" in block.a['href']):
            website_link = block.a['href']
            break

    # Extrage lista anunțurilor de angajare
    jobs_section = soup.find_all("div", class_="preview previewCard")
    job_list = []
    extracted_location = None

    month_map = {
        "ianuarie": "January", "februarie": "February", "martie": "March",
        "aprilie": "April", "mai": "May", "iunie": "June",
        "iulie": "July", "august": "August", "septembrie": "September",
        "octombrie": "October", "noiembrie": "November", "decembrie": "December"
    }

    def parse_romanian_date(date_str):
        for ro, en in month_map.items():
            if ro in date_str:
                date_str = date_str.replace(ro, en)
                break
        try:
            return datetime.strptime(date_str.strip(), "%d %B %Y").date()
        except ValueError:
            return None

    for job in jobs_section:
        title_tag = job.select_one("a.vacancyShowPopup.vacancy")
        meta_tag = job.find("div", class_="vacancy-meta")

        title = title_tag.text.strip() if title_tag else None
        published_date = None
        location = None

        if meta_tag:
            parts = [part.strip() for part in meta_tag.text.split(",")]
            if len(parts) >= 2:
                date_str = parts[0]
                location = parts[1]
                published_date = parse_romanian_date(date_str)

        if title:
            job_list.append({
                "title": title,
                "published_date": published_date.isoformat() if published_date else None,
                "location": location
            })
            if not extracted_location and location:
                extracted_location = location

    # Creează sau actualizează în baza de date
    CompanyJob.objects.update_or_create(
        company_name=company_name,
        defaults={
            "description": description,
            "available_jobs": json.dumps(job_list, ensure_ascii=False),
            "published_date": datetime.today().date(),
            "location": extracted_location,
            "website": website_link
        }
    )

    print(f"[OK] Datele pentru '{company_name}' au fost salvate/actualizate.")


def run_scraping():
    url = "https://www.alliedtesting.com"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extrage datele și salvează
        print("Scraping completed successfully")
    else:
        print("Error fetching the page")



if __name__ == "__main__":
    scrape_allied_testing()
