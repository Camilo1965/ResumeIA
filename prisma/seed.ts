import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario de demo
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const demoUser = await prisma.authenticatedUser.upsert({
    where: { emailAddress: 'demo@resumeia.com' },
    update: {},
    create: {
      emailAddress: 'demo@resumeia.com',
      fullName: 'Demo User',
      hashedPassword: hashedPassword,
    },
  })

  console.log('✅ Demo user created:', demoUser.emailAddress)

  // Crear perfil de ejemplo
  const profile = await prisma.userProfile.create({
    data: {
      ownedByUserId: demoUser.userId,
      completeName: 'Camilo Gonzalez',
      jobTitle: 'Senior Software Engineer',
      contactPhone: '3002033680',
      contactEmail: 'camilogonzalez1119@gmail.com',
      cityLocation: 'Piedecuesta, Santander 681011',
      linkedinProfile: 'https://www.linkedin.com/in/camilo-gonzalez-93ba66396/',
      displayLinkedin: true,
      jobHistory: `Bolivarian Pontifical Institute
Senior Software Engineer
Jan 2021 - Jan 2026

Led the development of Android and AI benchmarking frameworks, translating complex requirements into robust, verifiable Kotlin functionalities.`,
      academicHistory: `Universidad Autónoma de Bucaramanga
Bachelor's degree in Computer Science
Sep 2019 - Jun 2022`,
      technicalSkills: 'Kotlin, Java, Android SDK, Jetpack Compose, Python, AI/ML',
      selectedTemplate: 'minimalist',
      bgPattern: 'hexagon',
    },
  })

  console.log('✅ Profile created:', profile.completeName)
  console.log('\n🎉 Seed completed successfully!')
  console.log(`\n📧 Login with: ${demoUser.emailAddress}`)
  console.log(`🔑 Password: demo123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
