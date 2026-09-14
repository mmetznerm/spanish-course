(() => {
  const phrases = Array.isArray(window.PHRASES) ? window.PHRASES : [];
  if (!phrases.length) return;

  const els = {
    counter: document.getElementById('counter'),
    topic: document.getElementById('topic'),
    pt: document.getElementById('pt'),
    en: document.getElementById('en'),
    es: document.getElementById('es'),
    source: document.getElementById('source'),
    prev: document.getElementById('prev'),
    next: document.getElementById('next'),

    btnAudioPt: document.getElementById('btn-audio-pt'),
    btnAudioEn: document.getElementById('btn-audio-en'),
    btnAudioEs: document.getElementById('btn-audio-es'),

    btnGtPt: document.getElementById('btn-gt-pt'),
    btnGtEn: document.getElementById('btn-gt-en'),
    btnGtEs: document.getElementById('btn-gt-es'),
  };

  let index = 0;

  function getGoogleTranslateUrl(text, sourceLang, targetLang = 'pt') {
    return `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(text)}&op=translate`;
  }

  function speak(text, lang, buttonEl) {
    if (!('speechSynthesis' in window)) {
      const sourceLang = lang === 'en' ? 'en' : (lang === 'es' ? 'es' : 'pt');
      const targetLang = lang === 'pt' ? 'es' : 'pt';
      window.open(getGoogleTranslateUrl(text, sourceLang, targetLang), '_blank');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: 'en-US',
      es: 'es-ES',
      pt: 'pt-BR'
    };
    utterance.lang = langMap[lang] || 'pt-BR';
    utterance.rate = 0.9;

    const allAudioBtns = [els.btnAudioPt, els.btnAudioEn, els.btnAudioEs];
    allAudioBtns.forEach(btn => btn?.classList.remove('playing'));

    if (buttonEl) {
      buttonEl.classList.add('playing');
      utterance.onend = () => buttonEl.classList.remove('playing');
      utterance.onerror = () => buttonEl.classList.remove('playing');
    }

    window.speechSynthesis.speak(utterance);
  }

  function render() {
    const item = phrases[index];
    els.counter.textContent = `${index + 1} / ${phrases.length}`;
    els.topic.textContent = item.topic;
    els.pt.textContent = item.pt;
    els.en.textContent = item.en;
    els.es.textContent = item.es;
    els.source.textContent = `Fonte: ${item.source}`;
    els.prev.disabled = index === 0;
    els.prev.style.opacity = index === 0 ? '0.45' : '1';

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    [els.btnAudioPt, els.btnAudioEn, els.btnAudioEs].forEach(btn => btn?.classList.remove('playing'));

    if (els.btnGtPt) els.btnGtPt.href = getGoogleTranslateUrl(item.pt, 'pt', 'es');
    if (els.btnGtEn) els.btnGtEn.href = getGoogleTranslateUrl(item.en, 'en', 'pt');
    if (els.btnGtEs) els.btnGtEs.href = getGoogleTranslateUrl(item.es, 'es', 'pt');
  }

  function go(delta) {
    index = Math.min(Math.max(index + delta, 0), phrases.length - 1);
    render();
  }

  els.prev.addEventListener('click', () => go(-1));
  els.next.addEventListener('click', () => go(1));

  if (els.btnAudioPt) els.btnAudioPt.addEventListener('click', () => speak(phrases[index].pt, 'pt', els.btnAudioPt));
  if (els.btnAudioEn) els.btnAudioEn.addEventListener('click', () => speak(phrases[index].en, 'en', els.btnAudioEn));
  if (els.btnAudioEs) els.btnAudioEs.addEventListener('click', () => speak(phrases[index].es, 'es', els.btnAudioEs));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  });

  render();
})();
