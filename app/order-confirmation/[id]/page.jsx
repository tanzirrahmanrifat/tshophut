import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db";

export default function OrderConfirmationPage({ params }) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  return (
    <main className="max-w-[720px] mx-auto px-5 sm:px-7 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-cobalt text-white flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="eyebrow">Order confirmed</span>
      <h1 className="font-display text-3xl sm:text-4xl mt-2 mb-3">Thanks, {order.shipping.name.split(" ")[0]}.</h1>
      <p className="text-ink/70 mb-10">
        Order <b className="font-mono">{order.id}</b> is confirmed for Cash on Delivery.
        We&apos;ll call {order.shipping.phone} before it ships.
      </p>

      <div className="bg-paper border border-line p-6 text-left mb-8">
        <span className="eyebrow block mb-4">Order summary</span>
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.name} <span className="text-ink/45">({item.size}) × {item.qty}</span>
              </span>
              <span className="font-mono">৳{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <hr className="border-line mb-3" />
        <div className="flex justify-between font-mono text-sm mb-1">
          <span>Subtotal</span>
          <span>৳{order.subtotal.toLocaleString()}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between font-mono text-sm mb-1 text-cobalt">
            <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
            <span>−৳{order.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-mono text-sm mb-1">
          <span>Shipping</span>
          <span>{order.shippingFee === 0 ? "Free" : `৳${order.shippingFee}`}</span>
        </div>
        <div className="flex justify-between font-mono text-base font-bold">
          <span>Total</span>
          <span>৳{order.total.toLocaleString()}</span>
        </div>
      </div>

      <Link href="/collections/tees" className="inline-block bg-ink text-canvas px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors">
        Keep shopping
      </Link>
    </main>
  );
}
