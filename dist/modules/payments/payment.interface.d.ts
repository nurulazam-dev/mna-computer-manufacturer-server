export interface CreatePaymentIntentInput {
    shouldPay?: number;
    amount?: number;
    orderId?: string;
}
