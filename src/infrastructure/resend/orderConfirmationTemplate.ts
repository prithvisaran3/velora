import { Order } from "@/model/domain/types";

export function generateOrderConfirmationEmailHtml(order: Order): string {
  const item = order.items[0];
  const itemTitle = item ? item.title.en : "Handpicked Saree";
  const formattedAmount = `₹${(order.totals.totalInPaise / 100).toLocaleString("en-IN")}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #EDE2CE; color: #241F1C; margin: 0; padding: 32px 16px; }
    .container { max-width: 600px; margin: 0 auto; background: #FBF6EC; border: 1px solid rgba(36,31,28,0.15); padding: 32px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-text { font-size: 28px; font-weight: bold; letter-spacing: 0.28em; color: #241F1C; }
    .logo-sub { font-size: 8px; letter-spacing: 0.34em; color: #C6521A; text-transform: uppercase; margin-top: 4px; }
    .divider { height: 1px; background: #F5A623; margin: 24px 0; }
    .h1 { font-size: 24px; font-weight: normal; margin-bottom: 12px; }
    .p { font-size: 14px; line-height: 1.6; color: rgba(36,31,28,0.8); margin-bottom: 16px; }
    .spec-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .spec-table td { padding: 10px 0; border-bottom: 1px solid rgba(36,31,28,0.1); font-size: 13px; }
    .spec-table td.label { color: rgba(36,31,28,0.6); text-transform: uppercase; letter-spacing: 0.15em; font-size: 10px; }
    .footer { text-align: center; font-size: 11px; color: rgba(36,31,28,0.6); margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-text">ELORA</div>
      <div class="logo-sub">BY PRIYA MAHADEVAN · ERODE</div>
    </div>
    
    <div class="divider"></div>

    <div class="h1">Order Confirmed — ${order.reference}</div>
    <p class="p">Dear ${order.customer.name}, thank you for choosing Velora. Your handpicked saree is being prepared for dispatch at our Erode house.</p>

    <table class="spec-table">
      <tr>
        <td class="label">ORDER REF</td>
        <td style="font-weight: bold; color: #C6521A;">${order.reference}</td>
      </tr>
      <tr>
        <td class="label">ITEM</td>
        <td>${itemTitle}</td>
      </tr>
      <tr>
        <td class="label">TOTAL AMOUNT</td>
        <td style="font-weight: bold;">${formattedAmount} (INCL. GST)</td>
      </tr>
      <tr>
        <td class="label">PAYMENT METHOD</td>
        <td style="text-transform: uppercase;">${order.payment.method}</td>
      </tr>
      <tr>
        <td class="label">DELIVERY TO</td>
        <td>${order.address.line1}, ${order.address.city}, ${order.address.state} — ${order.address.pincode}</td>
      </tr>
    </table>

    <div class="divider"></div>

    <p class="p">You can track your order delivery status anytime at: <br>
      <a href="https://velora-storefront.vercel.app/track/${order.reference}" style="color: #C6521A; font-weight: bold;">https://velora-storefront.vercel.app/track/${order.reference}</a>
    </p>

    <div class="footer">
      Velora · Erode, Tamil Nadu · ஈரோடு · 1977 முதல்<br>
      Need help? <a href="https://wa.me/919876543210" style="color: #12514E;">Ask on WhatsApp</a>
    </div>
  </div>
</body>
</html>
  `;
}
