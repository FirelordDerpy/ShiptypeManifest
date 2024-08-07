

export const manufacturers = ['Incom', 'MVC', 'Free Dac'];


document.addEventListener('DOMContentLoaded', (event) => {
    const manufacturers = ['Incom', 'MVC', 'Free Dac'];
    const dropdown = document.getElementById('manufacturers-dropdown');

    manufacturers.forEach(manufacturer => {
        let option = document.createElement('option');
        option.text = manufacturer;
        option.value = manufacturer;
        dropdown.add(option);
    });
});
