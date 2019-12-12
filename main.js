const content = document.getElementById('content');

fetch('https://api.thecatapi.com/v1/images/search?limit=8&order=Desc')
    .then(response => response.json())
    .then(data => {
        let html = "";
        data.forEach(d => {
            html += `
                <div class='cats'>
                    <img src='${d.url}' />
                </div>`;
        });

        content.innerHTML = html;
    });
