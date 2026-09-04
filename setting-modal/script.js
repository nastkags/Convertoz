document.addEventListener('DOMContentLoaded', () => {

  // Находим три элемента: саму модалку, кнопку открытия и кнопку закрытия
  const modal = document.querySelector('#settingsModal');
  const openBtn = document.querySelector('#openBtn');
  const closeBtn = document.querySelector('#closeBtn');

  // Клик по кнопке "Открыть настройки" → показываем модалку
  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  // Клик по кнопке "✕" → закрываем модалку
  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  // Бонус: клик по затемнённому фону тоже закрывает модалку
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  // ===== Переключение вкладок в настройках =====

  // Находим все ссылки меню и все панели контента
  const tabLinks = document.querySelectorAll('.settings-nav-link');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      // Не даём ссылке "прыгать" по странице (у нас href="#")
      event.preventDefault();

      // Узнаём, какую вкладку нужно показать
      const targetTab = link.getAttribute('data-tab');

      // 1. Убираем класс "active" у всех ссылок меню
      tabLinks.forEach(l => l.classList.remove('active'));
      // 2. Добавляем "active" только той ссылке, по которой кликнули
      link.classList.add('active');

      // 3. Скрываем все панели контента
      tabPanels.forEach(panel => panel.classList.remove('active'));
      // 4. Показываем только ту панель, у которой id совпадает с data-tab
      const targetPanel = document.querySelector('#' + targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ===== Карточки выбора темы (Light / Dark / System) =====
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach(card => {
    card.addEventListener('click', () => {

      // Убираем selected со всех карточек
      themeCards.forEach(c => c.classList.remove('selected'));

      // Выбираем нажатую карточку
      card.classList.add('selected');

      // Получаем выбранную тему
      const theme = card.querySelector('input').value;

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');

      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');

      } else if (theme === 'system') {
        // Пока просто определяем тему системы
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  });

  // ===== Цветовые кружки акцента =====
 // ===== Выбор Accent color =====

const colorSwatches = document.querySelectorAll('.color-swatch');

colorSwatches.forEach(swatch => {

  swatch.addEventListener('click', () => {

    // Убираем selected со всех цветов
    colorSwatches.forEach(s => {
      s.classList.remove('selected');
    });

    // Выбираем нажатый цвет
    swatch.classList.add('selected');

    // Получаем название цвета
    const accent = swatch.getAttribute('data-accent');

    // Меняем data-accent у <html>
    document.documentElement.setAttribute('data-accent', accent);
  });

});

});


// ===== Emoji skin tone (в стиле GitHub) =====
const emojiToneItems = document.querySelectorAll('.emoji-tone-item');

emojiToneItems.forEach(item => {
  item.addEventListener('click', () => {
    emojiToneItems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

// ===== Кастомные dropdown-списки (замена нативного <select>) =====
const customSelects = document.querySelectorAll('.custom-select');

customSelects.forEach(select => {
  const trigger = select.querySelector('.custom-select-trigger');
  const valueLabel = select.querySelector('.custom-select-value');
  const options = select.querySelectorAll('.custom-select-option');

  trigger.addEventListener('click', () => {
    const isOpening = !select.classList.contains('open');

    select.classList.toggle('open');

    if (isOpening) {
      const triggerRect = trigger.getBoundingClientRect();
      const optionsHeight = select.querySelector('.custom-select-options').offsetHeight;
      const spaceBelow = window.innerHeight - triggerRect.bottom;

      if (spaceBelow < optionsHeight) {
        select.classList.add('open-up');
      } else {
        select.classList.remove('open-up');
      }
    }
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      valueLabel.textContent = option.getAttribute('data-value');
      select.classList.remove('open');
    });
  });
});

// Клик где угодно вне dropdown — закрывает все открытые списки
document.addEventListener('click', (event) => {
  customSelects.forEach(select => {
    if (!select.contains(event.target)) {
      select.classList.remove('open');
    }
  });
});