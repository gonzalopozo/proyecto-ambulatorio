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
                born_date DATE NOT NULL,
                password VARCHAR(255) NOT NULL
            );",
            
            "CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(70) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                specialty VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL
            );",
            
            "CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                symptomatology TEXT NOT NULL,
                diagnosis TEXT,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            );",
            
            "CREATE TABLE medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );",

            "CREATE TABLE appointment_medicines (
                appointment_id INT NOT NULL,
                medicine_id INT NOT NULL,
                quantity SMALLINT NOT NULL,
                frequency VARCHAR(255) NOT NULL,
                PRIMARY KEY (appointment_id, medicine_id),
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
                FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
            );",
            
            "CREATE TABLE patient_medicines (
                patient_id INT NOT NULL,
                medicine_id INT NOT NULL,
                chronic TINYINT(1) NOT NULL,
                number_days SMALLINT,
                PRIMARY KEY (patient_id, medicine_id),
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
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
            "INSERT INTO patients (name, email, dni, sex, born_date, password) VALUES
            ('Juan Pérez', 'juan.perez@example.com', '12345678A', 'male', '1990-05-20', 'Secure!2024'),
            ('María Gómez', 'maria.gomez@example.com', '87654321B', 'female', '1985-08-15', 'Passw0rd$123'),
            ('Pedro López', 'pedro.lopez@example.com', '45612378C', 'male', '2000-01-30', 'D4me@Time!'),
            ('Ana Martínez', 'ana.martinez@example.com', '78945612D', 'female', '1995-12-10', 'Alpha#9876'),
            ('Luis Ramírez', 'luis.ramirez@example.com', '15975346E', 'male', '1980-07-05', 'Str0ng&P@ss'),
            ('Carmen Díaz', 'carmen.diaz@example.com', '96385274F', 'female', '1993-11-25', 'Code!123Go');",

            "INSERT INTO doctors (name, email, specialty, password) VALUES
            ('Dr. Fernando Sánchez', 'fernando.sanchez@example.com', 'Cardiología', 'P@ssword2024'),
            ('Dra. Laura Fernández', 'laura.fernandez@example.com', 'Pediatría', 'My\$ecur3Key'),
            ('Dr. José López', 'jose.lopez@example.com', 'Dermatología', 'R0ck&Roll!23'),
            ('Dra. Elena García', 'elena.garcia@example.com', 'Medicina General', 'Sky@2024Blue'),
            ('Dr. Javier Gómez', 'javier.gomez@example.com', 'Neurología', 'P@ssW0rd#Now'),
            ('Dra. Patricia Ramírez', 'patricia.ramirez@example.com', 'Ginecología', 'B1g\$Tr33&4U');",

            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, symptomatology, diagnosis) VALUES
            (1, 5, '2024-11-28 10:00:00', 'Dolor de cabeza persistente', 'Migraña leve'),
            (2, 1, '2024-11-28 12:30:00', 'Dolor en el pecho al hacer ejercicio', 'Angina de esfuerzo'),
            (3, 2, '2024-11-29 09:00:00', 'Tos persistente y fiebre', 'Bronquitis aguda'),
            (4, 3, '2024-11-29 11:15:00', 'Dolor abdominal frecuente', 'Gastritis crónica'),
            (5, 4, '2024-11-30 14:45:00', 'Consulta de control anual', 'Todo normal'),
            (6, 6, '2024-11-30 16:00:00', 'Erupción cutánea en brazos y espalda', 'Dermatitis de contacto');",

            "INSERT INTO medicines (name) VALUES
            ('Paracetamol'),
            ('Ibuprofeno'),
            ('Omeprazol'),
            ('Salbutamol'),
            ('Metformina'),
            ('Amoxicilina');",

            "INSERT INTO appointment_medicines (appointment_id, medicine_id, quantity, frequency) VALUES
            (1, 1, 1, 'Cada 8 horas'),
            (2, 2, 2, 'Cada 12 horas'),
            (3, 4, 1, 'Cada 6 horas'),
            (4, 3, 1, 'Antes de las comidas'),
            (5, 1, 1, 'Cada 12 horas'),
            (6, 6, 1, 'Cada 24 horas');",

            "INSERT INTO patient_medicines (patient_id, medicine_id, chronic, number_days) VALUES
            (1, 5, 1, 365),
            (2, 3, 0, 14),
            (3, 4, 0, 10),
            (4, 6, 0, 7),
            (5, 2, 0, 5),
            (6, 1, 1, 365);"
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
