
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
    // Funktion zum Setzen des E-Mail-Links
    function setEmailLink(linkId) {
        const link = document.getElementById(linkId);
        const user = link.getAttribute('data-user');
        const domain = link.getAttribute('data-domain');

        if (user && domain) {
            const email = `${user}@${domain}`;
            link.setAttribute('href', `mailto:${email}`);
            link.textContent = email; // Textinhalt des Links setzen
        }
    }

    // E-Mail-Adressen entschlüsseln
    setEmailLink('email-link');
    setEmailLink('privacy-email-link');
});


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
