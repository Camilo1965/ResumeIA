# Resume AI 🚀

Aplicación web para generar CVs/Resumes personalizados con Inteligencia Artificial.

## Funcionalidades

- **Resume Generator**: Genera CVs adaptados a ofertas de trabajo específicas
- **Profiles**: Gestión de perfiles de usuario con información personal y profesional
- **History**: Historial de CVs generados con opciones de descarga
- **AI-Powered**: Utiliza IA para personalizar el contenido según los requisitos del trabajo
- **Multiple Templates**: Modern, Classic, Minimalist
- **Background Styles**: No Background, Particle Dots, Dot Flow, Hexagon
- **PDF Export**: Descarga y vista previa en PDF

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **AI**: OpenAI API (GPT-4)
- **PDF**: react-pdf
- **Auth**: NextAuth.js

## Getting Started

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

## 🚀 Deploy en Producción

### Opción 1: Vercel (Recomendado)

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno:
   - `DATABASE_URL` - URL de PostgreSQL
   - `NEXTAUTH_SECRET` - Clave secreta (genera con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - URL de tu app (ej: https://resumeia.vercel.app)
   - `OPENAI_API_KEY` - Tu API key de OpenAI
3. Deploy automático con cada push a main

### Opción 2: Base de Datos Gratuita

**Supabase (Recomendado):**
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. Ve a Settings > Database > Connection string
4. Copia la URL y úsala como `DATABASE_URL`

**Neon:**
1. Crea cuenta en [neon.tech](https://neon.tech)
2. Crea nuevo proyecto
3. Copia connection string

### Migrar Base de Datos

```bash
# Generar migración
npx prisma migrate dev --name init

# Aplicar en producción
npx prisma migrate deploy

# Seed inicial (opcional)
npx prisma db seed
```

## Licencia

MIT