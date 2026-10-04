import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default function AdminOrderDetailPage({ params }) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  return (
    <main className="px-5 sm:px-8 py-10 max-w-[1000px] mx-auto">
      <Link href="/admin/orders" className="font-mono text-xs uppercase tracking-wider text-ink/50 hover:text-ink">
        ← Back to orders
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4 mt-4 mb-10">
        <div>
          <span className="eyebrow">Order</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-1">{order.id}</h1>
          <p className="font-mono text-xs text-ink/50 mt-2">
            Placed {new Date(order.createdAt).toLocaleString()} · {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="border border-line bg-paper p-6">
            <span className="eyebrow block mb-4">Items</span>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b border-dashed border-line pb-3 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full flex-none" style={{ background: item.hex }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="font-mono text-xs text-ink/50">
                      {item.size} × {item.qty}
                      {item.customSignature ? " · custom design" : ""}
                    </p>
                  </div>
                  <span className="font-mono text-sm">৳{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-line bg-paper p-6">
            <span className="eyebrow block mb-4">Shipping address</span>
            <p className="text-sm font-semibold mb-1">{order.shipping.name}</p>
            <p className="text-sm text-ink/70">{order.shipping.phone}</p>
            <p className="text-sm text-ink/70 mt-2">
              {order.shipping.address}, {order.shipping.city}
            </p>
            {order.shipping.note && (
              <p className="font-mono text-xs text-ink/50 mt-3 pt-3 border-t border-dashed border-line">
                Note: {order.shipping.note}
              </p>
            )}
          </div>
        </div>

        <div className="border border-line bg-paper p-6 h-fit">
          <span className="eyebrow block mb-4">Payment summary</span>
          <div className="space-y-1.5 font-mono text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-cobalt">
                <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
                <span>−৳{order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : `৳${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-line mt-2">
              <span>Total</span>
              <span>৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
