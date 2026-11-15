/* Gentleman Barbershop Tbilisi — ადმინ პანელი (დემო).
   მონაცემები ინახება localStorage-ში TBStore-ის მეშვეობით; ყოველი ცვლილება ავტომატურად ინახება
   და მთავარი საიტი მაშინვე ახლდება (storage მოვლენით). პაროლი ADMIN-PASSWORD.txt-შია (GitHub-ზე არ იტვირთება). */
(function () {
  'use strict';

  var Store = window.TBStore;
  var data = Store.load();
  var editLang = 'ka';
  var tab = 'bookings';
  var bkFilter = 'all';
  var bkBarber = 'all';
  var bkDay = '';
  var SESSION = 'gentleman.admin';
  /* პაროლის ჰეში (cyrb53). ეს მხოლოდ დემო-დაცვაა: ნამდვილ საიტზე შესვლა სერვერზე უნდა მოწმდებოდეს. */
  var PASS_HASH = '25g3o0m627j';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var DAYS = ['ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი', 'კვირა'];
  var MONTHS = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];
  var LANG_NAME = { ka: 'ქართული', en: 'English', ru: 'Русский' };
  var STATUS = { new: 'ახალი', confirmed: 'დადასტურებული', cancelled: 'გაუქმებული' };

  function hash(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function getPath(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, data);
  }
  function setPath(path, value) {
    var keys = path.split('.'), o = data;
    for (var i = 0; i < keys.length - 1; i++) {
      if (o[keys[i]] == null || typeof o[keys[i]] !== 'object') o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }

  /* ---------- შენახვა ---------- */
  var saveTimer = null, toastTimer = null;
  function toast(msg, bad) {
    var el = $('#toast'); el.textContent = msg; el.classList.toggle('is-bad', !!bad); el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, bad ? 5000 : 1600);
  }
  function saveNow(quiet) {
    clearTimeout(saveTimer); saveTimer = null;
    if (Store.save(data)) { if (!quiet) toast('შენახულია — საიტი განახლდა'); return true; }
    toast('ვერ შეინახა: ბრაუზერის მეხსიერება გაივსო. წაშალე ან შეამცირე ატვირთული ფოტოები.', true);
    return false;
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveNow(); }, 450); }

  /* ---------- ველების შაბლონები ---------- */
  var uidN = 0;
  function field(label, path, o) {
    o = o || {};
    var id = 'f' + (++uidN), full = o.l10n ? path + '.' + editLang : path;
    var val = getPath(full); if (val == null) val = '';
    var ph = o.l10n && editLang !== 'ka' ? (getPath(path + '.ka') || '') : (o.ph || '');
    var attrs = ' id="' + id + '" data-path="' + esc(full) + '"' + (o.num ? ' data-num="1"' : '') +
      (ph ? ' placeholder="' + esc(ph) + '"' : '') + (o.l10n ? ' lang="' + editLang + '"' : '');
    var tagL = o.l10n ? ' <span class="help">· ' + LANG_NAME[editLang] + '</span>' : '';
    var input = o.area
      ? '<textarea' + attrs + ' rows="' + (o.rows || 3) + '">' + esc(val) + '</textarea>'
      : '<input type="' + (o.type || 'text') + '"' + attrs + ' value="' + esc(val) + '"' +
        (o.min != null ? ' min="' + o.min + '"' : '') + (o.step ? ' step="' + o.step + '"' : '') + (o.mode ? ' inputmode="' + o.mode + '"' : '') + '>';
    return '<div class="f ' + (o.cls || '') + '"><label for="' + id + '">' + esc(label) + tagL + '</label>' + input +
      (o.help ? '<p class="help">' + esc(o.help) + '</p>' : '') + '</div>';
  }
  function moveBtns(list, i, len, extra) {
    extra = extra || '';
    return '<button type="button" class="ghost icon" data-act="move" data-list="' + list + '" data-i="' + i + '" data-dir="-1"' + extra + (i === 0 ? ' disabled' : '') + ' aria-label="ზემოთ აწევა">↑</button>' +
      '<button type="button" class="ghost icon" data-act="move" data-list="' + list + '" data-i="' + i + '" data-dir="1"' + extra + (i === len - 1 ? ' disabled' : '') + ' aria-label="ქვემოთ ჩაწევა">↓</button>';
  }
  function delBtn(list, i, what) {
    return '<button type="button" class="ghost danger" data-act="del" data-list="' + list + '" data-i="' + i + '" data-what="' + esc(what) + '">წაშლა</button>';
  }
  function imgBlock(path, tall) {
    var src = getPath(path);
    return (src ? '<img class="thumb' + (tall ? ' tall' : '') + '" src="' + esc(src) + '" alt="">'
                : '<div class="thumb thumb-empty' + (tall ? ' tall' : '') + '">ფოტო არ არის</div>');
  }
  function imgTools(path, allowClear) {
    var src = getPath(path) || '';
    return '<div class="f"><label>ფოტო</label><div class="row-tools">' +
      '<button type="button" class="ghost" data-act="upload" data-path="' + esc(path) + '">ფოტოს ატვირთვა</button>' +
      (allowClear && src ? '<button type="button" class="ghost danger" data-act="clear-img" data-path="' + esc(path) + '">ფოტოს მოხსნა</button>' : '') +
      '</div><input type="text" data-path="' + esc(path) + '" data-img="1" value="' + esc(src.indexOf('data:') === 0 ? '' : src) + '" placeholder="' + (src.indexOf('data:') === 0 ? 'ატვირთული ფოტო' : 'ან ჩასვი ფოტოს ბმული / ფაილის გზა') + '" aria-label="ფოტოს ბმული">' +
      '</div>';
  }
  function head(title, sub, extra) {
    return '<div class="panel-head"><div><h2>' + esc(title) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' + (extra || '') + '</div>';
  }

  /* ---------- განყოფილებები ---------- */
  var panels = {};

  panels.bookings = function () {
    var list = (data.bookings || []).slice().sort(function (a, b) { return (b.createdAt || '').localeCompare(a.createdAt || ''); });
    var counts = { all: list.length, new: 0, confirmed: 0, cancelled: 0 };
    list.forEach(function (b) { counts[b.status] = (counts[b.status] || 0) + 1; });
    var shown = list.filter(function (b) { return (bkFilter === 'all' || b.status === bkFilter) && (bkBarber === 'all' || b.barberId === bkBarber) && (!bkDay || b.date === bkDay); });
    var html = head('ჯავშნები', 'საიტის ფორმიდან გაგზავნილი ჯავშნები. კლიენტი პარალელურად WhatsApp-ზეც გწერთ — აქ სტატუსს ნიშნავთ.');
    html += '<div class="filters" role="group" aria-label="ფილტრი">' +
      [['all', 'ყველა'], ['new', STATUS.new], ['confirmed', STATUS.confirmed], ['cancelled', STATUS.cancelled]].map(function (f) {
        return '<button type="button" data-act="bk-filter" data-f="' + f[0] + '" aria-pressed="' + (bkFilter === f[0]) + '">' + f[1] + ' · ' + (counts[f[0]] || 0) + '</button>';
      }).join('') +
      '<label class="filter-select"><span>ბარბერი</span><select data-bk-barber="1">' +
      [{ id: 'all', n: 'ყველა ბარბერი' }, { id: 'any', n: 'ნებისმიერი (არჩევის გარეშე)' }].concat(data.barbers.map(function (x) { return { id: x.id, n: x.name.ka }; })).map(function (o) {
        return '<option value="' + esc(o.id) + '"' + (bkBarber === o.id ? ' selected' : '') + '>' + esc(o.n) + '</option>';
      }).join('') + '</select></label>' +
      '<label class="filter-select"><span>დღე</span><input type="date" data-bk-day="1" value="' + esc(bkDay) + '"></label>' +
      (bkDay ? '<button type="button" class="ghost" data-act="bk-day-clear">ყველა დღე</button>' : '') + '</div>';
    if (!shown.length) {
      html += '<div class="empty"><strong>' + (list.length ? 'ამ ფილტრით ჯავშანი არ არის' : 'ჯავშნები ჯერ არ არის') + '</strong>' +
        (list.length ? 'აირჩიე სხვა ფილტრი.' : 'გახსენი საიტი, შეავსე ჩაწერის ფორმა — ჯავშანი მაშინვე აქ გამოჩნდება.') + '</div>';
    } else {
      html += shown.map(function (b) {
        var p = (b.date || '').split('-'), dow = b.date ? window.TBTime.dowOf(b.date) : 0;
        var when = b.date ? DAYS[dow].slice(0, 3) + ', ' + parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' · ' + b.time : '';
        var tel = String(b.phone || '').replace(/[^\d+]/g, ''), wa = tel.replace(/\D/g, '');
        if (wa.length === 9) wa = '995' + wa;
        var made = '';
        if (b.createdAt) {   /* თბილისის დროით (UTC+4) */
          var cd = new Date(new Date(b.createdAt).getTime() + 4 * 3600000);
          made = cd.getUTCDate() + ' ' + MONTHS[cd.getUTCMonth()] + ', ' + ('0' + cd.getUTCHours()).slice(-2) + ':' + ('0' + cd.getUTCMinutes()).slice(-2);
        }
        return '<article class="bk" data-status="' + esc(b.status) + '">' +
          '<div><p class="bk-when">' + esc(when) + '</p><p class="bk-meta">მიღებულია: ' + esc(made) + '</p></div>' +
          '<div><p class="bk-what">' + esc(b.serviceName) + (b.price != null ? ' — ' + esc(b.price) + ' ₾' : '') + ' · ' + esc(b.barberName) + '</p>' +
          '<p class="bk-who">' + esc(b.name) + ' · <a href="tel:' + esc(tel) + '">' + esc(b.phone) + '</a> · <a href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">WhatsApp</a></p></div>' +
          '<div class="bk-tools"><select data-bk="' + esc(b.id) + '" aria-label="სტატუსი">' +
          Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (b.status === k ? ' selected' : '') + '>' + STATUS[k] + '</option>'; }).join('') +
          '</select><button type="button" class="ghost danger" data-act="bk-del" data-id="' + esc(b.id) + '">წაშლა</button></div></article>';
      }).join('');
    }
    return html;
  };

  panels.slides = function () {
    var html = head('სლაიდები', 'მთავარი გვერდის ზედა სლაიდერი. ტექსტი ივსება თითო ენაზე ცალ-ცალკე — ენა ირჩევა ზემოთ.');
    html += data.slides.map(function (s, i) {
      var p = 'slides.' + i;
      return '<section class="card"><div class="row-tools"><strong>სლაიდი ' + (i + 1) + '</strong><span class="spacer"></span>' + moveBtns('slides', i, data.slides.length) + '</div>' +
        '<div class="media">' + imgBlock(p + '.image') + '<div class="stack">' +
        field('სათაური', p + '.title', { l10n: true, help: s.badge === 'open' ? '{hours} ავტომატურად ჩანაცვლდება დღევანდელი საათებით.' : '' }) +
        field('ტექსტი', p + '.text', { l10n: true, area: true, rows: 2 }) +
        imgTools(p + '.image') +
        '<div class="grid2"><div class="f"><label for="bd' + i + '">დამატებითი ნიშანი</label><select id="bd' + i + '" data-path="' + p + '.badge">' +
        [['none', 'არაფერი'], ['rating', 'რეიტინგი და ვარსკვლავები'], ['open', '„ღიაა ახლა“ ნიშანი']].map(function (o) {
          return '<option value="' + o[0] + '"' + (s.badge === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
        }).join('') + '</select></div>' +
        '<label class="check"><input type="checkbox" data-path="' + p + '.cta"' + (s.cta ? ' checked' : '') + '> დიდი ღილაკი „ჩაწერა“</label></div>' +
        '</div></div></section>';
    }).join('');
    return html;
  };

  panels.services = function () {
    var html = head('სერვისები და ფასები', 'ფასი ლარშია, ხანგრძლივობა — წუთებში (ჩაწერის ფორმა ამით ითვლის თავისუფალ საათებს).');
    data.categories.forEach(function (cat, ci) {
      html += '<h3 class="h3">კატეგორია</h3><div class="card">' + field('კატეგორიის სახელი', 'categories.' + ci + '.name', { l10n: true }) + '</div>';
      var idx = []; data.services.forEach(function (s, i) { if (s.cat === cat.id) idx.push(i); });
      html += idx.map(function (i, n) {
        var p = 'services.' + i, s = data.services[i];
        return '<div class="svc">' +
          field('სერვისი', p + '.name', { l10n: true, cls: 'f-name' }) +
          field('ფასი, ₾', p + '.price', { type: 'number', num: true, min: 0, step: 1, mode: 'numeric' }) +
          field('წუთი', p + '.duration', { type: 'number', num: true, min: 5, step: 5, mode: 'numeric' }) +
          '<div class="f"><label for="ct' + i + '">კატეგორია</label><select id="ct' + i + '" data-path="' + p + '.cat" data-rerender="1">' +
          data.categories.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === s.cat ? ' selected' : '') + '>' + esc(c.name.ka) + '</option>'; }).join('') + '</select></div>' +
          field('აღწერა', p + '.desc', { l10n: true, cls: 'f-desc' }) +
          '<div class="row-tools"><span class="spacer"></span>' + moveBtns('services', n, idx.length, ' data-cat="' + esc(cat.id) + '"') + delBtn('services', i, s.name.ka || 'სერვისი') + '</div></div>';
      }).join('');
      html += '<button type="button" class="ghost" data-act="add-service" data-cat="' + esc(cat.id) + '">+ სერვისის დამატება: ' + esc(cat.name.ka) + '</button>';
    });
    return html;
  };

  panels.hours = function () {
    var html = head('საათები და კონტაქტი', '„ღიაა ახლა / დაიხურა“ ნიშანი და ჩაწერის ფორმა ამ საათებით მუშაობს (თბილისის დროით).');
    html += '<h3 class="h3">სამუშაო საათები</h3>';
    html += data.business.hours.map(function (h, i) {
      var p = 'business.hours.' + i;
      return '<div class="hours-row"><span class="hours-day">' + DAYS[i] + '</span><div class="times">' +
        '<input type="time" data-path="' + p + '.open" value="' + esc(h.open) + '" aria-label="' + DAYS[i] + ': გახსნა"' + (h.closed ? ' disabled' : '') + '>' +
        '<input type="time" data-path="' + p + '.close" value="' + esc(h.close) + '" aria-label="' + DAYS[i] + ': დახურვა"' + (h.closed ? ' disabled' : '') + '>' +
        '<label class="check"><input type="checkbox" data-path="' + p + '.closed" data-rerender="1"' + (h.closed ? ' checked' : '') + '> დასვენება</label></div></div>';
    }).join('');
    html += '<button type="button" class="ghost" data-act="hours-copy">ორშაბათის საათები ყველა დღეზე</button>';
    html += '<h3 class="h3">კონტაქტი</h3><div class="card"><div class="grid2">' +
      field('ტელეფონი (როგორც ჩანს საიტზე)', 'business.phone', { type: 'tel' }) +
      field('WhatsApp ნომერი (მხოლოდ ციფრები)', 'business.whatsapp', { mode: 'numeric', help: 'მაგ. 995514400010 — ქვეყნის კოდით, + და ჰარების გარეშე.' }) +
      field('ელფოსტა', 'business.email', { type: 'email' }) +
      field('Instagram-ის ბმული', 'business.instagram', { type: 'url' }) +
      field('Facebook-ის ბმული', 'business.facebook', { type: 'url' }) + '</div>' +
      field('მისამართი', 'business.address', { l10n: true }) +
      '<div class="grid2">' + field('განედი (lat)', 'business.lat', { type: 'number', num: true, step: 'any' }) +
      field('გრძედი (lng)', 'business.lng', { type: 'number', num: true, step: 'any' }) + '</div></div>';
    html += '<h3 class="h3">რეიტინგი</h3><div class="card"><div class="grid2">' +
      field('საშუალო შეფასება', 'business.rating', { type: 'number', num: true, min: 0, step: 0.1 }) +
      field('შეფასებების რაოდენობა (როგორც ჩანს, მაგ. 140+)', 'business.reviewsCount', {}) + '</div></div>';
    return html;
  };

  panels.about = function () {
    var html = head('ბარბერები, ჩვენ შესახებ', '„ჩვენ შესახებ“ ტექსტი და ბარბერების ბარათები. ფოტოს გარეშე ბარათზე ჩანს სახელის პირველი ასო.');
    html += '<div class="card">' + field('მთავარი აბზაცი (დიდი შრიფტით)', 'about.lead', { l10n: true, area: true, rows: 3 }) +
      field('მეორე აბზაცი', 'about.text', { l10n: true, area: true, rows: 3 }) + '</div>';
    html += '<h3 class="h3">ბარბერები</h3>';
    html += data.barbers.map(function (b, i) {
      var p = 'barbers.' + i;
      return '<section class="card"><div class="media">' + imgBlock(p + '.photo', true) + '<div class="stack">' +
        '<div class="grid2">' + field('სახელი', p + '.name', { l10n: true }) + field('როლი', p + '.role', { l10n: true }) + '</div>' +
        field('მოკლე აღწერა', p + '.bio', { l10n: true }) +
        '<div class="f"><span class="f-label">ენები</span><div class="row-tools">' + ['ka', 'en', 'ru'].map(function (l) {
          return '<label class="check"><input type="checkbox" data-blang="' + i + '" value="' + l + '"' + ((b.langs || []).indexOf(l) > -1 ? ' checked' : '') + '> ' + LANG_NAME[l] + '</label>';
        }).join('') + '</div></div>' + imgTools(p + '.photo', true) +
        '<div class="row-tools"><span class="spacer"></span>' + moveBtns('barbers', i, data.barbers.length) + delBtn('barbers', i, b.name.ka || 'ბარბერი') + '</div>' +
        '</div></div></section>';
    }).join('');
    html += '<button type="button" class="ghost" data-act="add-barber">+ ბარბერის დამატება</button>';
    return html;
  };

  panels.gallery = function () {
    var html = head('გალერეა', 'ფოტო ატვირთვისას ავტომატურად მცირდება. რეკომენდებულია ვერტიკალური ფოტოები (3:4).',
      '<button type="button" class="btn" data-act="gallery-add">+ ფოტოს დამატება</button>');
    if (!data.gallery.length) return html + '<div class="empty"><strong>გალერეა ცარიელია</strong>დაამატე პირველი ფოტო.</div>';
    html += '<div class="gal">' + data.gallery.map(function (g, i) {
      var p = 'gallery.' + i;
      return '<section class="card">' + imgBlock(p + '.src', true) + field('აღწერა (alt)', p + '.alt', { l10n: true }) +
        '<div class="row-tools">' + moveBtns('gallery', i, data.gallery.length) + '<span class="spacer"></span>' +
        '<button type="button" class="ghost" data-act="upload" data-path="' + p + '.src">შეცვლა</button>' + delBtn('gallery', i, 'ფოტო') + '</div></section>';
    }).join('') + '</div>';
    return html;
  };

  panels.reviews = function () {
    var html = head('შეფასებები', 'მოკლე ციტატები მთავარ გვერდზე. რეიტინგის ციფრი იცვლება განყოფილებაში „საათები და კონტაქტი“.',
      '<button type="button" class="btn" data-act="add-review">+ ციტატის დამატება</button>');
    if (!data.reviews.length) return html + '<div class="empty"><strong>ციტატები არ არის</strong>დაამატე პირველი.</div>';
    html += data.reviews.map(function (r, i) {
      return '<section class="card">' + field('ციტატა', 'reviews.' + i + '.text', { l10n: true, area: true, rows: 2 }) +
        '<div class="row-tools"><span class="spacer"></span>' + moveBtns('reviews', i, data.reviews.length) + delBtn('reviews', i, 'ციტატა') + '</div></section>';
    }).join('');
    return html;
  };

  panels.data = function () {
    var size = 0; try { size = (localStorage.getItem(Store.KEY) || '').length; } catch (e) {}
    var pct = Math.min(100, Math.round(size / (5 * 1024 * 1024) * 100));
    return head('მონაცემები', 'დემოში ყველაფერი ინახება ამ ბრაუზერში (localStorage), ერთ JSON ობიექტად. ნამდვილ საიტზე ეს JSON გადადის ბექენდში (მაგ. Supabase ან Firebase).') +
      '<div class="card"><p><strong>ექსპორტი</strong></p><p class="help">ჩამოტვირთავს მთელ შინაარსს და ჯავშნებს ერთ ფაილად — სარეზერვო ასლისთვის ან სხვა მოწყობილობაზე გადასატანად.</p>' +
      '<div class="row-tools"><button type="button" class="btn" data-act="export">ექსპორტი JSON</button>' +
      '<button type="button" class="ghost" data-act="import">იმპორტი JSON-დან</button></div></div>' +
      '<div class="card"><p><strong>საწყის მონაცემებზე დაბრუნება</strong></p><p class="help">შლის ყველა ცვლილებას და ჯავშანს და აბრუნებს დემოს საწყის მდგომარეობას.</p>' +
      '<div class="row-tools"><button type="button" class="ghost danger" data-act="reset">საწყის მონაცემებზე დაბრუნება</button></div></div>' +
      '<div class="card"><p><strong>მეხსიერება</strong></p><p class="help">გამოყენებულია დაახლოებით ' + (size / 1024).toFixed(0) + ' KB (≈' + pct + '% ბრაუზერის 5 MB ლიმიტიდან). ყველაზე მეტ ადგილს ატვირთული ფოტოები იკავებს.</p></div>';
  };

  /* ---------- დახატვა ---------- */
  function render(keepScroll) {
    var y = window.scrollY;
    uidN = 0;
    $('#panel').innerHTML = panels[tab]();
    $$('#tabs button').forEach(function (b) {
      if (b.getAttribute('data-tab') === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $$('[data-elang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-elang') === editLang)); });
    var n = (data.bookings || []).filter(function (b) { return b.status === 'new'; }).length;
    var badge = $('#new-count'); badge.hidden = !n; badge.textContent = n;
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  }

  /* ---------- ფოტოს ატვირთვა (შემცირებით) ---------- */
  var uploadCb = null;
  function pickImage(cb) { uploadCb = cb; var inp = $('#file-img'); inp.value = ''; inp.click(); }
  function compress(file, cb) {
    var reader = new FileReader();
    reader.onerror = function () { toast('ფაილი ვერ წაიკითხა.', true); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { toast('ეს ფაილი ფოტო არ არის.', true); };
      img.onload = function () {
        var max = 1400, k = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------- მოვლენები ---------- */
  function onInput(e) {
    var el = e.target, path = el.getAttribute('data-path');
    if (!path) return;
    if (el.type === 'checkbox') return;            /* change-ში მუშავდება */
    if (el.tagName === 'SELECT') return;
    var v = el.value;
    if (el.hasAttribute('data-num')) { v = v === '' ? 0 : Number(v); if (isNaN(v)) return; }
    if (el.hasAttribute('data-img') && v === '' && String(getPath(path) || '').indexOf('data:') === 0) return;
    setPath(path, v); saveSoon();
  }
  function onChange(e) {
    var el = e.target, bk = el.getAttribute('data-bk'), path = el.getAttribute('data-path');
    if (el.hasAttribute('data-bk-barber')) { bkBarber = el.value; render(true); return; }
    if (el.hasAttribute('data-bk-day')) { bkDay = el.value; render(true); return; }
    if (el.hasAttribute('data-blang')) {   /* ბარბერის ენები — მასივი */
      var bb = data.barbers[+el.getAttribute('data-blang')], code = el.value;
      bb.langs = (bb.langs || []).filter(function (x) { return x !== code; });
      if (el.checked) bb.langs.push(code);
      bb.langs.sort(function (x, y) { return ['ka', 'en', 'ru'].indexOf(x) - ['ka', 'en', 'ru'].indexOf(y); });
      saveNow(); return;
    }
    if (bk) {
      var b = data.bookings.filter(function (x) { return x.id === bk; })[0];
      if (b) { b.status = el.value; saveNow(true); toast('სტატუსი: ' + STATUS[el.value]); render(true); }
      return;
    }
    if (!path) return;
    if (el.type === 'checkbox') setPath(path, el.checked);
    else if (el.tagName === 'SELECT') setPath(path, el.value);
    else if (el.hasAttribute('data-img')) { saveNow(); render(true); return; }
    else return;
    saveNow();
    if (el.hasAttribute('data-rerender')) render(true);
  }
  function onClick(e) {
    var btn = e.target.closest('[data-act]'); if (!btn) return;
    var act = btn.getAttribute('data-act'), list, i;

    if (act === 'bk-filter') { bkFilter = btn.getAttribute('data-f'); render(true); return; }
    if (act === 'bk-day-clear') { bkDay = ''; render(true); return; }
    if (act === 'bk-del') {
      if (!confirm('წავშალო ეს ჯავშანი?')) return;
      data.bookings = data.bookings.filter(function (x) { return x.id !== btn.getAttribute('data-id'); });
      saveNow(); render(true); return;
    }
    if (act === 'move') {
      list = data[btn.getAttribute('data-list')]; i = +btn.getAttribute('data-i'); var dir = +btn.getAttribute('data-dir'), cat = btn.getAttribute('data-cat'), a, b2;
      if (cat) {   /* სერვისები მოძრაობს მხოლოდ საკუთარი კატეგორიის შიგნით */
        var idx = []; list.forEach(function (s, k) { if (s.cat === cat) idx.push(k); });
        a = idx[i]; b2 = idx[i + dir];
      } else { a = i; b2 = i + dir; }
      if (a == null || b2 == null || b2 < 0 || b2 >= list.length) return;
      var tmp = list[a]; list[a] = list[b2]; list[b2] = tmp;
      saveNow(); render(true); return;
    }
    if (act === 'del') {
      if (!confirm('წავშალო: ' + btn.getAttribute('data-what') + '?')) return;
      data[btn.getAttribute('data-list')].splice(+btn.getAttribute('data-i'), 1);
      saveNow(); render(true); return;
    }
    if (act === 'add-service') {
      data.services.push({ id: Store.uid('sv'), cat: btn.getAttribute('data-cat'), price: 30, duration: 30,
        name: { ka: 'ახალი სერვისი', en: 'New service', ru: 'Новая услуга' }, desc: { ka: '', en: '', ru: '' } });
      saveNow(); render(true); return;
    }
    if (act === 'add-barber') {
      data.barbers.push({ id: Store.uid('b'), photo: '', langs: ['ka'], name: { ka: 'ახალი ბარბერი', en: 'New barber', ru: 'Новый барбер' },
        role: { ka: 'ბარბერი', en: 'Barber', ru: 'Барбер' }, bio: { ka: '', en: '', ru: '' } });
      saveNow(); render(true); return;
    }
    if (act === 'add-review') {
      data.reviews.push({ id: Store.uid('r'), text: { ka: '', en: '', ru: '' } });
      saveNow(true); render(true);
      var areas = $$('#panel textarea'); if (areas.length) areas[areas.length - 1].focus();
      return;
    }
    if (act === 'gallery-add') {
      pickImage(function (url) {
        data.gallery.push({ id: Store.uid('g'), src: url, alt: { ka: '', en: '', ru: '' } });
        if (!saveNow()) data.gallery.pop();
        render(true);
      }); return;
    }
    if (act === 'upload') {
      var path = btn.getAttribute('data-path');
      pickImage(function (url) {
        var old = getPath(path); setPath(path, url);
        if (!saveNow()) setPath(path, old);
        render(true);
      }); return;
    }
    if (act === 'clear-img') { setPath(btn.getAttribute('data-path'), ''); saveNow(); render(true); return; }
    if (act === 'hours-copy') {
      var m = data.business.hours[0];
      data.business.hours = data.business.hours.map(function () { return { open: m.open, close: m.close, closed: m.closed }; });
      saveNow(); render(true); return;
    }
    if (act === 'export') {
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var a2 = document.createElement('a'); a2.href = URL.createObjectURL(blob);
      a2.download = 'gentleman-data-' + window.TBTime.now().date + '.json';
      document.body.appendChild(a2); a2.click(); a2.remove();
      setTimeout(function () { URL.revokeObjectURL(a2.href); }, 2000);
      toast('JSON ჩამოიტვირთა'); return;
    }
    if (act === 'import') { var fj = $('#file-json'); fj.value = ''; fj.click(); return; }
    if (act === 'reset') {
      if (!confirm('ნამდვილად დავაბრუნო საწყისი მონაცემები? ყველა ცვლილება და ჯავშანი წაიშლება.')) return;
      data = Store.reset(); Store.save(data); toast('საწყისი მონაცემები აღდგა'); render(); return;
    }
  }

  function initApp() {
    $('#login').hidden = true; $('#app').hidden = false;
    var panel = $('#panel');
    panel.addEventListener('input', onInput);
    panel.addEventListener('change', onChange);
    panel.addEventListener('click', onClick);
    $('#tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]'); if (!b) return;
      if (saveTimer) saveNow(true);
      tab = b.getAttribute('data-tab'); render(); panel.focus({ preventScroll: true });
    });
    $$('[data-elang]').forEach(function (b) {
      b.addEventListener('click', function () { if (saveTimer) saveNow(true); editLang = b.getAttribute('data-elang'); render(true); });
    });
    $('#logout').addEventListener('click', function () {
      if (saveTimer) saveNow(true);
      try { sessionStorage.removeItem(SESSION); } catch (e) {}
      location.reload();
    });
    $('#file-img').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f || !uploadCb) return;
      compress(f, uploadCb);
    });
    $('#file-json').addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var obj = JSON.parse(r.result);
          if (!obj || !obj.business || !Array.isArray(obj.services) || !Array.isArray(obj.slides)) throw new Error('shape');
          if (!confirm('იმპორტი ჩაანაცვლებს ამჟამინდელ მონაცემებს. გავაგრძელო?')) return;
          data = obj; Store.save(data); data = Store.load(); toast('მონაცემები იმპორტირდა'); render();
        } catch (err) { toast('ეს ფაილი Gentleman-ის მონაცემების JSON არ არის.', true); }
      };
      r.readAsText(f);
    });
    /* საიტიდან მოსული ახალი ჯავშანი მაშინვე ჩანს */
    Store.onExternalChange(function (fresh) {
      var before = (data.bookings || []).length;
      data.bookings = fresh.bookings || [];
      if (data.bookings.length > before) toast('ახალი ჯავშანი მოვიდა');
      if (tab === 'bookings') render(true); else {
        var n = data.bookings.filter(function (b) { return b.status === 'new'; }).length;
        var badge = $('#new-count'); badge.hidden = !n; badge.textContent = n;
      }
    });
    window.addEventListener('beforeunload', function () { if (saveTimer) saveNow(true); });
    render();
  }

  /* ---------- შესვლა ---------- */
  var authed = false;
  try { authed = sessionStorage.getItem(SESSION) === PASS_HASH; } catch (e) {}
  if (authed) initApp();
  else {
    $('#pw-toggle').addEventListener('click', function () {
      var pw = $('#pw'), show = pw.type === 'password';
      pw.type = show ? 'text' : 'password'; this.textContent = show ? 'დამალვა' : 'ჩვენება'; this.setAttribute('aria-pressed', String(show));
    });
    $('#login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = $('#pw');
      if (hash('gm:' + pw.value) === PASS_HASH) {
        try { sessionStorage.setItem(SESSION, PASS_HASH); } catch (err) {}
        initApp();
      } else {
        $('#pw-err').hidden = false; pw.setAttribute('aria-invalid', 'true'); pw.select();
      }
    });
    $('#pw').focus();
  }
})();
