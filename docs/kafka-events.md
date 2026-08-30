# Kafka Event Contract

## Pregled

Aplikacija koristi Apache Kafka platformu za asinhronu komunikaciju između Trip Service i Analytics Service mikroservisa.

Kafka broker je dostupan na sledećim adresama:

* Iz Docker kontejnera: `kafka:19092`
* Sa lokalnog računara: `localhost:9092`

## Kafka topic-i

| Topic                    | Producer          | Consumer          | Namena                                        |
| ------------------------ | ----------------- | ----------------- | --------------------------------------------- |
| `trip-created`           | Trip Service      | Analytics Service | Obaveštenje da je kreiran novi plan putovanja |
| `trip-updated`           | Trip Service      | Analytics Service | Obaveštenje da je plan putovanja izmenjen     |
| `analytics-generated`    | Analytics Service | Trip Service      | Obaveštenje da je analiza uspešno izračunata  |
| `trip-processing-failed` | Analytics Service | Trip Service      | Obaveštenje da obrada podataka nije uspela    |

## Zajednička struktura događaja

Svaki događaj mora sadržati sledeća osnovna polja:

```json
{
  "eventId": "jedinstveni UUID događaja",
  "eventType": "naziv događaja",
  "occurredAt": "ISO-8601 datum i vreme",
  "tripId": 1,
  "userId": 10,
  "data": {}
}
```

Polje `tripId` koristi se kao Kafka message key. Na taj način događaji koji pripadaju istom putovanju obrađuju se pravilnim redosledom.

## trip-created

Topic: `trip-created`

Producer: Trip Service

Consumer: Analytics Service

Događaj se šalje nakon što je novo putovanje uspešno sačuvano u Trip MySQL bazi.

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "trip-created",
  "occurredAt": "2026-06-23T10:30:00.000Z",
  "tripId": 1,
  "userId": 10,
  "data": {
    "destination": "Rome",
    "startDate": "2026-07-10",
    "endDate": "2026-07-15",
    "items": []
  }
}
```

## trip-updated

Topic: `trip-updated`

Producer: Trip Service

Consumer: Analytics Service

Događaj se šalje nakon:

* izmene osnovnih podataka putovanja;
* dodavanja atrakcije, hotela ili restorana;
* uklanjanja stavke iz plana putovanja.

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440001",
  "eventType": "trip-updated",
  "occurredAt": "2026-06-23T10:35:00.000Z",
  "tripId": 1,
  "userId": 10,
  "data": {
    "destination": "Rome",
    "startDate": "2026-07-10",
    "endDate": "2026-07-15",
    "items": [
      {
        "id": 101,
        "catalogItemId": "catalog-25",
        "name": "Colosseum",
        "category": "ATTRACTION"
      },
      {
        "id": 102,
        "catalogItemId": "catalog-34",
        "name": "Hotel Roma",
        "category": "HOTEL"
      }
    ]
  }
}
```

## analytics-generated

Topic: `analytics-generated`

Producer: Analytics Service

Consumer: Trip Service

Događaj se šalje nakon uspešnog izračunavanja statistike i čuvanja rezultata u Analytics MongoDB bazi.

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440002",
  "eventType": "analytics-generated",
  "occurredAt": "2026-06-23T10:35:01.000Z",
  "tripId": 1,
  "userId": 10,
  "data": {
    "totalItems": 2,
    "counts": {
      "attractions": 1,
      "hotels": 1,
      "restaurants": 0
    },
    "percentages": {
      "attractions": 50,
      "hotels": 50,
      "restaurants": 0
    },
    "status": "READY"
  }
}
```

## trip-processing-failed

Topic: `trip-processing-failed`

Producer: Analytics Service

Consumer: Trip Service

Događaj se šalje kada Analytics Service ne može uspešno da obradi događaj.

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440003",
  "eventType": "trip-processing-failed",
  "occurredAt": "2026-06-23T10:35:01.000Z",
  "tripId": 1,
  "userId": 10,
  "data": {
    "status": "FAILED",
    "errorCode": "ANALYTICS_PROCESSING_ERROR",
    "message": "Nije moguće izračunati analitiku putovanja."
  }
}
```

## Pravila publikovanja događaja

1. Trip Service publikuje događaj tek nakon uspešnog čuvanja promene u svojoj bazi.
2. Svaki događaj mora imati jedinstveni `eventId`.
3. Datum u polju `occurredAt` mora biti u ISO-8601 formatu.
4. Kafka message key mora biti vrednost polja `tripId`.
5. Događaji ne smeju sadržati lozinke, JWT tokene, API ključeve ili druge poverljive podatke.
6. Consumer mora biti otporan na ponovno primanje istog događaja.
7. Analytics Service funkcioniše kao hibridni Processor jer prima Trip događaj, obrađuje ga i publikuje novi događaj.
