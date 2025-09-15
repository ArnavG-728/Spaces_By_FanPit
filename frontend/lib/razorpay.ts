
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async (
  orderId: string,
  amount: number,
  userDetails: { name: string; email: string },
  onPaymentSuccess: (response: any) => void,
  onPaymentError: (error: any) => void
) => {
  const res = await initializeRazorpay();
  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    amount: amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    name: 'Spaces By FanPit',
    description: 'Space Booking Transaction',
    order_id: orderId,
    handler: function (response: any) {
      onPaymentSuccess(response);
    },
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
    },
    theme: {
      color: '#3B82F6',
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.on('payment.failed', function (response: any) {
    onPaymentError(response.error);
  });
  paymentObject.open();
};
