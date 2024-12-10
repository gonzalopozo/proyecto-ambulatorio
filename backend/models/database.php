<?php

// Se incluye el archivo de configuración con las credenciales de la base de datos
require "../config/config.php";

/**
 * Clase MySQL que extiende de mysqli para manejar la conexión a la base de datos
 */
class DatabaseConection extends mysqli {

    /**
     * Constructor para establecer la conexión con la base de datos
     * @param string $database_name Nombre de la base de datos
     */
    public function __construct() {

        // Configuramos mysqli para que lance excepciones
        mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ERROR);

        // Intentamos crear la conexión a la base de datos
        try {
            // Establecemos la conexión con los parámetros definidos en config.php
            parent::__construct(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

            // Configuramos el juego de caracteres a UTF-8
            $this->set_charset('utf8');

            // Si ocurre un error en la conexión, terminamos el proceso
            if ($this->connect_error) {
                die("Connection error {$this->connect_error}");
            }
        }

        // Captura de excepciones si la base de datos no existe
        catch (mysqli_sql_exception $mse) { 
            $errorSQL = $mse->getMessage();
            if (str_contains($errorSQL, "Unknown database '" . DB_NAME . "'")) {
                // Si no se encuentra la base de datos, la creamos
                parent::__construct(DB_HOST, DB_USER, DB_PASSWORD);

                // Creamos la base de datos
                $createDatabase = 'CREATE DATABASE ' . DB_NAME . ';';
                $this->db_query($createDatabase);

                // Seleccionamos la base de datos recién creada
                $this->select_db(DB_NAME);

                // Llamamos a la función para crear las tablas
                $this->createTables();
            }
        }
    }

    /**
     * Método privado para crear las tablas en la base de datos
     */
    private function createTables() {
        // Definimos las consultas SQL para crear las tablas necesarias
        $tablesQueries = [
            // Crear tabla para pacientes
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
            
            // Crear tabla para médicos
            "CREATE TABLE doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(70) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(15) NOT NULL, 
                specialty VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL
            );",

            // Tabla intermedia para relacionar médicos y pacientes
            "CREATE TABLE doctor_patients (
                doctor_id INT NOT NULL,
                patient_id INT NOT NULL,
                PRIMARY KEY (doctor_id, patient_id),
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
            );",

