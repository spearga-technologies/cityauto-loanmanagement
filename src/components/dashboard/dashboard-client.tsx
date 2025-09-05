
"use client"

import type { Loan } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Clock, DollarSign, Landmark, TrendingUp, AlertTriangle, FileText, Download } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { predictFuturePaymentDefaults, PredictFuturePaymentDefaultsOutput } from "@/ai/flows/predict-future-payment-defaults"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

type DashboardClientProps = {
  loans: Loan[];
}

const statusColors: { [key: string]: string } = {
  Approved: "text-green-600",
  Pending: "text-yellow-600",
  Rejected: "text-red-600",
  Paid: "text-blue-600",
}

export function DashboardClient({ loans }: DashboardClientProps) {
  const totalLoans = loans.length
  const outstandingBalance = loans.reduce((acc, loan) => acc + loan.outstandingBalance, 0)
  const approvedLoans = loans.filter(l => l.status === 'Approved').length;
  const pendingLoans = loans.filter(l => l.status === 'Pending').length;

  const loanStatusData = [
    { name: 'Approved', value: loans.filter(l => l.status === 'Approved').length, fill: "hsl(var(--chart-1))" },
    { name: 'Pending', value: loans.filter(l => l.status === 'Pending').length, fill: "hsl(var(--chart-2))" },
    { name: 'Rejected', value: loans.filter(l => l.status === 'Rejected').length, fill: "hsl(var(--chart-3))" },
    { name: 'Paid', value: loans.filter(l => l.status === 'Paid').length, fill: "hsl(var(--chart-4))" },
  ];
  
  const chartConfig = {
    loans: {
      label: "Loans",
    },
    Approved: {
      label: "Approved",
      color: "hsl(var(--chart-1))",
    },
    Pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
     Rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-3))",
    },
     Paid: {
      label: "Paid",
      color: "hsl(var(--chart-4))",
    },
  }

  const recentLoans = loans.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Landmark} title="Total Loans" value={totalLoans} />
        <StatsCard icon={DollarSign} title="Outstanding Balance" value={`$${outstandingBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
        <StatsCard icon={CheckCircle} title="Approved Loans" value={approvedLoans} />
        <StatsCard icon={Clock} title="Pending Applications" value={pendingLoans} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Loan Overview</CardTitle>
            <CardDescription>A summary of loan activity over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoanActivityChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loan Status Distribution</CardTitle>
            <CardDescription>Current status of all loan applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
              <PieChart>
                 <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={loanStatusData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                   {loanStatusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-mt-4"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Loan Applications</CardTitle>
              <CardDescription>The latest applications submitted to the system.</CardDescription>
            </div>
             <Button variant="outline" size="sm" asChild>
                <Link href="/loans">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoans.map(loan => (
                  <TableRow key={loan.id}>
                    <TableCell>
                        <Link href={`/loans/${loan.id}`} className="font-medium hover:underline">{loan.applicant.name}</Link>
                    </TableCell>
                    <TableCell>${loan.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={loan.status === 'Approved' ? 'default' : loan.status === 'Paid' ? 'default' : 'secondary'} className={`${statusColors[loan.status]} bg-opacity-20`}>{loan.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{loan.applicationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <div className="flex flex-col gap-6">
            <DefaultRiskAnalysis />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Generate Reports</CardTitle>
                        <CardDescription>Download loan statuses and payment histories.</CardDescription>
                    </div>
                    <Button variant="default">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </CardHeader>
            </Card>
        </div>
      </div>
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

function LoanActivityChart() {
  const data = [
    { month: 'Jun', loans: 65 },
    { month: 'Jul', loans: 59 },
    { month: 'Aug', loans: 80 },
    { month: 'Sep', loans: 81 },
    { month: 'Oct', loans: 56 },
    { month: 'Nov', loans: 55 },
  ]
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <Bar dataKey="loans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


function DefaultRiskAnalysis() {
    const [loanData, setLoanData] = useState('');
    const [result, setResult] = useState<PredictFuturePaymentDefaultsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!loanData.trim()) {
            toast({
                title: 'Error',
                description: 'Please provide some loan data to analyze.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const res = await predictFuturePaymentDefaults({ loanData });
            setResult(res);
        } catch (error) {
            console.error('AI analysis failed:', error);
            toast({
                title: 'Analysis Failed',
                description: 'The AI risk analysis could not be completed.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-accent" /> AI-Powered Default Risk</CardTitle>
                <CardDescription>Use AI to predict future loan payment defaults based on historical data.</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Run New Analysis
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Predict Future Payment Defaults</DialogTitle>
                            <DialogDescription>
                                Paste historical loan payment data below. Include loan amount, interest rate, payment history, and applicant details for the best results.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Textarea 
                                placeholder="e.g., Loan: $20000, Rate: 5%, History: 3 late payments in 12 months, Credit Score: 650..."
                                className="min-h-[150px]"
                                value={loanData}
                                onChange={(e) => setLoanData(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        {result && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">Risk Assessment</h4>
                                    <p className="text-sm text-muted-foreground">{result.riskAssessment}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Recommendations</h4>
                                    <p className="text-sm text-muted-foreground">{result.recommendations}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

