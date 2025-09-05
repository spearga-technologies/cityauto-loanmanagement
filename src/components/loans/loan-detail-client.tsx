
"use client"

import * as React from "react"
import type { Loan, Payment, ScheduledPayment } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentTracker } from "./payment-tracker"
import Image from "next/image"
import { Button } from "../ui/button"
import { PlusCircle, Edit } from "lucide-react"
import { AddPaymentDialog } from "./add-payment-dialog"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "../ui/separator"
import { UpdatePaymentDialog } from "./update-payment-dialog"
import { cn } from "@/lib/utils"


type LoanDetailClientProps = {
  loan: Loan;
}

const statusColors: { [key: string]: string } = {
  Approved: "text-green-600 bg-green-500/10",
  Pending: "text-yellow-600 bg-yellow-500/10",
  Rejected: "text-red-600 bg-red-500/10",
  Paid: "text-blue-600 bg-blue-500/10",
}

const scheduleStatusColors: { [key: string]: string } = {
  Paid: "text-green-600 bg-green-500/10",
  Due: "text-blue-600 bg-blue-500/10",
  'Partially Paid': "text-yellow-600 bg-yellow-500/10",
  Overdue: "text-red-600 bg-red-500/10",
};


export function LoanDetailClient({ loan: initialLoan }: LoanDetailClientProps) {
    const [loan, setLoan] = React.useState(initialLoan);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [isUpdatePaymentDialogOpen, setIsUpdatePaymentDialogOpen] = React.useState(false);
    const [selectedPayment, setSelectedPayment] = React.useState<ScheduledPayment | null>(null);
    const { toast } = useToast();

    const handleAddPayment = (loanId: string, payment: { amount: number; date: Date; description: string }) => {
        setLoan(prevLoan => {
            const newPayment: Payment = {
                id: `P${prevLoan.payments.length + 1}`,
                amount: payment.amount,
                date: payment.date.toISOString().split('T')[0],
                description: payment.description,
            };
            const newOutstandingBalance = prevLoan.outstandingBalance - payment.amount;
            return {
                ...prevLoan,
                payments: [...prevLoan.payments, newPayment],
                outstandingBalance: newOutstandingBalance,
                status: newOutstandingBalance <= 0 ? 'Paid' : prevLoan.status,
            };
        });
        toast({ title: "Payment Added", description: `A new payment of $${payment.amount} has been recorded for loan ${loanId}.` });
        setIsPaymentDialogOpen(false);
    };

    const handleUpdatePayment = (updatedPayment: ScheduledPayment) => {
        setLoan(prevLoan => ({
            ...prevLoan,
            repaymentSchedule: prevLoan.repaymentSchedule.map(p => p.id === updatedPayment.id ? updatedPayment : p),
        }));
        toast({ title: "Payment Updated", description: `Payment ${updatedPayment.id} has been successfully updated.` });
        setIsUpdatePaymentDialogOpen(false);
        setSelectedPayment(null);
    }

    const openUpdateDialog = (payment: ScheduledPayment) => {
        setSelectedPayment(payment);
        setIsUpdatePaymentDialogOpen(true);
    }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan <span className="text-primary">{loan.id}</span></h1>
          <p className="text-muted-foreground">Applicant: {loan.applicant.name}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant="outline" className={`text-base ${statusColors[loan.status]}`}>{loan.status}</Badge>
        </div>
      </div>
      
      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-4 sm:w-[500px]">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Repayment Schedule</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="categorize">Categorize Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Complete information about the loan agreement and vehicle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-primary">Loan Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <InfoCard label="Total Amount" value={`$${loan.amount.toLocaleString()}`} />
                       <InfoCard label="Interest Rate" value={`${loan.interestRate}%`} />
                       <InfoCard label="Term" value={`${loan.term} months`} />
                       <InfoCard label="Outstanding" value={`$${loan.outstandingBalance.toLocaleString()}`} className="bg-primary/10 text-primary" />
                    </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-primary">Applicant Information</h4>
                        <InfoItem label="Name" value={loan.applicant.name} />
                        <InfoItem label="Email" value={loan.applicant.email} />
                        <InfoItem label="Application Date" value={loan.applicationDate} />
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-primary">Vehicle Information</h4>
                        <InfoItem label="Make & Model" value={`${loan.vehicle.make} ${loan.vehicle.model}`} />
                        <InfoItem label="Year" value={loan.vehicle.year} />
                        <InfoItem label="Registration #" value={loan.vehicle.vin} />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-primary">Vehicle Photo</h4>
                    <div className=" overflow-hidden rounded-lg border">
                        <Image src={loan.vehicle.photoUrl} data-ai-hint="scooter motorcycle" alt="Vehicle Image" width={800} height={600} className="object-cover" />
                    </div>
                 </div>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="schedule">
          <Card>
            <CardHeader>
                <CardTitle>Repayment Schedule</CardTitle>
                <CardDescription>Manage and track all scheduled payments for this loan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loan.repaymentSchedule.length > 0 ? loan.repaymentSchedule.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className={cn(scheduleStatusColors[payment.status])}>{payment.status}</Badge></TableCell>
                      <TableCell>{payment.amountPaid ? `$${payment.amountPaid.toLocaleString()}`: 'N/A'}</TableCell>
                      <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                      <TableCell>{payment.paymentReference || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openUpdateDialog(payment)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No repayment schedule found for this loan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manual Payment History</CardTitle>
                <CardDescription>A log of all manually added payments for this loan.</CardDescription>
              </div>
               <Button onClick={() => setIsPaymentDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Manual Payment
                </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loan.payments.length > 0 ? loan.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No manual payments have been recorded for this loan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categorize">
            <PaymentTracker />
        </TabsContent>
      </Tabs>
       <AddPaymentDialog
            isOpen={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
            loan={loan}
            onSubmit={handleAddPayment}
        />
        {selectedPayment && (
            <UpdatePaymentDialog 
                isOpen={isUpdatePaymentDialogOpen}
                onOpenChange={setIsUpdatePaymentDialogOpen}
                payment={selectedPayment}
                onSubmit={handleUpdatePayment}
            />
        )}
    </div>
  )
}

function InfoItem({ label, value, className }: { label: string, value: string | number, className?: string }) {
    return (
        <div className="flex justify-between items-baseline border-b pb-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-sm font-medium ${className}`}>{value}</p>
        </div>
    )
}

function InfoCard({ label, value, className }: { label: string, value: string | number, className?: string }) {
    return (
        <div className={cn("p-3 rounded-lg border bg-card", className)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value}</p>
        </div>
    )
}
