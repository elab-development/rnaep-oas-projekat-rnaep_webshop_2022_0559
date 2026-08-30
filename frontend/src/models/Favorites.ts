export class Favorite {
    public id: number;
    public name: string;
    public rating: number;
    public reviews: number;
    public priceRange: string;
    public image: string;
    public link: string;
  
    constructor(
      id: number,
      name: string,
      rating: number,
      reviews: number,
      priceRange: string,
      image: string,
      link: string
    ) {
      this.id = id;
      this.name = name;
      this.rating = rating;
      this.reviews = reviews;
      this.priceRange = priceRange;
      this.image = image;
      this.link = link;
    }
  }