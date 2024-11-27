<?php

require "../config/config.php";

/**
 * Clase MySQL
 */
class database extends mysqli {

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
            throw new Exception("Error during the connection with MySQLI {$mse->getMessage()}");
        } catch (Exception $e) {
            throw new Exception("Error {$e->getMessage()}");
        } catch (Error $e) { // Captura de errores fatales de versiones mayores a PHP 7.0
            throw new Exception("Fatal error {$e->getMessage()}");
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
