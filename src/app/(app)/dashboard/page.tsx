
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { loans } from "@/lib/data";

export const metadata = {
  title: "Dashboard | LoanFlow",
  description: "An overview of your loan management system.",
};

export default function DashboardPage() {
  const allLoans = loans;

  return (
    <div className="space-y-6">
        <DashboardClient loans={allLoans} />
    </div>
  )
}
