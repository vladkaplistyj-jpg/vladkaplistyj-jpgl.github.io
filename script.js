document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header scroll state (only matters where header starts transparent) ---- */
  const header = document.getElementById('siteHeader');
  if(header && header.classList.contains('transparent')){
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---- Mobile nav toggle ---- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if(toggle && nav){
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---- Gallery filters ---- */
  const filterBtns = document.querySelectorAll('.gallery-filters button');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---- Gallery lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  if(lightbox){
    const lbTitle = lightbox.querySelector('.lb-title');
    const lbDesc = lightbox.querySelector('.lb-desc');
    const lbIcon = lightbox.querySelector('.lb-icon');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        lbTitle.textContent = item.dataset.title || '';
        lbDesc.textContent = item.dataset.desc || '';
        lbIcon.innerHTML = item.querySelector('svg') ? item.querySelector('svg').innerHTML : '';
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
  }

  /* ---- Booking form ---- */
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    const guestsCount = document.getElementById('guestsCount');
    const guestsMinus = document.getElementById('guestsMinus');
    const guestsPlus = document.getElementById('guestsPlus');
    if(guestsMinus && guestsPlus && guestsCount){
      guestsMinus.addEventListener('click', () => {
        let v = parseInt(guestsCount.textContent, 10);
        if(v > 1) guestsCount.textContent = v - 1;
      });
      guestsPlus.addEventListener('click', () => {
        let v = parseInt(guestsCount.textContent, 10);
        if(v < 8) guestsCount.textContent = v + 1;
      });
    }

    /* Show/hide time field depending on service type */
    const serviceSelect = document.getElementById('serviceType');
    const timeField = document.getElementById('timeField');
    const checkoutField = document.getElementById('checkoutField');
    function syncFields(){
      const needsTime = ['dining', 'spa', 'conference'].includes(serviceSelect.value);
      const needsStay = ['boulevard', 'deluxe', 'apartment'].includes(serviceSelect.value);
      timeField.style.display = needsTime ? 'flex' : 'none';
      checkoutField.style.display = needsStay ? 'flex' : 'none';
    }
    if(serviceSelect){
      serviceSelect.addEventListener('change', syncFields);
      syncFields();
    }

    const resultPanel = document.getElementById('resultPanel');
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('checkinDate').value;
      const service = serviceSelect.value;
      const guests = guestsCount.textContent;

      if(!date){
        resultPanel.className = 'result-panel unavailable show';
        resultPanel.innerHTML = '<h4>Select a date</h4><p>Choose a date to check availability.</p>';
        return;
      }

      /* Deterministic demo logic: turns a date + service into a repeatable
         available / not-available result, so the same query always gives
         the same answer without needing a real backend. */
      const seed = date.split('-').reduce((a, b) => a + parseInt(b, 10), 0) + service.length;
      const isAvailable = seed % 3 !== 0;

      const niceDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
      const serviceNames = {
        boulevard:'Boulevard Room', deluxe:'Deluxe Suite', apartment:'The Aurelia Apartment',
        dining:'Malinowa Room dinner table', spa:'Spa treatment', conference:'Conference room'
      };
      const label = serviceNames[service] || 'Reservation';

      if(isAvailable){
        resultPanel.className = 'result-panel available show';
        resultPanel.innerHTML = `<h4>Available for ${guests} ${guests==1?'guest':'guests'}</h4>
          <p>${label} is open on ${niceDate}. A member of the front desk will confirm final pricing by email within a few hours.</p>
          <a href="#" class="btn btn-solid" style="margin-top:16px;">Confirm Request</a>`;
      } else {
        const d = new Date(date + 'T00:00:00');
        const alt1 = new Date(d); alt1.setDate(d.getDate() + 1);
        const alt2 = new Date(d); alt2.setDate(d.getDate() + 3);
        const fmt = (dt) => dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
        resultPanel.className = 'result-panel unavailable show';
        resultPanel.innerHTML = `<h4>Fully booked on this date</h4>
          <p>${label} has no openings on ${niceDate}. Nearby dates with availability:</p>
          <div class="alt-dates"><span>${fmt(alt1)}</span><span>${fmt(alt2)}</span></div>`;
      }
    });
  }
});
