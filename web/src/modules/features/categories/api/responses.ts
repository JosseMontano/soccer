export interface Category {
  id: string;
  name: string;
  typeCategoryId: string;
  minAge: number;
  maxAge: number;
  typeCategory: {
    id: string;
    name: string;
  };
}
