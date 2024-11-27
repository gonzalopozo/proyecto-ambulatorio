<?php

require "../config/config.php";

/**
 * Clase MySQL
 */
class DatabaseConection extends mysqli {

    /**
     * Creamos un constructor para poder crear instancias de la conexión
     * @param string $database_name
     */
    public function __construct() {

        // Configuramos mysqli para que lanze excepciones
        mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ERROR);

        // Intentamos crear una instancia de MySQL
        try {
            // Creamos una instancia de MySQL
            parent::__construct(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

            // Configuramos la instancia para que acepte caractéres especiales
            $this->set_charset('utf8');

            // Manejo de errores
            if ($this->connect_error) {
                die("Connection error {$this->connect_error}");
            }
        }

        // Captura de excepciones en la conexión con la base de datos
        catch (mysqli_sql_exception $mse) { // Capturamos excepciones de mysqli
            $errorSQL = $mse->getMessage();
            if (str_contains($errorSQL, "Unknown database '" . DB_NAME . "'")) {
                parent::__construct(DB_HOST, DB_USER, DB_PASSWORD);

                $createDatabase = 'CREATE DATABASE ' . DB_NAME . ';';

                $this->db_query($createDatabase);
                $this->select_db(DB_NAME);
                $this->createTables();
                
            }
        }
    }

    private function createTables() {
        $tablesQueries = [
            "CREATE TABLE patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                dni CHAR(9) UNIQUE NOT NULL,
                sex ENUM('male', 'female') NOT NULL,
                born_date DATE NOT NULL
            );",
            
            "CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(70) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                specialty VARCHAR(100) NOT NULL
            );",
            
            "CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            );",
            
            "CREATE TABLE consultations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_id INT NOT NULL,
                diagnosis TEXT NOT NULL,
                symptomatology VARCHAR(100),
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
            );",

            "CREATE TABLE medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );",
            
            "CREATE TABLE medications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                consultation_id INT NOT NULL,
                medicine_id INT NOT NULL,
                quantity SMALLINT NOT NULL,
                frequency VARCHAR(255) NOT NULL,
                chronic TINYINT(1) NOT NULL,
                number_days SMALLINT NOT NULL,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
                FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
            );"
        ];
        
        foreach ($tablesQueries as $key => $value) {
            // print "Error creating table: {$query}\n";
            $this->db_query($value);
        }

        $this->insertSampleData();
    }

    private function insertSampleData() {
        $tablesInserts = [
            "INSERT INTO patients (name, email, dni, sex, born_date) VALUES 
            ('John Doe', 'john.doe@example.com', '12345678A', 'male', '1985-04-15'),
            ('Jane Smith', 'jane.smith@example.com', '23456789B', 'female', '1992-07-20'),
            ('Carlos Ruiz', 'carlos.ruiz@example.com', '34567890C', 'male', '1980-02-11'),
            ('Laura Garcia', 'laura.garcia@example.com', '45678901D', 'female', '1995-09-30'),
            ('Mario Fernandez', 'mario.fernandez@example.com', '56789012E', 'male', '1978-01-22'),
            ('Ana Lopez', 'ana.lopez@example.com', '67890123F', 'female', '2000-06-18');",

            "INSERT INTO doctors (name, email, specialty) VALUES 
            ('Dr. Alice Brown', 'alice.brown@hospital.com', 'Cardiology'),
            ('Dr. Robert Wilson', 'robert.wilson@hospital.com', 'Neurology'),
            ('Dr. Clara Martinez', 'clara.martinez@hospital.com', 'Pediatrics'),
            ('Dr. David Johnson', 'david.johnson@hospital.com', 'Orthopedics'),
            ('Dr. Elena Perez', 'elena.perez@hospital.com', 'Dermatology'),
            ('Dr. Francisco Gomez', 'francisco.gomez@hospital.com', 'General Medicine');",

            "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES 
            (1, 1, '2024-11-28 09:00:00'),
            (2, 2, '2024-11-28 10:30:00'),
            (3, 3, '2024-11-29 14:00:00'),
            (4, 4, '2024-11-30 11:00:00'),
            (5, 5, '2024-12-01 08:30:00'),
            (6, 6, '2024-12-01 13:15:00');",

            "INSERT INTO consultations (patient_id, doctor_id, appointment_id, diagnosis, symptomatology) VALUES 
            (1, 1, 1, 'Hypertension', 'High blood pressure, headache'),
            (2, 2, 2, 'Migraine', 'Severe headache, nausea'),
            (3, 3, 3, 'Flu', 'Fever, cough, sore throat'),
            (4, 4, 4, 'Fracture', 'Broken left arm, swelling'),
            (5, 5, 5, 'Eczema', 'Itchy skin rash on arms'),
            (6, 6, 6, 'Diabetes Type 2', 'Increased thirst, frequent urination');",

            "INSERT INTO medicines (name) VALUES 
            ('Paracetamol'),
            ('Ibuprofen'),
            ('Insulin'),
            ('Antihistamines'),
            ('Metformin'),
            ('Amoxicillin');",

            "INSERT INTO medications (patient_id, consultation_id, medicine_id, quantity, frequency, chronic, number_days) VALUES 
            (1, 1, 1, 30, 'Twice a day', 1, 365),
            (2, 2, 2, 20, 'Once a day', 0, 7),
            (3, 3, 4, 15, 'Three times a day', 0, 10),
            (4, 4, 6, 10, 'Once a day', 0, 14),
            (5, 5, 5, 50, 'Twice a day', 1, 90),
            (6, 6, 3, 25, 'Thrice a day', 1, 365);"
        ];

        foreach ($tablesInserts as $insert) {
            $this->db_query($insert);
        }
    }

    /**
     * Realizar consulta SQL a MySQL
     * @param string $sql
     * @return array $value
     * */
    public function db_query(string $sql): array|null {
        // Inicializamos el array a devolver
        $value = [];

        // Intentamos hacer la consulta
        try {
            // Ejecutamos la consulta
            if ($this->real_query($sql)) {
                // Usamos use_result para optimizar la eficiencia de memoria en el cliente
                if ($data = $this->use_result()) {
                    // Guardamos el resultado en el array a devolver
                    while ($row = $data->fetch_assoc()) {
                        $value[] = $row;
                    }
                    // Liberamos recursos
                    $data->free();
                }
            } else {
                // Si real_query retorna falso, es posible que nunca se asigne $data, por lo que no debemos intentar liberarlo aquí
                throw new Exception("Error during the query: {$this->error}");
            }
        } catch (mysqli_sql_exception | Exception $e) { // Capturamos la excepción
            print "\n\nError: {$e->getMessage()}\n\n";
            $value = null;
        }

        return $value;
    }


    /**
     * Método para cerrar la sesión de MySQL
     */
    public function db_close(): void {
        $this->close();
    }
}
