
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
})

const contactDetailsSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  whatsappNumber: z.string().min(10, "WhatsApp number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),
})

const verificationSchema = z.object({
  aadharNumber: z.string().min(12, "Aadhaar number must be 12 digits.").max(12, "Aadhaar number must be 12 digits."),
  aadhar: z.instanceof(File).refine(file => file.size > 0, "Aadhaar photo is required."),
  pan: z.string().optional(),
  photo: z.instanceof(File).refine(file => file.size > 0, "A profile photo is required."),
})

const formSchema = personalDetailsSchema.merge(contactDetailsSchema).merge(verificationSchema)

const steps = [
  { id: 'Personal Details', schema: personalDetailsSchema, fields: ['fullName', 'email'] },
  { id: 'Contact Info', schema: contactDetailsSchema, fields: ['phone', 'whatsappNumber', 'address'] },
  { id: 'Verification', schema: verificationSchema, fields: ['aadhar', 'pan', 'photo', 'aadharNumber'] },
]

export function LoanApplicationForm() {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = React.useState(0)
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
    const [aadharPreview, setAadharPreview] = React.useState<string | null>(null)
    const photoFileInputRef = React.useRef<HTMLInputElement>(null)
    const aadharFileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            whatsappNumber: "",
            address: "",
            pan: "",
            aadharNumber: "",
        },
    })

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>, 
        fieldName: "photo" | "aadhar",
        setPreview: (value: string | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            form.setValue(fieldName, file)
        }
    }

    const nextStep = async () => {
        const currentFields = steps[currentStep].fields as (keyof z.infer<typeof formSchema>)[];
        const isValid = await form.trigger(currentFields);
        if (isValid) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                toast({
                    title: "User Created!",
                    description: "The new user profile has been successfully created.",
                })
                form.reset()
                setCurrentStep(0)
                setPhotoPreview(null)
                setAadharPreview(null)
                resolve(null)
            }, 1500)
        })
    }

    const progress = ((currentStep + 1) / steps.length) * 100

    return (
        <Card>
            <CardHeader>
                <CardTitle>New User Onboarding</CardTitle>
                <CardDescription>Please complete all steps to create your account.</CardDescription>
                 <div className="pt-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground mt-2">{`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].id}`}</p>
                </div>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-8">
                        
                        {currentStep === 0 && (
                             <div className="space-y-4">
                                <h3 className="text-lg font-medium">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField name="fullName" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField name="phone" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField name="whatsappNumber" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem className="md:col-span-2"><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                         {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Identity Verification</h3>
                                <FormField
                                    name="photo"
                                    control={form.control}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Photo</FormLabel>
                                        <div className="flex items-center gap-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={photoPreview || undefined} alt="User photo" className="object-cover" />
                                            <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                                        </Avatar>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => photoFileInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Photo
                                        </Button>
                                        <FormControl>
                                            <Input
                                            type="file"
                                            className="hidden"
                                            ref={photoFileInputRef}
                                            onChange={(e) => handleFileChange(e, "photo", setPhotoPreview)}
                                            accept="image/*"
                                            />
                                        </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField name="aadharNumber" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Aadhaar Card Number</FormLabel><FormControl><Input placeholder="12-digit number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField
                                        name="aadhar"
                                        control={form.control}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aadhaar Card Photo</FormLabel>
                                            <FormControl>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => aadharFileInputRef.current?.click()}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {aadharPreview ? "Change Photo" : "Upload Aadhaar Photo"}
                                                </Button>
                                            </FormControl>
                                             <Input
                                                type="file"
                                                className="hidden"
                                                ref={aadharFileInputRef}
                                                onChange={(e) => handleFileChange(e, "aadhar", setAadharPreview)}
                                                accept="image/*"
                                                />
                                            {aadharPreview && <img src={aadharPreview} alt="Aadhaar preview" className="mt-2 h-32 w-auto rounded-md object-contain" />}
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="pan" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>PAN Card Number (Optional)</FormLabel><FormControl><Input placeholder="10-character number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}
                      
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div>
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep < steps.length - 1 && (
                                <Button type="button" onClick={nextStep}>
                                    Next <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="mr-2 h-4 w-4" />
                                    )}
                                    Submit
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
