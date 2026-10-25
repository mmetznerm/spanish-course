(() => {
  // As 500 frases práticas aparecem primeiro; as 110 originais são preservadas em seguida.
  const phrases = [
    ...(Array.isArray(window.SURVIVAL_PHRASES) ? window.SURVIVAL_PHRASES : []),
    ...(Array.isArray(window.PHRASES) ? window.PHRASES : [])
  ];
  if (!phrases.length) return;

  const els = {
    counter: document.getElementById('counter'),
    topic: document.getElementById('topic'),
    pt: document.getElementById('pt'),
    en: document.getElementById('en'),
    es: document.getElementById('es'),
    de: document.getElementById('de'),
    source: document.getElementById('source'),
    prev: document.getElementById('prev'),
    next: document.getElementById('next'),
    btnAudioPt: document.getElementById('btn-audio-pt'),
    btnAudioEn: document.getElementById('btn-audio-en'),
    btnAudioEs: document.getElementById('btn-audio-es'),
    btnAudioDe: document.getElementById('btn-audio-de'),
    btnGtPt: document.getElementById('btn-gt-pt'),
    btnGtEn: document.getElementById('btn-gt-en'),
    btnGtEs: document.getElementById('btn-gt-es'),
    btnGtDe: document.getElementById('btn-gt-de')
  };

  // A versão v2 evita que o índice guardado da versão antiga abra num cartão diferente.
  const STORAGE_KEY = 'language_gym_current_index_v2';
  let index = 0;

  try {
    const savedIndex = localStorage.getItem(STORAGE_KEY);
    if (savedIndex !== null) {
      const parsed = Number.parseInt(savedIndex, 10);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed < phrases.length) index = parsed;
    }
  } catch (_) {
    // O estudo continua a funcionar mesmo se o navegador bloquear localStorage.
  }

  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, String(index)); } catch (_) { /* armazenamento opcional */ }
  }

  function getGoogleTranslateUrl(text, sourceLang, targetLang = 'pt') {
    return `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate`;
  }

  let cachedVoices = [];
  let activeUtterance = null;

  function loadVoices() {
    if (!('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) cachedVoices = voices;
    return cachedVoices;
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  function findBestVoice(targetLocale, langPrefix) {
    const voices = loadVoices();
    if (!voices.length) return null;
    const normalizedTarget = targetLocale.toLowerCase();
    const normalizedPrefix = langPrefix.toLowerCase();
    const normalizeLang = l => String(l || '').replace('_', '-').toLowerCase();

    return (
      voices.find(v => normalizeLang(v.lang) === normalizedTarget && v.localService) ||
      voices.find(v => normalizeLang(v.lang) === normalizedTarget) ||
      voices.find(v => normalizeLang(v.lang).startsWith(normalizedPrefix + '-') && v.localService) ||
      voices.find(v => normalizeLang(v.lang).startsWith(normalizedPrefix)) ||
      null
    );
  }

  function openGoogleTranslateFallback(text, lang) {
    const sourceLang = ({ en: 'en', es: 'es', de: 'de', pt: 'pt' })[lang] || 'pt';
    const targetLang = lang === 'pt' ? 'es' : 'pt';
    window.open(getGoogleTranslateUrl(text, sourceLang, targetLang), '_blank', 'noopener,noreferrer');
  }

  function speak(text, lang, buttonEl) {
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
      openGoogleTranslateFallback(text, lang);
      return;
    }

    const synth = window.speechSynthesis;
    const allAudioBtns = [els.btnAudioPt, els.btnAudioEn, els.btnAudioEs, els.btnAudioDe];
    allAudioBtns.forEach(btn => btn?.classList.remove('playing'));

    try {
      if (synth.speaking || synth.pending) {
        synth.cancel();
      }
      if (synth.paused) {
        synth.resume();
      }
    } catch (_) {
      // Ignora falhas de estado em WebViews móveis.
    }

    const targetLocale = ({ en: 'en-US', es: 'es-ES', pt: 'pt-BR', de: 'de-DE' })[lang] || 'pt-BR';
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;
    utterance.lang = targetLocale;
    utterance.rate = 0.9;

    const matchedVoice = findBestVoice(targetLocale, lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || targetLocale;
    }

    if (buttonEl) {
      buttonEl.classList.add('playing');
    }

    const clearPlaying = () => {
      if (buttonEl) buttonEl.classList.remove('playing');
      if (activeUtterance === utterance) activeUtterance = null;
    };

    utterance.onend = clearPlaying;
    utterance.onerror = event => {
      clearPlaying();
      const err = event && event.error;
      if (err && err !== 'canceled' && err !== 'interrupted') {
        openGoogleTranslateFallback(text, lang);
      }
    };

    synth.speak(utterance);
    if (synth.paused) {
      try { synth.resume(); } catch (_) { /* noop */ }
    }
  }

  function render() {
    const item = phrases[index];
    els.counter.textContent = `${index + 1} / ${phrases.length}`;
    els.topic.textContent = item.topic || 'Frases do dia a dia';
    els.pt.textContent = item.pt;
    els.en.textContent = item.en;
    els.es.textContent = item.es;
    els.de.textContent = item.de;
    els.source.textContent = `Bloco: ${item.topic || item.source || 'Frases do dia a dia'}`;
    els.prev.disabled = index === 0;
    els.next.disabled = index === phrases.length - 1;
    els.prev.style.opacity = els.prev.disabled ? '0.45' : '1';
    els.next.style.opacity = els.next.disabled ? '0.45' : '1';

    if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      window.speechSynthesis.cancel();
    }
    [els.btnAudioPt, els.btnAudioEn, els.btnAudioEs, els.btnAudioDe].forEach(btn => btn?.classList.remove('playing'));
    if (els.btnGtPt) els.btnGtPt.href = getGoogleTranslateUrl(item.pt, 'pt', 'es');
    if (els.btnGtEn) els.btnGtEn.href = getGoogleTranslateUrl(item.en, 'en', 'pt');
    if (els.btnGtEs) els.btnGtEs.href = getGoogleTranslateUrl(item.es, 'es', 'pt');
    if (els.btnGtDe) els.btnGtDe.href = getGoogleTranslateUrl(item.de, 'de', 'pt');
  }

  function go(delta) {
    const nextIndex = Math.min(Math.max(index + delta, 0), phrases.length - 1);
    if (nextIndex === index) return;
    index = nextIndex;
    saveProgress();
    render();
  }

  els.prev.addEventListener('click', () => go(-1));
  els.next.addEventListener('click', () => go(1));
  els.btnAudioPt?.addEventListener('click', () => speak(phrases[index].pt, 'pt', els.btnAudioPt));
  els.btnAudioEn?.addEventListener('click', () => speak(phrases[index].en, 'en', els.btnAudioEn));
  els.btnAudioEs?.addEventListener('click', () => speak(phrases[index].es, 'es', els.btnAudioEs));
  els.btnAudioDe?.addEventListener('click', () => speak(phrases[index].de, 'de', els.btnAudioDe));
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  });
  render();
})();
