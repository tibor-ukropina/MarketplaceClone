export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  categories: string[];
  condition: string;
  location: string;
  quantity?: number;
  imageName?: string;
  imageType?: string;
  imageData?: string;
}
