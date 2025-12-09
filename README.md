TechHelpDesk – API de Soporte Técnico (NestJS + TypeORM + PostgreSQL)

Descripción breve
- API REST para el ciclo de vida de tickets de soporte (roles Admin, Technician, Client).
- Stack: NestJS 10, TypeORM, PostgreSQL, JWT, Swagger.
- Reglas clave: estados en secuencia (Abierto → En progreso → Resuelto → Cerrado), máximo 5 tickets en progreso por técnico, crear ticket requiere cliente y categoría válidos.

Coder / Clan
- Nombre: __________________
- Clan: _____________________

Requisitos previos
- Node.js 18+ y npm.
- Docker Desktop (para levantar Postgres y/o la API en contenedor).
- Opcional: PostgreSQL local si no usas Docker para la base.

Variables de entorno
1) Copia `.env.example` a `.env`.
2) Ajusta: `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME=techhelpdesk`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.

Ejecución con Docker (recomendado)
1) Levanta la base: `docker compose up -d db` (DB `techhelpdesk`).
2) (Opcional) Levanta la API: `docker compose up -d api` (corre migración + seed y expone `3000`).
3) Logs API: `docker compose logs -f api`
4) Detener: `docker compose down` (agrega `-v` si quieres borrar datos).

Ejecución local (host)
1) `npm install`
2) Migraciones: `DB_HOST=localhost npm run db:migrate`
3) Seed: `DB_HOST=localhost npm run seed`
4) Arrancar dev: `npm run start:dev`
   - Health: `GET http://localhost:3000/`
   - Swagger: `http://localhost:3000/docs`

Cómo autenticarse y usar roles
1) `POST /auth/login` con credenciales seed (abajo).
2) En Swagger, pulsa “Authorize” y pega `Bearer <accessToken>`.
3) Roles:
   - Admin: CRUD de users/technicians/clients/categories/tickets.
   - Technician: consulta y cambia estado de tickets asignados.
   - Client: crea tickets y consulta su historial.
4) Credenciales seed:
   - Admin: `admin@techhelpdesk.com` / `admin123`
   - Técnico: `tech@techhelpdesk.com` / `tech123`
   - Cliente: `client@techhelpdesk.com` / `client123`

Resumen de endpoints (usa Swagger para ejemplos)
- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- Users (solo Admin): CRUD `/users`
- Categories (solo Admin CRUD, lectura para todos): `/categories`
- Technicians (solo Admin CRUD, lectura admin/tech): `/technicians`
- Clients (solo Admin CRUD): `/clients` (crear requiere `userId` de un user con rol client)
- Tickets:
  - Crear (Admin/Client): `POST /tickets`
  - Listar todos (Admin): `GET /tickets`
  - Obtener: `GET /tickets/:id`
  - Historial por cliente: `GET /tickets/client/:id` (cliente solo ve los suyos)
  - Por técnico: `GET /tickets/technician/:id` (técnico solo ve los suyos)
  - Cambiar estado: `PATCH /tickets/:id/status` (Admin/Tech, valida secuencia y capacidad)
  - Actualizar prioridad/asignación: `PATCH /tickets/:id` (Admin)

Pruebas
- Unitarias (tickets): `npm run test`
- Cobertura: `npm run test:cov` (objetivo ≥ 40%).

Dump SQL
- Genera uno con `pg_dump -U <user> techhelpdesk > techhelpdesk_dump.sql` después de migrar y seedear.
