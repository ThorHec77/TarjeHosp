document.addEventListener('DOMContentLoaded', () => {
    cargarTarjetas(); // Carga inicial de tarjetas

    // Configurar para refrescar solo el contenido de tarjetas cada 2 minutos
    setInterval(cargarTarjetas, 120000);
});

let tarjetasPorPagina = 8; 
let paginaActual = 1;

function cargarTarjetas() {
    fetch('./tarjetas/tarjetas.json')
        .then(response => response.json())
        .then(data => {
            mostrarTarjetas(data);
            inicializarPaginacion(data); // Actualizar la paginación sin cambiar de página
        })
        .catch(error => console.error('Error al cargar las tarjetas:', error));
}

function mostrarTarjetas(tarjetas) {
    const container = document.getElementById('tarjetas-container');
    container.innerHTML = ''; 

    const inicio = (paginaActual - 1) * tarjetasPorPagina;
    const fin = inicio + tarjetasPorPagina;
    const tarjetasVisibles = tarjetas.slice(inicio, fin);

    tarjetasVisibles.forEach(tarjeta => {
        const tarjetaCol = document.createElement('div');
        tarjetaCol.classList.add('col-md-3', 'mb-4');
        tarjetaCol.innerHTML = `
            <div class="tarjeta-item" 
                data-nombre="${tarjeta.nombre}" 
                data-sector="${tarjeta.sector}" 
                data-funcion="${tarjeta.funcion}" 
                data-fecha="${tarjeta.fecha}">
                
                <div class="card" style="max-width: 250px; cursor: pointer;">
                    <input type="checkbox" class="seleccionar-tarjeta" data-imagen="${tarjeta.imagen}" data-nombre="${tarjeta.nombre}" data-sector="${tarjeta.sector}" data-funcion="${tarjeta.funcion}" data-fecha="${tarjeta.fecha}">
                    <img src="./tarjetas/${tarjeta.imagen}" class="card-img-top" alt="${tarjeta.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${tarjeta.nombre}</h5>
                        <p>${tarjeta.funcion}</p>
                        <p>${tarjeta.sector}</p>
                        <p>Fecha: ${tarjeta.fecha}</p>
                        <button class="btn btn-danger" onclick="eliminarTarjeta('${tarjeta.imagen}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(tarjetaCol);
    });
}

function inicializarPaginacion(tarjetas) {
    const totalPaginas = Math.ceil(tarjetas.length / tarjetasPorPagina);
    const paginacionContainer = document.getElementById('paginacion-container');
    paginacionContainer.innerHTML = '';

    // Define el número máximo de páginas visibles a la vez
    const maxPaginasVisibles = 15;
    const inicioPagina = Math.floor((paginaActual - 1) / maxPaginasVisibles) * maxPaginasVisibles + 1;
    const finPagina = Math.min(inicioPagina + maxPaginasVisibles - 1, totalPaginas);

    // Botón "Anterior" para ir al bloque previo de páginas
    if (inicioPagina > 1) {
        const anterior = document.createElement('li');
        anterior.classList.add('page-item');
        anterior.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
        anterior.onclick = (e) => {
            e.preventDefault();
            paginaActual = inicioPagina - 1;
            mostrarTarjetas(tarjetas);
            inicializarPaginacion(tarjetas);
        };
        paginacionContainer.appendChild(anterior);
    }

    // Crear los botones de paginación del bloque actual
    for (let i = inicioPagina; i <= finPagina; i++) {
        const boton = document.createElement('li');
        boton.classList.add('page-item');

        const enlace = document.createElement('a');
        enlace.classList.add('page-link');
        enlace.textContent = i;
        enlace.href = '#';

        if (i === paginaActual) {
            enlace.classList.add('selected-page');
        }

        enlace.onclick = (e) => {
            e.preventDefault();
            paginaActual = i;
            mostrarTarjetas(tarjetas);
            inicializarPaginacion(tarjetas);
        };

        boton.appendChild(enlace);
        paginacionContainer.appendChild(boton);
    }

    // Botón "Siguiente" para ir al siguiente bloque de páginas
    if (finPagina < totalPaginas) {
        const siguiente = document.createElement('li');
        siguiente.classList.add('page-item');
        siguiente.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
        siguiente.onclick = (e) => {
            e.preventDefault();
            paginaActual = finPagina + 1;
            mostrarTarjetas(tarjetas);
            inicializarPaginacion(tarjetas);
        };
        paginacionContainer.appendChild(siguiente);
    }
}


function eliminarTarjeta(imagen) {
    const tarjetaCol = Array.from(document.querySelectorAll('.card')).find(card => card.querySelector('img').src.includes(imagen));
    if (tarjetaCol) {
        tarjetaCol.remove();
    }

    fetch('eliminar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imagen: imagen })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarTarjetas(); // Solo recargar las tarjetas
        } else {
            console.error('Error al eliminar la tarjeta del JSON.');
        }
    })
    .catch(error => console.error('Error:', error));
}


function imprimirSeleccionadas() {
    const seleccionadas = document.querySelectorAll('.seleccionar-tarjeta:checked');
    let contenidoHTML = '';

    // Agrupamos las tarjetas en filas de 2
    seleccionadas.forEach((tarjeta, index) => {
        if (index % 2 === 0) {
            contenidoHTML += `<div class="fila">`; // Comienza una nueva fila cada 2 tarjetas
        }

        // Obtener los datos de cada tarjeta
        const imagen = tarjeta.getAttribute('data-imagen');
        const nombre = tarjeta.getAttribute('data-nombre');
        const sector = tarjeta.getAttribute('data-sector');
        const funcion = tarjeta.getAttribute('data-funcion');

        // Agregar el HTML de cada tarjeta
        contenidoHTML += `
            <div class="tarjeta">
                <div class="background">
                    <img src="./img/FondoTarjeta.png" alt="Imagen Ficticia" class="fondo">
                    <div class="contenido">
                        <div class="photo-frame">
                            <img src="./tarjetas/${imagen}" alt="Foto Capturada" class="ImagenVideo" id="foto">
                        </div>
                    </div>
                    <div class="hospital-logo">
                        <img class="hospital-logo-img" src="./img/HospitalDeCanelones.png" alt="Hospital de Canelones">
                        <div class="info">
                            <h1 id="nombre-text">${nombre}</h1>
                            <h3 id="funcion-text">${sector}</h3>
                            <h3 id="sector-text">${funcion}</h3>
                        </div>
                    </div>
                    <div class="logos">
                        <div class="logo logo-asse">
                            <img src="./img/asse_capacita.png" alt="Logo ASSE">
                        </div>
                        <div class="logo logo-region">
                            <img src="./img/RegionSur.png" alt="Región Sur">
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (index % 2 === 1 || index === seleccionadas.length - 1) {
            contenidoHTML += `</div><hr>`; // Cierra la fila después de cada 2 tarjetas
        }
    });

    const ventana = window.open('', '_blank');
    ventana.document.write(`
        <html>
            <head>
                <title>Imprimir Tarjetas</title>
                <style>
                    /* Estilos generales */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        background-color: #f4f4f4;
                    }

                    .fila {
                        display: flex;
                        justify-content: space-around; /* O puedes dejar 'space-around' */
                        margin-bottom: 20px;
                    }

                    .tarjeta {
                        position: relative;
                        width: 540px; /* Mantener un ancho fijo para cada tarjeta */
                        height: 320px;
                        border-radius: 20px;
                        overflow: hidden;
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        margin-right: 10px; /* Añadir margen derecho */
                    }

                    .tarjeta:last-child {
                        margin-right: 0; /* Eliminar margen derecho en la última tarjeta */
                    }

                    .fondo {
                        position: absolute;
                        width: 100%; /* Asegúrate de que cubra todo el contenedor */
                        height: 100%; /* Asegúrate de que cubra todo el contenedor */
                        object-fit: cover; /* Mantiene la proporción */
                        z-index: 0; /* Enviar al fondo */
                    }

                    #foto {
                        border-radius: 10px;
                        width: 140px; /* Ajuste de ancho proporcional */
                        height: 170px; /* Ajuste de altura proporcional */
                        object-fit: cover;
                        z-index: 1; /* Para que esté por encima de la imagen de fondo */
                    }

                    .contenido {
                        position: absolute;
                        top: 35px; /* Ajustado proporcionalmente */
                        left: 28px; /* Ajustado proporcionalmente */
                        text-align: center;
                    }

                    .info {
                        margin-top: 5px;
                        font-size: 10px; /* Ajuste proporcional de tamaño de fuente */
                        color: black;
                        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
                        text-align: left;
                    }

                    #nombre-text {
                        font-size: 1.65rem; /* Ajuste proporcional */
                        font-weight: bold;
                    }

                    #sector-text, #funcion-text {
                        font-size: 1.45rem; /* Ajuste proporcional */
                        font-weight: bold;
                    }

                    .hospital-logo {
                        position: absolute;
                        top: 10px;
                        right: 28px; /* Ajustado proporcionalmente */
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        z-index: 2;
                    }

                    .hospital-logo img {
                        width: 225px; /* Ajuste proporcional */
                        height: auto;
                    }

                    .logos {
                        position: absolute;
                        bottom: 5px;
                        left: 5px;
                        right: 13px; /* Ajuste proporcional */
                        display: flex;
                        justify-content: space-between;
                        background-color: rgba(255, 255, 255, 0.5);
                        padding: 5px;
                        border-radius: 10px;
                    }

                    .logo-asse img {
                        width: 255px; /* Ajuste proporcional */
                        height: auto;
                    }

                    .logo-region img {
                        width: 150px; /* Ajuste proporcional */
                        height: auto;
                    }
                </style>
            </head>
            
            <body>
                ${contenidoHTML}
                
                <div class="inputs mb-4">
                    <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
                </div>
                
                <script>
                    window.onload = function() {
                        const nombreText = document.getElementById('nombre-text');
                        const funcionText = document.getElementById('funcion-text');
                        const sectorText = document.getElementById('sector-text');

                        if (nombreText && nombreText.textContent.length > 18) {
                            nombreText.style.fontSize = '1.25rem';
                        } else {
                            nombreText.style.fontSize = '1.65rem';
                        }
                        
                        if (funcionText && funcionText.textContent.length > 23) {
                            funcionText.style.fontSize = '1.15rem';
                        } else {
                            funcionText.style.fontSize = '1.45rem';
                        }
                        
                        if (sectorText && sectorText.textContent.length > 23) {
                            sectorText.style.fontSize = '1.15rem';
                        } else {
                            sectorText.style.fontSize = '1.45rem';
                        }
                    }
                </script>
            </body>
        </html>
    `);
    ventana.document.close();
}
