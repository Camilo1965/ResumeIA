import NextAuth from 'next-auth';
import { resumeAIAuthConfiguration } from '@/lib/auth-setup';

const authHandler = NextAuth(resumeAIAuthConfiguration);

export { authHandler as GET, authHandler as POST };
