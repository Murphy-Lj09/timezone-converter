const { DateTime } = luxon;

// Translation Dictionary
const translations = {
  zh: {
    // Page title
    'page-title': '跨时区面试时间转换器',

    // Main interface labels
    'interview-time-label': '面试时间（面试官时区）:',
    'interviewer-tz-label': '面试官时区:',
    'candidate-tz-label': '面试者时区:',
    'now-btn': '现在',
    'convert-btn': '转换时间',
    'download-ics-btn': '下载日历提醒',
    'copy-btn': '一键复制',
    'copy-btn-sub': '面试当地时间',

    // Title bubble
    'title-bubble': '🌐跨时区面试时间转换器',

    // Credit box and popup
    'credit-box': '🎁 点我有惊喜',
    'popup-text': '🐱 谢谢使用！<br>想合作或交流？<br>✉️ lim84356@gmail.com',

    // Alert messages
    'enter-time-alert': '请输入面试时间',
    'convert-first-alert': '请先转换时间',
    'copied-alert': '已复制到剪贴板',
    'copy-failed-alert': '复制失败，请手动选择文字',

    // Result display
    'candidate-local-time': '面试者本地时间',
    'same-timezone': '两地时间相同',
    'timezone-faster': '目标时区比原时区 快',
    'timezone-slower': '目标时区比原时区 慢',
    'hours-unit': '小时',

    // Calendar and copy text
    'interview-reminder': '面试提醒',
    'interview-reminder-desc': '跨时区面试提醒',
    'ics-filename': '面试提醒.ics',

    // Timezone labels (keeping bilingual format as per requirements)
    'tz-pacific': 'Pacific Time (洛杉矶, 西雅图)',
    'tz-eastern': 'Eastern Time (纽约, 华盛顿)',
    'tz-london': 'London Time (伦敦)',
    'tz-central-europe': 'Central Europe Time (巴黎, 柏林)',
    'tz-china': 'China Standard Time (北京, 上海)',
    'tz-japan': 'Japan Standard Time (东京)',
    'tz-sydney': 'Sydney Time (悉尼)'
  },
  en: {
    // Page title
    'page-title': 'Cross-Timezone Interview Time Converter',

    // Main interface labels
    'interview-time-label': 'Interview Time (Interviewer\'s Timezone):',
    'interviewer-tz-label': 'Interviewer\'s Timezone:',
    'candidate-tz-label': 'Candidate\'s Timezone:',
    'now-btn': 'Now',
    'convert-btn': 'Convert Time',
    'download-ics-btn': 'Download Calendar Reminder',
    'copy-btn': 'Copy',
    'copy-btn-sub': 'Local Interview Time',

    // Title bubble
    'title-bubble': '🌐Cross-Timezone Interview Converter',

    // Credit box and popup
    'credit-box': '🎁 Click for Surprise',
    'popup-text': '🐱 Thanks for using!<br>Want to collaborate?<br>✉️ lim84356@gmail.com',

    // Alert messages
    'enter-time-alert': 'Please enter interview time',
    'convert-first-alert': 'Please convert time first',
    'copied-alert': 'Copied to clipboard',
    'copy-failed-alert': 'Copy failed, please select text manually',

    // Result display
    'candidate-local-time': 'Candidate\'s Local Time',
    'same-timezone': 'Same timezone',
    'timezone-faster': 'Target timezone is',
    'timezone-slower': 'Target timezone is',
    'hours-unit': 'hours ahead',
    'hours-unit-behind': 'hours behind',

    // Calendar and copy text
    'interview-reminder': 'Interview Reminder',
    'interview-reminder-desc': 'Cross-timezone Interview Reminder',
    'ics-filename': 'interview-reminder.ics',

    // Timezone labels (keeping bilingual format as per requirements)
    'tz-pacific': 'Pacific Time (Los Angeles, Seattle)',
    'tz-eastern': 'Eastern Time (New York, Washington)',
    'tz-london': 'London Time (London)',
    'tz-central-europe': 'Central Europe Time (Paris, Berlin)',
    'tz-china': 'China Standard Time (Beijing, Shanghai)',
    'tz-japan': 'Japan Standard Time (Tokyo)',
    'tz-sydney': 'Sydney Time (Sydney)'
  }
};

