"use client"

import * as React from "react"
import type { Loan } from "@/lib/data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FilePlus2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type LoansClientProps = {
  loans: Loan[];
}

const statusColors: { [key: string]: string } = {
  Approved: "text-green-600 bg-green-500/10",
  Pending: "text-yellow-600 bg-yellow-500/10",
  Rejected: "text-red-600 bg-red-500/10",
  Paid: "text-blue-600 bg-blue-500/10",
}

export function LoansClient({ loans: initialLoans }: LoansClientProps) {
  const [filter, setFilter] = React.useState("All")
  
  const filteredLoans = React.useMemo(() => {
    if (filter === "All") return initialLoans
    return initialLoans.filter(loan => loan.status === filter)
  }, [filter, initialLoans])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>All Loans</CardTitle>
                <CardDescription>Manage and view all loan applications.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <Tabs value={filter} onValueChange={setFilter}>
                    <TabsList>
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Approved">Approved</TabsTrigger>
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                        <TabsTrigger value="Paid">Paid</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button asChild>
                    <Link href="/loans/new">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        New Loan
                    </Link>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Application Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length > 0 ? filteredLoans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">
                  <Link href={`/loans/${loan.id}`} className="hover:underline">{loan.id}</Link>
                </TableCell>
                <TableCell>{loan.applicant.name}</TableCell>
                <TableCell>${loan.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[loan.status]}>{loan.status}</Badge>
                </TableCell>
                <TableCell>{loan.applicationDate}</TableCell>
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
                      <DropdownMenuItem asChild><Link href={`/loans/${loan.id}`}>View Details</Link></DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No loans found for this status.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
