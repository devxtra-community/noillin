"use client";

import axios from "axios";

export default function OrdersPage() {

  const releasePayment = async () => {
    try {
      const orderId = prompt("Enter Order ID");

      await axios.patch(
        `http://localhost:5000/api/orders/release/${orderId}`
      );

      alert("Payment Released ✅");
    } catch (err) {
      console.error(err);
      alert("Error releasing payment ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={releasePayment}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Release Payment
      </button>
    </div>
  );
}