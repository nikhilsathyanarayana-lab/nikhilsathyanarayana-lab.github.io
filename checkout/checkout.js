(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var form = document.getElementById('checkout-form');
  var layout = document.querySelector('.checkout-layout');
  var confirmation = document.getElementById('confirmation');
  var completedSteps = {};
  var fieldsByStep = {
    1: ['email'],
    2: ['organisation', 'firstName', 'lastName', 'phone', 'address1', 'city', 'country', 'postcode'],
    3: ['cardName', 'cardNumber', 'expiry', 'cvc'],
  };

  function getField(name) {
    return form.elements.namedItem(name);
  }

  function setFieldError(field, message) {
    var wrapper = field.closest('.field');
    var error = wrapper.querySelector('.field-error');
    wrapper.classList.toggle('has-error', Boolean(message));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message || '';
  }

  function validateField(field) {
    var value = field.value.trim();
    var message = '';

    if (field.required && !value) {
      message = 'This field is required';
    } else if (field.name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      message = 'Enter a valid email address';
    } else if (field.name === 'phone' && value.replace(/\D/g, '').length < 7) {
      message = 'Enter a valid phone number';
    } else if (field.name === 'cardNumber' && value.replace(/\s/g, '').length !== 16) {
      message = 'Enter a 16-digit card number';
    } else if (field.name === 'expiry' && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      message = 'Use MM/YY format';
    } else if (field.name === 'cvc' && !/^\d{3,4}$/.test(value)) {
      message = 'Enter 3 or 4 digits';
    }

    setFieldError(field, message);
    return !message;
  }

  function validateStep(stepNumber) {
    var fields = fieldsByStep[stepNumber].map(getField);
    var isValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      var firstInvalid = fields.find(function (field) {
        return field.getAttribute('aria-invalid') === 'true';
      });
      if (firstInvalid) firstInvalid.focus();
    }

    return isValid;
  }

  function stepSummary(stepNumber) {
    if (stepNumber === 1) return getField('email').value.trim();
    if (stepNumber === 2) {
      return [
        getField('organisation').value.trim(),
        getField('city').value.trim() + ', ' + getField('country').value,
      ].join(' · ');
    }
    return '';
  }

  function showStep(stepNumber) {
    document.querySelectorAll('.checkout-step').forEach(function (step) {
      var number = Number(step.dataset.step);
      var isOpen = number === stepNumber;
      var content = step.querySelector('.step-content');
      var summary = step.querySelector('.step-summary');
      var editButton = step.querySelector('.edit-button');

      step.classList.toggle('is-open', isOpen);
      if (content) content.hidden = !isOpen;

      if (summary) {
        summary.textContent = completedSteps[number] ? stepSummary(number) : '';
      }

      if (editButton) {
        editButton.hidden = !completedSteps[number] || isOpen;
      }
    });
  }

  function continueFrom(stepNumber) {
    if (!validateStep(stepNumber)) return;
    completedSteps[stepNumber] = true;
    showStep(stepNumber + 1);
  }

  document.querySelectorAll('[data-continue]').forEach(function (button) {
    button.addEventListener('click', function () {
      continueFrom(Number(button.dataset.continue));
    });
  });

  document.querySelectorAll('[data-edit]').forEach(function (button) {
    button.addEventListener('click', function () {
      showStep(Number(button.dataset.edit));
    });
  });

  form.addEventListener('input', function (event) {
    var field = event.target;

    if (field.name === 'cardNumber') {
      field.value = field.value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
    }

    if (field.name === 'expiry') {
      var digits = field.value.replace(/\D/g, '').slice(0, 4);
      field.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    }

    if (field.name === 'cvc') {
      field.value = field.value.replace(/\D/g, '').slice(0, 4);
    }

    if (field.closest('.field')) setFieldError(field, '');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validateStep(3)) return;

    var payButton = form.querySelector('.pay-button');
    payButton.disabled = true;
    payButton.textContent = 'Processing…';

    window.setTimeout(function () {
      document.querySelector('[data-confirmation-name]').textContent = getField('firstName').value.trim();
      document.querySelector('[data-confirmation-email]').textContent = getField('email').value.trim();
      document.querySelector('[data-confirmation-address]').textContent = [
        getField('address1').value.trim(),
        getField('city').value.trim(),
        getField('postcode').value.trim(),
      ].join(', ');
      layout.hidden = true;
      confirmation.hidden = false;
      window.scrollTo(0, 0);
    }, 700);
  });

  showStep(1);
})();
