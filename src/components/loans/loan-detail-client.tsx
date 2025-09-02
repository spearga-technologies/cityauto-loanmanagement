"use client"

import type { Loan } from "@/lib/data"
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

type LoanDetailClientProps = {
  loan: Loan;
}

const statusColors: { [key: string]: string } = {
  Approved: "text-green-600 bg-green-500/10",
  Pending: "text-yellow-600 bg-yellow-500/10",
  Rejected: "text-red-600 bg-red-500/10",
  Paid: "text-blue-600 bg-blue-500/10",
}

export function LoanDetailClient({ loan }: LoanDetailClientProps) {
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
      
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="categorize">Categorize Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Complete information about the loan agreement and vehicle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Loan Summary</h4>
                        <InfoItem label="Loan Amount" value={`$${loan.amount.toLocaleString()}`} />
                        <InfoItem label="Interest Rate" value={`${loan.interestRate}%`} />
                        <InfoItem label="Loan Term" value={`${loan.term} months`} />
                        <InfoItem label="Outstanding Balance" value={`$${loan.outstandingBalance.toLocaleString()}`} className="font-bold text-primary" />
                        <InfoItem label="Application Date" value={loan.applicationDate} />
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Applicant</h4>
                        <InfoItem label="Name" value={loan.applicant.name} />
                        <InfoItem label="Email" value={loan.applicant.email} />
                    </div>
                </div>
                 <div className="space-y-4 pt-6">
                    <h4 className="font-semibold text-lg">Vehicle Information</h4>
                     <div className="grid md:grid-cols-3 gap-6">
                        <div>
                             <InfoItem label="Make & Model" value={`${loan.vehicle.make} ${loan.vehicle.model}`} />
                             <InfoItem label="Year" value={loan.vehicle.year} />
                             <InfoItem label="VIN" value={loan.vehicle.vin} />
                        </div>
                        <div className="md:col-span-2">
                            <Image src="https://picsum.photos/600/400" data-ai-hint="car side" alt="Vehicle Image" width={600} height={400} className="rounded-lg object-cover" />
                        </div>
                     </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>A log of all payments made for this loan.</CardDescription>
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
                        No payments have been recorded for this loan.
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
    </div>
  )
}

function InfoItem({ label, value, className }: { label: string, value: string | number, className?: string }) {
    return (
        <div className="flex justify-between items-baseline">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-sm font-medium ${className}`}>{value}</p>
        </div>
    )
}
