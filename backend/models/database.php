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
                phone VARCHAR(15) NOT NULL, 
                address VARCHAR(255),
                sex CHAR(6) NOT NULL,
                born_date DATE NOT NULL,
                password VARCHAR(255) NOT NULL
            );",
            
            "CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(70) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(15) NOT NULL, 
                specialty VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL
            );;",
            
            "CREATE TABLE doctor_patients (
                doctor_id INT NOT NULL,
                patient_id INT NOT NULL,
                PRIMARY KEY (doctor_id, patient_id),
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
            );",
            
            "CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                symptomatology TEXT,
                diagnosis TEXT,
                is_consultation_done TINYINT(1) DEFAULT 0,
                pdf_file VARCHAR(255), -- Archivo PDF asociado a la consulta
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            );",

            "CREATE TABLE medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );",
            
            "CREATE TABLE appointment_medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                appointment_id INT NOT NULL,
                medicine_id INT NOT NULL,
                quantity VARCHAR(100) NOT NULL,
                frequency VARCHAR(255) NOT NULL,
                duration_days SMALLINT, -- Número de días de tratamiento
                chronic TINYINT(1) DEFAULT 0, -- Indicador de medicación crónica
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
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
            "INSERT INTO patients (name, email, dni, phone, address, sex, born_date, password) VALUES 
            ('Juan Pérez', 'juan.perez@example.com', '12345678A', '123456789', 'Calle Falsa 123', 'male', '1985-06-15', 'JuanP@ss1'),
            ('Ana García', 'ana.garcia@example.com', '23456789B', '234567890', 'Avenida Libertad 456', 'female', '1990-03-25', 'AnaGarci@2'),
            ('Carlos López', 'carlos.lopez@example.com', '34567890C', '345678901', 'Calle Mayor 789', 'male', '1980-09-05', 'CarL0pez#3'),
            ('Marta Sánchez', 'marta.sanchez@example.com', '45678901D', '456789012', 'Calle de la Paz 321', 'female', '1995-12-10', 'Mart@S4nch3z'),
            ('Pedro Ruiz', 'pedro.ruiz@example.com', '56789012E', '567890123', 'Calle Real 654', 'male', '1982-04-20', 'PedroR#5z'),
            ('Lucía Torres', 'lucia.torres@example.com', '67890123F', '678901234', 'Plaza Mayor 987', 'female', '1993-07-30', 'LucTorr6$');",

            "INSERT INTO doctors (name, email, phone, specialty, password) VALUES 
            ('Luis Rodríguez', 'luis.rodriguez@example.com', '778899001', 'Familia', 'LuisRodr!gu3z2'),
            ('Jorge Martín', 'jorge.martin@example.com', '112233445', 'Cardiología', 'J0rg3M@rt1n!'),
            ('Marta Jiménez', 'marta.jimenez@example.com', '889900112', 'Familia', 'Mart@J1m#nez3'),
            ('Laura González', 'laura.gonzalez@example.com', '223344556', 'Pediatría', 'Laur@Gonz4l3z!'),
            ('Alejandro Fernández', 'alejandro.fernandez@example.com', '990011223', 'Familia', 'AlexFern@nd3z5'),
            ('Daniel García', 'daniel.garcia@example.com', '334455667', 'Neurología', 'D4n13lGarci@4'),
            ('Carmen López', 'carmen.lopez@example.com', '101112233', 'Familia', 'CarmenL0pez!8'),
            ('Isabel Pérez', 'isabel.perez@example.com', '445566778', 'Dermatología', 'IsabelP#6rez7'),
            ('Francisco Martín', 'francisco.martin@example.com', '112233445', 'Familia', 'Franc!sc0Mart1n1'),
            ('Juan Fernández', 'juan.fernandez@example.com', '556677889', 'Traumatología', 'JuanFern@ndez9'),
            ('Teresa García', 'teresa.garcia@example.com', '223344556', 'Familia', 'T3resaGarc!a3'),
            ('Ana López', 'ana.lopez@example.com', '667788990', 'Ginecología', 'An@L0pez2');",

            "INSERT INTO doctor_patients (doctor_id, patient_id) VALUES
            (1, 1),
            (2, 1),
            (3, 2),
            (4, 2),
            (5, 3),
            (6, 3),
            (7, 4),
            (8, 4),
            (9, 5), 
            (10, 5), 
            (11, 6), 
            (12, 6);",

            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, symptomatology, diagnosis, is_consultation_done, pdf_file) VALUES 
            (1, 1, '2024-12-05 10:00:00', 'Dolor en el pecho', 'Posible angina de pecho', 1, 'consulta1.pdf'),
            (2, 2, '2024-12-06 11:30:00', 'Fiebre alta', 'Infección viral', 1, 'consulta2.pdf'),
            (3, 3, '2024-12-07 14:00:00', 'Dolor de cabeza intenso', 'Migraña', 1, 'consulta3.pdf'),
            (4, 4, '2024-12-08 16:00:00', 'Erupción en la piel', 'Dermatitis', 1, 'consulta4.pdf'),
            (5, 5, '2024-12-09 09:00:00', 'Dolor en la rodilla', 'Esguince', 1, 'consulta5.pdf'),
            (6, 6, '2024-12-10 15:30:00', 'Dolor abdominal', 'Gastritis', 1, 'consulta6.pdf');",

            "INSERT INTO medicines (name) VALUES 
            ('Ibuprofeno'),
            ('Paracetamol'),
            ('Amoxicilina'),
            ('Loratadina'),
            ('Omeprazol'),
            ('Aspirina');",

            "INSERT INTO appointment_medicines (appointment_id, medicine_id, quantity, frequency, duration_days, chronic) VALUES 
            (1, 1, '400mg', 'Cada 8 horas', 7, 0),
            (2, 2, '500mg', 'Cada 6 horas', 5, 0),
            (3, 3, '10mg', 'Cada 12 horas', 3, 0),
            (4, 4, '10mg', 'Una vez al día', 7, 0),
            (5, 5, '20mg', 'Cada 24 horas', 10, 0),
            (6, 6, '500mg', 'Cada 6 horas', 7, 0);"
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
            // print "\n\nError: {$e->getMessage()}\n\n";
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
