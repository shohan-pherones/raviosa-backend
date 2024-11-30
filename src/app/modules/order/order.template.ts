import env from "../../config/env";

export const getOrderConfirmTemplate = (
  name: string,
  orderId: string,
  email: string,
  phone: string,
  address: string,
  total: number,
  paymentMethod: string,
  fullOrderId: string
) => {
  return `<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .header {
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
      }
      .footer {
        text-align: center;
        font-size: 0.9em;
        color: #888;
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
      .button {
        display: inline-block;
        background-color: #ff6f61;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        margin: 10px 0;
        transition:
          background-color 0.3s ease,
          transform 0.2s ease;
      }

      .button:hover {
        background-color: #e65c55;
        transform: scale(1.05);
      }

      .button:active {
        background-color: #cc504c;
        transform: scale(0.95);
      }

      .button:visited {
        color: #fff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Order Confirmation</h1>
      </div>
      <p>Dear ${name},</p>
      <p>
        We are pleased to inform you that your recent order,
        <strong>${orderId}</strong>, has been confirmed! Your purchase is coming
        to you, and we’re excited for you to receive it.
      </p>
      <h3>Shipping Details:</h3>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Address: ${address}</p>
      <p>Total Price: $${total.toFixed(2)}</p>
      <p>Payment Method: ${paymentMethod}</p>
      <p>
        <b
          >You can track your order status by clicking the link below (you must
          be authenticated):</b
        >
      </p>
      <a href="${env.frontend_url}/orders/${fullOrderId}" class="button"
        >Track Your Order</a
      >
      <p>Thank you for choosing Raviosa!</p>
      <p>Warm regards,</p>
      <p><strong>Raviosa Team</strong></p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Raviosa. All Rights Reserved.
      </div>
    </div>
  </body>
</html>
`;
};
