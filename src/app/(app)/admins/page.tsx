import { AddAdminForm } from "@/components/admins/add-admin-form";

export const metadata = {
  title: "Manage Admins | LoanFlow",
  description: "Add and manage administrators.",
};

export default function AdminsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Admins</h1>
        <p className="text-muted-foreground">Add new administrators to your application.</p>
      </div>
      <AddAdminForm />
    </div>
  )
}
