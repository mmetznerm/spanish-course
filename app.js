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
    next: document.getElementById('next')
  };

  let index = 0;

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
  }

  function go(delta) {
    index = Math.min(Math.max(index + delta, 0), phrases.length - 1);
    render();
  }

  els.prev.addEventListener('click', () => go(-1));
  els.next.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') go(-1);
    if (event.key === 'ArrowRight') go(1);
  });

  render();
})();
