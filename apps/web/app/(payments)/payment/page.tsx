"use client";

import api from "@/lib/axios.client";

export default function PaymentPage() {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create Order
      const orderRes = await api.post(
        "/orders",
        {
          buyerId: "507f1f77bcf86cd799439011",
          influencerId: "507f1f77bcf86cd799439012",
          gigId: "507f1f77bcf86cd799439013",
          amount: 500,
        }
      );

      const { orderId, amount } = orderRes.data;

      // 2️⃣ Create Stripe Checkout Session
      const res = await api.post(
        "/payments/checkout",
        {
          amount,
          orderId,
        }
      );

      // 3️⃣ Redirect to Stripe Payment Page
      window.location.href = res.data.url;
      console.log(res.data);

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handlePayment}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Pay ₹500
      </button>
    </div>
  );
}