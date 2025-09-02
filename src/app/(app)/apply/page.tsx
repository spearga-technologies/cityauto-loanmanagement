import { LoanApplicationForm } from "@/components/loans/loan-application-form";

export const metadata = {
  title: "Apply for Loan | LoanFlow",
  description: "Submit a new loan application.",
};

export default function ApplyPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Apply for a Loan</h1>
        <p className="text-muted-foreground">Complete the form below to start your loan application process.</p>
      </div>
      <LoanApplicationForm />
    </div>
  )
}
