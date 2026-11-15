/* Gentleman Barbershop Tbilisi — მონაცემების შრე.
   ყველაფერი (ტექსტები, ფასები, ფოტოები, ჯავშნები) ერთ JSON ობიექტშია და ინახება localStorage-ში.
   რეალურ ბექენდზე (Supabase / Firebase) გადასასვლელად საკმარისია TBStore.load / TBStore.save-ის ჩანაცვლება. */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'gentleman.data.v1';
  var IMG = 'assets/img/';

  var DEFAULT_DATA = {
    version: 1,
    business: {
      name: 'Gentleman Barbershop Tbilisi',
      nameKa: 'ჯენტლმენი',
      phone: '+995 514 40 00 10',
      whatsapp: '995514400010',
      email: '',
      instagram: 'https://www.instagram.com/gentlemantbilisi/',
      facebook: 'https://www.facebook.com/gentlemantbilisi',
      address: {
        ka: 'თბილისი, საბურთალო, ბიძინა კვერნაძის ქ. 13',
        en: '13 Bidzina Kvernadze St, Saburtalo, Tbilisi',
        ru: 'Тбилиси, Сабуртало, ул. Бидзины Квернадзе, 13'
      },
      metro: {
        ka: 'მეტრო „ტექნიკური უნივერსიტეტი“',
        en: 'Technical University metro',
        ru: 'метро «Технический университет»'
      },
      lat: 41.71896,
      lng: 44.78069,
      rating: 4.9,
      /* საიტზე ჩანს ასე, როგორც წერია ("140+"). */
      reviewsCount: '140+',
      /* 0 = ორშაბათი … 6 = კვირა */
      hours: [
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false },
        { open: '11:00', close: '20:00', closed: false }
      ]
    },

    /* badge: none | rating | open.  {hours} ტექსტში ჩანაცვლდება დღევანდელი საათებით. */
    slides: [
      {
        id: 's1', image: IMG + 'window.jpg', badge: 'none', cta: true,
        title: { ka: 'სტილი, რომელიც ჯენტლმენს შეეფერება', en: 'Style that suits a gentleman', ru: 'Стиль, достойный джентльмена' },
        text: {
          ka: 'ბარბერშოპი საბურთალოზე: შეჭრა, წვერი და პარსვა.',
          en: 'A barbershop in Saburtalo: haircuts, beards and shaves.',
          ru: 'Барбершоп на Сабуртало: стрижка, борода и бритьё.'
        }
      },
      {
        id: 's2', image: IMG + 'fade.jpg', badge: 'none', cta: false,
        title: { ka: 'შეჭრა: კლასიკა და ფეიდი', en: 'Haircuts: classic and fade', ru: 'Стрижки: классика и фейд' },
        text: {
          ka: 'კლასიკური და თანამედროვე შეჭრა, სუფთა ფეიდი — სწრაფად და ზუსტად.',
          en: 'Classic and modern cuts with a clean fade, done quickly and precisely.',
          ru: 'Классические и современные стрижки, чистый фейд — быстро и точно.'
        }
      },
      {
        id: 's3', image: IMG + 'razor.jpg', badge: 'none', cta: false,
        title: { ka: 'წვერი და პარსვა', en: 'Beard and shave', ru: 'Борода и бритьё' },
        text: {
          ka: 'წვერის ფორმირება, მოვლა და პარსვა.',
          en: 'Beard shaping, beard care and shaves.',
          ru: 'Оформление бороды, уход и бритьё.'
        }
      },
      {
        id: 's4', image: IMG + 'kit.jpg', badge: 'rating', cta: false,
        title: { ka: '4.9 · 140+ შეფასება', en: '4.9 · 140+ reviews', ru: '4.9 · 140+ отзывов' },
        text: {
          ka: '10K+ გამომწერი Instagram-ზე: @gentlemantbilisi.',
          en: '10K+ followers on Instagram: @gentlemantbilisi.',
          ru: '10K+ подписчиков в Instagram: @gentlemantbilisi.'
        }
      },
      {
        id: 's5', image: IMG + 'chair.jpg', badge: 'open', cta: false,
        title: { ka: 'საბურთალო, მეტროსთან', en: 'Saburtalo, by the metro', ru: 'Сабуртало, у метро' },
        text: {
          ka: 'მეტრო „ტექნიკური უნივერსიტეტი“ · ყოველდღე {hours}.',
          en: 'Technical University metro · every day, {hours}.',
          ru: 'Метро «Технический университет» · ежедневно, {hours}.'
        }
      }
    ],

    categories: [
      { id: 'hair', name: { ka: 'თმა', en: 'Hair', ru: 'Стрижка' } },
      { id: 'beard', name: { ka: 'წვერი და პარსვა', en: 'Beard and shave', ru: 'Борода и бритьё' } },
      { id: 'combo', name: { ka: 'კომბო: თმა + წვერი', en: 'Combo: hair + beard', ru: 'Комбо: стрижка + борода' } },
      { id: 'kids', name: { ka: 'ბავშვი', en: 'Kids', ru: 'Детям' } }
    ],

    /* ფასები ნიმუშია — ადმინიდან იცვლება. price ლარში, duration წუთებში. */
    services: [
      { id: 'sv1', cat: 'hair', price: 40, duration: 45,
        name: { ka: 'კლასიკური შეჭრა', en: 'Classic haircut', ru: 'Классическая стрижка' },
        desc: { ka: 'მაკრატლით და მანქანით, დავარცხნით.', en: 'Scissors and clippers, styled to finish.', ru: 'Ножницы и машинка, с укладкой.' } },
      { id: 'sv2', cat: 'hair', price: 45, duration: 50,
        name: { ka: 'ფეიდი', en: 'Fade', ru: 'Фейд' },
        desc: { ka: 'რბილი გადასვლა და სუფთა კონტური.', en: 'A smooth blend and clean edges.', ru: 'Плавный переход и чистый контур.' } },
      { id: 'sv3', cat: 'hair', price: 30, duration: 25,
        name: { ka: 'მანქანით შეჭრა', en: 'Clipper cut', ru: 'Стрижка машинкой' },
        desc: { ka: 'ერთი სიგრძე.', en: 'One length all over.', ru: 'Одна длина.' } },

      { id: 'sv4', cat: 'beard', price: 30, duration: 25,
        name: { ka: 'წვერის ფორმირება', en: 'Beard shaping', ru: 'Оформление бороды' },
        desc: { ka: 'სიგრძე და ფორმა სახის მიხედვით.', en: 'Length and shape matched to your face.', ru: 'Длина и форма под ваше лицо.' } },
      { id: 'sv5', cat: 'beard', price: 35, duration: 30,
        name: { ka: 'წვერის მოვლა', en: 'Beard care', ru: 'Уход за бородой' },
        desc: { ka: 'ფორმირება და მოვლა ერთ ვიზიტში.', en: 'Shaping and care in one visit.', ru: 'Оформление и уход за один визит.' } },
      { id: 'sv6', cat: 'beard', price: 35, duration: 30,
        name: { ka: 'პარსვა', en: 'Shave', ru: 'Бритьё' },
        desc: { ka: 'გლუვი პარსვა.', en: 'A smooth, close shave.', ru: 'Гладкое бритьё.' } },

      { id: 'sv7', cat: 'combo', price: 60, duration: 70,
        name: { ka: 'შეჭრა + წვერი', en: 'Haircut + beard', ru: 'Стрижка + борода' },
        desc: { ka: 'შეჭრა და წვერის ფორმირება ერთ ვიზიტში.', en: 'Haircut and beard shaping in one visit.', ru: 'Стрижка и оформление бороды за один визит.' } },
      { id: 'sv8', cat: 'combo', price: 60, duration: 70,
        name: { ka: 'შეჭრა + პარსვა', en: 'Haircut + shave', ru: 'Стрижка + бритьё' },
        desc: { ka: 'შეჭრა და პარსვა ერთად.', en: 'Haircut and a shave together.', ru: 'Стрижка и бритьё вместе.' } },

      { id: 'sv9', cat: 'kids', price: 30, duration: 30,
        name: { ka: 'ბავშვის შეჭრა', en: 'Kids haircut', ru: 'Детская стрижка' },
        desc: { ka: '12 წლამდე.', en: 'Up to 12 years.', ru: 'До 12 лет.' } },
      { id: 'sv10', cat: 'kids', price: 60, duration: 70,
        name: { ka: 'მამა + შვილი', en: 'Father + son', ru: 'Папа + сын' },
        desc: { ka: 'ორი შეჭრა ერთ ვიზიტში.', en: 'Two haircuts in one visit.', ru: 'Две стрижки за один визит.' } }
    ],

    about: {
      lead: {
        ka: 'შეჭრა, წვერი და პარსვა ერთ სავარძელში — საბურთალოზე, მეტროსთან.',
        en: 'Haircut, beard and shave in one chair — in Saburtalo, by the metro.',
        ru: 'Стрижка, борода и бритьё в одном кресле — на Сабуртало, у метро.'
      },
      text: {
        ka: 'შეფასებებში კლიენტები ყველაზე ხშირად გუნდის პროფესიონალიზმს, სისუფთავესა და ატმოსფეროს აღნიშნავენ.',
        en: 'In their reviews, clients most often mention the team’s skill, the clean shop and the atmosphere.',
        ru: 'В отзывах клиенты чаще всего отмечают профессионализм команды, чистоту и атмосферу.'
      }
    },

    /* photo ცარიელია → ჩანს სახელის პირველი ასო. langs: მომსახურების ენები. */
    barbers: [
      { id: 'b1', photo: '', langs: ['ka', 'ru', 'en'],
        name: { ka: 'რაული', en: 'Raul', ru: 'Рауль' },
        role: { ka: 'ბარბერი', en: 'Barber', ru: 'Барбер' },
        bio: { ka: 'შეჭრა, ფეიდი, წვერი', en: 'Haircuts, fades, beards', ru: 'Стрижки, фейд, борода' } },
      { id: 'b2', photo: '', langs: ['ka', 'ru', 'en'],
        name: { ka: 'გიორგი', en: 'Giorgi', ru: 'Георгий' },
        role: { ka: 'ბარბერი', en: 'Barber', ru: 'Барбер' },
        bio: { ka: 'შეჭრა, წვერი, პარსვა', en: 'Haircuts, beards, shaves', ru: 'Стрижки, борода, бритьё' } },
      { id: 'b3', photo: '', langs: ['ka'],
        name: { ka: 'მესამე ბარბერი', en: 'Third barber', ru: 'Третий барбер' },
        role: { ka: 'ბარბერი', en: 'Barber', ru: 'Барбер' },
        bio: { ka: 'სახელი და ფოტო დაემატება', en: 'Name and photo to be added', ru: 'Имя и фото будут добавлены' } }
    ],

    /* ნიმუში ფოტოები (თავისუფალი ლიცენზია) — ჩანაცვლდება სალონის ნამუშევრებით. */
    gallery: [
      { id: 'g1', src: IMG + 'fade.jpg', alt: { ka: 'ფეიდი მანქანით', en: 'A fade with clippers', ru: 'Фейд машинкой' } },
      { id: 'g2', src: IMG + 'razor.jpg', alt: { ka: 'წვერის კონტური სამართებლით', en: 'Lining up a beard with a razor', ru: 'Окантовка бороды бритвой' } },
      { id: 'g3', src: IMG + 'window.jpg', alt: { ka: 'ბარბერი მუშაობისას', en: 'A barber at work', ru: 'Барбер за работой' } },
      { id: 'g4', src: IMG + 'kit.jpg', alt: { ka: 'საპარსი ფუნჯი და ინსტრუმენტები', en: 'A shaving brush and tools', ru: 'Помазок и инструменты' } },
      { id: 'g5', src: IMG + 'towel.jpg', alt: { ka: 'პარსვის შემდეგ — ცხელი პირსახოცი', en: 'A hot towel after the shave', ru: 'Горячее полотенце после бритья' } },
      { id: 'g6', src: IMG + 'scissors.jpg', alt: { ka: 'მაკრატლები კედელზე', en: 'Scissors on the wall', ru: 'Ножницы на стене' } },
      { id: 'g7', src: IMG + 'chair.jpg', alt: { ka: 'ბარბერის სავარძელი', en: 'A barber chair', ru: 'Кресло барбера' } }
    ],

    /* კლიენტების სიტყვები გადმოცემულია ჩვენი სიტყვებით (წყარო: Madloba). */
    reviews: [
      { id: 'r1', text: { ka: 'მაღალი კვალიფიკაციის, პროფესიონალი გუნდი.', en: 'A highly skilled, professional team.', ru: 'Профессиональная команда высокого уровня.' } },
      { id: 'r2', text: { ka: 'სუფთა სალონი და კარგი მუსიკა.', en: 'A clean shop and good music.', ru: 'Чистый салон и хорошая музыка.' } },
      { id: 'r3', text: { ka: 'სწრაფი და ზუსტი შეჭრა.', en: 'A quick, precise cut.', ru: 'Быстрая и точная стрижка.' } },
      { id: 'r4', text: { ka: 'თბილისის ერთ-ერთი საუკეთესო ბარბერშოპი.', en: 'One of the best barbershops in Tbilisi.', ru: 'Один из лучших барбершопов Тбилиси.' } }
    ],

    /* status: new | confirmed | cancelled */
    bookings: []
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ძველ შენახულ მონაცემებს ავსებს ახალი ველებით, რომ განახლებისას არაფერი გატყდეს. */
  function mergeDefaults(saved, def) {
    if (saved === null || typeof saved !== 'object' || Array.isArray(saved)) return saved === undefined ? clone(def) : saved;
    Object.keys(def).forEach(function (k) {
      if (saved[k] === undefined) saved[k] = clone(def[k]);
      else if (def[k] && typeof def[k] === 'object' && !Array.isArray(def[k])) mergeDefaults(saved[k], def[k]);
    });
    return saved;
  }

  var TBStore = {
    KEY: STORAGE_KEY,
    defaults: function () { return clone(DEFAULT_DATA); },
    load: function () {
      try {
        var raw = global.localStorage.getItem(STORAGE_KEY);
        if (raw) return mergeDefaults(JSON.parse(raw), DEFAULT_DATA);
      } catch (e) { /* localStorage მიუწვდომელია ან JSON დაზიანებულია */ }
      return clone(DEFAULT_DATA);
    },
    /* აბრუნებს true-ს, თუ შეინახა; false — თუ მეხსიერება გაივსო. */
    save: function (data) {
      try {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (e) { return false; }
    },
    reset: function () {
      try { global.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      return clone(DEFAULT_DATA);
    },
    /* cb გამოიძახება, როცა მონაცემები სხვა ჩანართში (ადმინში) შეიცვლება. */
    onExternalChange: function (cb) {
      global.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY || e.key === null) cb(TBStore.load());
      });
    },
    uid: function (prefix) {
      return (prefix || 'id') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
  };

  /* თბილისის დრო (UTC+4), მომხმარებლის მოწყობილობის სარტყლის მიუხედავად. */
  var TBTime = {
    now: function () {
      var parts = {};
      try {
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Tbilisi', year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short'
        }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
      } catch (e) {
        var d = new Date(Date.now() + 4 * 3600000);
        parts = {
          year: String(d.getUTCFullYear()), month: ('0' + (d.getUTCMonth() + 1)).slice(-2), day: ('0' + d.getUTCDate()).slice(-2),
          hour: ('0' + d.getUTCHours()).slice(-2), minute: ('0' + d.getUTCMinutes()).slice(-2),
          weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()]
        };
      }
      var dow = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[parts.weekday];
      return {
        date: parts.year + '-' + parts.month + '-' + parts.day,
        minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10),
        dow: dow
      };
    },
    toMin: function (hhmm) { var p = String(hhmm).split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1] || '0', 10); },
    toHHMM: function (min) { return ('0' + Math.floor(min / 60)).slice(-2) + ':' + ('0' + (min % 60)).slice(-2); },
    /* date 'YYYY-MM-DD' + n დღე */
    addDays: function (date, n) {
      var p = date.split('-'); var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n));
      return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
    },
    dowOf: function (date) {
      var p = date.split('-'); return (new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay() + 6) % 7;
    },
    /* აბრუნებს {open:boolean, until:'19:00'} ან {open:false, next:'10:00', nextDow:n} */
    status: function (hours) {
      var n = TBTime.now(); var h = hours[n.dow];
      if (h && !h.closed && n.minutes >= TBTime.toMin(h.open) && n.minutes < TBTime.toMin(h.close)) return { open: true, until: h.close };
      if (h && !h.closed && n.minutes < TBTime.toMin(h.open)) return { open: false, next: h.open, today: true };
      for (var i = 1; i <= 7; i++) {
        var d = (n.dow + i) % 7;
        if (hours[d] && !hours[d].closed) return { open: false, next: hours[d].open, today: false, tomorrow: i === 1, nextDow: d };
      }
      return { open: false };
    }
  };

  global.TBStore = TBStore;
  global.TBTime = TBTime;
})(window);
