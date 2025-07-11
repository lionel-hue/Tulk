//Le fonctionnement de resultats des recherches
const searchInput = document.getElementById('searchInput');
const searchTooltip = document.getElementById('searchTooltip');

if (searchInput && searchTooltip) {
  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      searchTooltip.style.display = 'block';
    } else {
      searchTooltip.style.display = 'none';
    }
  });

  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchTooltip.contains(e.target)) {
      searchTooltip.style.display = 'none';
    }
  });
}