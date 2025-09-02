"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { categorizePaymentTransaction, CategorizePaymentTransactionOutput } from "@/ai/flows/categorize-payment-transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Wand2, Lightbulb } from "lucide-react"

const formSchema = z.object({
  transactionDescription: z.string().min(5, "Description must be at least 5 characters."),
  paymentAmount: z.coerce.number().positive("Amount must be a positive number."),
})

export function PaymentTracker() {
  const { toast } = useToast()
  const [result, setResult] = useState<CategorizePaymentTransactionOutput | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDescription: "",
      paymentAmount: undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setResult(null)
    try {
      const aiResult = await categorizePaymentTransaction(values)
      setResult(aiResult)
      toast({
        title: "Categorization Complete",
        description: `Transaction categorized as ${aiResult.category}.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to categorize transaction.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wand2 className="text-accent" /> AI Payment Categorization</CardTitle>
              <CardDescription>Enter a payment's details to have AI categorize it automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="transactionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Monthly auto-debit', 'Additional principal payment'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="477.42" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Categorize
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Analysis Result</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              <strong>Category:</strong> <span className="capitalize font-medium text-primary">{result.category}</span>
            </p>
            <p>
              <strong>Explanation:</strong> {result.explanation}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
