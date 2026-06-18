# Trip Planner - Mikroservisna aplikacija

Aplikacija za planiranje putovanja zasnovana na mikroservisnoj arhitekturi.

## Servisi

- Frontend - React korisnički interfejs
- API Gateway - jedinstvena ulazna tačka sistema
- Auth Service - registracija, prijava, JWT i korisničke uloge
- Catalog Service - pretraga destinacija, hotela, restorana i atrakcija
- Trip Service - kreiranje i upravljanje planovima putovanja
- Analytics Service - statistika i podaci za grafikon

## Pokretanje aplikacije

```bash
docker compose up --build