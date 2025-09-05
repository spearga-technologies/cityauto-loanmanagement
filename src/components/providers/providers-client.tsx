"use client"

import * as React from "react"
import type { Provider } from "@/lib/providers"
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
import { AddProviderForm } from "./add-provider-form"
import { Badge } from "@/components/ui/badge"

type ProvidersClientProps = {
  providers: Provider[];
}

export function ProvidersClient({ providers: initialProviders }: ProvidersClientProps) {
  const [open, setOpen] = React.useState(false);
  const [providers, setProviders] = React.useState(initialProviders);

  const handleProviderAdded = (newProvider: Provider) => {
    setProviders((prevProviders) => [...prevProviders, newProvider]);
    setOpen(false);
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>All Loan Providers</CardTitle>
                <CardDescription>A list of all loan provider users in your application.</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Provider
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add New Loan Provider</DialogTitle>
                        <DialogDescription>
                            Fill out the details below to create a new loan provider account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                       <AddProviderForm onSuccess={handleProviderAdded} />
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
              <TableHead>Role</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length > 0 ? providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={provider.photoUrl} alt={provider.fullName} />
                    <AvatarFallback>{provider.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {provider.fullName}
                </TableCell>
                <TableCell>@{provider.username}</TableCell>
                <TableCell><Badge variant="secondary">{provider.role}</Badge></TableCell>
                <TableCell>{provider.phone}</TableCell>
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
                    <TableCell colSpan={5} className="h-24 text-center">
                        No loan providers found.
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
