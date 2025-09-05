
import { AdminsClient } from "@/components/admins/admins-client";
import { admins } from "@/lib/admins";

export const metadata = {
  title: "Manage Admins | LoanFlow",
  description: "View, add, and manage administrators.",
};

export default function AdminsPage() {
  const allAdmins = admins;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Admins</h1>
        <p className="text-muted-foreground">View, add, and manage administrators for your application.</p>
      </div>
      <AdminsClient admins={allAdmins} />
    </div>
  )
}
