document.addEventListener('DOMContentLoaded', () => {

  // [01] Modal open / close ------------------------------------------------

  const modal = document.querySelector('#settingsModal');
  const openBtn = document.querySelector('#openBtn');
  const closeBtn = document.querySelector('#closeBtn');

  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });

  // Clicking the dimmed backdrop also closes the modal
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });

  // [03] Sidebar tab switching ----------------------------------------------

  const tabLinks = document.querySelectorAll('.settings-nav-link');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // links use href="#", stop the page from jumping

      const targetTab = link.getAttribute('data-tab');

      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      tabPanels.forEach(panel => panel.classList.remove('active'));
      const targetPanel = document.querySelector('#' + targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // [07] Theme switcher: Light / Dark / System -------------------------------

  const themeCards = document.querySelectorAll('.theme-card');

  // Applies a theme to the document. Shared by the initial load and every
  // click, so the logic only lives in one place.
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }

  // Apply whichever theme card is marked checked in the HTML on page load
  const initialThemeInput = document.querySelector('.theme-card input:checked');
  if (initialThemeInput) {
    applyTheme(initialThemeInput.value);
  }

  // Keep the page in sync if the OS theme changes while "System" is selected
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentThemeInput = document.querySelector('.theme-card input:checked');
    if (currentThemeInput && currentThemeInput.value === 'system') {
      applyTheme('system');
    }
  });

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const theme = card.querySelector('input').value;
      applyTheme(theme);
    });
  });

  // [08] Accent color picker -------------------------------------------------

  const colorSwatches = document.querySelectorAll('.color-swatch');

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');

      const accent = swatch.getAttribute('data-accent');
      document.documentElement.setAttribute('data-accent', accent);
    });
  });

  // [09] Emoji skin tone preference (visual selection only, no persistence yet)

  const emojiToneItems = document.querySelectorAll('.emoji-tone-item');

  emojiToneItems.forEach(item => {
    item.addEventListener('click', () => {
      emojiToneItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    });
  });

  // [09] Custom select dropdowns (replaces native <select>) -----------------

  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const valueLabel = select.querySelector('.custom-select-value');
    const options = select.querySelectorAll('.custom-select-option');

    trigger.addEventListener('click', () => {
      const isOpening = !select.classList.contains('open');
      select.classList.toggle('open');

      if (isOpening) {
        // Flip the list above the trigger if there isn't enough room below
        const triggerRect = trigger.getBoundingClientRect();
        const optionsHeight = select.querySelector('.custom-select-options').offsetHeight;
        const spaceBelow = window.innerHeight - triggerRect.bottom;

        select.classList.toggle('open-up', spaceBelow < optionsHeight);
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

  // Clicking anywhere outside an open dropdown closes it
  document.addEventListener('click', (event) => {
    customSelects.forEach(select => {
      if (!select.contains(event.target)) {
        select.classList.remove('open');
      }
    });
  });

  // [11] Copy version number to clipboard ------------------------------------

  const copyVersionBtn = document.querySelector('#copyVersionBtn');

  if (copyVersionBtn) {
    const copyIcon = copyVersionBtn.querySelector('.copy-icon');
    const checkIcon = copyVersionBtn.querySelector('.check-icon');

    copyVersionBtn.addEventListener('click', async () => {
      const versionText = copyVersionBtn.querySelector('.version-text').textContent.trim();

      try {
        await navigator.clipboard.writeText(versionText);

        copyVersionBtn.classList.add('copied');
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'block';

        setTimeout(() => {
          copyVersionBtn.classList.remove('copied');
          copyIcon.style.display = 'block';
          checkIcon.style.display = 'none';
        }, 1500);
      } catch (err) {
        console.error('Failed to copy version to clipboard:', err);
      }
    });
  }

});