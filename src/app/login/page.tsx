import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/layout/logo";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center space-y-4">
        <Logo className="h-16 w-16" />
        <LoginForm />
      </div>
    </div>
  );
}
