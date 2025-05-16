from celery import shared_task
from . import scrape_allied_testing  # Importă funcția ta de scraping

@shared_task
def run_scraping_task():
    # Apelează funcția de scraping
    scrape_allied_testing()
    return "Scraping task finished!"
