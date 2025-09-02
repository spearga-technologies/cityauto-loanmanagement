"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  // Applicant Details
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),

  // Vehicle Information
  vehicleMake: z.string().min(2, "Vehicle make is required."),
  vehicleModel: z.string().min(1, "Vehicle model is required."),
  vehicleYear: z.coerce.number().min(1980, "Year must be 1980 or newer.").max(new Date().getFullYear() + 1),
  vehicleVin: z.string().length(17, "VIN must be 17 characters."),

  // Loan Details
  loanAmount: z.coerce.number().min(1000, "Loan amount must be at least $1,000."),
  loanTerm: z.coerce.number().min(12, "Loan term must be at least 12 months.").max(84, "Loan term cannot exceed 84 months."),
})

export function LoanApplicationForm() {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            vehicleMake: "",
            vehicleModel: "",
            vehicleYear: undefined,
            vehicleVin: "",
            loanAmount: undefined,
            loanTerm: undefined,
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                toast({
                    title: "Application Submitted!",
                    description: "We've received your loan application and will review it shortly.",
                })
                form.reset()
                resolve(null)
            }, 1500)
        })
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>New Loan Application</CardTitle>
                        <CardDescription>Please fill out the form below to apply for a new loan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Applicant Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Applicant Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField name="fullName" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="email" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="phone" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="address" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                        <Separator />

                        {/* Vehicle Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Vehicle Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FormField name="vehicleMake" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="Toyota" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="vehicleModel" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="Camry" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="vehicleYear" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="2023" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="vehicleVin" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>VIN</FormLabel><FormControl><Input placeholder="17-digit VIN" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                        <Separator />

                        {/* Loan Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Loan Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField name="loanAmount" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount Requested</FormLabel>
                                        <FormControl><Input type="number" placeholder="25000" {...field} /></FormControl>
                                        <FormDescription>The total amount you wish to borrow.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="loanTerm" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loan Term (in months)</FormLabel>
                                        <FormControl><Input type="number" placeholder="60" {...field} /></FormControl>
                                        <FormDescription>The number of months you'd like to repay the loan.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Application
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