// Language Switcher Class
class LanguageSwitcher {
  constructor() {
    this.currentLanguage = 'zh'; // Default language
    this.loadLanguagePreference();
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  switchLanguage() {
    const startTime = performance.now();

    this.currentLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
    this.saveLanguagePreference();
    this.updateDOM();

    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(`Language switching took ${duration.toFixed(2)}ms, which exceeds the 100ms requirement`);
    }
  }

  updateDOM() {
    const currentTranslations = translations[this.currentLanguage];

    // Preserve form state during language switching
    const formState = this.preserveFormState();

    // Batch DOM updates to minimize reflow
    const updates = [];

    // Update page title
    document.title = currentTranslations['page-title'];

    // Update elements with data-translate attributes
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (currentTranslations[key]) {
        updates.push(() => {
          if (element.innerHTML.includes('<br>')) {
            element.innerHTML = currentTranslations[key];
          } else {
            element.textContent = currentTranslations[key];
          }
        });
      } else {
        console.warn(`Missing translation key: ${key} for language: ${this.currentLanguage}`);
        // Fallback: keep original text if translation is missing
        if (this.currentLanguage !== 'zh' && translations.zh[key]) {
          updates.push(() => {
            if (element.innerHTML.includes('<br>')) {
              element.innerHTML = translations.zh[key];
            } else {
              element.textContent = translations.zh[key];
            }
          });
        }
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (currentTranslations[key]) {
        updates.push(() => {
          element.placeholder = currentTranslations[key];
        });
      } else {
        console.warn(`Missing translation key for placeholder: ${key} for language: ${this.currentLanguage}`);
        // Fallback: use Chinese translation if available
        if (this.currentLanguage !== 'zh' && translations.zh[key]) {
          updates.push(() => {
            element.placeholder = translations.zh[key];
          });
        }
      }
    });

    // Update title attributes
    document.querySelectorAll('[data-translate-title]').forEach(element => {
      const key = element.getAttribute('data-translate-title');
      if (currentTranslations[key]) {
        updates.push(() => {
          element.title = currentTranslations[key];
        });
      } else {
        console.warn(`Missing translation key for title: ${key} for language: ${this.currentLanguage}`);
        // Fallback: use Chinese translation if available
        if (this.currentLanguage !== 'zh' && translations.zh[key]) {
          updates.push(() => {
            element.title = translations.zh[key];
          });
        }
      }
    });

    // Execute all DOM updates in a single batch
    requestAnimationFrame(() => {
      updates.forEach(update => update());

      // Update timezone dropdowns after text updates
      const interviewerSelect = document.getElementById("interviewerTZ");
      const candidateSelect = document.getElementById("candidateTZ");
      const interviewerValue = interviewerSelect.value;
      const candidateValue = candidateSelect.value;

      populateTimeZones(interviewerSelect);
      populateTimeZones(candidateSelect);

      // Restore selected values
      interviewerSelect.value = interviewerValue;
      candidateSelect.value = candidateValue;

      // Restore other form state
      this.restoreFormState(formState);
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  }

  preserveFormState() {
    return {
      interviewTime: document.getElementById('interviewTime')?.value || '',
      resultVisible: document.getElementById('result')?.classList.contains('show') || false,
      resultContent: document.getElementById('result')?.innerHTML || '',
      downloadVisible: !document.getElementById('downloadICS')?.classList.contains('hidden') || false,
      copyVisible: !document.getElementById('copyBtn')?.classList.contains('hidden') || false
    };
  }

  restoreFormState(formState) {
    if (formState.interviewTime) {
      const timeInput = document.getElementById('interviewTime');
      if (timeInput) timeInput.value = formState.interviewTime;
    }

    if (formState.resultVisible) {
      const result = document.getElementById('result');
      if (result) {
        result.classList.add('show');
        // Update result content with new language if conversion data exists
        this.updateResultDisplay();
      }
    }

    if (formState.downloadVisible) {
      const downloadBtn = document.getElementById('downloadICS');
      if (downloadBtn) downloadBtn.classList.remove('hidden');
    }

    if (formState.copyVisible) {
      const copyBtn = document.getElementById('copyBtn');
      if (copyBtn) copyBtn.classList.remove('hidden');
    }
  }

  updateResultDisplay() {
    if (!lastConversionData) return;
    
    const currentTranslations = translations[this.currentLanguage];
    const { candidateTime, diffHours } = lastConversionData;
    
    let diffText;
    if (diffHours === 0) {
      diffText = currentTranslations['same-timezone'];
    } else if (diffHours > 0) {
      diffText = this.currentLanguage === 'zh'
        ? `${currentTranslations['timezone-faster']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`
        : `${currentTranslations['timezone-faster']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`;
    } else {
      diffText = this.currentLanguage === 'zh'
        ? `${currentTranslations['timezone-slower']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`
        : `${currentTranslations['timezone-slower']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit-behind']}`;
    }

    document.getElementById("result").innerHTML = `
      <div class="main-time">${currentTranslations['candidate-local-time']}: ${candidateTime.toFormat("yyyy-MM-dd HH:mm")}</div>
      <div class="time-diff">${diffText}</div>
    `;

    // Update lastConverted with new language
    lastConverted = { start: candidateTime, summary: currentTranslations['interview-reminder'] };
  }

  isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  saveLanguagePreference() {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available, language preference will not be saved');
      return;
    }

    try {
      const preference = {
        language: this.currentLanguage,
        timestamp: Date.now()
      };
      localStorage.setItem('timezone-converter-language', JSON.stringify(preference));
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }

  loadLanguagePreference() {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using default language');
      this.currentLanguage = 'zh';
      return;
    }

    try {
      const stored = localStorage.getItem('timezone-converter-language');
      if (stored) {
        const preference = JSON.parse(stored);
        if (preference.language && translations[preference.language]) {
          this.currentLanguage = preference.language;
        } else {
          console.warn('Invalid language preference found, using default');
          this.currentLanguage = 'zh';
        }
      } else {
        this.currentLanguage = 'zh'; // Default when no preference exists
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error);
      this.currentLanguage = 'zh'; // Fallback to default
    }
  }
}

