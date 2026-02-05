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

## Licencia

MIT