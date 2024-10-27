
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
