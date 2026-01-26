"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function TestCardPage() {
    const params = useSearchParams();
    const router = useRouter();

    const amount = params.get("amount");
    const method = params.get("method");

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const detectBrand = (number: string) => {
        if (/^4/.test(number)) return "VISA";
        if (/^5[1-5]/.test(number)) return "MASTERCARD";
        if (/^3[47]/.test(number)) return "AMEX";
        return "CARD";
    };


    const handlePay = () => {
        const cleanNumber = cardNumber.replace(/\s+/g, "");

        if (cleanNumber.length < 12) {
            alert("Քարտի համարը սխալ է");
            return;
        }

        const last4 = cleanNumber.slice(-4);
        const brand = detectBrand(cleanNumber);

        router.push(
            `/test-success?amount=${amount}&method=${method}&last4=${last4}&brand=${brand}`
        );
    };


    return (
        <div style={{ maxWidth: 420, margin: "60px auto", padding: 30, backgroundColor: "white", display: "flex", alignItems: "center", flexDirection: 'column', gap: 20 }}>
            <h2>ARCA Secure Payment (TEST)</h2>

            <input
                style={{height:40, width: "100%", padding: "10px", borderRadius: '10px'}}
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
            />

            <input
                style={{height:40, width: "100%", padding: "10px", borderRadius: '10px'}}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
            />

            <input
                style={{height:40, width: "100%", padding: "10px", borderRadius: '10px'}}
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
            />

            <button onClick={handlePay} style={{padding: '10px 30px', borderRadius: '10px', cursor: 'pointer'}}>
                Pay {amount} AMD
            </button>
        </div>
    );
}
