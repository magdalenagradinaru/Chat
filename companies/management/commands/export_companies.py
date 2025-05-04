from django.core.management.base import BaseCommand
from companies.models import CompanyJob

class Command(BaseCommand):
    help = 'Scrapează joburi de pe delucru.md și le salvează în baza de date'

    def handle(self, *args, **kwargs):
        job_urls = [
            "https://www.delucru.md/job/",
            "https://www.rabota.md/ro/companies/allied-testing"
        ]

        for url in job_urls:
            self.stdout.write(f"Scraping {url}")
            data = scrape_job_detail(url)

            if data:
                obj, created = CompanyJob.objects.get_or_create(
                    company_name=data['company_name'],
                    defaults={
                        'company_description': data['company_description'],
                        'requirements': ', '.join(data['requirements']),
                        'skills': ', '.join(data['skills']),
                        'benefits': ', '.join(data['benefits']),
                        'email': data['contact_email'],
                        'website': data['contact_website'],
                        'address': '',  # Dacă vrei să adaugi și adresa, extrage-o separat
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Salvat: {obj.company_name}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Deja există: {obj.company_name}"))
