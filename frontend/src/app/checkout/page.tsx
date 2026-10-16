"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Lock,
  Tag,
  Smartphone,
  Building2,
  Globe,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod" | "netbanking">("upi");
  const [notes, setNotes] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autofill user info if logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setStreet(addr.street || "");
        setApartment(addr.apartment || "");
        setCity(addr.city || "");
        setState(addr.state || "");
        setPostalCode(addr.postalCode || "");
        setCountry(addr.country || "India");
        if (addr.phone) setPhone(addr.phone);
      }
    }
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your shopping bag is empty");
      return;
    }

    if (!fullName || !email || !street || !city || !postalCode) {
      setError("Please fill in all required shipping fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        items: items.map((it) => ({
          productId: it.productId,
          finishName: it.finishName,
          finishColor: it.finishColor,
          quantity: it.quantity,
          image: it.image,
        })),
        shippingAddress: {
          fullName,
          phone,
          street,
          apartment,
          city,
          state,
          postalCode,
          country,
        },
        customerName: fullName,
        customerPhone: phone,
        guestEmail: email,
        paymentMethod,
        couponCode: coupon?.code,
        notes,
      };

      const res = await api.createOrder(payload);
      clearCart();
      router.push(`/checkout/success?orderNumber=${res.order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Failed to process order. Please check availability.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-display font-bold text-ink mb-2">Nothing to Checkout</h2>
          <p className="text-sm text-ink-soft mb-6">Your shopping bag is currently empty.</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-ink text-canvas hover:bg-ink/90 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2"
          >
            Explore Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-faint mb-8">
          <Link href="/cart" className="hover:text-ink transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3" /> Return to Bag
          </Link>
          <span>/</span>
          <span className="text-ink">Secure Checkout</span>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Customer Information & Delivery Address Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Details */}
            <div className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-ink">1. Contact Information</h3>
                {!user && (
                  <Link href="/login" className="text-xs font-mono text-accent hover:underline">
                    Have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Freja Lindqvist"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="freja@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 349-1029"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line space-y-4">
              <h3 className="text-lg font-display font-semibold text-ink">2. Shipping Destination</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="428 Elmwood Terrace"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-ink-soft">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Portland"
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-ink-soft">State / Region</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="OR"
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <label className="text-xs font-mono text-ink-soft">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="97201"
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-ink-soft">Country / Territory *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-line text-sm text-ink outline-none focus:border-ink/50"
                  >
                    <option value="India">India (IN)</option>
                    <option value="United States">United States (US)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                    <option value="Canada">Canada (CA)</option>
                    <option value="Australia">Australia (AU)</option>
                    <option value="Germany">Germany (DE)</option>
                    <option value="France">France (FR)</option>
                    <option value="Singapore">Singapore (SG)</option>
                    <option value="Japan">Japan (JP)</option>
                    <option value="Netherlands">Netherlands (NL)</option>
                    <option value="Worldwide">Other / Worldwide Destination</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="tile rounded-[28px] p-6 sm:p-8 bg-card border border-line space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-ink">3. Payment Method</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-sand text-ink text-[11px] font-mono flex items-center gap-1">
                  <Lock className="size-3 text-ink-soft" /> 256-bit Encrypted
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === "upi"
                      ? "border-ink bg-canvas ring-1 ring-ink"
                      : "border-line bg-canvas/40 hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-ink">UPI</span>
                    <Smartphone className="size-4 text-ink-soft" />
                  </div>
                  <span className="text-[10px] text-ink-faint">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === "card"
                      ? "border-ink bg-canvas ring-1 ring-ink"
                      : "border-line bg-canvas/40 hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-ink">Cards</span>
                    <CreditCard className="size-4 text-ink-soft" />
                  </div>
                  <span className="text-[10px] text-ink-faint">Visa, Master, RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-ink bg-canvas ring-1 ring-ink"
                      : "border-line bg-canvas/40 hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-ink">Net Banking</span>
                    <Building2 className="size-4 text-ink-soft" />
                  </div>
                  <span className="text-[10px] text-ink-faint">All Major Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === "cod"
                      ? "border-ink bg-canvas ring-1 ring-ink"
                      : "border-line bg-canvas/40 hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-ink">COD</span>
                    <Truck className="size-4 text-ink-soft" />
                  </div>
                  <span className="text-[10px] text-ink-faint">Pay upon delivery</span>
                </button>
              </div>

              {/* UPI Details */}
              {paymentMethod === "upi" && (
                <div className="p-4 rounded-2xl bg-canvas/60 border border-line/60 space-y-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-ink-soft">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank or mobile@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none focus:border-ink/50"
                    />
                  </div>
                  <p className="text-[11px] text-ink-faint flex items-center gap-1.5">
                    <Smartphone className="size-3 text-ink-soft" />
                    Accepts Google Pay, PhonePe, Paytm, BHIM, and all UPI-enabled banking apps.
                  </p>
                </div>
              )}

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="p-4 rounded-2xl bg-canvas/60 border border-line/60 space-y-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-ink-soft">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none focus:border-ink/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-ink-soft">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name as printed on card"
                      className="w-full px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none focus:border-ink/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-ink-soft">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none focus:border-ink/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-ink-soft">CVV / Security Code</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none focus:border-ink/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Details */}
              {paymentMethod === "netbanking" && (
                <div className="p-4 rounded-2xl bg-canvas/60 border border-line/60 space-y-3 mt-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-ink-soft">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-line text-xs font-mono text-ink outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Other Bank">Other / International Net Banking</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-ink-faint">
                    You will be directed to your bank's secure portal for instant two-factor authentication.
                  </p>
                </div>
              )}

              {/* Cash on Delivery Details */}
              {paymentMethod === "cod" && (
                <div className="p-4 rounded-2xl bg-canvas/60 border border-line/60 space-y-2 mt-4 text-xs font-mono text-ink-soft">
                  <p className="font-medium text-ink">Cash / UPI on Scheduled Delivery</p>
                  <p className="text-[11px] text-ink-faint">
                    Pay via Cash, UPI QR code, or card machine when your curated piece arrives at your doorstep.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="tile rounded-[28px] p-6 bg-card border border-line space-y-5">
              <h3 className="text-lg font-display font-semibold text-ink">Order Summary</h3>

              {/* Items Snapshot */}
              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-line/40">
                {items.map((it) => (
                  <div key={`${it.productId}-${it.finishName}`} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-14 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                        <img src={it.image} alt={it.name} className="size-full object-cover" />
                      </div>
                      <div className="text-xs">
                        <p className="font-medium text-ink line-clamp-1">{it.name}</p>
                        <p className="text-ink-soft text-[11px] font-mono">{it.finishName} × {it.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-ink tabular shrink-0">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-2 text-xs font-mono text-ink-soft pt-3 border-t border-line/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ink tabular">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-ok">
                    <span>Discount ({coupon?.code})</span>
                    <span className="tabular">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ink tabular">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-display font-semibold text-ink pt-3 border-t border-line">
                  <span>Total Amount</span>
                  <span className="tabular">{formatPrice(total)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50 font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Verifying Stock & Authorizing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" /> Place Order · {formatPrice(total)}
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-ink-faint">
                By placing your order, you agree to Kartly's terms of slow living craft and return guidelines.
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
