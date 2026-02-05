import Link from 'next/link';
import { LogIn } from 'lucide-react';

export function SignInPromptButton() {
  return (
    <Link href="/login" className="btn-primary flex items-center gap-2">
      <LogIn size={18} />
      <span>Sign In</span>
    </Link>
  );
}
