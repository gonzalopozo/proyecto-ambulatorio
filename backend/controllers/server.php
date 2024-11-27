<?php

require_once "../models/database.php";

$dbConn = new DatabaseConection();

// Definimos los recursos disponibles
$allowedResourceTypes = [
    'patients',
    'doctors',
    'appointments',
    'consultations',
    'medications'
];

// Validamos que el recurso este disponible
$resourceType = $_GET['resource_type'];

if (!in_array($resourceType, $allowedResourceTypes)) {
    die;
}

// Avisamos al cliente de que el contenido enviado es en formato JSON
header('Content-Type: application/json');

// Levantamos el id del recurso buscado
$resourceId = array_key_exists('resource_id', $_GET) ? $_GET['resource_id'] : '';

// Generamos la respuesta asumiendo que el pedido es correcto
switch (strtoupper($_SERVER['REQUEST_METHOD'])) {
    case 'GET':
        if (empty($resourceId)) {
            $select_query = "SELECT * FROM $resourceType";

            $resource = $dbConn->db_query($select_query);

            echo $resource;

            // echo json_encode($resource, true);
        } else {
            if (count($dbConn->db_query("SELECT * FROM $resourceType WHERE id = $resourceId")) > 0) {
                $select_query = "SELECT * FROM $resourceType WHERE id = $resourceId)";

                $resource = $dbConn->db_query($select_query);

                echo json_encode($resource);
                
            } else {
                echo json_encode(['error' => "Libro no encontrado"]);
            }
        }

        break;

    case 'POST':
        // En un caso real, aquí se guardaria un nuevo libro en una BBDD 

        // Tomamos la entrada "cruda"
        $json = file_get_contents('php://input');

        // Transformamos el json recibido a un nuevo elemento del array
        $books[] = json_decode($json, true);

        // Emitimos hacia la salida la ultima clave del arreglo de los libros, se hace por convención (el devolver el id del elemento añadido)
        echo array_keys($books)[count($books) - 1];

        // echo json_encode($books);
        break;
    
    case 'PUT':
        // Validamos que el recurso buscado exista
        if (!empty($resourceId) && array_key_exists($resourceId, $books)) {
            // Tomamos la entrada "cruda"
            $json = file_get_contents('php://input');

            // Actualizamos el array de libros cambiando el libro con el id recibido ($resourceId) asignando como valor este el json recibido
            $books[$resourceId] = json_decode($json, true);

            // Emitimos hacia la salida la clave del arreglo de los libros del libro actualizado, se hace por convención (el devolver el id del elemento modificado)
            echo array_keys($books)[$resourceId - 1];

            // Retornamos la coleccion modificada en formato JSON
            // echo json_encode($books);
        }

        break;
    
    case 'DELETE':
        // Validamos que el recurso exista
        if (!empty($resourceId) && array_key_exists($resourceId, $books)) { 
            // En caso real, ejecutar sentencia SQL para borrar registro en BBDD

            // Eliminamos el recurso
            unset($books[$resourceId]);

            // Retornamos la coleccion modificada en formato JSON
            echo json_encode($books);
        }

        break;
    
    default:
        # code...
        break;
}