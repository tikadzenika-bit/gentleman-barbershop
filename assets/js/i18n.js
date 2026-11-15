/* ინტერფეისის ტექსტები სამ ენაზე. შინაარსი (სერვისები, სლაიდები და ა.შ.) data.js-შია. */
(function (global) {
  'use strict';

  var STR = {
    ka: {
      'meta.title': 'Gentleman Barbershop Tbilisi — ბარბერშოპი საბურთალოზე',
      'meta.desc': 'ბარბერშოპი საბურთალოზე, მეტრო „ტექნიკური უნივერსიტეტი“-სთან: შეჭრა, ფეიდი, წვერის მოვლა და პარსვა. 4.9 ★ · 140+ შეფასება. ყოველდღე 11:00–20:00. ჩაეწერე WhatsApp-ით.',
      'skip': 'გადასვლა შინაარსზე',
      'nav.home': 'მთავარი', 'nav.services': 'სერვისები და ფასები', 'nav.barbers': 'ბარბერები',
      'nav.gallery': 'ნამუშევრები', 'nav.reviews': 'შეფასებები', 'nav.contact': 'კონტაქტი', 'nav.book': 'ჩაწერა',
      'nav.menu': 'მენიუ', 'nav.close': 'დახურვა', 'nav.lang': 'ენა',
      'hero.what': 'ბარბერშოპი · თბილისი, საბურთალო',
      'hero.book': 'ჩაწერა', 'hero.prices': 'ფასების ნახვა', 'hero.prev': 'წინა სლაიდი', 'hero.next': 'შემდეგი სლაიდი',
      'hero.pause': 'სლაიდების შეჩერება', 'hero.play': 'სლაიდების გაშვება', 'hero.slide': 'სლაიდი', 'hero.label': 'მთავარი სლაიდები',
      'hero.route': 'მარშრუტი',
      'marquee': 'შეჭრა · ფეიდი · წვერი · პარსვა',
      'open.now': 'ღიაა ახლა', 'open.until': '{t}-მდე', 'open.closed': 'დაიხურა',
      'open.opensToday': 'გაიხსნება {t}-ზე', 'open.opensTomorrow': 'გაიხსნება ხვალ {t}-ზე', 'open.opensDay': 'გაიხსნება: {d}, {t}',
      'services.title': 'სერვისები და ფასები',
      'services.lead': 'დააჭირე სერვისს — ჩაწერის ფორმა თავად შეივსება.',
      'services.min': 'წთ', 'services.pick': 'ჩაწერა ამ სერვისზე',
      'barbers.title': 'ბარბერები', 'barbers.lead': 'აირჩიე, ვის სავარძელში დაჯდები.',
      'barbers.bookWith': 'ჩაეწერე მასთან', 'barbers.langs': 'ენები',
      'lang.ka': 'ქართული', 'lang.en': 'English', 'lang.ru': 'Русский',
      'gallery.title': 'ნამუშევრები', 'gallery.note': 'ფოტოები ნიმუშია — ჩანაცვლდება სალონის ნამუშევრებით.',
      'gallery.more': 'მეტი Instagram-ზე',
      'gallery.prev': 'წინა ფოტოები', 'gallery.next': 'შემდეგი ფოტოები', 'gallery.open': 'ფოტოს გადიდება', 'gallery.close': 'დახურვა',
      'why.title': 'რატომ ჩვენ',
      'why.1.t': 'პროფესიონალი გუნდი', 'why.1.d': 'მაღალი კვალიფიკაციის ბარბერები — ასე გვაფასებენ კლიენტები.',
      'why.2.t': 'სისუფთავე', 'why.2.d': 'სუფთა, მოწესრიგებული სალონი.',
      'why.3.t': 'მუსიკა და ატმოსფერო', 'why.3.d': 'კარგი მუსიკა და მშვიდი გარემო.',
      'why.4.t': 'სამ ენაზე', 'why.4.d': 'გემსახურებით ქართულად, ინგლისურად და რუსულად.',
      'why.5.t': 'მეტროსთან ახლოს', 'why.5.d': 'მეტრო „ტექნიკური უნივერსიტეტი“-ს გვერდით.',
      'reviews.title': 'შეფასებები', 'reviews.count': '{n} შეფასება Madloba-ზე', 'reviews.short': '{n} შეფასება',
      'reviews.source': 'კლიენტების შეფასებებიდან, ჩვენი სიტყვებით.',
      'reviews.stars': 'შეფასება {r} 5-დან',
      'book.title': 'ჩაწერა', 'book.lead': 'აირჩიე სერვისი, ბარბერი და დრო. ღილაკი გახსნის WhatsApp-ს მზა ტექსტით — იქვე დაგიდასტურებთ.',
      'book.service': 'სერვისი', 'book.barber': 'ბარბერი', 'book.any': 'ნებისმიერი', 'book.day': 'დღე', 'book.time': 'საათი',
      'book.name': 'სახელი', 'book.phone': 'ტელეფონი', 'book.namePh': 'მაგ. ნიკა', 'book.phonePh': '5XX XX XX XX',
      'book.submit': 'ჩაწერა WhatsApp-ით', 'book.today': 'დღეს', 'book.tomorrow': 'ხვალ',
      'book.noSlots': 'ამ დღეს თავისუფალი დრო აღარ არის — აირჩიე სხვა დღე.',
      'book.closedDay': 'ამ დღეს არ ვმუშაობთ.',
      'book.errService': 'აირჩიე სერვისი.', 'book.errTime': 'აირჩიე საათი.', 'book.errName': 'ჩაწერე სახელი.',
      'book.errPhone': 'ჩაწერე ტელეფონის ნომერი (მინიმუმ 9 ციფრი).',
      'book.done': 'ჯავშანი გაიგზავნა', 'book.doneText': 'WhatsApp გაიხსნა მზა ტექსტით — გააგზავნე შეტყობინება და დაგიდასტურებთ. თუ არ გაიხსნა, დააჭირე ქვემოთ.',
      'book.openWa': 'WhatsApp-ის გახსნა', 'book.again': 'ახალი ჯავშანი',
      'book.summary': '{service} · {day}, {time}',
      'wa.msg': 'გამარჯობა! მინდა ჩაწერა Gentleman Barbershop-ში.\nსერვისი: {service} ({price} ₾)\nბარბერი: {barber}\nდღე: {day}\nსაათი: {time}\nსახელი: {name}\nტელეფონი: {phone}',
      'wa.hello': 'გამარჯობა! მაქვს შეკითხვა.',
      'contact.title': 'კონტაქტი', 'contact.address': 'მისამართი', 'contact.hours': 'სამუშაო საათები',
      'contact.whatsapp': 'WhatsApp', 'contact.facebook': 'Facebook', 'contact.instagram': 'Instagram',
      'contact.route': 'მარშრუტის აგება', 'contact.map': 'რუკა: Gentleman Barbershop, ბიძინა კვერნაძის ქ. 13', 'contact.closed': 'დასვენება',
      'contact.everyday': 'ყოველდღე',
      'day.0': 'ორშაბათი', 'day.1': 'სამშაბათი', 'day.2': 'ოთხშაბათი', 'day.3': 'ხუთშაბათი', 'day.4': 'პარასკევი', 'day.5': 'შაბათი', 'day.6': 'კვირა',
      'dayShort.0': 'ორშ', 'dayShort.1': 'სამ', 'dayShort.2': 'ოთხ', 'dayShort.3': 'ხუთ', 'dayShort.4': 'პარ', 'dayShort.5': 'შაბ', 'dayShort.6': 'კვ',
      'month.1': 'იანვარი', 'month.2': 'თებერვალი', 'month.3': 'მარტი', 'month.4': 'აპრილი', 'month.5': 'მაისი', 'month.6': 'ივნისი',
      'month.7': 'ივლისი', 'month.8': 'აგვისტო', 'month.9': 'სექტემბერი', 'month.10': 'ოქტომბერი', 'month.11': 'ნოემბერი', 'month.12': 'დეკემბერი',
      'footer.invite': 'სავარძელი გელოდებათ',
      'footer.demo': 'დემო ვერსია — ფასები და ფოტოები ნიმუშია.',
      'footer.credits': 'ფოტოები: Nick Demou, Robin Vanden Berghe, Skitter Photo, Christoffer Engström — StockSnap (CC0).',
      'footer.map': 'რუკა © OpenStreetMap-ის მონაწილეები.',
      'footer.by': 'საიტი: NNN Holding',
      'float.wa': 'მოგვწერე WhatsApp-ზე'
    },
    en: {
      'meta.title': 'Gentleman Barbershop Tbilisi — barbershop in Saburtalo',
      'meta.desc': 'A barbershop in Saburtalo, Tbilisi, by Technical University metro: haircuts, fades, beard care and shaves. 4.9 ★ · 140+ reviews. Open daily 11:00–20:00. Book on WhatsApp.',
      'skip': 'Skip to content',
      'nav.home': 'Home', 'nav.services': 'Services and prices', 'nav.barbers': 'Barbers',
      'nav.gallery': 'Our work', 'nav.reviews': 'Reviews', 'nav.contact': 'Contact', 'nav.book': 'Book',
      'nav.menu': 'Menu', 'nav.close': 'Close', 'nav.lang': 'Language',
      'hero.what': 'Barbershop · Saburtalo, Tbilisi',
      'hero.book': 'Book a visit', 'hero.prices': 'See prices', 'hero.prev': 'Previous slide', 'hero.next': 'Next slide',
      'hero.pause': 'Pause slides', 'hero.play': 'Play slides', 'hero.slide': 'Slide', 'hero.label': 'Featured slides',
      'hero.route': 'Directions',
      'marquee': 'Haircut · Fade · Beard · Shave',
      'open.now': 'Open now', 'open.until': 'until {t}', 'open.closed': 'Closed',
      'open.opensToday': 'opens at {t}', 'open.opensTomorrow': 'opens tomorrow at {t}', 'open.opensDay': 'opens {d} at {t}',
      'services.title': 'Services and prices',
      'services.lead': 'Tap a service and the booking form fills itself in.',
      'services.min': 'min', 'services.pick': 'Book this service',
      'barbers.title': 'Barbers', 'barbers.lead': 'Choose whose chair you sit in.',
      'barbers.bookWith': 'Book with him', 'barbers.langs': 'Languages',
      'lang.ka': 'ქართული', 'lang.en': 'English', 'lang.ru': 'Русский',
      'gallery.title': 'Our work', 'gallery.note': 'Sample photos — to be replaced with the shop’s own work.',
      'gallery.more': 'More on Instagram',
      'gallery.prev': 'Previous photos', 'gallery.next': 'Next photos', 'gallery.open': 'Enlarge photo', 'gallery.close': 'Close',
      'why.title': 'Why us',
      'why.1.t': 'A professional team', 'why.1.d': 'Highly skilled barbers — that is how clients rate us.',
      'why.2.t': 'Clean', 'why.2.d': 'A clean, tidy shop.',
      'why.3.t': 'Music and atmosphere', 'why.3.d': 'Good music and a relaxed room.',
      'why.4.t': 'Three languages', 'why.4.d': 'We speak Georgian, English and Russian.',
      'why.5.t': 'By the metro', 'why.5.d': 'Next to Technical University station.',
      'reviews.title': 'Reviews', 'reviews.count': '{n} reviews on Madloba', 'reviews.short': '{n} reviews',
      'reviews.source': 'From client reviews, in our own words.',
      'reviews.stars': 'Rated {r} out of 5',
      'book.title': 'Book a visit', 'book.lead': 'Choose a service, a barber and a time. The button opens WhatsApp with the message ready — we confirm right there.',
      'book.service': 'Service', 'book.barber': 'Barber', 'book.any': 'Any barber', 'book.day': 'Day', 'book.time': 'Time',
      'book.name': 'Name', 'book.phone': 'Phone', 'book.namePh': 'e.g. Nika', 'book.phonePh': '5XX XX XX XX',
      'book.submit': 'Book on WhatsApp', 'book.today': 'Today', 'book.tomorrow': 'Tomorrow',
      'book.noSlots': 'No free times left on this day — please pick another.',
      'book.closedDay': 'We are closed on this day.',
      'book.errService': 'Choose a service.', 'book.errTime': 'Choose a time.', 'book.errName': 'Enter your name.',
      'book.errPhone': 'Enter a phone number (at least 9 digits).',
      'book.done': 'Booking sent', 'book.doneText': 'WhatsApp opened with your message ready — send it and we will confirm. If it did not open, use the button below.',
      'book.openWa': 'Open WhatsApp', 'book.again': 'New booking',
      'book.summary': '{service} · {day}, {time}',
      'wa.msg': 'Hello! I would like to book at Gentleman Barbershop.\nService: {service} ({price} ₾)\nBarber: {barber}\nDay: {day}\nTime: {time}\nName: {name}\nPhone: {phone}',
      'wa.hello': 'Hello! I have a question.',
      'contact.title': 'Contact', 'contact.address': 'Address', 'contact.hours': 'Opening hours',
      'contact.whatsapp': 'WhatsApp', 'contact.facebook': 'Facebook', 'contact.instagram': 'Instagram',
      'contact.route': 'Get directions', 'contact.map': 'Map: Gentleman Barbershop, 13 Bidzina Kvernadze St', 'contact.closed': 'Closed',
      'contact.everyday': 'Every day',
      'day.0': 'Monday', 'day.1': 'Tuesday', 'day.2': 'Wednesday', 'day.3': 'Thursday', 'day.4': 'Friday', 'day.5': 'Saturday', 'day.6': 'Sunday',
      'dayShort.0': 'Mon', 'dayShort.1': 'Tue', 'dayShort.2': 'Wed', 'dayShort.3': 'Thu', 'dayShort.4': 'Fri', 'dayShort.5': 'Sat', 'dayShort.6': 'Sun',
      'month.1': 'January', 'month.2': 'February', 'month.3': 'March', 'month.4': 'April', 'month.5': 'May', 'month.6': 'June',
      'month.7': 'July', 'month.8': 'August', 'month.9': 'September', 'month.10': 'October', 'month.11': 'November', 'month.12': 'December',
      'footer.invite': 'Your chair is waiting',
      'footer.demo': 'Demo version — prices and photos are samples.',
      'footer.credits': 'Photos: Nick Demou, Robin Vanden Berghe, Skitter Photo, Christoffer Engström — StockSnap (CC0).',
      'footer.map': 'Map © OpenStreetMap contributors.',
      'footer.by': 'Website: NNN Holding',
      'float.wa': 'Message us on WhatsApp'
    },
    ru: {
      'meta.title': 'Gentleman Barbershop Tbilisi — барбершоп на Сабуртало',
      'meta.desc': 'Барбершоп на Сабуртало в Тбилиси, у метро «Технический университет»: стрижки, фейд, уход за бородой и бритьё. 4.9 ★ · 140+ отзывов. Ежедневно 11:00–20:00. Запись в WhatsApp.',
      'skip': 'Перейти к содержимому',
      'nav.home': 'Главная', 'nav.services': 'Услуги и цены', 'nav.barbers': 'Барберы',
      'nav.gallery': 'Работы', 'nav.reviews': 'Отзывы', 'nav.contact': 'Контакты', 'nav.book': 'Запись',
      'nav.menu': 'Меню', 'nav.close': 'Закрыть', 'nav.lang': 'Язык',
      'hero.what': 'Барбершоп · Тбилиси, Сабуртало',
      'hero.book': 'Записаться', 'hero.prices': 'Смотреть цены', 'hero.prev': 'Предыдущий слайд', 'hero.next': 'Следующий слайд',
      'hero.pause': 'Остановить слайды', 'hero.play': 'Запустить слайды', 'hero.slide': 'Слайд', 'hero.label': 'Главные слайды',
      'hero.route': 'Маршрут',
      'marquee': 'Стрижка · Фейд · Борода · Бритьё',
      'open.now': 'Открыто', 'open.until': 'до {t}', 'open.closed': 'Закрыто',
      'open.opensToday': 'откроется в {t}', 'open.opensTomorrow': 'откроется завтра в {t}', 'open.opensDay': 'откроется: {d}, {t}',
      'services.title': 'Услуги и цены',
      'services.lead': 'Нажмите на услугу — форма записи заполнится сама.',
      'services.min': 'мин', 'services.pick': 'Записаться на эту услугу',
      'barbers.title': 'Барберы', 'barbers.lead': 'Выберите, в чьё кресло сесть.',
      'barbers.bookWith': 'Записаться к нему', 'barbers.langs': 'Языки',
      'lang.ka': 'ქართული', 'lang.en': 'English', 'lang.ru': 'Русский',
      'gallery.title': 'Работы', 'gallery.note': 'Фото — образцы, их заменят работы салона.',
      'gallery.more': 'Больше в Instagram',
      'gallery.prev': 'Предыдущие фото', 'gallery.next': 'Следующие фото', 'gallery.open': 'Увеличить фото', 'gallery.close': 'Закрыть',
      'why.title': 'Почему мы',
      'why.1.t': 'Профессиональная команда', 'why.1.d': 'Барберы высокого уровня — так нас оценивают клиенты.',
      'why.2.t': 'Чистота', 'why.2.d': 'Чистый, аккуратный салон.',
      'why.3.t': 'Музыка и атмосфера', 'why.3.d': 'Хорошая музыка и спокойная обстановка.',
      'why.4.t': 'На трёх языках', 'why.4.d': 'Говорим по-грузински, по-английски и по-русски.',
      'why.5.t': 'Рядом с метро', 'why.5.d': 'У станции «Технический университет».',
      'reviews.title': 'Отзывы', 'reviews.count': '{n} отзывов на Madloba', 'reviews.short': '{n} отзывов',
      'reviews.source': 'Из отзывов клиентов, своими словами.',
      'reviews.stars': 'Оценка {r} из 5',
      'book.title': 'Запись', 'book.lead': 'Выберите услугу, барбера и время. Кнопка откроет WhatsApp с готовым текстом — подтвердим там же.',
      'book.service': 'Услуга', 'book.barber': 'Барбер', 'book.any': 'Любой', 'book.day': 'День', 'book.time': 'Время',
      'book.name': 'Имя', 'book.phone': 'Телефон', 'book.namePh': 'напр. Ника', 'book.phonePh': '5XX XX XX XX',
      'book.submit': 'Записаться в WhatsApp', 'book.today': 'Сегодня', 'book.tomorrow': 'Завтра',
      'book.noSlots': 'На этот день свободного времени нет — выберите другой.',
      'book.closedDay': 'В этот день мы не работаем.',
      'book.errService': 'Выберите услугу.', 'book.errTime': 'Выберите время.', 'book.errName': 'Укажите имя.',
      'book.errPhone': 'Укажите номер телефона (не меньше 9 цифр).',
      'book.done': 'Заявка отправлена', 'book.doneText': 'WhatsApp открылся с готовым текстом — отправьте сообщение, и мы подтвердим. Если не открылся, нажмите кнопку ниже.',
      'book.openWa': 'Открыть WhatsApp', 'book.again': 'Новая запись',
      'book.summary': '{service} · {day}, {time}',
      'wa.msg': 'Здравствуйте! Хочу записаться в Gentleman Barbershop.\nУслуга: {service} ({price} ₾)\nБарбер: {barber}\nДень: {day}\nВремя: {time}\nИмя: {name}\nТелефон: {phone}',
      'wa.hello': 'Здравствуйте! У меня вопрос.',
      'contact.title': 'Контакты', 'contact.address': 'Адрес', 'contact.hours': 'Часы работы',
      'contact.whatsapp': 'WhatsApp', 'contact.facebook': 'Facebook', 'contact.instagram': 'Instagram',
      'contact.route': 'Построить маршрут', 'contact.map': 'Карта: Gentleman Barbershop, ул. Бидзины Квернадзе, 13', 'contact.closed': 'Выходной',
      'contact.everyday': 'Ежедневно',
      'day.0': 'Понедельник', 'day.1': 'Вторник', 'day.2': 'Среда', 'day.3': 'Четверг', 'day.4': 'Пятница', 'day.5': 'Суббота', 'day.6': 'Воскресенье',
      'dayShort.0': 'Пн', 'dayShort.1': 'Вт', 'dayShort.2': 'Ср', 'dayShort.3': 'Чт', 'dayShort.4': 'Пт', 'dayShort.5': 'Сб', 'dayShort.6': 'Вс',
      'month.1': 'января', 'month.2': 'февраля', 'month.3': 'марта', 'month.4': 'апреля', 'month.5': 'мая', 'month.6': 'июня',
      'month.7': 'июля', 'month.8': 'августа', 'month.9': 'сентября', 'month.10': 'октября', 'month.11': 'ноября', 'month.12': 'декабря',
      'footer.invite': 'Кресло ждёт вас',
      'footer.demo': 'Демо-версия — цены и фотографии являются образцами.',
      'footer.credits': 'Фото: Nick Demou, Robin Vanden Berghe, Skitter Photo, Christoffer Engström — StockSnap (CC0).',
      'footer.map': 'Карта © участники OpenStreetMap.',
      'footer.by': 'Сайт: NNN Holding',
      'float.wa': 'Написать в WhatsApp'
    }
  };

  var LANGS = ['ka', 'en', 'ru'];
  var LANG_KEY = 'gentleman.lang';

  function detect() {
    try {
      var q = new URLSearchParams(global.location.search).get('lang');
      if (LANGS.indexOf(q) > -1) return q;
      var s = global.localStorage.getItem(LANG_KEY);
      if (LANGS.indexOf(s) > -1) return s;
    } catch (e) {}
    return 'ka';
  }

  var TBI18n = {
    langs: LANGS,
    lang: detect(),
    set: function (l) {
      if (LANGS.indexOf(l) === -1) return;
      TBI18n.lang = l;
      try { global.localStorage.setItem(LANG_KEY, l); } catch (e) {}
    },
    /* ინტერფეისის ტექსტი; vars: {t:'20:00'} → ჩანაცვლება {t}-ზე */
    t: function (key, vars) {
      var s = (STR[TBI18n.lang] && STR[TBI18n.lang][key]) || STR.ka[key] || key;
      if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
      return s;
    },
    /* შინაარსის ველი {ka,en,ru} → მიმდინარე ენა, თუ ცარიელია — ქართული */
    c: function (field) {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      return field[TBI18n.lang] || field.ka || field.en || '';
    }
  };

  global.TBI18n = TBI18n;
})(window);
