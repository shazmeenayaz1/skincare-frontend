import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const PaymentForm = ({ onPaymentSuccess, onError, loading, setLoading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    onError('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message || 'Payment failed. Please try again.');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      } else {
        onError('Payment was not completed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      onError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form id="stripe-payment-form" onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs'
        }}
      />
      <button type="submit" style={{ display: 'none' }} disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
};

const StripeCardPayment = ({ amount, email, onPaymentSuccess, onError, loading, setLoading }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const initStripe = async () => {
      try {
        setInitializing(true);
        setLoadError('');
        onError('');

        const configRes = await api('/stripe/config');
        const publishableKey =
          configRes.publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
          throw new Error('Stripe is not configured. Please contact support.');
        }

        const stripe = await loadStripe(publishableKey);
        if (cancelled) return;
        setStripePromise(stripe);

        const intentRes = await api('/stripe/create-payment-intent', {
          method: 'POST',
          body: { amount, email: email || undefined }
        });

        if (cancelled) return;

        if (!intentRes.clientSecret) {
          throw new Error('Failed to initialize payment.');
        }

        setClientSecret(intentRes.clientSecret);
      } catch (err) {
        const message = err.message || 'Failed to load payment form.';
        if (!cancelled) {
          setLoadError(message);
          onError(message);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    if (amount > 0) {
      initStripe();
    } else {
      setInitializing(false);
      setLoadError('Order total must be greater than zero.');
    }

    return () => {
      cancelled = true;
    };
  }, [amount]);

  if (initializing) {
    return (
      <div className="stripe-loading">
        <Loader2 size={20} className="animate-spin" />
        <span>Loading secure payment form...</span>
      </div>
    );
  }

  if (loadError || !clientSecret || !stripePromise) {
    return (
      <div className="stripe-error">
        <p>{loadError || 'Unable to load payment form.'}</p>
        <button
          type="button"
          className="stripe-retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#d4a574',
            borderRadius: '8px'
          }
        }
      }}
    >
      <PaymentForm
        onPaymentSuccess={onPaymentSuccess}
        onError={onError}
        loading={loading}
        setLoading={setLoading}
      />
    </Elements>
  );
};

export default StripeCardPayment;
