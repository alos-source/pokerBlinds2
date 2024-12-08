
// site.js

function getBuildDate(){

    fetch('build_timestamp.txt')
    .then(response => response.text())
    .then(data => {
        document.getElementById('build-timestamp').innerText = data;
    });
    console.log('Fetching build timestamp...');

}
window.onload = getBuildDate;
//getBuildDate();


document.addEventListener('DOMContentLoaded', () => {
    const impressumModal = document.getElementById('impressum-modal');
    const datenschutzModal = document.getElementById('datenschutz-modal');

    const impressumLink = document.getElementById('impressum-link');
    const datenschutzLink = document.getElementById('datenschutz-link');

    const impressumClose = document.getElementById('impressum-close');
    const datenschutzClose = document.getElementById('datenschutz-close');

    // Öffnen des Impressum-Modals
    impressumLink.addEventListener('click', (e) => {
        e.preventDefault();
        impressumModal.style.display = 'block';
    });

    // Öffnen des Datenschutz-Modals
    datenschutzLink.addEventListener('click', (e) => {
        e.preventDefault();
        datenschutzModal.style.display = 'block';
    });

    // Schließen der Modalen Fenster
    impressumClose.addEventListener('click', () => {
        impressumModal.style.display = 'none';
    });

    datenschutzClose.addEventListener('click', () => {
        datenschutzModal.style.display = 'none';
    });

    // Schließen beim Klick außerhalb des Modals
    window.addEventListener('click', (event) => {
        if (event.target === impressumModal) {
            impressumModal.style.display = 'none';
        } else if (event.target === datenschutzModal) {
            datenschutzModal.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to load JSON data
    async function loadImpressumData() {
        try {
            const response = await fetch('impressum.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setImpressumData(data);
        } catch (error) {
            console.error('Error loading Impressum data:', error);
        }
    }

    // Function to set Impressum data from JSON
    function setImpressumData(data) {
        // Name
        const nameElem = document.getElementById('impressum-name');
        if (data.name) nameElem.textContent = data.name;

        // Address
        const addressElem = document.getElementById('impressum-address');
        if (data.address) {
            const { street, house, zip, city } = data.address;
            addressElem.textContent = `${street} ${house}, ${zip} ${city}`;
        }

        // Country
        const countryElem = document.getElementById('impressum-country');
        if (data.country) countryElem.textContent = data.country;

        // Phone
        const phoneElem = document.getElementById('impressum-phone');
        if (data.phone) {
            const { ccode, phone1, phone2 } = data.phone;
            phoneElem.textContent = `${ccode} ${phone1} ${phone2}`;
        }

        // Email
        const emailElem = document.getElementById('impressum-email');
        if (data.email) {
            const { user, domain } = data.email;
            const email = `${user}@${domain}`;
            emailElem.setAttribute('href', `mailto:${email}`);
            emailElem.textContent = email;
        }
    }

    // Load the Impressum data
    loadImpressumData();
});

