import React, { useState } from 'react';
import { Icon } from 'antd';

import './checkout.scss';

const initialFields = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postcode: '',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const fieldLabels = {
  email: 'Email address',
  firstName: 'First name',
  lastName: 'Last name',
  address: 'Street address',
  city: 'City',
  postcode: 'Postcode',
  cardName: 'Name on card',
  cardNumber: 'Card number',
  expiry: 'Expiry date',
  cvc: 'Security code',
};

const Checkout = () => {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [delivery, setDelivery] = useState('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === 'cardNumber') {
      nextValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
    }

    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }

    if (name === 'cvc') {
      nextValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFields({ ...fields, [name]: nextValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const nextErrors = {};

    Object.keys(initialFields).forEach((field) => {
      if (!fields[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required`;
      }
    });

    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (fields.cardNumber && fields.cardNumber.replace(/\s/g, '').length < 16) {
      nextErrors.cardNumber = 'Enter a 16-digit card number';
    }

    if (fields.expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) {
      nextErrors.expiry = 'Use MM/YY format';
    }

    if (fields.cvc && fields.cvc.length < 3) {
      nextErrors.cvc = 'Enter 3 or 4 digits';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstInvalidName = Object.keys(nextErrors)[0];
      const firstInvalidField = document.querySelector(`[name="${firstInvalidName}"]`);
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      window.scrollTo(0, 0);
    }, 700);
  };

  const renderField = ({ name, label, type = 'text', autoComplete, placeholder, wide, inputMode }) => (
    <label className={`checkout-field${wide ? ' checkout-field-wide' : ''}${errors[name] ? ' checkout-field-error' : ''}`}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={fields[name]}
        onChange={updateField}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && <small id={`${name}-error`}>{errors[name]}</small>}
    </label>
  );

  if (isComplete) {
    return (
      <div className="checkout-page checkout-complete-page">
        <header className="checkout-header">
          <a className="checkout-brand" href="/" aria-label="Pizza CRM home">
            <img src="/images/pizza-logo.png" alt="" />
            <span><strong>pizza</strong>shop</span>
          </a>
          <div className="checkout-secure"><Icon type="lock" /> Secure checkout</div>
        </header>
        <main className="checkout-confirmation">
          <div className="checkout-confirmation-icon"><Icon type="check" /></div>
          <span className="checkout-eyebrow">Order #PZ-2048</span>
          <h1>Thanks, {fields.firstName}!</h1>
          <p>Your pizza is in the oven. We sent a confirmation to <strong>{fields.email}</strong>.</p>
          <div className="checkout-confirmation-details">
            <div>
              <span>Estimated delivery</span>
              <strong>{delivery === 'express' ? '25–35 minutes' : '35–45 minutes'}</strong>
            </div>
            <div>
              <span>Delivery address</span>
              <strong>{fields.address}, {fields.city}, {fields.postcode}</strong>
            </div>
          </div>
          <a className="checkout-home-button" href="/">Return to home</a>
        </main>
      </div>
    );
  }

  const total = delivery === 'express' ? '23.50' : '20.50';

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <a className="checkout-brand" href="/" aria-label="Pizza CRM home">
          <img src="/images/pizza-logo.png" alt="" />
          <span><strong>pizza</strong>shop</span>
        </a>
        <div className="checkout-secure"><Icon type="lock" /> Secure checkout</div>
      </header>

      <main className="checkout-shell">
        <section className="checkout-form-column">
          <a className="checkout-back" href="/"><Icon type="left" /> Back to shop</a>
          <h1>Checkout</h1>

          <form id="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-section">
              <div className="checkout-section-heading">
                <span>1</span>
                <div>
                  <h2>Contact information</h2>
                  <p>We’ll send your receipt and delivery updates here.</p>
                </div>
              </div>
              {renderField({ name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'you@example.com', wide: true })}
            </div>

            <div className="checkout-section">
              <div className="checkout-section-heading">
                <span>2</span>
                <div>
                  <h2>Delivery details</h2>
                  <p>Where and when should we bring your order?</p>
                </div>
              </div>
              <div className="checkout-fields">
                {renderField({ name: 'firstName', label: 'First name', autoComplete: 'given-name' })}
                {renderField({ name: 'lastName', label: 'Last name', autoComplete: 'family-name' })}
                {renderField({ name: 'address', label: 'Street address', autoComplete: 'street-address', wide: true })}
                {renderField({ name: 'city', label: 'City', autoComplete: 'address-level2' })}
                {renderField({ name: 'postcode', label: 'Postcode', autoComplete: 'postal-code' })}
              </div>

              <fieldset className="checkout-delivery-options">
                <legend>Delivery speed</legend>
                <label className={delivery === 'standard' ? 'selected' : ''}>
                  <input type="radio" name="delivery" value="standard" checked={delivery === 'standard'} onChange={(event) => setDelivery(event.target.value)} />
                  <span><strong>Standard delivery</strong><small>35–45 minutes</small></span>
                  <strong>£2.50</strong>
                </label>
                <label className={delivery === 'express' ? 'selected' : ''}>
                  <input type="radio" name="delivery" value="express" checked={delivery === 'express'} onChange={(event) => setDelivery(event.target.value)} />
                  <span><strong>Express delivery</strong><small>25–35 minutes</small></span>
                  <strong>£5.50</strong>
                </label>
              </fieldset>
            </div>

            <div className="checkout-section">
              <div className="checkout-section-heading">
                <span>3</span>
                <div>
                  <h2>Payment</h2>
                  <p>This demo does not process or store card details.</p>
                </div>
              </div>
              <div className="checkout-payment-card">
                <div className="checkout-payment-title">
                  <span><Icon type="credit-card" /> Credit or debit card</span>
                  <span className="checkout-card-brands">VISA&nbsp;&nbsp; MC</span>
                </div>
                <div className="checkout-fields">
                  {renderField({ name: 'cardName', label: 'Name on card', autoComplete: 'cc-name', wide: true })}
                  {renderField({ name: 'cardNumber', label: 'Card number', autoComplete: 'cc-number', placeholder: '0000 0000 0000 0000', inputMode: 'numeric', wide: true })}
                  {renderField({ name: 'expiry', label: 'Expiry date', autoComplete: 'cc-exp', placeholder: 'MM/YY', inputMode: 'numeric' })}
                  {renderField({ name: 'cvc', label: 'Security code', autoComplete: 'cc-csc', placeholder: 'CVC', inputMode: 'numeric' })}
                </div>
              </div>
            </div>
          </form>
        </section>

        <aside className="checkout-summary">
          <div className="checkout-summary-card">
            <h2>Your order</h2>
            <div className="checkout-product">
              <div className="checkout-product-image" aria-hidden="true">🍕</div>
              <div className="checkout-product-copy">
                <strong>The Team Favourite</strong>
                <span>Large · Classic crust</span>
                <span>Quantity: 1</span>
              </div>
              <strong>£18.00</strong>
            </div>
            <div className="checkout-totals">
              <div><span>Subtotal</span><span>£18.00</span></div>
              <div><span>{delivery === 'express' ? 'Express delivery' : 'Delivery'}</span><span>{delivery === 'express' ? '£5.50' : '£2.50'}</span></div>
              <div className="checkout-total"><span>Total</span><span>£{total}</span></div>
            </div>
            <button className="checkout-submit" type="submit" form="checkout-form" disabled={isSubmitting}>
              {isSubmitting ? <React.Fragment><Icon type="loading" /> Processing</React.Fragment> : `Pay £${total}`}
            </button>
            <p className="checkout-terms">By placing your order, you agree to our terms of service.</p>
            <p className="checkout-guarantee"><Icon type="safety-certificate" /> Secure payment · Freshness guaranteed</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
