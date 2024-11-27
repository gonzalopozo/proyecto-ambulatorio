<?php

require_once "../models/database.php";

$dbConn = new DatabaseConection();

// Definimos los recursos disponibles
$allowedResourceTypes = [
    'patients',
    'doctors',
    'appointments',
    'consultations',
    'medications',
    'medicines'
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

            echo json_encode($resource, true);
        } else {
            $exists_id_query = "SELECT * FROM $resourceType WHERE id = $resourceId";
            $execute_exists_id_query = $dbConn->db_query($exists_id_query);
            $idExits = count($execute_exists_id_query) > 0 ? true : false;

            if ($idExits) {
                echo json_encode($execute_exists_id_query);
            } else {
                echo json_encode(['error' => "$resourceType no encontrado"]);
            }
        }

        break;

    case 'POST':
        // En un caso real, aquí se guardaria un nuevo libro en una BBDD 

        // Tomamos la entrada "cruda"
        $json = file_get_contents('php://input');

        $insertInfo = json_decode($json, true);

        $insert_query = "INSERT INTO $resourceType (";

        $insertInfoKeys = array_keys($insertInfo);

        for ($i = 0; $i < count($insertInfoKeys); $i++) { 
            if ((count($insertInfoKeys) - 1) == $i) {
                $insert_query .= "$insertInfoKeys[$i]) ";
            } else {
                $insert_query .= "$insertInfoKeys[$i],";
            }
        }

        $insert_query .= "VALUES (";

        $insertInfoValues = array_values($insertInfo);

        for ($i = 0; $i < count($insertInfoValues); $i++) { 
            if ((count($insertInfoValues) - 1) == $i) {
                $insert_query .= "'$insertInfoValues[$i]');";
            } else {
                $insert_query .= "'$insertInfoValues[$i]',";
            }
        }

        $insertResource = $dbConn->real_query($insert_query);

        if (isset($insertResource)) {
            $select_inserted_resource = "SELECT id FROM $resourceType ORDER BY id DESC LIMIT 1";

            $resource = $dbConn->db_query($select_query);

            echo json_encode(["ID del $resourceType añadido" => $resource[0]], true);
        } else {
            echo "\n$insert_query\n";
            echo json_encode(['error' => "este $resourceType no se ha podido meter"]);
        }

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