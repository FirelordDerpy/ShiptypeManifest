export const manufacturers = ['Incom', 'MVC', 'Free Dac'];

//'None': { cost: 0, powerLevelBoost: 0, hullPointsBoost: 0, shieldArmorPointsBoost: 0},


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
