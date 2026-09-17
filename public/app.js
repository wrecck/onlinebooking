'use strict';

const state = {
  services: [],
  selectedService: null,
  selectedTime: null,
};

const els = {
  services: document.getElementById('services'),
  slots: document.getElementById('slots'),
  date: document.getElementById('date'),
  form: document.getElementById('booking-form'),
  name: document.getElementById('customerName'),
  email: document.getElementById('customerEmail'),
  summary: document.getElementById('summary'),
  confirm: document.getElementById('confirm-btn'),
  message: document.getElementById('form-message'),
  bookings: document.getElementById('bookings'),
};

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

async function api(path, options) {
  const res = await fetch(path, options);
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error((body && body.error) || `Request failed (${res.status})`);
  }
  return body;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function loadServices() {
  state.services = await api('/api/services');
  els.services.innerHTML = '';
  state.services.forEach((service) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'service-card';
    card.dataset.id = service.id;
    card.innerHTML = `
      <div class="name"><span>${service.name}</span><span>${money(service.price_cents)}</span></div>
      <div class="desc">${service.description}</div>
      <div class="meta">${service.duration_minutes} min</div>`;
    card.addEventListener('click', () => selectService(service, card));
    els.services.appendChild(card);
  });
}

function selectService(service, card) {
  state.selectedService = service;
  state.selectedTime = null;
  document
    .querySelectorAll('.service-card')
    .forEach((c) => c.classList.toggle('selected', c === card));
  loadSlots();
  updateSummary();
}

async function loadSlots() {
  const service = state.selectedService;
  const date = els.date.value;
  if (!service || !date) {
    els.slots.innerHTML =
      '<p class="muted">Select a service and date to see available times.</p>';
    return;
  }
  els.slots.innerHTML = '<p class="muted">Loading…</p>';
  try {
    const data = await api(`/api/services/${service.id}/slots?date=${date}`);
    els.slots.innerHTML = '';
    data.slots.forEach(({ time, available }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.textContent = time;
      btn.disabled = !available;
      btn.addEventListener('click', () => {
        state.selectedTime = time;
        document
          .querySelectorAll('.slot')
          .forEach((s) => s.classList.toggle('selected', s === btn));
        updateSummary();
      });
      els.slots.appendChild(btn);
    });
  } catch (err) {
    els.slots.innerHTML = `<p class="muted">${err.message}</p>`;
  }
}

function updateSummary() {
  const { selectedService, selectedTime } = state;
  const date = els.date.value;
  if (selectedService && selectedTime && date) {
    els.summary.textContent = `${selectedService.name} · ${date} at ${selectedTime} · ${money(
      selectedService.price_cents
    )}`;
    els.summary.classList.add('ready');
    els.confirm.disabled = false;
  } else {
    els.summary.textContent = 'No time selected yet.';
    els.summary.classList.remove('ready');
    els.confirm.disabled = true;
  }
}

async function loadBookings() {
  const bookings = await api('/api/bookings');
  els.bookings.innerHTML = '';
  if (bookings.length === 0) {
    els.bookings.innerHTML = '<li class="muted">No bookings yet.</li>';
    return;
  }
  bookings.forEach((b) => {
    const li = document.createElement('li');
    li.className = 'booking-item';
    li.innerHTML = `
      <div>
        <div><strong>${b.service_name}</strong> — ${b.customer_name}</div>
        <div class="when">${b.date} at ${b.time}</div>
      </div>`;
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', async () => {
      await api(`/api/bookings/${b.id}`, { method: 'DELETE' });
      await Promise.all([loadBookings(), loadSlots()]);
    });
    li.appendChild(cancel);
    els.bookings.appendChild(li);
  });
}

els.date.addEventListener('change', () => {
  state.selectedTime = null;
  loadSlots();
  updateSummary();
});

els.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  els.message.textContent = '';
  els.message.className = 'form-message';
  try {
    const payload = {
      serviceId: state.selectedService.id,
      customerName: els.name.value.trim(),
      customerEmail: els.email.value.trim(),
      date: els.date.value,
      time: state.selectedTime,
    };
    await api('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    els.message.textContent = 'Booking confirmed! See it below.';
    els.message.classList.add('ok');
    els.form.reset();
    state.selectedTime = null;
    updateSummary();
    await Promise.all([loadBookings(), loadSlots()]);
  } catch (err) {
    els.message.textContent = err.message;
    els.message.classList.add('error');
  }
});

async function init() {
  els.date.value = todayISO();
  els.date.min = todayISO();
  await Promise.all([loadServices(), loadBookings()]);
}

init();
