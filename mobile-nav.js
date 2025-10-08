// Mobile bottom navigation functions
function toggleMoreMenu() {
    const moreMenu = document.getElementById('mobileMoreMenu');
    moreMenu.classList.toggle('show');
}

function focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.focus();
    }
}