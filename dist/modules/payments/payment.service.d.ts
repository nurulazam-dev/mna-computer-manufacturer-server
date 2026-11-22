export declare const paymentService: {
    createIntent: (email: string, input: {
        shouldPay?: number;
        amount?: number;
        orderId?: string;
    }) => Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
    }>;
};
