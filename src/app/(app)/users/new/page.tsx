import { LoanApplicationForm } from "@/components/loans/loan-application-form";

export const metadata = {
  title: "New User | LoanFlow",
  description: "Add a new user to the system.",
};

export default function NewUserPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">User Onboarding</h1>
        <p className="text-muted-foreground">Complete the form below to create a new user profile.</p>
      </div>
      <LoanApplicationForm />
    </div>
  )
}
