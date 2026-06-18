export class SearchRestaurant {
    public id: number;
    public name: string;
    public rating: number;
    public reviews: number;
    public priceRange: string;
    public image: string;
  
    constructor(
      id: number,
      name: string,
      rating: number,
      reviews: number,
      priceRange: string,
      image: string
    ) {
      this.id = id;
      this.name = name;
      this.rating = rating;
      this.reviews = reviews;
      this.priceRange = priceRange;
      this.image = image;
    }
     }
  
export class RestaurantDetails {
  public id: number;
  public name: string;
  public rating: number;
  public reviews: number;
  public priceRange: string;
  public image: string;
  public link: string;
  public address: string;
  recenzije: any[]  ; 


  constructor(
    id: number,
    name: string,
    rating: number,
    reviews: number,
    priceRange: string,
    image: string,
    link: string,
    address: string,
    recenzije: any[]=[]
  ) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.reviews = reviews;
    this.priceRange = priceRange;
    this.image = image;
    this.link = link;
    this.address = address;
    this.recenzije = recenzije; 

  
  }
}
