# Trip Planner - Mikroservisna aplikacija

Aplikacija za planiranje putovanja zasnovana na mikroservisnoj arhitekturi.

Sistem omogućava registraciju i prijavu korisnika, pretragu hotela, restorana i atrakcija, kreiranje putovanja, asinhronu obradu događaja preko Kafka sistema, osnovnu analitiku, monitoring i CI/CD pipeline.

---

## Arhitektura sistema

Sistem se sastoji od sledećih komponenti:

- Frontend aplikacija
- API Gateway
- Auth Service
- Catalog Service
- Trip Service
- Analytics Service
- Kafka
- MySQL baza za Auth Service
- MySQL baza za Trip Service
- MongoDB baza za Catalog Service
- MongoDB baza za Analytics Service
- Prometheus
- Grafana

Frontend ne komunicira direktno sa servisima, već svi zahtevi idu preko API Gateway-a.

---

## Servisi

### Frontend

React aplikacija koja predstavlja korisnički interfejs.

Adresa:

- http://localhost:5173

Frontend koristi API Gateway kao backend ulaznu tačku:

- http://localhost:8080

### API Gateway

API Gateway predstavlja jedinstvenu ulaznu tačku sistema.

Rute:

- /api/auth -> auth-service
- /api/catalog -> catalog-service
- /api/trips -> trip-service
- /api/analytics -> analytics-service

Endpointi:

- http://localhost:8080/health
- http://localhost:8080/metrics

### Auth Service

Auth Service je zadužen za:

- registraciju korisnika
- prijavu korisnika
- JWT autentifikaciju
- korisničke uloge
- rad sa MySQL bazom

Port:

- 3001

Baza:

- mysql-auth

### Catalog Service

Catalog Service je zadužen za:

- pretragu hotela
- pretragu restorana
- pretragu atrakcija
- rad sa eksternim API servisima
- čuvanje kataloških podataka u MongoDB bazi

Port:

- 3002

Baza:

- mongo-catalog

### Trip Service

Trip Service je zadužen za:

- kreiranje putovanja
- izmenu putovanja
- upravljanje stavkama putovanja
- proveru vlasništva nad putovanjem
- komunikaciju sa OpenWeather API-jem
- slanje Kafka događaja

Port:

- 3003

Baza:

- trip-db

Trip Service šalje Kafka događaje:

- trip-created
- trip-updated

### Analytics Service

Analytics Service je zadužen za:

- slušanje Kafka događaja
- obradu podataka o putovanjima
- generisanje statistike
- čuvanje analitike u MongoDB bazi
- slanje rezultujućih Kafka događaja

Port:

- 3004

Baza:

- mongo-analytics

Analytics Service sluša događaje:

- trip-created
- trip-updated

Analytics Service šalje događaje:

- analytics-generated
- trip-processing-failed

Endpointi:

- http://localhost:3004/health
- http://localhost:3004/metrics

---

## Kafka

Kafka se koristi za asinhronu komunikaciju između servisa.

Definisani topic-i:

- trip-created
- trip-updated
- analytics-generated
- trip-processing-failed

Kafka broker unutar Docker mreže:

- kafka:19092

Kafka broker sa host računara:

- localhost:9092

Detaljan opis događaja nalazi se u fajlu:

- docs/kafka-events.md

---

## Event-driven komunikacija

Primer toka komunikacije:

1. Korisnik kreira putovanje.
2. Trip Service čuva putovanje u MySQL bazi.
3. Trip Service šalje Kafka događaj trip-created.
4. Analytics Service prima događaj.
5. Analytics Service obrađuje podatke.
6. Analytics Service šalje događaj analytics-generated.

Analytics Service je i Consumer i Producer, pa predstavlja primer procesora u event-driven arhitekturi.

---

## Circuit Breaker pattern

U Trip Service-u je implementiran Circuit Breaker pattern za komunikaciju sa eksternim vremenskim API-jem.

Korišćena biblioteka:

- opossum

Ukoliko eksterni vremenski servis nije dostupan ili predugo odgovara, aktivira se fallback odgovor. Na taj način pad eksternog servisa ne ruši ostatak sistema.

---

## Monitoring

Monitoring je realizovan pomoću:

- Prometheus
- Grafana
- prom-client biblioteke

Prometheus:

- http://localhost:9090

Grafana:

- http://localhost:3000

Grafana login:

- username: admin
- password: admin

Dashboard:

- Trip Planner Monitoring

Dashboard prikazuje:

- dostupnost servisa
- broj HTTP zahteva na API Gateway-u
- trajanje HTTP zahteva
- memorijsku potrošnju Node.js servisa

---

## Bezbednost

U projektu su obrađeni sledeći bezbednosni aspekti:

### XSS

Frontend koristi React, koji podrazumevano escapuje vrednosti koje se prikazuju u komponentama. Time se smanjuje rizik od ubacivanja malicioznog JavaScript koda kroz korisnički unos.

### CSRF

API Gateway i backend servisi koriste CORS konfiguraciju i ograničavaju pristup samo dozvoljenim origin adresama.

### IDOR

Trip Service proverava vlasništvo nad putovanjem pre pristupa i izmene. Korisnik ne može pristupiti tuđem putovanju samo promenom ID-ja u URL-u.

### CORS

API Gateway ima podešenu CORS politiku i dozvoljava komunikaciju samo sa definisanim frontend adresama.

### SQL Injection

Za rad sa MySQL bazom koriste se parametrizovani SQL upiti, čime se sprečava direktno ubacivanje korisničkog unosa u SQL komande.

---

## CI/CD

CI/CD je realizovan pomoću GitHub Actions.

Workflow fajl:

- .github/workflows/ci.yml

Pipeline izvršava:

- instalaciju zavisnosti
- testiranje servisa
- build frontend aplikacije
- proveru Docker Compose konfiguracije
- build Docker image-a

Pipeline se pokreće na push i pull request događaje.

---

## Pokretanje projekta

Preduslovi:

- Docker Desktop
- Node.js
- Git

Pokretanje svih servisa:

```bash
docker compose up -d
```

Provera statusa:

```bash
docker compose ps
```

Zaustavljanje sistema:

```bash
docker compose down
```

Ponovni build i pokretanje:

```bash
docker compose up -d --build
```

---

## Provera servisa

Frontend:

- http://localhost:5173

API Gateway health:

- http://localhost:8080/health

API Gateway metrics:

- http://localhost:8080/metrics

Analytics health:

- http://localhost:3004/health

Analytics metrics:

- http://localhost:3004/metrics

Prometheus:

- http://localhost:9090

Grafana:

- http://localhost:3000

---

## Docker Compose

Docker Compose pokreće:

- frontend
- api-gateway
- auth-service
- catalog-service
- trip-service
- analytics-service
- mysql-auth
- trip-db
- mongo-catalog
- mongo-analytics
- kafka
- kafka-init
- prometheus
- grafana

---

## Dokumentacija

Dodatna dokumentacija se nalazi u folderu:

- docs/

Kafka događaji:

- docs/kafka-events.md

Prvi domaći zadatak treba da se nalazi u istom folderu u PDF formatu.

---

## Autori

Projekat je rađen timski u okviru seminarskog zadatka iz oblasti mikroservisne arhitekture.
