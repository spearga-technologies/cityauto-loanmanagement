import { LoanCalculatorClient } from "@/components/calculator/loan-calculator-client";

export const metadata = {
  title: "Loan Calculator | LoanFlow",
  description: "Calculate loan payments and amortization schedules.",
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Loan EMI Calculator</h1>
        <p className="text-muted-foreground">Estimate your monthly loan payments and see a detailed amortization schedule.</p>
      </div>
      <LoanCalculatorClient />
    </div>
  );
}
