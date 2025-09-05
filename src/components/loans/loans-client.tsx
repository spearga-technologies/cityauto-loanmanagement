
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
import { FilePlus2, MoreHorizontal, Search, DollarSign, Landmark, Clock, CheckCircle, Pencil, PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AddPaymentDialog } from "./add-payment-dialog"
import { UpdateStatusDialog } from "./update-status-dialog"
import { useToast } from "@/hooks/use-toast"

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
  const [loans, setLoans] = React.useState(initialLoans);
  const [filter, setFilter] = React.useState("All")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = React.useState(false);
  const { toast } = useToast();
  
  const filteredLoans = React.useMemo(() => {
    let filtered = loans;
    if (filter !== "All") {
        filtered = filtered.filter(loan => loan.status === filter);
    }
    if (searchTerm) {
        filtered = filtered.filter(loan => loan.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  }, [filter, searchTerm, loans])

  const stats = React.useMemo(() => {
    return {
      totalValue: loans.reduce((acc, loan) => acc + loan.amount, 0),
      activeLoans: loans.filter(l => l.status === 'Approved').length,
      pendingApplications: loans.filter(l => l.status === 'Pending').length,
      totalLoans: loans.length,
    }
  }, [loans])

  const handleAddPayment = (loanId: string, payment: { amount: number; date: Date; description: string }) => {
    setLoans(prevLoans => prevLoans.map(loan => {
        if (loan.id === loanId) {
            const newPayment = {
                id: `P${loan.payments.length + 1}`,
                amount: payment.amount,
                date: payment.date.toISOString().split('T')[0],
                description: payment.description,
            };
            return {
                ...loan,
                payments: [...loan.payments, newPayment],
                outstandingBalance: loan.outstandingBalance - payment.amount,
            };
        }
        return loan;
    }));
    toast({ title: "Payment Added", description: `A new payment of $${payment.amount} has been recorded for loan ${loanId}.` });
    setIsPaymentDialogOpen(false);
  };

  const handleUpdateStatus = (loanId: string, status: Loan['status']) => {
      setLoans(prevLoans => prevLoans.map(loan => loan.id === loanId ? { ...loan, status } : loan));
      toast({ title: "Status Updated", description: `Loan ${loanId} has been updated to "${status}".` });
      setIsStatusDialogOpen(false);
  };

  const openDialog = (loan: Loan, dialog: 'payment' | 'status') => {
      setSelectedLoan(loan);
      if (dialog === 'payment') setIsPaymentDialogOpen(true);
      if (dialog === 'status') setIsStatusDialogOpen(true);
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
            <p className="text-muted-foreground">Search, filter, and manage all loan applications.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard icon={DollarSign} title="Total Loan Value" value={`$${stats.totalValue.toLocaleString()}`} />
            <StatsCard icon={CheckCircle} title="Active Loans" value={stats.activeLoans} />
            <StatsCard icon={Clock} title="Pending Applications" value={stats.pendingApplications} />
            <StatsCard icon={Landmark} title="Total Loans" value={stats.totalLoans} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>All Loans</CardTitle>
                    <CardDescription>A list of all loan applications in the system.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/loans/new">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        New Loan
                    </Link>
                </Button>
            </div>
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                 <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search by applicant name..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Approved">Approved</TabsTrigger>
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                        <TabsTrigger value="Paid">Paid</TabsTrigger>
                    </TabsList>
                </Tabs>
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
                      <Link href={`/loans/${loan.id}`} className="hover:underline text-primary">{loan.id}</Link>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => openDialog(loan, 'payment')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => openDialog(loan, 'status')}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No loans found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {selectedLoan && (
            <>
                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    onOpenChange={setIsPaymentDialogOpen}
                    loan={selectedLoan}
                    onSubmit={handleAddPayment}
                />
                <UpdateStatusDialog
                    isOpen={isStatusDialogOpen}
                    onOpenChange={setIsStatusDialogOpen}
                    loan={selectedLoan}
                    onSubmit={handleUpdateStatus}
                />
            </>
        )}
    </div>
  )
}

function StatsCard({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
