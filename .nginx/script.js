(() => {
  const prefix = '/.nginx';

  async function addIcons() {
    const iconMap = await fetch(`${prefix}/icons.json`).then(response => response.json());
    const defaultIcon = iconMap[''];

    delete iconMap[''];

    const icons = Object.entries(iconMap).map(([pattern, icon]) => [new RegExp(pattern, 'i'), icon]);
    const links = Array.from(document.querySelectorAll('#list .link a'));
    const renderIcons = (left = 0, partitionSize = 10) => {
      const right = left + partitionSize;
      const partition = links.slice(left, right);

      partition.forEach(link => {
        const pathname = decodeURIComponent(link.pathname);
        const iconImage = document.createElement('img');
        const [, icon] = icons.find(([regex]) => regex.test(pathname)) || [, defaultIcon];

        iconImage.src = `${prefix}/${icon}`;
        iconImage.alt = '';
        iconImage.classList.add('icon');

        link.parentNode.insertBefore(iconImage, link);
      });

      if (right < links.length) {
        setTimeout(renderIcons, 0, right, partitionSize);
      }
    };

    renderIcons();
  }

  document.title = `Index of ${decodeURIComponent(location.pathname)}`;
  document.addEventListener('DOMContentLoaded', () => {
    addIcons();
  });
})();
