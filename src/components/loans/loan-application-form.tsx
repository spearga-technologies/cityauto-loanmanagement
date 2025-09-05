
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createUser } from "@/lib/firebase/users"
import type { User as AppUser } from "@/lib/users"

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
  aadharNumber: z.string().length(12, "Aadhaar number must be 12 digits."),
  aadhar: z.instanceof(File).refine(file => file.size > 0, "Aadhaar photo is required."),
  pan: z.string().optional(),
  photo: z.instanceof(File).refine(file => file.size > 0, "A profile photo is required."),
})

const formSchema = personalDetailsSchema.merge(contactDetailsSchema).merge(verificationSchema)

const steps = [
  { id: 'Personal Details', schema: personalDetailsSchema, fields: ['fullName', 'email'] },
  { id: 'Contact Info', schema: contactDetailsSchema, fields: ['phone', 'whatsappNumber', 'address'] },
  { id: 'Verification', schema: verificationSchema, fields: ['aadharNumber', 'aadhar', 'pan', 'photo'] },
]

type LoanApplicationFormProps = {
    onSuccess?: (newUser: AppUser) => void;
}

export function LoanApplicationForm({ onSuccess }: LoanApplicationFormProps) {
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
        const isValid = await form.trigger(currentFields, { shouldFocus: true });
        if (isValid) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const newUser = await createUser(values);

            if (newUser) {
                 toast({
                    title: "User Created!",
                    description: `${newUser.fullName} has been created successfully.`,
                })
                form.reset()
                setCurrentStep(0)
                setPhotoPreview(null)
                setAadharPreview(null)
                 if (photoFileInputRef.current) photoFileInputRef.current.value = ""
                if (aadharFileInputRef.current) aadharFileInputRef.current.value = ""
                onSuccess?.(newUser);
            } else {
                 toast({
                    title: "Error",
                    description: "Failed to create user. The email might already be in use.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Form submission error:", error)
            toast({
                title: "Something went wrong",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        }
    }

    const progress = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="space-y-4">
             <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">{`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].id}`}</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-8 p-1">
                        
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <FormField
                                        name="photo"
                                        control={form.control}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Photo</FormLabel>
                                            <div className="flex flex-col items-center gap-4 border p-4 rounded-md">
                                            <Avatar className="h-32 w-32">
                                                <AvatarImage src={photoPreview || undefined} alt="User photo" className="object-cover" />
                                                <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                                            </Avatar>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => photoFileInputRef.current?.click()}
                                                className="w-full"
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
                                    <FormField
                                        name="aadhar"
                                        control={form.control}
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aadhaar Card Photo</FormLabel>
                                            <div className="flex flex-col items-center gap-4 border p-4 rounded-md min-h-[228px] justify-center">
                                                {aadharPreview ? (
                                                    <img src={aadharPreview} alt="Aadhaar preview" className="h-32 w-auto rounded-md object-contain" />
                                                ) : <div className="text-muted-foreground text-sm text-center">Aadhaar preview will appear here.</div>}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => aadharFileInputRef.current?.click()}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    {aadharPreview ? "Change Photo" : "Upload Aadhaar Photo"}
                                                </Button>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        className="hidden"
                                                        ref={aadharFileInputRef}
                                                        onChange={(e) => handleFileChange(e, "aadhar", setAadharPreview)}
                                                        accept="image/*"
                                                        />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField name="aadharNumber" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Aadhaar Card Number</FormLabel><FormControl><Input placeholder="12-digit number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="pan" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>PAN Card Number (Optional)</FormLabel><FormControl><Input placeholder="10-character number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}
                      
                    </div>
                    <div className="flex justify-between pt-8">
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
                    </div>
                </form>
            </Form>
        </div>
    )
}
