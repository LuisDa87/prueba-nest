SportsLine API (Node + TypeScript + PostgreSQL)

Resumen
- Express + TypeScript
- Sequelize (PostgreSQL)
- Autenticación con JWT + refreshToken
- Roles: admin y vendedor
- Cifrado híbrido: AES-256-GCM + RSA-OAEP
- Docker + Docker Compose (Node + Postgres)

Requisitos
- Node 18+
- Docker y Docker Compose (opcional para contenedores)

Instalación local
1) Copia .env.example a .env y ajusta valores.
2) Instala dependencias: npm install
3) Arranca Postgres (local o con Docker):
   - docker compose up -d db
4) Sincroniza tablas y corre seeds:
   - npm run db:sync
   - npm run seed
5) Levanta la API:
   - npm run dev

Rutas principales
- GET / -> status API
- POST /api/auth/register { name, email, password, role? }
- POST /api/auth/login { email, password }
- POST /api/auth/refresh { refreshToken }
- GET /api/products (Bearer token requerido)
- POST /api/products (solo admin)

Notas de cifrado híbrido
- Si defines RSA_PUBLIC_KEY en .env, /api/auth/login devolverá un objeto "secure" con el mensaje encriptado (demo).
- Para probar decrypt en el servidor, el util de decryptHybrid requiere RSA_PRIVATE_KEY (no expuesto por rutas por simplicidad).

Docker (API + DB)
- docker compose up -d
- API en http://localhost:3000 y Postgres en 5432.
  Se limita CPU/RAM en el servicio api mediante deploy.resources (Compose).

Gitflow básico
- main: estable
- develop: integración
- features: feature/<nombre>

