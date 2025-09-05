import { UsersClient } from "@/components/users/users-client";
import { getAllUsers } from "@/lib/firebase/users";

export const metadata = {
  title: "Manage Users | LoanFlow",
  description: "View, add, and manage users.",
};

export default async function UsersPage() {
  const allUsers = await getAllUsers();

  return (
    <div className="space-y-6">
      <UsersClient users={allUsers} />
    </div>
  )
}
