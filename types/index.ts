export type User = {
  email: string;
  image: string;
  name?: string;
};

export type Home = {
  id: string;
  image: string;
  title: string;
  description: string;
  guests: number;
  beds: number;
  baths: number;
  price: number;
};
