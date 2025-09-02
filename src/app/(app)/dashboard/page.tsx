import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { loans } from "@/lib/data";

export const metadata = {
  title: "Dashboard | LoanFlow",
  description: "Overview of your loan portfolio.",
};

export default function DashboardPage() {
  // In a real app, you'd fetch this data from an API
  const allLoans = loans;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a look at your loan portfolio.</p>
      </div>
      <DashboardClient loans={allLoans} />
    </div>
  )
}
