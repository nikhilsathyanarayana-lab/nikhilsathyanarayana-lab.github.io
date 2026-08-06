import React, { useState } from 'react';
import { Icon } from 'antd';

import './checkout.scss';

const initialFields = {
  email: '',
  organisation: '',
  firstName: '',
  lastName: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const fieldLabels = {
  email: 'Email address',
  organisation: 'Organisation',
  firstName: 'First Name',
  lastName: 'Last Name',
  phone: 'Phone Number',
  address1: 'Address line 1',
  city: 'City',
  postcode: 'Postcode',
  country: 'Country',
  cardName: 'Name on card',
  cardNumber: 'Card number',
  expiry: 'Expiry date',
  cvc: 'Security code',
};

const stepFields = {
  1: ['email'],
  2: ['organisation', 'firstName', 'lastName', 'phone', 'address1', 'city', 'country', 'postcode'],
  3: ['cardName', 'cardNumber', 'expiry', 'cvc'],
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === 'cardNumber') {
      nextValue = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }

    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      nextValue = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }

    if (name === 'cvc') {
      nextValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFields({ ...fields, [name]: nextValue });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const renderField = ({ name, label, type = 'text', autoComplete, placeholder, optional, inputMode }) => (
    <label className={`checkout-field${errors[name] ? ' checkout-field-error' : ''}`}>
      <span>{label}{optional ? '' : ' *'}</span>
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

  const validateStep = (step) => {
    const nextErrors = {};

    stepFields[step].forEach((name) => {
      if (!fields[name].trim()) nextErrors[name] = `${fieldLabels[name]} is required`;
    });

    if (step === 1 && fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (step === 3 && fields.cardNumber && fields.cardNumber.replace(/\s/g, '').length !== 16) {
      nextErrors.cardNumber = 'Enter a 16-digit card number';
    }

    if (step === 3 && fields.expiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) {
      nextErrors.expiry = 'Use MM/YY format';
    }

    if (step === 3 && fields.cvc && fields.cvc.length < 3) {
      nextErrors.cvc = 'Enter 3 or 4 digits';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstInvalid = document.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`);
      if (firstInvalid) firstInvalid.focus();
      return false;
    }

    return true;
  };

  const continueFrom = (step) => {
    if (!validateStep(step)) return;
    setCompletedSteps({ ...completedSteps, [step]: true });
    setActiveStep(step + 1);
  };

  const editStep = (step) => {
    setErrors({});
    setActiveStep(step);
  };

  const submitPayment = () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      window.scrollTo(0, 0);
    }, 700);
  };

  const getStepSummary = (step) => {
    if (step === 1) return fields.email;
    if (step === 2) return `${fields.organisation} · ${fields.city}, ${fields.country}`;
    return '';
  };

  const renderStepHeader = (number, title) => (
    <div className="checkout-step-header">
      <span className="checkout-step-number">{number}</span>
      <h2>{title}</h2>
      {completedSteps[number] && activeStep !== number && (
        <React.Fragment>
          <span className="checkout-step-summary">{getStepSummary(number)}</span>
          <button className="checkout-edit" type="button" onClick={() => editStep(number)}>Edit</button>
        </React.Fragment>
      )}
    </div>
  );

  if (isComplete) {
    return (
      <div className="checkout-page checkout-accordion-page">
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
            <div><span>Estimated delivery</span><strong>35–45 minutes</strong></div>
            <div><span>Billing address</span><strong>{fields.address1}, {fields.city}, {fields.postcode}</strong></div>
          </div>
          <a className="checkout-home-button" href="/">Return to home</a>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page checkout-accordion-page">
      <header className="checkout-header">
        <a className="checkout-brand" href="/" aria-label="Pizza CRM home">
          <img src="/images/pizza-logo.png" alt="" />
          <span><strong>pizza</strong>shop</span>
        </a>
        <div className="checkout-secure"><Icon type="lock" /> Secure checkout</div>
      </header>

      <main className="checkout-shell checkout-accordion-shell">
        <section className="checkout-form-column">
          <a className="checkout-back" href="/"><Icon type="left" /> Back to shop</a>
          <h1>Checkout</h1>

          <section className={`checkout-step-card${activeStep === 1 ? ' is-open' : ''}`}>
            {renderStepHeader(1, 'Customer')}
            {activeStep === 1 && (
              <div className="checkout-step-body">
                {renderField({ name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' })}
                <button className="checkout-continue" type="button" onClick={() => continueFrom(1)}>Continue</button>
              </div>
            )}
          </section>

          <section className={`checkout-step-card${activeStep === 2 ? ' is-open' : ''}`}>
            {renderStepHeader(2, 'Organisation')}
            {activeStep === 2 && (
              <div className="checkout-step-body">
                <div className="checkout-field-group">
                  {renderField({ name: 'organisation', label: 'Organisation', autoComplete: 'organization', placeholder: 'Pendo' })}
                </div>

                <h3>Billing Address</h3>
                <div className="checkout-fields checkout-organisation-fields">
                  {renderField({ name: 'firstName', label: 'First Name', autoComplete: 'given-name' })}
                  {renderField({ name: 'lastName', label: 'Last Name', autoComplete: 'family-name' })}
                  {renderField({ name: 'phone', label: 'Phone Number', autoComplete: 'tel', inputMode: 'tel' })}
                  {renderField({ name: 'address1', label: 'Address line 1', autoComplete: 'address-line1' })}
                  {renderField({ name: 'address2', label: 'Address line 2', autoComplete: 'address-line2', optional: true })}
                  {renderField({ name: 'city', label: 'City', autoComplete: 'address-level2' })}
                  <label className="checkout-field">
                    <span>Country *</span>
                    <select
                      name="country"
                      value={fields.country}
                      onChange={updateField}
                      autoComplete="country-name"
                      aria-invalid={Boolean(errors.country)}
                    >
                      <option>United Kingdom</option>
                      <option>Ireland</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </label>
                  {renderField({ name: 'postcode', label: 'Postcode', autoComplete: 'postal-code' })}
                </div>
                <button className="checkout-continue" type="button" onClick={() => continueFrom(2)}>Continue</button>
              </div>
            )}
          </section>

          <section className={`checkout-step-card${activeStep === 3 ? ' is-open' : ''}`}>
            {renderStepHeader(3, 'Payment')}
            {activeStep === 3 && (
              <div className="checkout-step-body">
                <p className="checkout-step-note">This demo does not process or store card details.</p>
                <div className="checkout-fields checkout-payment-fields">
                  {renderField({ name: 'cardName', label: 'Name on card', autoComplete: 'cc-name' })}
                  {renderField({ name: 'cardNumber', label: 'Card number', autoComplete: 'cc-number', placeholder: '0000 0000 0000 0000', inputMode: 'numeric' })}
                  {renderField({ name: 'expiry', label: 'Expiry date', autoComplete: 'cc-exp', placeholder: 'MM/YY', inputMode: 'numeric' })}
                  {renderField({ name: 'cvc', label: 'Security code', autoComplete: 'cc-csc', placeholder: 'CVC', inputMode: 'numeric' })}
                </div>
                <button className="checkout-continue checkout-pay" type="button" onClick={submitPayment} disabled={isSubmitting}>
                  {isSubmitting ? <React.Fragment><Icon type="loading" /> Processing</React.Fragment> : 'Pay £20.50'}
                </button>
              </div>
            )}
          </section>
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
              <div><span>Delivery</span><span>£2.50</span></div>
              <div className="checkout-total"><span>Total</span><span>£20.50</span></div>
            </div>
            <p className="checkout-guarantee"><Icon type="safety-certificate" /> Secure checkout</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;
