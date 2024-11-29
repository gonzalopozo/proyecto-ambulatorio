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

// Permitir solicitudes CORS
header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json');

// Levantamos el id del recurso buscado
$resourceId = array_key_exists('resource_id', $_GET) ? $_GET['resource_id'] : '';
$userEmail = array_key_exists('user_email', $_GET) ? $_GET['user_email'] : '';
$userPassword = array_key_exists('user_password', $_GET) ? $_GET['user_password'] : '';

// Generamos la respuesta asumiendo que el pedido es correcto
switch (strtoupper($_SERVER['REQUEST_METHOD'])) {
    case 'GET':
        if (!empty($userEmail) && !empty($userPassword)) {
            $select_query = "SELECT 'patient' AS role, password, id 
                            FROM patients 
                            WHERE email = '$userEmail'

                            UNION 

                            SELECT 'doctor' AS role, password, id
                            FROM doctors 
                            WHERE email = '$userEmail';";

            $execute_query = $dbConn->db_query($select_query);
            $accountExits = count($execute_query) > 0 ? true : false;
            if ($accountExits) {
                if ($userPassword == $execute_query[0]['password']) {
                    echo json_encode(["role" => $execute_query[0]["role"], "id" => $execute_query[0]["id"]]);
                }
            } else {
                echo json_encode(['error' => "Usuario no encontrado"]);
            }

        } else if (empty($resourceId)) {
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

        $insertResource = $dbConn->db_query($insert_query);
        if (is_array($insertResource)) {
            $select_inserted_resource = "SELECT id FROM $resourceType ORDER BY id DESC LIMIT 1";

            $resource = $dbConn->db_query($select_inserted_resource);

            echo json_encode(["ID del $resourceType added" => $resource[0]], true);
        } else {
            echo json_encode(['error' => "este $resourceType no se ha podido meter"]);
        }

        break;
    
    case 'PUT':
        $exists_id_query = "SELECT * FROM $resourceType WHERE id = $resourceId";
        $execute_exists_id_query = $dbConn->db_query($exists_id_query);
        $idExits = count($execute_exists_id_query) > 0 ? true : false;

        // Validamos que el recurso buscado exista
        if (!empty($resourceId) && $idExits) {
            // Tomamos la entrada "cruda"
            $json = file_get_contents('php://input');

            $updateInfo = json_decode($json, true);
            $lastKeyUpdateInfo = array_key_last($updateInfo);

            $update_query = "UPDATE $resourceType SET ";

            foreach ($updateInfo as $column => $value) {
                if ($column == $lastKeyUpdateInfo) {
                    $update_query .= "$column = '$value' ";
                } else {
                    $update_query .= "$column = '$value', ";
                }
            }

            $update_query .= "WHERE id = $resourceId";

            $updateResource = $dbConn->db_query($update_query);

            if (is_array($updateResource)) {
                echo json_encode(["ID del $resourceType modificado" => $resourceId], true);
            }
        } else {
            echo json_encode(["error" => "este $resourceType no se ha podido actualizar"]);
        }

        break;
    
    case 'DELETE':
        $exists_id_query = "SELECT * FROM $resourceType WHERE id = $resourceId";
        $execute_exists_id_query = $dbConn->db_query($exists_id_query);
        $idExits = count($execute_exists_id_query) > 0 ? true : false;

        // Validamos que el recurso buscado exista
        if (!empty($resourceId) && $idExits) {
            $delete_query = "DELETE FROM $resourceType WHERE id = $resourceId;";

            $deleteResource = $dbConn->db_query($delete_query);

            $select_query = "SELECT * FROM $resourceType";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else {
            echo json_encode(["error" => "este $resourceType no se ha podido eliminar"]);
        }

        break;
    
    default:
        # code...
        break;
}