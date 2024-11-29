document.addEventListener('DOMContentLoaded', () => {
    cargarSectores(); // Carga los sectores al iniciar
});

// Recargar la página cada 5 minutos (300000 ms)
setInterval(function() {
    location.reload();
}, 300000);


function cargarSectores() {
    fetch('./tarjetas/sectores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos cargados:', data); // Verifica los datos cargados
            mostrarSectores(data.sectores); // Cambia aquí para acceder al array
        })
        .catch(error => console.error('Error al cargar los sectores:', error));
}

function mostrarSectores(sectores) {
    const tarjetasContainer = document.getElementById('tarjetas-container');
    tarjetasContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos

    sectores.forEach(sector => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('col-md-4', 'mb-4'); // Columna de Bootstrap

        tarjeta.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>${sector.nombre}</h5>
                    <button class="btn btn-danger btn-sm" onclick="eliminarSector('${sector.nombre}')">Eliminar</button>
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        ${sector.funciones.map(funcion => `<li class="list-group-item">${funcion}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        tarjetasContainer.appendChild(tarjeta); // Agregar la tarjeta al contenedor
    });
}

let funciones = [];

document.getElementById('agregar-funcion').addEventListener('click', () => {
    const nuevaFuncion = document.getElementById('nueva-funcion').value;
    if (nuevaFuncion) {
        funciones.push(nuevaFuncion);
        document.getElementById('nueva-funcion').value = ''; // Limpiar el campo
        mostrarFunciones(); // Actualizar la lista de funciones
    }
});

function mostrarFunciones() {
    const listaFunciones = document.getElementById('funciones-lista');
    listaFunciones.innerHTML = ''; // Limpiar la lista
    funciones.forEach(funcion => {
        const div = document.createElement('div');
        div.textContent = funcion;
        listaFunciones.appendChild(div);
    });
}

function guardarSector() {
    const nuevoSector = document.getElementById('nuevo-sector').value;
    if (nuevoSector && funciones.length > 0) {
        const data = {
            accion: 'agregar',
            nombre: nuevoSector,
            funciones: funciones
        };

        // Enviar los datos al servidor para guardar
        fetch('./gestionarSectores.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                console.log('Sector guardado correctamente');
                location.reload(); // Recargar la página
            } else {
                console.error('Error al guardar el sector');
            }
        })
        .catch(error => console.error('Error en la petición:', error));

        // Limpiar el formulario
        document.getElementById('nuevo-sector').value = '';
        document.getElementById('nueva-funcion').value = '';
        funciones = [];
        document.getElementById('funciones-lista').innerHTML = '';

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarSector'));
        modal.hide();
    } else {
        alert('Por favor, ingrese un sector y al menos una función.');
    }
}

function eliminarSector(nombreSector) {
    if (confirm(`¿Estás seguro de que deseas eliminar el sector "${nombreSector}"?`)) {
        // Enviar la solicitud al servidor
        fetch('./gestionarSectores.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accion: 'eliminar', nombre: nombreSector })
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                console.log('Sector eliminado correctamente');
                location.reload(); // Recargar la página
            } else {
                console.error('Error al eliminar el sector');
            }
        })
        .catch(error => console.error('Error en la petición:', error));
    }
}
