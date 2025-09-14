import { paymentsAPI } from './api';

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

export const processPayment = async (bookingId: string, amount: number, userDetails: any) => {
  try {
    // Initialize Razorpay
    const res = await initializeRazorpay();
    if (!res) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order
    const orderResponse = await paymentsAPI.createOrder({ bookingId, amount });
    const { id: order_id, currency } = orderResponse.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
      amount: amount * 100,
      currency,
      name: 'Spaces By FanPit',
      description: 'Space Booking Payment',
      order_id,
      handler: async function (response: any) {
        try {
          const verifyResponse = await paymentsAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          if (verifyResponse.data.status === 'success') {
            return { success: true, paymentId: response.razorpay_payment_id };
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          throw new Error('Payment verification failed');
        }
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
    paymentObject.open();

    return new Promise((resolve, reject) => {
      paymentObject.on('payment.success', (response: any) => {
        resolve({ success: true, response });
      });
      paymentObject.on('payment.error', (error: any) => {
        reject({ success: false, error });
      });
    });
  } catch (error) {
    throw error;
  }
};
