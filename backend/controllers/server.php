<?php

require_once "../models/database.php";

$dbConn = new DatabaseConection();

// Definimos los recursos disponibles
$allowedResourceTypes = [
    'patients',
    'doctors',
    'doctor_patients',
    'appointments',
    'appointments_by_id',
    'appointments_for_doctors',
    'appointments_for_doctors_7_days',
    'medicines',
    'appointment_medicines'
];

// Validamos que el recurso este disponible
$resourceType = $_GET['resource_type'];

if (!in_array($resourceType, $allowedResourceTypes)) {
    header("Location: http://localhost:5500/frontend/");
    die;
}

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

header('Content-Type: application/json');

$resourceId = array_key_exists('resource_id', $_GET) ? $_GET['resource_id'] : '';
$userEmail = array_key_exists('user_email', $_GET) ? $_GET['user_email'] : '';
$userPassword = array_key_exists('user_password', $_GET) ? $_GET['user_password'] : '';
$appointmentsStatus = array_key_exists('appointments_status', $_GET) ? $_GET['appointments_status'] : '';
$pdf = array_key_exists('pdf', $_GET) ? true : false;

switch (strtoupper($_SERVER['REQUEST_METHOD'])) {
    case 'GET':
        if (!empty($userEmail) && !empty($userPassword)) { // Inicio de sesión con email y contraseña
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

        } else if (empty($resourceId)) { // Obtener todos los registros de un recurso
            $select_query = "SELECT * FROM $resourceType";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType === 'appointment_medicines') { // Obtener medicamentos de una cita
            $select_query = "SELECT 
                m.name AS medicine_name,
                am.quantity,
                am.frequency,
                a.appointment_date,
                am.duration_days,
                am.chronic
            FROM 
                appointment_medicines am
            JOIN 
                medicines m ON am.medicine_id = m.id
            JOIN 
                appointments a ON am.appointment_id = a.id
            WHERE 
                a.patient_id = $resourceId;";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType === 'appointments' && $appointmentsStatus == 'upcoming') { // Obtener citas pendientes de un paciente
            $select_query = "SELECT id, (SELECT name FROM doctors WHERE id = appointments.doctor_id) as doctor_name, appointment_date FROM $resourceType WHERE (diagnosis IS NULL OR diagnosis = '') AND patient_id = $resourceId;
";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType === 'appointments' && $appointmentsStatus == 'past') { // Obtener citas pasadas de un paciente
            $select_query = "SELECT id, (SELECT name FROM doctors WHERE id = appointments.doctor_id) as doctor_name, appointment_date FROM $resourceType WHERE (diagnosis IS NULL OR diagnosis = '') AND patient_id = $resourceId";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType === "appointments" && !empty($resourceId)) { // Obtener detalles de una cita específica
            $select_query = "SELECT 
                                d.name AS doctor_name,
                                a.appointment_date,
                                a.symptomatology,
                                a.diagnosis,
                                a.pdf_file,
                                m.name AS medicine_name,
                                am.quantity AS posology,
                                am.frequency,
                                am.duration_days,
                                am.chronic
                            FROM 
                                appointments a
                            JOIN 
                                doctors d ON a.doctor_id = d.id
                            LEFT JOIN 
                                appointment_medicines am ON a.id = am.appointment_id
                            LEFT JOIN 
                                medicines m ON am.medicine_id = m.id
                            WHERE 
                                (diagnosis IS NOT NULL AND diagnosis != '') 
                                AND a.id = $resourceId;";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);

        } else if ($resourceType == "doctor_patients" && !empty($resourceId)) { // Obtener pacientes asignados a un médico
            $select_query = "SELECT doctor_id, (SELECT name FROM doctors WHERE id = doctor_patients.doctor_id) as name, (SELECT specialty FROM doctors WHERE id = doctor_patients.doctor_id) as specialty FROM $resourceType WHERE patient_id = $resourceId";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType == "appointments_for_doctors_7_days" && !empty($resourceId)) { // Obtener citas futuras para un médico (7 días)
            $select_query = "SELECT 
                                id, 
                                (SELECT name FROM patients WHERE id = appointments.patient_id) AS patient_name, symptomatology, appointment_date
                            FROM 
                                appointments 
                            WHERE 
                                doctor_id = $resourceId
                                AND (diagnosis IS NULL OR diagnosis = '')
                                AND appointment_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);";

            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        } else if ($resourceType == "appointments_for_doctors" && !empty($resourceId)) { // Obtener citas para un médico en el día actual
            $select_query = "SELECT 
                                id, 
                                (SELECT name FROM patients WHERE id = appointments.patient_id) AS patient_name, 
                                symptomatology 
                            FROM 
                                appointments 
                            WHERE 
                                doctor_id = $resourceId
                                AND (diagnosis IS NULL OR diagnosis = '')
                                AND DATE(appointment_date) = CURDATE();";
            
            $resource = $dbConn->db_query($select_query);

            echo json_encode($resource, true);
        }
        
        
        else if ($resourceType == "appointments_by_id" && !empty($resourceId)) { // Obtener una cita específica por ID
            $select_query = "SELECT patient_id, (SELECT name FROM patients WHERE id = appointments.patient_id) AS doctor_name, (SELECT name FROM doctors WHERE id = appointments.doctor_id) AS patient_name, appointment_date, symptomatology FROM appointments WHERE id = $resourceId;";

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
        if ($resourceType == "appointments" && !empty($resourceId) && $pdf) { // Subir un archivo PDF para una cita
            // error_log(print_r($_FILES, true));
            $fileTmpPath = $_FILES['file']['tmp_name'];
            $fileName = $_FILES['file']['name'];
            $fileSize = $_FILES['file']['size'];
            $fileType = $_FILES['file']['type'];

            // Genera un nombre único para evitar colisiones
            $uniqueFileName = uniqid() . '-' . $fileName;
            error_log($uniqueFileName);

            // Ruta completa al archivo
            $destPath = "./uploads/" . $uniqueFileName;

            // Mueve el archivo a la ubicación deseada
            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $update_query = "UPDATE $resourceType SET pdf_file = '$uniqueFileName' WHERE id = $resourceId";

                $updateResource = $dbConn->db_query($update_query);

                if (is_array($updateResource)) {
                    echo json_encode(["ID del $resourceType modificado" => $resourceId], true);
                }

            }
        } else {
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
        echo json_encode(["error" => "ERROR"]);

        break;
}