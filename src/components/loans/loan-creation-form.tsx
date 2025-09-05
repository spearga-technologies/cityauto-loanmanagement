
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
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, User, Search, Bike, Users, FileSignature, BookImage } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import type { User as AppUser } from "@/lib/users"
import { getAllUsers } from "@/lib/firebase/users"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

// Step Schemas
const userSelectionSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
})

const loanDetailsSchema = z.object({
  loanAmount: z.coerce.number().positive("Loan amount must be positive."),
  interestRate: z.coerce.number().positive("Interest rate must be positive."),
  term: z.coerce.number().int().positive("Term must be a positive number of months."),
})

const vehicleSchema = z.object({
    make: z.string().min(2, "Vehicle make is required."),
    model: z.string().min(2, "Vehicle model is required."),
    year: z.coerce.number().int().min(1980, "Enter a valid year."),
    vin: z.string().length(17, "VIN must be 17 characters."),
    photo: z.instanceof(File).refine(file => file.size > 0, "Vehicle photo is required."),
})

const guarantorSchema = z.object({
    guarantor1Name: z.string().min(2, "Guarantor name is required."),
    guarantor1Phone: z.string().min(10, "Enter a valid phone number."),
    guarantor2Name: z.string().optional(),
    guarantor2Phone: z.string().optional(),
})

const documentsSchema = z.object({
    signature: z.instanceof(File).refine(file => file.size > 0, "User signature is required."),
    rcBook: z.instanceof(File).refine(file => file.size > 0, "RC book photo is required."),
})

// Combined Schema
const formSchema = userSelectionSchema
  .merge(loanDetailsSchema)
  .merge(vehicleSchema)
  .merge(guarantorSchema)
  .merge(documentsSchema)

const steps = [
  { id: 'User Selection', schema: userSelectionSchema, fields: ['userId'], icon: User },
  { id: 'Loan Details', schema: loanDetailsSchema, fields: ['loanAmount', 'interestRate', 'term'], icon: User },
  { id: 'Vehicle Info', schema: vehicleSchema, fields: ['make', 'model', 'year', 'vin', 'photo'], icon: Bike },
  { id: 'Guarantors', schema: guarantorSchema, fields: ['guarantor1Name', 'guarantor1Phone', 'guarantor2Name', 'guarantor2Phone'], icon: Users },
  { id: 'Documents', schema: documentsSchema, fields: ['signature', 'rcBook'], icon: BookImage },
]

export function LoanCreationForm() {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = React.useState(0)
    
    // User search state
    const [allUsers, setAllUsers] = React.useState<AppUser[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState<AppUser | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    React.useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setAllUsers(users);
        }
        fetchUsers();
    }, []);

    const filteredUsers = searchTerm
        ? allUsers.filter(user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)
          )
        : [];

    const selectUser = (user: AppUser) => {
        setSelectedUser(user);
        form.setValue("userId", user.id);
        setSearchTerm("");
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
        // Mock submission
        console.log("Form submitted:", values);
        toast({
            title: "Loan Application Submitted!",
            description: `The loan for ${selectedUser?.fullName} has been created.`,
        })
        form.reset();
        setSelectedUser(null);
        setCurrentStep(0);
    }

    const progress = ((currentStep + 1) / (steps.length + 1)) * 100

    return (
        <Card>
            <CardHeader>
                <div className="space-y-2 mb-4">
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-muted-foreground">{`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].id}`}</p>
                </div>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-8 p-1">
                        
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2"><Search /> Find Applicant</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormItem>
                                        <FormLabel>Search by Name, Email, or Phone</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Start typing to search..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                    {searchTerm && filteredUsers.length > 0 && (
                                        <div className="border rounded-md max-h-60 overflow-y-auto">
                                            {filteredUsers.map(user => (
                                                <div 
                                                    key={user.id} 
                                                    className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer"
                                                    onClick={() => selectUser(user)}
                                                >
                                                    <Avatar>
                                                        <AvatarImage src={user.photoUrl} />
                                                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedUser && (
                                        <div className="border p-4 rounded-md bg-muted/50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={selectedUser.photoUrl} />
                                                    <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-lg">{selectedUser.fullName}</p>
                                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                                </div>
                                            </div>
                                            <Button variant="link" onClick={() => setSelectedUser(null)}>Change</Button>
                                        </div>
                                    )}
                                    <FormField name="userId" control={form.control} render={({ field }) => (
                                        <FormItem><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 1 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><User /> Loan Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField name="loanAmount" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Loan Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="interestRate" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Interest Rate (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 12.5" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField name="term" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Term (Months)</FormLabel><FormControl><Input type="number" placeholder="e.g., 24" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><Bike /> Vehicle Information</h3>
                               {/* Vehicle fields here */}
                            </div>
                        )}
                        
                        {currentStep === 3 && (
                             <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><Users /> Guarantors</h3>
                                {/* Guarantor fields here */}
                            </div>
                        )}

                         {currentStep === 4 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium flex items-center gap-2"><BookImage /> Document Uploads</h3>
                                {/* Document upload fields here */}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-8 mt-8 border-t">
                        <div>
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep < steps.length - 1 && (
                                <Button type="button" onClick={nextStep} disabled={!selectedUser}>
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
                                    Submit Application
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
            </CardContent>
        </Card>
    )
}
