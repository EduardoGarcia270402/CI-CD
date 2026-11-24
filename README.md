# Sistema Bibliotecario

Laboratorio de modelo de datos, PostgreSQL con Docker y primer CRUD REST de personas con NestJS y TypeORM.

## Modelo de datos

La base de datos inicial contiene `persona`, `usuario`, `rol` y `usuario_rol`. Una persona puede existir sin cuenta; cada usuario referencia una persona única. Los roles se relacionan con usuarios mediante `usuario_rol`, que impide repetir una misma asignación. El catálogo y la circulación (libro, ejemplar, préstamo y reserva) quedan como incrementos posteriores del DER.

## Requisitos

- Git y acceso al repositorio remoto.
- Docker Desktop iniciado con el motor Linux disponible.
- Node.js LTS y npm.

## Configuración local

1. Copia `.env.example` como `.env` y establece una contraseña local para PostgreSQL. No subas `.env` al repositorio.
2. Inicia la base de datos y confirma que esté saludable:

   ```powershell
   docker compose up -d
   docker compose ps
   ```

3. Crea las tablas en PostgreSQL:

   ```powershell
   Get-Content .\database\01_schema.sql | docker compose exec -T postgres psql -U biblioteca -d biblioteca_db
   ```

4. Instala dependencias e inicia la API:

   ```powershell
   cd backend
   npm install
   npm run start:dev
   ```

La API escucha en `http://localhost:3000`. TypeORM usa `localhost:5434` y no modifica el esquema automáticamente.

## Rutas de Persona

| Método | Ruta | Resultado |
| --- | --- | --- |
| `POST` | `/persona` | Crea una persona y valida el correo y los campos requeridos. |
| `GET` | `/persona` | Lista personas. |
| `GET` | `/persona/:id` | Busca una persona por UUID. |
| `PATCH` | `/persona/:id` | Actualiza los campos enviados. |
| `DELETE` | `/persona/:id` | Elimina la persona; responde 404 si no existe. |

Ejemplo de creación desde PowerShell:

```powershell
$persona = @{
    nombres = 'Ana'
    apellidos = 'Perez'
    identificacion = 'PRUEBA-001'
    correo = 'ana.prueba@example.com'
    telefono = '0991234567'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/persona' -Method Post -ContentType 'application/json' -Body $persona
Invoke-RestMethod -Uri 'http://localhost:3000/persona' -Method Get
```

## Ramas del laboratorio

Las ramas de trabajo son `master`, `pruebas` y `desarrollo`. Los cambios de este incremento se realizan en `desarrollo`.

```powershell
git switch desarrollo
git add .gitignore .env.example README.md docker-compose.yml database backend
git commit -m "feat: implementar primer CRUD de personas"
git push -u origin desarrollo
git push -u origin pruebas
git push -u origin master
```
