"use client";

import { useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orderId, setOrderId] = useState("");

  const releasePayment = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/release/${orderId}`
      );

      alert("Payment Released ✅");
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
        className="border px-4 py-2 rounded"
      />

      <button
        onClick={releasePayment}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Release Payment
      </button>
    </div>
  );
}