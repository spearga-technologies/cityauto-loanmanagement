
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScheduledPayment } from "@/lib/data"
import React from "react"
import { Textarea } from "../ui/textarea"

const formSchema = z.object({
  status: z.enum(["Due", "Paid", "Partially Paid", "Overdue"]),
  amountPaid: z.coerce.number().optional(),
  paymentDate: z.date().optional(),
  paymentMethod: z.enum(["Cash", "UPI", "Bank Transfer"]).optional(),
  paymentReference: z.string().optional(),
}).refine(data => {
    if (data.status === 'Partially Paid' && (data.amountPaid === undefined || data.amountPaid <= 0)) {
        return false;
    }
    return true;
}, {
    message: "Amount paid is required for partially paid status.",
    path: ["amountPaid"],
});


type UpdatePaymentDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  payment: ScheduledPayment
  onSubmit: (updatedPayment: ScheduledPayment) => void
}

export function UpdatePaymentDialog({ isOpen, onOpenChange, payment, onSubmit }: UpdatePaymentDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: payment.status,
      amountPaid: payment.amountPaid,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
      paymentMethod: payment.paymentMethod,
      paymentReference: payment.paymentReference,
    },
  })

  React.useEffect(() => {
    form.reset({
      status: payment.status,
      amountPaid: payment.amountPaid,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
      paymentMethod: payment.paymentMethod,
      paymentReference: payment.paymentReference,
    })
  }, [payment, form, isOpen])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedPayment: ScheduledPayment = {
        ...payment,
        ...values,
        paymentDate: values.paymentDate ? format(values.paymentDate, "yyyy-MM-dd") : undefined,
    }
    onSubmit(updatedPayment)
  }
  
  const status = form.watch("status");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment for {payment.id}</DialogTitle>
          <DialogDescription>
            Update the status and details for the payment due on {payment.dueDate}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Due">Due</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(status === 'Paid' || status === 'Partially Paid') && (
                 <>
                    <FormField
                    control={form.control}
                    name="amountPaid"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount Paid</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 500.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a method" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="paymentReference"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Payment Reference</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Transaction ID, Receipt No." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                 </>
            )}

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
