// Obtenemos los elementos del DOM
const sectorSelect = document.getElementById('sector');
const funcionSelect = document.getElementById('funcion');
const nombreInput = document.getElementById('nombre');
const capturarYMostrarBtn = document.getElementById('capturarYMostrar');

// Función para verificar si todos los campos están completos
function verificarCamposCompletos() {
    if (nombreInput.value.trim() !== "" && sectorSelect.value !== "" && funcionSelect.value !== "") {
        capturarYMostrarBtn.disabled = false;  // Habilita el botón
    } else {
        capturarYMostrarBtn.disabled = true;   // Deshabilita el botón
    }
}

// Deshabilitar el botón al cargar la página
capturarYMostrarBtn.disabled = true;

// Función para cargar sectores y funciones desde el JSON
async function cargarSectoresYFunciones() {
    try {
        const response = await fetch('./panel/tarjetas/sectores.json');
        const data = await response.json();

        // Llenamos el select de sector
        sectorSelect.innerHTML = '<option value="">Seleccione un sector</option>';
        data.sectores.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector.nombre;
            option.textContent = sector.nombre;
            sectorSelect.appendChild(option);
        });

        // Escuchar cambios en el sector seleccionado para actualizar funciones
        sectorSelect.addEventListener('change', function() {
            const selectedSector = sectorSelect.value;

            // Limpiar las opciones de función
            funcionSelect.innerHTML = '<option value="">Seleccione una función</option>';

            // Buscar el sector seleccionado en el JSON y poblar las funciones
            const funciones = data.sectores.find(sector => sector.nombre === selectedSector)?.funciones || [];
            funciones.forEach(funcion => {
                const option = document.createElement('option');
                option.value = funcion;
                option.textContent = funcion;
                funcionSelect.appendChild(option);
            });

            // Habilitar el select de función
            funcionSelect.disabled = false;

            // Verificar si todos los campos están completos
            verificarCamposCompletos();
        });
    } catch (error) {
        console.error("Error al cargar sectores y funciones:", error);
    }
}

// Escuchar cambios en los otros campos
nombreInput.addEventListener('input', verificarCamposCompletos);
funcionSelect.addEventListener('change', verificarCamposCompletos);

// Inicialmente, el select de función está deshabilitado
funcionSelect.disabled = true;

// Cargar los sectores y funciones al cargar la página
document.addEventListener('DOMContentLoaded', cargarSectoresYFunciones);
