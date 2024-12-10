# proyecto-ambulatorio
Repositorio de GitHub para el proyecto de un ambulatorio usando JavaScript Vanilla y PHP Vanilla.

## Configuración del servidor web

Independientemente de usar XAMPP o Apache, deberemos configurar el servidor web añadiendo lo siguiente al archivo de configuración para obtener el correcto funcionamiento del proyecto:

```apache
DocumentRoot "rutaServerWeb/backend/controllers"
<Directory "rutaServerWeb/backend/controllers">
    # Para evitar el CORS
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header set Content-Type "application/json"
</Directory>
