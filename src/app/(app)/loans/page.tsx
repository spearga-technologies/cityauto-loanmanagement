import { LoansClient } from "@/components/loans/loans-client";
import { loans } from "@/lib/data";

export const metadata = {
  title: "All Loans | LoanFlow",
  description: "View and manage all loan applications.",
};

export default function LoansPage() {
  const allLoans = loans;

  return (
    <div className="space-y-6">
        <LoansClient loans={allLoans} />
    </div>
  )
}
