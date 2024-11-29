<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $imagenABorrar = $input['imagen'];

    // Ruta completa de la imagen a eliminar
    $rutaImagen = './tarjetas/' . $imagenABorrar;

    // Verifica si el archivo existe y lo elimina
    if (file_exists($rutaImagen)) {
        unlink($rutaImagen); // Elimina el archivo de imagen
    }

    // Cargar las tarjetas existentes
    $tarjetas = json_decode(file_get_contents('./tarjetas/tarjetas.json'), true);
    
    // Filtrar las tarjetas para eliminar la especificada
    $tarjetasFiltradas = array_filter($tarjetas, function($tarjeta) use ($imagenABorrar) {
        return $tarjeta['imagen'] !== $imagenABorrar;
    });

    // Guardar las tarjetas actualizadas de nuevo en el JSON
    file_put_contents('./tarjetas/tarjetas.json', json_encode(array_values($tarjetasFiltradas)));
    
    echo json_encode(['success' => true]);
}
?>
