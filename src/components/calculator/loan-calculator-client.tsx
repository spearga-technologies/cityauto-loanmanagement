
"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DollarSign, Percent, Calendar, Calculator } from "lucide-react"

const formSchema = z.object({
  amount: z.coerce.number().min(1000, "Must be at least 1,000").max(10000000, "Must be at most 10,000,000"),
  rate: z.coerce.number().min(0.1, "Must be at least 0.1").max(30, "Must be at most 30"),
  term: z.coerce.number().int().min(1, "Must be at least 1 month").max(360, "Must be at most 360 months (30 years)"),
})

type AmortizationScheduleItem = {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

export function LoanCalculatorClient() {
  const [schedule, setSchedule] = useState<AmortizationScheduleItem[]>([])
  const [results, setResults] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50000,
      rate: 12,
      term: 24,
    },
  })

  const { amount, rate, term } = form.watch()

  const calculateLoan = (values: z.infer<typeof formSchema>) => {
    const principal = values.amount
    const monthlyRate = values.rate / 100 / 12
    const numberOfPayments = values.term

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setResults({ emi: 0, totalInterest: 0, totalPayment: 0 })
      setSchedule([])
      return
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    if (isNaN(emi) || !isFinite(emi)) {
        setResults({ emi: 0, totalInterest: 0, totalPayment: 0 })
        setSchedule([])
        return;
    }

    const totalPayment = emi * numberOfPayments
    const totalInterest = totalPayment - principal

    setResults({ emi, totalInterest, totalPayment })

    let balance = principal
    const newSchedule: AmortizationScheduleItem[] = []
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPaid = balance * monthlyRate
      const principalPaid = emi - interestPaid
      balance -= principalPaid
      newSchedule.push({
        month: i,
        principal: principalPaid,
        interest: interestPaid,
        totalPayment: emi,
        remainingBalance: balance > 0 ? balance : 0,
      })
    }
    setSchedule(newSchedule)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    calculateLoan(values)
  }
  
  // Initial calculation on mount
  useState(() => {
    calculateLoan(form.getValues())
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="text-primary"/> Calculator</CardTitle>
                <CardDescription>Adjust the sliders or input values to calculate your loan details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount: <span className="font-bold text-primary">{formatCurrency(field.value)}</span></FormLabel>
                      <FormControl>
                        <Slider
                          min={1000}
                          max={1000000}
                          step={1000}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate: <span className="font-bold text-primary">{field.value.toFixed(2)}%</span></FormLabel>
                      <FormControl>
                         <Slider
                          min={0.1}
                          max={30}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Term (Months): <span className="font-bold text-primary">{field.value}</span></FormLabel>
                      <FormControl>
                          <Slider
                          min={1}
                          max={360}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full" onClick={() => calculateLoan(form.getValues())}>Calculate</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Here is a summary of your loan calculation.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Monthly Payment (EMI)</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(results.emi)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalInterest)}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Payment</p>
                <p className="text-2xl font-bold">{formatCurrency(results.totalPayment)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Amortization Schedule</CardTitle>
                <CardDescription>A detailed breakdown of your payments over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                        <TableHead className="w-[80px]">Month</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedule.map((item) => (
                        <TableRow key={item.month}>
                            <TableCell className="font-medium">{item.month}</TableCell>
                            <TableCell>{formatCurrency(item.principal)}</TableCell>
                            <TableCell>{formatCurrency(item.interest)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.remainingBalance)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
