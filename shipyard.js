export const manufacturers = ['Incom', 'MVC', 'Free Dac'];

document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.pathname === '/shipyards.html') {
        const manufacturers = ['Incom', 'MVC', 'Free Dac'];
        const list = document.getElementById('manufacturers-list');

        if (list) {
            manufacturers.forEach(manufacturer => {
                let listItem = document.createElement('li');
                listItem.textContent = manufacturer;
                list.appendChild(listItem);
            });
        }
    }
});
