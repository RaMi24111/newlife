"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

const PARCEL_CHARGE = 20;
const GST_RATE = 0.05;

export default function PaymentPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: "", mobile: "", table: "" });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("customerName") || "Guest";
    const mobile = localStorage.getItem("customerMobile") || "";
    const table = localStorage.getItem("tableNumber") || "1";

    const cartKey = `currentCart_${table}_${name}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

    setCart(storedCart);
    setCustomer({ name, mobile, table });
  }, []);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty + (item.parcel ? PARCEL_CHARGE * item.qty : 0),
    0
  );
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

 const saveOrderHistory = () => {
  const key = `allOrders_${customer.table}_${customer.name}`;
  const existingOrders = JSON.parse(localStorage.getItem(key) || "[]");

  const newOrder = {
    id: Date.now(),
    date: new Date().toISOString(), // ✅ FIXED DATE FORMAT
    status: 0, // ✅ Each order has its own status (0 = Placed)
    items: cart,
    subtotal,
    gst,
    total,
  };

  localStorage.setItem(key, JSON.stringify([...existingOrders, newOrder]));

  const cartKey = `currentCart_${customer.table}_${customer.name}`;
  localStorage.removeItem(cartKey);
};


  const downloadInvoice = () => {
    if (!cart.length) return alert("Cart is empty");

    const doc = new jsPDF("p", "mm", "a4");

    const maroon: [number, number, number] = [93, 22, 22];
    const gold: [number, number, number] = [200, 169, 81];
    const gray: [number, number, number] = [90, 90, 90];

    let y = 20;

    /* HEADER */
    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...maroon);
    doc.text("ROYAL SPICE RESTAURANT", 105, y, { align: "center" });

    y += 8;
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text("Exquisite Dining Experience", 105, y, { align: "center" });

    y += 5;
    doc.setFont("times", "normal");
    doc.text("123 Main Street, City - 123456", 105, y, { align: "center" });
    y += 5;
    doc.text("Phone: 1234123456  |  info@royalspice.com", 105, y, { align: "center" });

    y += 10;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.8);
    doc.line(20, y, 190, y);

    /* INVOICE TITLE */
    y += 12;
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...maroon);
    doc.text("INVOICE", 105, y, { align: "center" });

    /* CUSTOMER DETAILS */
    y += 15;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);

    const invoiceNo = `ORD${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleString();

    doc.text(`Invoice No: ${invoiceNo}`, 20, y);
    doc.text(`Date: ${dateStr}`, 120, y);

    y += 8;
    doc.text(`Table No: ${customer.table}`, 20, y);
    doc.text(`Mobile: ${customer.mobile}`, 120, y);

    y += 6;
    doc.text(`Guest Name: ${customer.name}`, 120, y);

    /* ITEMS TABLE HEADER */
    y += 14;
    doc.setFillColor(...gold);
    doc.rect(20, y - 6, 170, 10, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Item", 25, y);
    doc.text("Price", 110, y, { align: "right" });
    doc.text("Qty", 140, y, { align: "center" });
    doc.text("Amount", 185, y, { align: "right" });

    y += 10;

    /* ITEMS */
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);

    cart.forEach((item) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      const itemTotal = item.price * item.qty;
      const parcelCost = item.parcel ? PARCEL_CHARGE * item.qty : 0;
      const finalAmount = itemTotal + parcelCost;

      const itemName =
        item.name.length > 32 ? item.name.slice(0, 32) + "…" : item.name;

      doc.text(itemName, 25, y);
      doc.text(item.price.toFixed(2), 110, y, { align: "right" });
      doc.text(String(item.qty), 140, y, { align: "center" });
      doc.text(finalAmount.toFixed(2), 185, y, { align: "right" });

      y += 6;

      if (item.parcel) {
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        doc.text(`Parcel Charge (${item.qty} × ${PARCEL_CHARGE})`, 30, y);
        doc.text(parcelCost.toFixed(2), 185, y, { align: "right" });
        y += 6;
        doc.setFontSize(10);
        doc.setTextColor(0);
      }

      if (item.notes) {
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        const noteLines = doc.splitTextToSize(`Note: ${item.notes}`, 140);
        doc.text(noteLines, 30, y);
        y += noteLines.length * 4;
        doc.setFontSize(10);
        doc.setTextColor(0);
      }

      y += 4;
    });

    /* SUMMARY */
    y += 10;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.6);
    doc.line(115, y, 190, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Subtotal", 135, y);
    doc.text(subtotal.toFixed(2), 185, y, { align: "right" });

    y += 8;
    doc.text("GST (5%)", 135, y);
    doc.text(gst.toFixed(2), 185, y, { align: "right" });

    y += 10;
    doc.setDrawColor(...maroon);
    doc.setLineWidth(0.8);
    doc.line(115, y, 190, y);

    y += 10;
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...maroon);
    doc.text("TOTAL", 135, y);
    doc.text(total.toFixed(2), 185, y, { align: "right" });

    /* FOOTER */
    y += 18;
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text(
      "Thank you for dining with Royal Spice Restaurant",
      105,
      y,
      { align: "center" }
    );

    y += 5;
    doc.text("We look forward to serving you again", 105, y, {
      align: "center",
    });

    doc.save(`Invoice_${customer.name}_${Date.now()}.pdf`);
  };

  const placeOrder = () => {
    if (!cart.length) return alert("Cart is empty");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      saveOrderHistory();
      setShowConfirm(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen pb-40 bg-gradient-to-br from-[#FBF6EE] via-[#F5EFE0] to-[#FBF6EE] relative">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#5D1616] via-[#7B1F1F] to-[#5D1616] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="px-4 py-4 flex items-center justify-between text-[#FFF8E1] max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/customer/cart")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#C8A951] transition-all duration-300 hover:scale-105"
            style={{ 
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #C8A951, #D4B76E)",
              color: "#2D0A0F"
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#2D0A0F">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Cart
          </button>

          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-[#C8A951]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <p className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Payment</p>
            </div>
            <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>Table #{customer.table}</p>
          </div>

          <div className="w-20" />
        </div>
      </div>

      {/* ORDER SUMMARY - Centered max-width container */}
      {cart.length > 0 && (
        <section className="px-4 mt-6 animate-slide-in-up max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-[#C8A951]/30 shadow-xl p-6">
            
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-6 h-6 text-[#7B1F1F]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <h2 className="font-bold text-[#5D1616] text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-5">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="border-2 border-[#C8A951]/20 rounded-xl p-4 hover:border-[#C8A951]/40 hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {item.name} × {item.qty}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-[#7B1F1F]/60 mt-1 flex items-start gap-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
                          </svg>
                          {item.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {item.parcel && (
                          <span className="text-xs bg-[#C8A951]/20 text-[#7B1F1F] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                            </svg>
                            Parcel
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-[#5D1616]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ₹{(item.price * item.qty + (item.parcel ? PARCEL_CHARGE * item.qty : 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="rounded-xl bg-gradient-to-br from-[#C8A951]/10 via-[#D4B76E]/10 to-[#C8A951]/10 border-2 border-[#C8A951]/40 p-5">
              <div className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex justify-between text-[#5D1616]">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5D1616]">
                  <span>GST (5%)</span>
                  <span className="font-semibold">₹{gst.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#C8A951]/50 to-transparent my-2" />
                <div className="flex justify-between font-bold text-xl text-[#5D1616]">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ACTION BUTTONS */}
      {cart.length > 0 && !showConfirm && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-3 max-w-md mx-auto">
          <button
            onClick={downloadInvoice}
            className="flex items-center justify-center gap-2 border-2 border-[#C8A951] py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold"
            style={{ 
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #C8A951, #D4B76E)",
              color: "#2D0A0F"
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#2D0A0F">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download Invoice
          </button>
          
          <button
            onClick={placeOrder}
            className="group flex items-center justify-center gap-2 text-white py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-bold"
            style={{ 
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #059669, #047857)"
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            CONFIRM ORDER
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#5D1616] to-[#2D0A0F] flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-[#C8A951]/30 border-t-[#C8A951] animate-spin" />
            <svg className="absolute inset-0 w-24 h-24 text-[#C8A951]/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-3 text-[#FFF8E1] animate-pulse-text" style={{ fontFamily: "'Playfair Display', serif" }}>
            Confirming Your Order
          </h3>
          <p className="text-lg text-[#E8DCC8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Preparing your royal dining experience...
          </p>
        </div>
      )}

      {/* CONFIRMATION STATE */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#10B981] to-[#059669] flex flex-col items-center justify-center z-50 px-4 animate-fade-in">
          <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center animate-scale-in">
            <svg className="w-12 h-12 text-[#047857]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <h3 className="text-4xl font-bold mb-3 text-white text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            Order Confirmed!
          </h3>
          <p className="text-xl text-white/90 mb-8 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Thank you for dining with Royal Spice
          </p>
          <button
            onClick={() => router.push("/customer/order-status")}
            className="px-8 py-4 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 font-bold flex items-center gap-2"
            style={{ 
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, #047857, #065F46)"
            }}
          >
            VIEW ORDER STATUS
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@400;500;600;700&display=swap');

        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-text { animation: pulse-text 2s ease-in-out infinite; }

        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
}
