export interface SearchResultItem {
  title: string;
  price: string;
  image: string;
  link: string;
  quantity?: string;
  rating?: string;
  platform: 'Amazon' | 'Flipkart' | 'Swiggy' | 'Zepto' | 'Blinkit';
}
