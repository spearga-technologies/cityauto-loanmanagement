import { LoanCreationForm } from "@/components/loans/loan-creation-form";

export const metadata = {
    title: "New Loan Application | LoanFlow",
    description: "Create a new loan application for a user.",
};

export default function NewLoanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Loan Application</h1>
                <p className="text-muted-foreground">Follow the steps to create a new loan for an existing user.</p>
            </div>
            <LoanCreationForm />
        </div>
    );
}