// Initialize language switcher
const languageSwitcher = new LanguageSwitcher();

// 常用时区
const commonTimeZones = [
  { tz: "America/Los_Angeles", labelKey: "tz-pacific" },
  { tz: "America/New_York", labelKey: "tz-eastern" },
  { tz: "Europe/London", labelKey: "tz-london" },
  { tz: "Europe/Paris", labelKey: "tz-central-europe" },
  { tz: "Asia/Shanghai", labelKey: "tz-china" },
  { tz: "Asia/Tokyo", labelKey: "tz-japan" },
  { tz: "Australia/Sydney", labelKey: "tz-sydney" }
];
const allTimeZones = Intl.supportedValuesOf("timeZone");

function populateTimeZones(select) {
  // Clear existing options
  select.innerHTML = '';

  const currentTranslations = translations[languageSwitcher.getCurrentLanguage()];

  commonTimeZones.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.tz;
    opt.textContent = "⭐ " + currentTranslations[item.labelKey];
    select.appendChild(opt);
  });
  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "------------------";
  select.appendChild(sep);
  allTimeZones
    .filter(tz => !commonTimeZones.some(c => c.tz === tz))
    .forEach(tz => {
      const opt = document.createElement("option");
      opt.value = tz;
      opt.textContent = tz;
      select.appendChild(opt);
    });
}

// Initialize timezone dropdowns after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize timezone dropdowns
  populateTimeZones(document.getElementById("interviewerTZ"));
  populateTimeZones(document.getElementById("candidateTZ"));

  document.getElementById("interviewerTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById("candidateTZ").value = Intl.DateTimeFormat().resolvedOptions().timeZone;
});

function setNow() {
  const now = DateTime.now().toFormat("yyyy-LL-dd'T'HH:mm");
  document.getElementById("interviewTime").value = now;
}
setNow();
document.getElementById("nowBtn").addEventListener("click", setNow);

let lastConverted = null;
let lastConversionData = null; // Store raw conversion data for re-rendering

