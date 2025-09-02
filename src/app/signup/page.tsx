import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/layout/logo";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
       <div className="flex flex-col items-center space-y-4">
        <Logo className="h-16 w-16" />
        <SignupForm />
      </div>
    </div>
  );
}
