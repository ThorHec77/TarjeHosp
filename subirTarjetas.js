document.addEventListener("DOMContentLoaded", function() {
    // Definir la función para enviar los datos de la tarjeta al servidor
    function enviarDatosAlServidor() {
        const nombre = document.getElementById('nombre-text').innerText;
        const sector = document.getElementById('sector-text').innerText;
        const funcion = document.getElementById('funcion-text').innerText;
        const imgSrc = document.getElementById('foto').src;

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('sector', sector);
        formData.append('funcion', funcion);
        formData.append('foto', imgSrc);

        // Mostrar el modal inmediatamente al hacer clic en el botón
        //const modalElement = document.getElementById('modalConfirmacion');
        //const modal = new bootstrap.Modal(modalElement);
        //modal.show();

        // Realizar la solicitud fetch sin esperar a la respuesta para abrir el modal
        fetch('subir.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Puedes añadir lógica adicional aquí si es necesario
        })
        .catch((error) => {
            console.error('Error en la petición:', error);
        });
    }

    // Configurar el listener para el botón
    const botonEnviar = document.getElementById('enviarTarjeta');
    if (botonEnviar) {
        botonEnviar.removeEventListener('click', enviarDatosAlServidor);
        botonEnviar.addEventListener('click', enviarDatosAlServidor);
    } else {
        console.error("El botón enviarTarjeta no se encuentra en el DOM.");
    }
});