            // Tabla para citas
            "CREATE TABLE appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                symptomatology TEXT,
                diagnosis TEXT,
                pdf_file VARCHAR(255), -- Archivo PDF asociado a la consulta
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            );",

            // Tabla para medicamentos
            "CREATE TABLE medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE
            );",
            
            // Tabla intermedia para asociar citas y medicamentos
            "CREATE TABLE appointment_medicines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                appointment_id INT NOT NULL,
                medicine_id INT NOT NULL,
                quantity VARCHAR(100) NOT NULL,
                frequency VARCHAR(255) NOT NULL,
                duration_days SMALLINT, -- Duración del tratamiento
                chronic TINYINT(1) DEFAULT 0, -- Indica si el medicamento es para tratamiento crónico
                FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
                FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
            );"
        ];
        
        // Ejecutamos cada una de las consultas para crear las tablas
        foreach ($tablesQueries as $key => $value) {
            $this->db_query($value);
        }

        // Insertamos datos de ejemplo en las tablas
        $this->insertSampleData();
    }

    /**
     * Método privado para insertar datos de ejemplo en las tablas
     */
    private function insertSampleData() {
        // Definimos las consultas para insertar datos de ejemplo
        $tablesInserts = [
            // Insertar pacientes
            "INSERT INTO patients (name, email, dni, phone, address, sex, born_date, password) VALUES 
            ('Juan Pérez', 'juan.perez@example.com', '12345678A', '123456789', 'Calle Falsa 123', 'male', '1985-06-15', 'JuanP@ss1'),
            ('Ana García', 'ana.garcia@example.com', '23456789B', '234567890', 'Avenida Libertad 456', 'female', '1990-03-25', 'AnaGarci@2'),
            ('Carlos López', 'carlos.lopez@example.com', '34567890C', '345678901', 'Calle Mayor 789', 'male', '1980-09-05', 'CarL0pez#3'),
            ('Marta Sánchez', 'marta.sanchez@example.com', '45678901D', '456789012', 'Calle de la Paz 321', 'female', '1995-12-10', 'Mart@S4nch3z'),
            ('Pedro Ruiz', 'pedro.ruiz@example.com', '56789012E', '567890123', 'Calle Real 654', 'male', '1982-04-20', 'PedroR#5z'),
            ('Lucía Torres', 'lucia.torres@example.com', '67890123F', '678901234', 'Plaza Mayor 987', 'female', '1993-07-30', 'LucTorr6$');",

            // Insertar médicos
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

            // Insertar relaciones entre médicos y pacientes
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

            // Insertar citas
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, symptomatology, diagnosis, pdf_file) VALUES 
            (1, 1, '2024-12-05 10:00:00', 'Dolor en el pecho', 'Posible angina de pecho', 'consulta1.pdf'),
            (2, 2, '2024-12-06 11:30:00', 'Fiebre alta', 'Infección viral', 'consulta2.pdf'),
            (3, 3, '2024-12-07 14:00:00', 'Dolor de cabeza intenso', 'Migraña', 'consulta3.pdf'),
            (4, 4, '2024-12-08 16:00:00', 'Erupción en la piel', 'Dermatitis', 'consulta4.pdf'),
            (5, 5, '2024-12-09 09:00:00', 'Dolor en la rodilla', 'Esguince', 'consulta5.pdf'),
            (6, 6, '2024-12-10 15:30:00', 'Dolor abdominal', 'Gastritis', 'consulta6.pdf');",

            // Insertar medicamentos
            "INSERT INTO medicines (name) VALUES 
            ('Ibuprofeno'),
            ('Paracetamol'),
            ('Amoxicilina'),
            ('Loratadina'),
            ('Omeprazol'),
            ('Aspirina');",

            // Insertar medicamentos asociados a citas
            "INSERT INTO appointment_medicines (appointment_id, medicine_id, quantity, frequency, duration_days, chronic) VALUES 
            (1, 1, '400mg', 'Cada 8 horas', 7, 0),
            (2, 2, '500mg', 'Cada 6 horas', 5, 0),
            (3, 3, '10mg', 'Cada 12 horas', 3, 0),
            (4, 4, '10mg', 'Una vez al día', 7, 0),
            (5, 5, '20mg', 'Cada 24 horas', 10, 0),
            (6, 6, '500mg', 'Cada 6 horas', 7, 0);"
        ];

        // Ejecutamos cada una de las consultas de inserción de datos
        foreach ($tablesInserts as $insert) {
            $this->db_query($insert);
        }
    }

    /**
     * Método para realizar consultas SQL y devolver los resultados
     * @param string $sql La consulta SQL a ejecutar
     * @return array|null El resultado de la consulta o null si hay error
     */
    public function db_query(string $sql): array|null {
        // Inicializamos un array vacío para guardar los resultados
        $value = [];

        // Intentamos realizar la consulta
        try {
            // Ejecutamos la consulta
            if ($this->real_query($sql)) {
                // Usamos use_result para obtener los resultados de manera más eficiente
                if ($data = $this->use_result()) {
                    // Almacenamos los resultados en el array $value
                    while ($row = $data->fetch_assoc()) {
                        $value[] = $row;
                    }
                    // Liberamos los recursos asociados
                    $data->free();
                }
            } else {
                // Si la consulta falla, lanzamos una excepción
                throw new Exception("Error during the query: {$this->error}");
            }
        } catch (mysqli_sql_exception | Exception $e) {
            // Capturamos cualquier excepción y asignamos null al resultado
            $value = null;
        }

        return $value;
    }

    /**
     * Método para cerrar la conexión a la base de datos
     */
    public function db_close(): void {
        // Cerramos la conexión a la base de datos
        $this->close();
    }
}