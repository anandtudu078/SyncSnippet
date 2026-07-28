(async () => {
  const containers = document.querySelectorAll('[data-syncsnippet]');
  for (const el of containers) {
    const id = el.getAttribute('data-syncsnippet');
    if (!id) continue;
    try {
      const res = await fetch(`/api/snippets/${id}`);
      const { html } = await res.json();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      el.replaceWith(wrapper);
    } catch (e) {
      console.error('SyncSnippet failed to load', e);
    }
  }
})();