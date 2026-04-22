export interface OrderCreatedEvent {
  orderId: string;
  buyerId: string;
  influencerId: string;
  amount: number;
}