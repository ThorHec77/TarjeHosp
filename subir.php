<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = $_POST['nombre'];
    $sector = $_POST['sector'];
    $funcion = $_POST['funcion'];
    $foto = $_POST['foto'];

    // Verifica si la imagen es válida
    if (preg_match('/^data:image\/(\w+);base64,/', $foto, $type)) {
        $foto = substr($foto, strpos($foto, ',') + 1);
        $foto = base64_decode($foto);
        
        // Genera un nombre de archivo único para la imagen
        $fileName = './panel/tarjetas/' . uniqid() . '.png';

        // Intenta guardar la imagen
        if (file_put_contents($fileName, $foto) === false) {
            echo json_encode(['success' => false, 'message' => 'No se pudo guardar la imagen.']);
            exit;
        }

        // Ahora guarda los datos en un archivo JSON
        $tarjetasDataFile = './panel/tarjetas/tarjetas.json';

        // Carga el archivo existente o crea uno nuevo
        if (file_exists($tarjetasDataFile)) {
            $tarjetasData = json_decode(file_get_contents($tarjetasDataFile), true);
        } else {
            $tarjetasData = [];
        }

        // Agrega la nueva tarjeta al arreglo
        $tarjeta = [
            'nombre' => $nombre,
            'sector' => $sector,
            'funcion' => $funcion,
            'imagen' => basename($fileName), // Solo el nombre del archivo
            'fecha' => date('Y-m-d H:i:s') // Fecha de creación
        ];
        $tarjetasData[] = $tarjeta;

        // Guarda los datos actualizados en el archivo JSON
        file_put_contents($tarjetasDataFile, json_encode($tarjetasData));

        // Devuelve una respuesta de éxito
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Datos de imagen no válidos.']);
        exit;
    }
}
?>
