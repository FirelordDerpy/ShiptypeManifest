export const manufacturers = ['Incom', 'MVC', 'Free Dac'];

document.addEventListener('DOMContentLoaded', (event) => {
    const manufacturers = ['Incom', 'MVC', 'Free Dac'];
    const list = document.getElementById('manufacturers-list');

    manufacturers.forEach(manufacturer => {
        let listItem = document.createElement('li');
        listItem.textContent = manufacturer;
        list.appendChild(listItem);
    });
});
