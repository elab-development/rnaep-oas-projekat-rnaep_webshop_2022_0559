export class SearchAktivnost {
  public id: number;
  public naziv: string;
  public cena: number;
  public trajanje: string;
  public opis: string;
  public image: string;

  constructor(
    id: number,
    naziv: string,
    cena: number,
    trajanje: string,
    opis: string,
    image: string
  ) {
    this.id = id;
    this.naziv = naziv;
    this.cena = cena;
    this.trajanje = trajanje;
    this.opis = opis;
    this.image = image;
  }
}

export class AktivnostDetails {
  public id: number;
  public naziv: string;
  public cena: number;
  public trajanje: string;
  public opis: string;
  public image: string;
  public destinacija_id: number;

  constructor(
    id: number,
    naziv: string,
    cena: number,
    trajanje: string,
    opis: string,
    image: string,
    destinacija_id: number
  ) {
    this.id = id;
    this.naziv = naziv;
    this.cena = cena;
    this.trajanje = trajanje;
    this.opis = opis;
    this.image = image;
    this.destinacija_id = destinacija_id;
  }
}