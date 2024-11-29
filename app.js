// Esperar a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
  
    // Obtener el botón por su ID
    const capturarYMostrar = document.getElementById('capturarYMostrar');

    // Función para actualizar el contenido de la tarjeta
    function actualizarTarjeta() {
        const nombre = document.getElementById('nombre').value;
        const sector = document.getElementById('sector').value;
        const funcion = document.getElementById('funcion').value;

        document.getElementById('nombre-text').innerText = nombre;
        document.getElementById('sector-text').innerText = `${sector}`;
        document.getElementById('funcion-text').innerText = `${funcion}`;

        // Actualizar los textos en el modal
        document.getElementById('nombre-text-modal').innerText = nombre;
        document.getElementById('sector-text-modal').innerText = `${sector}`;
        document.getElementById('funcion-text-modal').innerText = `${funcion}`;
    }

    // Función para capturar la foto del video y mostrar la tarjeta
    capturarYMostrar.addEventListener('click', function() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        // Asegúrate de que el canvas tenga el tamaño correcto
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Captura la imagen del video
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const foto = canvas.toDataURL('image/png');
        document.getElementById('foto').src = foto;
        document.getElementById('foto-con-marco').style.display = 'block';

        // Actualizar la tarjeta con la información del formulario
        actualizarTarjeta();

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modalTarjeta'));
        modal.show();
    });

    // Función para imprimir la tarjeta
    window.imprimirTarjeta = function() {
        const tarjeta = document.querySelector('.tarjeta');
        const ventanaImpresion = window.open('', '_blank');
    
        ventanaImpresion.document.write(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Imprimir Tarjeta</title>
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
                            height: 100vh;
                            background-color: #f4f4f4;
                        }

                        .tarjeta {
                            position: relative;
                            width: 1024px;
                            height: 640px;
                            border-radius: 20px;
                            overflow: hidden;
                            background-color: white;
                            background-size: cover;
                            background-position: center;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        }

                        /* Imagen capturada */
                        #foto {
                            position: absolute;
                            border-radius: 20px;
                            top: 70px; /* Ajusta esta posición según el diseño original */
                            left: 55px; /* Ajusta según el diseño */
                            z-index: 1;
                            width: 280px;
                            height: 340px;
                            object-fit: cover; /* Asegura que la imagen mantenga su proporción */
                        }

                        .contenido {
                            position: absolute;
                            top: 70px;
                            left: 55px;
                            z-index: 1;
                            text-align: center;
                        }

                        .info {
                            margin-top: 30px;
                            font-size: 20px;
                            color: black;
                            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                            text-align: left;
                        }
                        
                        @media (min-width: 1200px) {
                            h3 {
                                font-size: 2.75rem; /* Ajusta el tamaño de fuente para pantallas grandes */
                            }
                        }

                        h1, h3 {
                            margin-bottom: 5px;
                        }

                        h1 {
                            text-transform: uppercase;
                            font-size: 3.3rem;
                            font-weight: bold;
                        }

                        h3 {
                          font-size: 2.90rem;
                          font-weight: bold;
                          
                        }
                        
                        #nombre-text {
                          font-size: 3.3rem;
                          font-weight: bold;
                        }

                        #sector-text {
                            font-size: 2.90rem;
                            font-weight: bold;
                        }

                        #funcion-text {
                          font-size: 2.90rem;
                          font-weight: bold;
                        }

                        /* Logo en la parte superior derecha */
                        .hospital-logo {
                            position: absolute;
                            top: 20px;
                            right: 56px;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            z-index: 2;
                            height: auto;
                        }

                        /* Logos en las esquinas inferiores */
                        .logos {
                            position: absolute;
                            bottom: 10px;
                            left: 10px;
                            right: 26px;
                            display: flex;
                            justify-content: space-between;
                            background-color: rgba(255, 255, 255, 0.5);
                            padding: 10px;
                            border-radius: 10px;
                        }

                        /* Logo ASSE en la parte inferior izquierda */
                        .logo-asse-img {
                            width: 450px;
                            height: auto;
                        }

                        /* Logo Región Sur en la parte inferior derecha */
                        .logo-region {
                            position: absolute;
                            bottom: 30px;
                            right: 200px;
                            width: 150px;
                            height: auto;
                        }

                        /* Logo en la parte superior derecha */
                        .hospital-logo img {
                            width: 450px;
                            height: auto;
                        }

                        /* Logo ASSE en la parte inferior izquierda */
                        .logo-asse img {
                            width: 510px;
                            height: auto;
                        }

                        /* Logo Región Sur en la parte inferior derecha */
                        .logo-region img {
                            width: 300px;
                            height: auto;
                        }
                        .logoSobre {
                            width: 300px;
                            height: auto;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                  <div class="col-md-8">
                    <div class="inputs mb-4">
                      <div id=tarjeta>  
                        ${tarjeta.outerHTML}
                      </div>                   
                    </div><br><br><br>
                    <div class="inputs mb-4">
                      <button class="btn btn-success" id="enviarTarjeta" type="button">Enviar</button>
                    </div>                
                  </div>
                                      <!-- Modal -->
                    <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="modalConfirmacionLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <img  src="./panel/img/EnvioSobre.png" class="logoSobre">
                                </div>
                                <div class="modal-body">
                                    Su tarjeta de identificación ha sido enviada a la Dirección Administrativa. Podrá pasar a retirarla en un plazo de 48 horas.
                                    Una vez que haya leído este mensaje, haga clic en Aceptar y cierre la ventana emergente. Tenga en cuenta que cada vez que haga clic en Enviar, se generará un nuevo envío, por lo que le recomendamos hacerlo solo una vez.
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" id="btnCerrar" data-bs-dismiss="modal">Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    <script src="subirTarjetas.js"></script>
                    <script>

                        // Obtener el botón de "Enviar" y el modal
                        const botonEnviar = document.getElementById('enviarTarjeta');
                        const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

                        // Evento para mostrar el modal al hacer clic en "Enviar"
                        botonEnviar.addEventListener('click', function() {
                            // Mostrar el modal de confirmación
                            modalConfirmacion.show();
                            
                            // Opcional: realizar el envío al servidor sin esperar la respuesta
                            enviarDatosAlServidor();
                        });



                        const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                        document.getElementById('enviarTarjeta').addEventListener('click', function() {
                            enviarDatosAlServidor(); // Asegúrate de que esta función esté definida en subirTarjetas.js

                            // Mostrar el modal después de enviar
                            modal.show();

                            // Cerrar la ventana después de aceptar
                            document.getElementById('btnCerrar').addEventListener('click', function() {
                                //window.close(); Cerrar la ventana de impresión
                                modalConfirmacion.hide(); // Ocultar el modal de confirmación
                            });
                        });
                        window.onload = function() {
                            const nombreText = document.getElementById('nombre-text');
                            const funcionText = document.getElementById('funcion-text');
                            const sectorText = document.getElementById('sector-text');

                            if (nombreText && nombreText.textContent.length > 18) {
                                nombreText.style.fontSize = '2.5rem'; // Cambia a 2.5rem si excede 18 caracteres
                            } else {
                                nombreText.style.fontSize = '3.3rem'; // Mantiene 3.3rem si no excede
                            }

                            if (funcionText && funcionText.textContent.length > 23) {
                                funcionText.style.fontSize = '2.3rem'; // Cambia a 2.3rem si excede 23 caracteres
                            } else {
                                funcionText.style.fontSize = '2.9rem'; // Mantiene 2.9rem si no excede
                            }

                            if (sectorText && sectorText.textContent.length > 23) {
                                sectorText.style.fontSize = '2.3rem'; // Cambia a 2.3rem si excede 23 caracteres
                            } else {
                                sectorText.style.fontSize = '2.9rem'; // Mantiene 2.9rem si no excede
                            }
                        };

                    </script>
                </body>
            </html>
        `);

        ventanaImpresion.document.close();
        ventanaImpresion.focus();
      //  ventanaImpresion.print();
    };

    // Iniciar la captura de video
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        })
        .catch(function(error) {
            console.error("Error accediendo a la cámara: ", error);
        });
    
    
    // Recargar la página cada 5 minutos (300000 ms)
    setInterval(function() {
        location.reload();
    }, 120000);

});
