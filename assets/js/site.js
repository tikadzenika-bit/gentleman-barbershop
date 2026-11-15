/* Gentleman Barbershop Tbilisi — მთავარი საიტის ლოგიკა.
   შინაარსი მოდის TBStore-დან (data.js), ინტერფეისის ტექსტები — TBI18n-დან (i18n.js). */
(function () {
  'use strict';

  var I = window.TBI18n, Store = window.TBStore, Time = window.TBTime;
  var t = I.t, c = I.c;
  var data = Store.load();
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function telHref(phone) { return 'tel:' + String(phone).replace(/[^\d+]/g, ''); }
  function waHref(text) {
    var num = String(data.business.whatsapp).replace(/\D/g, '');
    return 'https://wa.me/' + num + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  /* rating 4.6 -> the top layer of stars is clipped to 92% */
  function starsHtml(rating) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<svg aria-hidden="true"><use href="#i-star"/></svg>';
    var pct = Math.max(0, Math.min(100, (Number(rating) || 0) / 5 * 100));
    return '<span class="stars-base">' + s + '</span><span class="stars-fill" style="width:' + pct.toFixed(1) + '%">' + s + '</span>';
  }
  function todayHours() {
    var h = data.business.hours[Time.now().dow];
    return h && !h.closed ? h.open + '–' + h.close : '';
  }
  function dayLabel(date) {
    var p = date.split('-');
    var m = t('month.' + parseInt(p[1], 10)), d = parseInt(p[2], 10);
    return I.lang === 'en' ? m + ' ' + d : d + ' ' + m;
  }

  /* ---------- ინტერფეისის ტექსტები ---------- */
  function applyI18n() {
    document.documentElement.lang = I.lang;
    document.title = t('meta.title');
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.desc'));
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('.langs button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === I.lang)); });
    $('#f-name').placeholder = t('book.namePh');
    $('#f-phone').placeholder = t('book.phonePh');
    $('#hero-prev').setAttribute('aria-label', t('hero.prev'));
    $('#hero-next').setAttribute('aria-label', t('hero.next'));
    $('#gal-prev').setAttribute('aria-label', t('gallery.prev'));
    $('#gal-next').setAttribute('aria-label', t('gallery.next'));
    $('#lb-close').setAttribute('aria-label', t('gallery.close'));
    $('#score-stars').setAttribute('aria-label', t('reviews.stars', { r: Number(data.business.rating).toFixed(1) }));
    $('#c-map').setAttribute('title', t('contact.map'));
  }

  /* ---------- ღიაა ახლა / დაიხურა ---------- */
  function openText() {
    var s = Time.status(data.business.hours);
    if (s.open) return { open: true, text: t('open.now') + ' · ' + t('open.until', { t: s.until }) };
    var tail = '';
    if (s.next) {
      if (s.today) tail = t('open.opensToday', { t: s.next });
      else if (s.tomorrow) tail = t('open.opensTomorrow', { t: s.next });
      else tail = t('open.opensDay', { d: t('day.' + s.nextDow), t: s.next });
    }
    return { open: false, text: t('open.closed') + (tail ? ' · ' + tail : '') };
  }
  function renderOpen() {
    var o = openText();
    $$('[data-open-badge]').forEach(function (el) {
      el.textContent = o.text;
      el.classList.toggle('is-open', o.open);
    });
  }

  /* ---------- სლაიდერი ---------- */
  var slider = { i: 0, timer: null, playing: !reduceMotion, hold: false, DELAY: 6500 };

  function renderSlides() {
    var b = data.business, hours = todayHours();
    var html = data.slides.map(function (s, i) {
      var tag = 'h2';
      var title = esc(c(s.title).split('{hours}').join(hours));
      var text = esc(c(s.text)).split('{hours}').join(esc(hours));
      var extra = '';
      if (s.cta) {
        extra = '<div class="slide-actions"><a class="btn" href="#booking">' + esc(t('hero.book')) + '</a>' +
          '<a class="link-arrow" href="#services">' + esc(t('hero.prices')) + '</a></div>';
      } else if (s.badge === 'rating') {
        extra = '<div class="slide-meta"><span class="stars" role="img" aria-label="' + esc(t('reviews.stars', { r: Number(b.rating).toFixed(1) })) + '">' + starsHtml(b.rating) + '</span>' +
          '<a class="link-arrow" href="#reviews">' + esc(t('nav.reviews')) + '</a></div>';
      } else if (s.badge === 'open') {
        extra = '<div class="slide-meta"><p class="open-badge" data-open-badge></p>' +
          '<a class="link-arrow" href="#contact">' + esc(t('hero.route')) + '</a></div>';
      } else {
        extra = '<div class="slide-actions"><a class="link-arrow" href="#booking">' + esc(t('hero.book')) + '</a></div>';
      }
      return '<article class="slide" role="group" aria-roledescription="slide" aria-label="' + esc(t('hero.slide')) + ' ' + (i + 1) + ' / ' + data.slides.length + '">' +
        '<div class="slide-photo"><img src="' + esc(s.image) + '" alt="" width="1600" height="1600"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '></div>' +
        '<div class="slide-body"><' + tag + ' class="slide-title">' + title + '</' + tag + '>' +
        '<p class="slide-text">' + text + '</p>' + extra + '</div></article>';
    }).join('');
    $('#slides').innerHTML = html;
    $('#dots').innerHTML = data.slides.map(function (s, i) {
      return '<button type="button" role="tab" aria-label="' + esc(t('hero.slide')) + ' ' + (i + 1) + '"></button>';
    }).join('');
    if (slider.i >= data.slides.length) slider.i = 0;
    showSlide(slider.i, true);
  }

  function showSlide(n, silent) {
    var slides = $$('#slides .slide'); if (!slides.length) return;
    slider.i = (n + slides.length) % slides.length;
    slides.forEach(function (el, i) {
      var on = i === slider.i;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', String(!on));
      if (on) el.removeAttribute('inert'); else el.setAttribute('inert', '');
      if (on) { var im = $('img', el); if (im) im.loading = 'eager'; }
    });
    /* მომდევნო სლაიდის ფოტო წინასწარ იტვირთება, რომ გადასვლა რბილი იყოს */
    var nextImg = $('img', slides[(slider.i + 1) % slides.length]); if (nextImg) nextImg.loading = 'eager';
    $$('#dots button').forEach(function (b, i) { b.setAttribute('aria-selected', String(i === slider.i)); });
    if (!silent) restart();
  }
  function restart() {
    clearTimeout(slider.timer);
    if (slider.playing && !slider.hold && data.slides.length > 1) {
      slider.timer = setTimeout(function () { showSlide(slider.i + 1); }, slider.DELAY);
    }
  }
  function setPlaying(on) {
    slider.playing = on;
    var btn = $('#hero-toggle');
    btn.setAttribute('aria-label', t(on ? 'hero.pause' : 'hero.play'));
    $('use', btn).setAttribute('href', on ? '#i-pause' : '#i-play');
    restart();
  }
  function initSlider() {
    var hero = $('#top');
    $('#hero-prev').addEventListener('click', function () { showSlide(slider.i - 1); });
    $('#hero-next').addEventListener('click', function () { showSlide(slider.i + 1); });
    $('#hero-toggle').addEventListener('click', function () { setPlaying(!slider.playing); });
    $('#dots').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      showSlide($$('#dots button').indexOf(b));
    });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showSlide(slider.i - 1);
      if (e.key === 'ArrowRight') showSlide(slider.i + 1);
    });
    /* კლავიატურის ფოკუსზე და მაუსის მიტანაზე ავტო-გადართვა ჩერდება */
    hero.addEventListener('mouseenter', function () { slider.hold = true; restart(); });
    hero.addEventListener('mouseleave', function () { slider.hold = false; restart(); });
    hero.addEventListener('focusin', function () { slider.hold = true; restart(); });
    hero.addEventListener('focusout', function () { slider.hold = false; restart(); });
    document.addEventListener('visibilitychange', function () { slider.hold = document.hidden; restart(); });

    /* swipe მობილურზე */
    var x0 = null, y0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) showSlide(slider.i + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
    setPlaying(slider.playing);
  }

  /* ---------- სერვისები ---------- */
  function renderMenu() {
    var html = data.categories.map(function (cat) {
      var rows = data.services.filter(function (s) { return s.cat === cat.id; });
      if (!rows.length) return '';
      return '<div class="group" data-reveal><h3 class="group-name">' + esc(c(cat.name)) + '</h3>' +
        rows.map(function (s) {
          var desc = c(s.desc), dur = s.duration ? s.duration + ' ' + t('services.min') : '';
          return '<a class="row" href="#booking" data-service="' + esc(s.id) + '" title="' + esc(t('services.pick')) + '">' +
            '<span class="row-main"><span class="row-name">' + esc(c(s.name)) + '</span>' +
            '<span class="row-price">' + esc(s.price) + ' ₾</span></span>' +
            '<span class="row-desc">' + esc(desc) + (desc && dur ? ' · ' : '') + esc(dur) + '</span></a>';
        }).join('') + '</div>';
    }).join('');
    $('#menu').innerHTML = html;
  }

  /* ---------- barbers, about ---------- */
  function renderAbout() {
    $('#about-lead').textContent = c(data.about.lead);
    $('#about-body').textContent = c(data.about.text);
    $('#barbers-list').innerHTML = data.barbers.map(function (b, i) {
      var name = c(b.name);
      var pic = b.photo
        ? '<img src="' + esc(b.photo) + '" alt="' + esc(name) + '" loading="lazy">'
        : '<span class="door-initial" aria-hidden="true">' + esc(name.charAt(0)) + '</span><svg class="door-mark" aria-hidden="true"><use href="#mark"/></svg>';
      var langs = (b.langs || []).map(function (l) { return t('lang.' + l); }).join(' · ');
      return '<article class="door" data-reveal style="--d:' + (i * 110) + 'ms">' +
        '<div class="door-frame">' + pic + '</div>' +
        '<h3 class="door-name">' + esc(name) + '</h3>' +
        '<p class="door-role">' + esc(c(b.role)) + (c(b.bio) ? ' · ' + esc(c(b.bio)) : '') + '</p>' +
        (langs ? '<p class="door-langs">' + esc(t('barbers.langs')) + ': ' + esc(langs) + '</p>' : '') +
        '<a class="btn btn-small btn-quiet" href="#booking" data-barber="' + esc(b.id) + '" aria-label="' + esc(t('barbers.bookWith')) + ': ' + esc(name) + '">' + esc(t('barbers.bookWith')) + '</a></article>';
    }).join('');
  }

  /* ---------- გალერეა ---------- */
  function renderGallery() {
    $('#strip').innerHTML = data.gallery.map(function (g, i) {
      return '<button class="frame" type="button" data-full="' + esc(g.src) + '" aria-label="' + esc(t('gallery.open')) + ': ' + esc(c(g.alt)) + '" data-reveal style="--d:' + (Math.min(i, 4) * 80) + 'ms">' +
        '<img src="' + esc(g.src) + '" alt="' + esc(c(g.alt)) + '" loading="lazy" width="900" height="1200"></button>';
    }).join('');
  }
  function initGallery() {
    var strip = $('#strip'), lb = $('#lightbox');
    function step(dir) {
      var f = $('.frame', strip); if (!f) return;
      strip.scrollBy({ left: dir * (f.offsetWidth + 20) * (window.innerWidth >= 1180 ? 2 : 1), behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    $('#gal-prev').addEventListener('click', function () { step(-1); });
    $('#gal-next').addEventListener('click', function () { step(1); });
    strip.addEventListener('click', function (e) {
      var f = e.target.closest('.frame'); if (!f || !lb.showModal) return;
      var im = $('#lb-img'); im.src = f.getAttribute('data-full'); im.alt = $('img', f).alt;
      lb.showModal();
    });
    $('#lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- შეფასებები ---------- */
  function renderReviews() {
    var b = data.business;
    $('#score-num').textContent = Number(b.rating).toFixed(1);
    $('#score-stars').innerHTML = starsHtml(b.rating);
    $('#score-count').textContent = t('reviews.count', { n: b.reviewsCount });
    $('#quotes').innerHTML = data.reviews.map(function (r, i) {
      return '<blockquote class="quote" data-reveal style="--d:' + (i * 90) + 'ms">„' + esc(c(r.text)).replace(/^[„“"«]+|[“”"»]+$/g, '') + '“</blockquote>';
    }).join('');
  }

  /* ---------- კონტაქტი ---------- */
  function renderContact() {
    var b = data.business, addr = c(b.address);
    $$('[data-tel]').forEach(function (a) { a.textContent = b.phone; a.href = telHref(b.phone); });
    $('#c-address').textContent = addr;
    $('#f-address').textContent = addr;
    $('#c-route').href = 'https://www.google.com/maps/dir/?api=1&destination=' + b.lat + ',' + b.lng;
    $('#wa-float').href = waHref(t('wa.hello'));
    $('#f-wa').href = waHref(t('wa.hello'));
    var fb = $('#f-fb'); fb.hidden = !b.facebook; if (b.facebook) fb.href = b.facebook;
    var ig = $('#f-ig'); ig.hidden = !b.instagram; if (b.instagram) ig.href = b.instagram;
    var gi = $('#g-insta'); gi.hidden = !b.instagram;
    if (b.instagram) { gi.href = b.instagram; $('#g-handle').textContent = '@' + String(b.instagram).replace(/\/+$/, '').split('/').pop(); }
    $('#c-metro').textContent = c(b.metro);

    var hrs = b.hours, same = hrs.every(function (h) { return !h.closed && h.open === hrs[0].open && h.close === hrs[0].close; });
    var today = Time.now().dow, rows;
    if (same) rows = '<tr class="is-today"><th scope="row">' + esc(t('contact.everyday')) + '</th><td>' + esc(hrs[0].open + '–' + hrs[0].close) + '</td></tr>';
    else rows = hrs.map(function (h, i) {
      return '<tr' + (i === today ? ' class="is-today"' : '') + '><th scope="row">' + esc(t('day.' + i)) + '</th><td>' +
        esc(h.closed ? t('contact.closed') : h.open + '–' + h.close) + '</td></tr>';
    }).join('');
    $('#c-hours').innerHTML = '<tbody>' + rows + '</tbody>';

    var ch = '<li><a href="' + esc(waHref(t('wa.hello'))) + '" target="_blank" rel="noopener">' + esc(t('contact.whatsapp')) + '</a></li>';
    if (b.instagram) ch += '<li><a href="' + esc(b.instagram) + '" target="_blank" rel="noopener">' + esc(t('contact.instagram')) + '</a></li>';
    if (b.facebook) ch += '<li><a href="' + esc(b.facebook) + '" target="_blank" rel="noopener">' + esc(t('contact.facebook')) + '</a></li>';
    if (b.email) ch += '<li><a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a></li>';
    $('#c-channels').innerHTML = ch;

    var lat = Number(b.lat), lng = Number(b.lng);
    var src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent((lng - 0.008).toFixed(4) + ',' + (lat - 0.0045).toFixed(4) + ',' + (lng + 0.008).toFixed(4) + ',' + (lat + 0.0045).toFixed(4)) +
      '&layer=mapnik&marker=' + encodeURIComponent(lat + ',' + lng);
    var map = $('#c-map'); if (map.getAttribute('src') !== src) map.setAttribute('src', src);
    $('#year').textContent = Time.now().date.slice(0, 4);
  }

  /* ---------- schema.org ---------- */
  function renderLd() {
    var b = data.business, names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var prices = data.services.map(function (s) { return Number(s.price); }).filter(function (n) { return !isNaN(n); });
    var ld = {
      '@context': 'https://schema.org', '@type': 'BarberShop', name: b.name, alternateName: b.nameKa,
      image: new URL('assets/img/og.jpg', location.href).href,
      url: location.href.split('#')[0].split('?')[0],
      telephone: String(b.phone).replace(/[^\d+]/g, ''), email: b.email || undefined, currenciesAccepted: 'GEL',
      priceRange: prices.length ? Math.min.apply(null, prices) + '–' + Math.max.apply(null, prices) + ' GEL' : undefined,
      address: { '@type': 'PostalAddress', streetAddress: c(b.address), addressLocality: 'თბილისი', addressCountry: 'GE' },
      geo: { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng },
      openingHoursSpecification: b.hours.map(function (h, i) {
        return h.closed ? null : { '@type': 'OpeningHoursSpecification', dayOfWeek: names[i], opens: h.open, closes: h.close };
      }).filter(Boolean),
      aggregateRating: { '@type': 'AggregateRating', ratingValue: String(b.rating), reviewCount: String(parseInt(b.reviewsCount, 10) || 0), bestRating: '5' },
      sameAs: [b.instagram, b.facebook].filter(Boolean)
    };
    $('#ld-json').textContent = JSON.stringify(ld);
  }

  /* ---------- ჩაწერის ფორმა ---------- */
  var form = { service: '', barber: 'any', date: '', time: '' };

  function barberName(id) {
    if (id === 'any') return t('book.any');
    var b = data.barbers.filter(function (x) { return x.id === id; })[0];
    return b ? c(b.name) : t('book.any');
  }
  function serviceById(id) { return data.services.filter(function (s) { return s.id === id; })[0]; }

  function renderBookingOptions() {
    var sel = $('#f-service');
    sel.innerHTML = '<option value="">—</option>' + data.categories.map(function (cat) {
      var rows = data.services.filter(function (s) { return s.cat === cat.id; });
      if (!rows.length) return '';
      return '<optgroup label="' + esc(c(cat.name)) + '">' + rows.map(function (s) {
        return '<option value="' + esc(s.id) + '">' + esc(c(s.name)) + ' — ' + esc(s.price) + ' ₾</option>';
      }).join('') + '</optgroup>';
    }).join('');
    if (!serviceById(form.service)) form.service = '';
    sel.value = form.service;

    if (form.barber !== 'any' && !data.barbers.some(function (b) { return b.id === form.barber; })) form.barber = 'any';
    $('#f-barbers').innerHTML = [{ id: 'any' }].concat(data.barbers).map(function (b) {
      return '<label class="chip"><input type="radio" name="barber" value="' + esc(b.id) + '"' + (form.barber === b.id ? ' checked' : '') + '>' +
        '<span>' + esc(barberName(b.id)) + '</span></label>';
    }).join('');

    var today = Time.now().date, days = [];
    for (var i = 0; i < 10; i++) days.push(Time.addDays(today, i));
    if (days.indexOf(form.date) === -1) form.date = firstOpenDay(days);
    $('#f-days').innerHTML = days.map(function (d, i) {
      var dow = Time.dowOf(d), closed = data.business.hours[dow].closed;
      var top = i === 0 ? t('book.today') : i === 1 ? t('book.tomorrow') : t('dayShort.' + dow);
      return '<label class="chip"><input type="radio" name="day" value="' + d + '"' + (form.date === d ? ' checked' : '') + (closed ? ' disabled' : '') + '>' +
        '<span' + (closed ? ' style="opacity:.45"' : '') + '>' + esc(top) + '<small>' + esc(dayLabel(d)) + '</small></span></label>';
    }).join('');
    renderTimes();
  }
  function firstOpenDay(days) {
    for (var i = 0; i < days.length; i++) if (slotsFor(days[i]).length) return days[i];
    return days[0];
  }
  /* თავისუფალი საათები: გასული დრო და უკვე დაკავებული დრო იმალება */
  function slotsFor(date) {
    var h = data.business.hours[Time.dowOf(date)];
    if (!h || h.closed) return [];
    var sv = serviceById(form.service), dur = sv && sv.duration ? Number(sv.duration) : 30;
    var now = Time.now(), open = Time.toMin(h.open), close = Time.toMin(h.close), out = [];
    var busy = (data.bookings || []).filter(function (b) { return b.date === date && b.status !== 'cancelled'; });
    for (var m = open; m + dur <= close; m += 30) {
      if (date === now.date && m <= now.minutes + 10) continue;
      var overlap = busy.filter(function (b) {
        var s = Time.toMin(b.time), e = s + (Number(b.duration) || 30);
        return m < e && m + dur > s;
      });
      var taken = form.barber === 'any'
        ? overlap.length >= Math.max(1, data.barbers.length)
        : overlap.some(function (b) { return b.barberId === form.barber; });
      if (!taken) out.push(Time.toHHMM(m));
    }
    return out;
  }
  function renderTimes() {
    var box = $('#f-times'), h = data.business.hours[Time.dowOf(form.date)];
    var slots = slotsFor(form.date);
    if (slots.indexOf(form.time) === -1) form.time = '';
    if (!slots.length) box.innerHTML = '<p class="chips-empty">' + esc(t(h && h.closed ? 'book.closedDay' : 'book.noSlots')) + '</p>';
    else box.innerHTML = slots.map(function (s) {
      return '<label class="chip"><input type="radio" name="time" value="' + s + '"' + (form.time === s ? ' checked' : '') + '><span>' + s + '</span></label>';
    }).join('');
    renderSummary();
  }
  function renderSummary() {
    var sv = serviceById(form.service);
    $('#book-summary').textContent = sv && form.time
      ? t('book.summary', { service: c(sv.name) + ' — ' + sv.price + ' ₾', day: dayLabel(form.date), time: form.time }) : '';
  }
  function setErr(id, msg, input) {
    var el = $('#e-' + id); el.textContent = msg || ''; el.hidden = !msg;
    if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
  }
  function initBooking() {
    var f = $('#book-form');
    f.addEventListener('change', function (e) {
      var el = e.target;
      if (el.name === 'service') { form.service = el.value; setErr('service', '', el); renderTimes(); }
      if (el.name === 'barber') { form.barber = el.value; renderTimes(); }
      if (el.name === 'day') { form.date = el.value; renderTimes(); }
      if (el.name === 'time') { form.time = el.value; setErr('time', ''); renderSummary(); }
    });
    $('#f-name').addEventListener('blur', function () { if (this.value.trim()) setErr('name', '', this); });
    $('#f-phone').addEventListener('blur', function () { if (this.value.replace(/\D/g, '').length >= 9) setErr('phone', '', this); });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#f-name'), phone = $('#f-phone'), sel = $('#f-service'), first = null;
      var sv = serviceById(form.service);
      if (!sv) { setErr('service', t('book.errService'), sel); first = first || sel; } else setErr('service', '', sel);
      if (!form.time) { setErr('time', t('book.errTime')); first = first || $('#f-times input') || $('#f-days input'); } else setErr('time', '');
      if (!name.value.trim()) { setErr('name', t('book.errName'), name); first = first || name; } else setErr('name', '', name);
      if (phone.value.replace(/\D/g, '').length < 9) { setErr('phone', t('book.errPhone'), phone); first = first || phone; } else setErr('phone', '', phone);
      if (first) { first.focus(); return; }

      var msg = t('wa.msg', {
        service: c(sv.name), price: sv.price, barber: barberName(form.barber),
        day: dayLabel(form.date), time: form.time, name: name.value.trim(), phone: phone.value.trim()
      });
      var url = waHref(msg);

      /* ჯავშანი ინახება ადმინისთვის (იმავე JSON-ში) */
      var fresh = Store.load();
      fresh.bookings = fresh.bookings || [];
      fresh.bookings.push({
        id: Store.uid('bk'), createdAt: new Date().toISOString(), date: form.date, time: form.time,
        serviceId: sv.id, serviceName: sv.name.ka || c(sv.name), price: sv.price, duration: sv.duration,
        barberId: form.barber, barberName: form.barber === 'any' ? 'ნებისმიერი' : (data.barbers.filter(function (b) { return b.id === form.barber; })[0].name.ka),
        name: name.value.trim(), phone: phone.value.trim(), lang: I.lang, status: 'new'
      });
      Store.save(fresh); data = fresh;

      window.open(url, '_blank', 'noopener');
      $('#done-sum').textContent = t('book.summary', { service: c(sv.name) + ' — ' + sv.price + ' ₾', day: dayLabel(form.date), time: form.time });
      $('#done-wa').href = url;
      f.hidden = true; var done = $('#book-done'); done.hidden = false; done.focus();
    });
    $('#done-again').addEventListener('click', function () {
      form.time = ''; $('#book-done').hidden = true; f.hidden = false; renderTimes(); $('#f-service').focus();
    });

    /* პრაისის სტრიქონზე ან ბარბერის ბმულზე დაჭერა ფორმას ავსებს */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-service], [data-barber]'); if (!a) return;
      if ($('#book-form').hidden) { $('#book-done').hidden = true; $('#book-form').hidden = false; }
      if (a.hasAttribute('data-service')) { form.service = a.getAttribute('data-service'); setErr('service', '', $('#f-service')); }
      if (a.hasAttribute('data-barber')) form.barber = a.getAttribute('data-barber');
      renderBookingOptions();
    });
  }

  /* ---------- ზედა ზოლი, მენიუ, scroll ---------- */
  function initChrome() {
    var bar = $('#bar'), burger = $('#burger'), drawer = $('#drawer');
    function onScroll() { bar.classList.toggle('is-solid', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    function setDrawer(open) {
      drawer.hidden = !open; burger.setAttribute('aria-expanded', String(open));
      bar.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      $('.sr', burger).textContent = t(open ? 'nav.close' : 'nav.menu');
    }
    burger.addEventListener('click', function () { setDrawer(drawer.hidden); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1180 && !drawer.hidden) setDrawer(false); });

    $$('.langs button').forEach(function (b) {
      b.addEventListener('click', function () { I.set(b.getAttribute('data-lang')); renderAll(); });
    });

    /* მენიუში აქტიური სექციის მონიშვნა */
    if ('IntersectionObserver' in window) {
      var links = $$('.nav a');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            var on = l.getAttribute('href') === '#' + en.target.id;
            l.classList.toggle('is-current', on);
            if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      ['top', 'services', 'barbers', 'gallery', 'reviews', 'contact'].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
    }
  }

  var revealIO = null;
  function observeReveals() {
    var els = $$('[data-reveal]:not(.is-in)');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    if (!revealIO) revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- ყველაფრის დახატვა ---------- */
  function renderAll() {
    applyI18n();
    renderSlides();
    renderMenu();
    renderAbout();
    renderGallery();
    renderReviews();
    renderContact();
    renderBookingOptions();
    renderOpen();
    renderLd();
    observeReveals();
  }

  initChrome();
  initSlider();
  initGallery();
  initBooking();
  renderAll();

  setInterval(function () { renderOpen(); }, 30000);
  /* ადმინში შენახული ცვლილება მაშინვე ჩანს აქ (სხვა ჩანართიდანაც) */
  Store.onExternalChange(function (fresh) { data = fresh; renderAll(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { data = Store.load(); renderAll(); } });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { var fresh = Store.load(); if (JSON.stringify(fresh) !== JSON.stringify(data)) { data = fresh; renderAll(); } }
  });
})();
