export type OrderLine = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  lines: OrderLine[];
};
