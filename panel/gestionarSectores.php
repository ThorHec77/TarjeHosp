<?php 
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Ruta del archivo sectores.json
$file_path = './tarjetas/sectores.json';
$sectores = json_decode(file_get_contents($file_path), true);

// Verificar si hubo un error en la lectura del archivo JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Error al leer el archivo JSON']);
    exit;
}

// Obtener datos enviados desde JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se recibió la acción correcta
if (!$data || !isset($data['accion'])) {
    echo json_encode(['success' => false, 'error' => 'Acción no especificada']);
    exit;
}

// Verificar la acción a realizar: agregar o eliminar
if ($data['accion'] === 'agregar') {
    if (!isset($data['nombre']) || !is_array($data['funciones']) || empty($data['funciones'])) {
        echo json_encode(['success' => false, 'error' => 'Datos incompletos para agregar']);
        exit;
    }

    $nuevoSector = [
        'nombre' => filter_var($data['nombre'], FILTER_SANITIZE_STRING),
        'funciones' => array_map('filter_var', $data['funciones'], array_fill(0, count($data['funciones']), FILTER_SANITIZE_STRING))
    ];

    // Agregar el nuevo sector
    $sectores['sectores'][] = $nuevoSector;

} elseif ($data['accion'] === 'eliminar') {
    if (empty($sectores['sectores'])) {
        echo json_encode(['success' => false, 'error' => 'No hay sectores para eliminar']);
        exit;
    }

    $nombreSector = filter_var($data['nombre'], FILTER_SANITIZE_STRING);

    // Buscar y eliminar el sector por nombre
    $sectores['sectores'] = array_filter($sectores['sectores'], function($sector) use ($nombreSector) {
        return $sector['nombre'] !== $nombreSector;
    });

    // Reindexar el array
    $sectores['sectores'] = array_values($sectores['sectores']);
} else {
    echo json_encode(['success' => false, 'error' => 'Acción inválida']);
    exit;
}

// Guardar los datos actualizados en sectores.json
if (file_put_contents($file_path, json_encode($sectores, JSON_PRETTY_PRINT))) {
    // Limpiar el buffer y responder con éxito
    ob_clean();
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'No se pudo guardar en el archivo']);
}
exit;
?>
