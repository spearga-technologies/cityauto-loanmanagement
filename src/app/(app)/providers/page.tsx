import { ProvidersClient } from "@/components/providers/providers-client";
import { getAllProviders } from "@/lib/firebase/providers";

export const metadata = {
  title: "Manage Providers | LoanFlow",
  description: "View, add, and manage loan providers.",
};

export default async function ProvidersPage() {
  const allProviders = await getAllProviders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Loan Providers</h1>
        <p className="text-muted-foreground">View, add, and manage loan providers for your application.</p>
      </div>
      <ProvidersClient providers={allProviders} />
    </div>
  )
}
