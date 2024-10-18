document.addEventListener("DOMContentLoaded", () => {
    let button = document.getElementById("btnBuscar");
    let container = document.getElementById("contenedor");

    button.addEventListener("click", () => {
        let search = document.getElementById("inputBuscar").value;
        let URL = `https://images-api.nasa.gov/search?q=${search}`;

        fetch(URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la red");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                showInfo(data);
            })
            .catch(error => {
                console.error("Error:", error);
                container.innerHTML = `<p class="text-center text-danger">Ocurrió un error al buscar los datos. Intenta nuevamente más tarde.</p>`;
            });
    });

    function showInfo(data) {
        const container = document.getElementById("contenedor");
        container.innerHTML = '';

        const items = data.collection.items;

        if (items.length === 0) {
            container.innerHTML = `<p class="text-center text-warning">No se encontraron resultados para la búsqueda.</p>`;
            return;
        }

        container.classList.add('row', 'g-0');

        items.forEach(item => {
            const [imageInfo] = item.data;
            const { href: imageUrl } = item.links ? item.links[0] : {}; // Validar que existan links

            if (imageInfo && imageUrl) {
                const { title, description, date_created } = imageInfo;
                const formattedDate = new Date(date_created).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                const card = `
                    <div class="col-12 mb-3">
                        <div class="card-horizontal">
                            <div class="img-container">
                                <img src="${imageUrl}" class="card-img-left" alt="${title}">
                            </div>
                            <div class="list-group list-group-flush">
                                <h5 class="card-title">${title}</h5>
                                <p class="card-text">${description}</p>
                                <p class="card-text">Fecha: ${formattedDate}</p>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            }
        });
    }
});
