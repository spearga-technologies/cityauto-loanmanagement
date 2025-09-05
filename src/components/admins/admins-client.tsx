
"use client"

import * as React from "react"
import type { Admin } from "@/lib/admins"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddAdminForm } from "./add-admin-form"

type AdminsClientProps = {
  admins: Admin[];
}

export function AdminsClient({ admins: initialAdmins }: AdminsClientProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>All Administrators</CardTitle>
                <CardDescription>A list of all admin users in your application.</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Administrator</DialogTitle>
                        <DialogDescription>
                            Fill out the details below to create a new admin user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                       <AddAdminForm onSuccess={() => setOpen(false)} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialAdmins.length > 0 ? initialAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={admin.photoUrl} alt={admin.fullName} />
                    <AvatarFallback>{admin.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {admin.fullName}
                </TableCell>
                <TableCell>@{admin.username}</TableCell>
                <TableCell>{admin.phone}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No administrators found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  )
}