// 合并事件监听 + 淡入动画
document.getElementById("convertBtn").addEventListener("click", () => {
  const interviewTime = document.getElementById("interviewTime").value;
  const interviewerTZ = document.getElementById("interviewerTZ").value;
  const candidateTZ = document.getElementById("candidateTZ").value;
  const currentTranslations = translations[languageSwitcher.getCurrentLanguage()];

  if (!interviewTime) {
    alert(currentTranslations['enter-time-alert']);
    return;
  }

  const dt = DateTime.fromISO(interviewTime, { zone: interviewerTZ });
  const candidateTime = dt.setZone(candidateTZ);

  const diffHours = (candidateTime.offset - dt.offset) / 60;
  let diffText;
  if (diffHours === 0) {
    diffText = currentTranslations['same-timezone'];
  } else if (diffHours > 0) {
    diffText = languageSwitcher.getCurrentLanguage() === 'zh'
      ? `${currentTranslations['timezone-faster']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`
      : `${currentTranslations['timezone-faster']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`;
  } else {
    diffText = languageSwitcher.getCurrentLanguage() === 'zh'
      ? `${currentTranslations['timezone-slower']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit']}`
      : `${currentTranslations['timezone-slower']} ${Math.abs(diffHours)} ${currentTranslations['hours-unit-behind']}`;
  }

  document.getElementById("result").innerHTML = `
    <div class="main-time">${currentTranslations['candidate-local-time']}: ${candidateTime.toFormat("yyyy-MM-dd HH:mm")}</div>
    <div class="time-diff">${diffText}</div>
  `;
  document.getElementById("result").classList.add("show");

  // Store raw conversion data for language switching
  lastConversionData = { candidateTime, diffHours };
  lastConverted = { start: candidateTime, summary: currentTranslations['interview-reminder'] };

  document.getElementById("downloadICS").classList.remove("hidden");
  document.getElementById("copyBtn").classList.remove("hidden");
});

// 下载 ICS
document.getElementById("downloadICS").addEventListener("click", () => {
  if (!lastConverted) return;

  const currentTranslations = translations[languageSwitcher.getCurrentLanguage()];
  const dtStart = lastConverted.start.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dtEnd = lastConverted.start.plus({ minutes: 30 }).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${lastConverted.summary}
DTSTART:${dtStart}
DTEND:${dtEnd}
DESCRIPTION:${currentTranslations['interview-reminder-desc']}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = currentTranslations['ics-filename'];
  link.click();
});

// 修复版一键复制
document.getElementById("copyBtn").addEventListener("click", () => {
  const currentTranslations = translations[languageSwitcher.getCurrentLanguage()];

  if (!lastConverted) {
    alert(currentTranslations['convert-first-alert']);
    return;
  }

  const copyText = `${currentTranslations['candidate-local-time']}: ${lastConverted.start.toFormat("yyyy-MM-dd HH:mm")}（${currentTranslations['interview-reminder']}）`;

  navigator.clipboard.writeText(copyText).then(() => {
    alert(currentTranslations['copied-alert']);
  }).catch(err => {
    console.error("复制失败:", err);
    alert(currentTranslations['copy-failed-alert']);
  });
});

// 弹窗交互
const creditBox = document.getElementById("creditBox");
const popupBox = document.getElementById("popupBox");

creditBox.addEventListener("click", (e) => {
  e.stopPropagation();
  popupBox.style.display = "block";
  setTimeout(() => {
    popupBox.style.display = "none";
  }, 4000);
});

// 点击外部关闭
document.addEventListener("click", () => {
  popupBox.style.display = "none";
});

// Language toggle button functionality
let isLanguageSwitching = false;

function updateLanguageButton() {
  const button = document.getElementById('languageToggle');
  const langText = button.querySelector('.lang-text');
  if (languageSwitcher.getCurrentLanguage() === 'zh') {
    langText.textContent = 'EN';
    button.title = 'Switch to English / 切换到英文';
  } else {
    langText.textContent = '中文';
    button.title = 'Switch to Chinese / 切换到中文';
  }
}

function handleLanguageSwitch() {
  if (isLanguageSwitching) {
    return; // Prevent rapid clicking
  }

  isLanguageSwitching = true;

  try {
    languageSwitcher.switchLanguage();
    updateLanguageButton();
  } catch (error) {
    console.error('Language switching failed:', error);
  } finally {
    // Reset flag after a short delay
    setTimeout(() => {
      isLanguageSwitching = false;
    }, 150);
  }
}

// Initialize language system and UI on page load
document.addEventListener('DOMContentLoaded', () => {
  // Language system initialization (must be first)
  languageSwitcher.updateDOM();

  const languageToggle = document.getElementById('languageToggle');

  // Use the debounced handler
  languageToggle.addEventListener('click', handleLanguageSwitch);

  updateLanguageButton();
});
