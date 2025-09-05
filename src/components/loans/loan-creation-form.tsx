
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
import { Loader2, ArrowLeft, ArrowRight, Check, Upload, User, Search, Bike, Users, FileSignature, BookImage, UserCheck, CalendarDays, Calculator } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import type { User as AppUser } from "@/lib/users"
import { getAllUsers } from "@/lib/firebase/users"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "../ui/textarea"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "../ui/table"

// Step Schemas
const userSelectionSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
})

const userVerificationSchema = z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
})

const loanDetailsSchema = z.object({
  loanAmount: z.coerce.number().positive("Loan amount must be positive."),
  interestRate: z.coerce.number().positive("Interest rate must be positive.").min(0).max(100),
  term: z.coerce.number().int().positive("Term must be a positive number of months."),
})

const vehicleSchema = z.object({
    make: z.string().min(1, "Please select a vehicle make."),
    model: z.string().min(2, "Vehicle model is required."),
    year: z.coerce.number().int().min(1980, "Enter a valid year.").max(new Date().getFullYear() + 1),
    registrationNumber: z.string().min(4, "Registration number is required."),
    vehiclePhoto: z.instanceof(File).refine(file => file.size > 0, "Vehicle photo is required."),
})

const guarantorSchema = z.object({
    guarantorName: z.string().min(2, "Guarantor name is required."),
    guarantorPhone: z.string().min(10, "Enter a valid phone number."),
    guarantorWhatsapp: z.string().optional(),
    guarantorAddress: z.string().min(5, "Guarantor address is required."),
    guarantorPhoto: z.instanceof(File).optional(),
})

const documentsSchema = z.object({
    signature: z.instanceof(File).refine(file => file.size > 0, "User signature is required."),
    rcBook: z.instanceof(File).refine(file => file.size > 0, "RC book photo is required."),
})

const repaymentSchema = z.object({
    frequency: z.string().min(1, "Please select a repayment frequency."),
    startDate: z.date({ required_error: "Please select a start date." }),
})

// Combined Schema
const formSchema = userSelectionSchema
  .merge(userVerificationSchema)
  .merge(loanDetailsSchema)
  .merge(vehicleSchema)
  .merge(guarantorSchema)
  .merge(documentsSchema)
  .merge(repaymentSchema);

const steps = [
  { id: 'User Selection', schema: userSelectionSchema, fields: ['userId'], icon: Search },
  { id: 'User Verification', schema: userVerificationSchema, fields: ['fullName', 'email', 'phone', 'address'], icon: UserCheck },
  { id: 'Loan Details', schema: loanDetailsSchema, fields: ['loanAmount', 'interestRate', 'term'], icon: FileSignature },
  { id: 'Vehicle Info', schema: vehicleSchema, fields: ['make', 'model', 'year', 'registrationNumber', 'vehiclePhoto'], icon: Bike },
  { id: 'Guarantor', schema: guarantorSchema, fields: ['guarantorName', 'guarantorPhone', 'guarantorWhatsapp', 'guarantorAddress', 'guarantorPhoto'], icon: Users },
  { id: 'Documents', schema: documentsSchema, fields: ['signature', 'rcBook'], icon: BookImage },
  { id: 'Repayment Schedule', schema: repaymentSchema, fields: ['frequency', 'startDate'], icon: Calculator },
]

const vehicleMakes = ["Honda", "TVS", "Bajaj", "Hero", "Suzuki", "Yamaha", "Royal Enfield", "KTM", "Vespa", "Aprilia", "Jawa"];

type FileUploadPreviewProps = {
    fieldName: "vehiclePhoto" | "signature" | "rcBook" | "guarantorPhoto";
    label: string;
    icon: React.ReactNode;
    form: any;
};

function FileUploadWithPreview({ fieldName, label, icon, form }: FileUploadPreviewProps) {
    const [preview, setPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue(fieldName, file);
        }
    };

    return (
        <FormField
            name={fieldName}
            control={form.control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="flex flex-col items-center gap-4 border p-4 rounded-md min-h-[228px] justify-center">
                        {preview ? (
                             <Image src={preview} alt={`${label} preview`} width={200} height={150} className="h-32 w-auto rounded-md object-contain" />
                        ) : (
                            <div className="text-muted-foreground text-center flex flex-col items-center gap-2">
                                {icon}
                                <span className="text-sm">Preview will appear here.</span>
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {preview ? "Change Photo" : `Upload ${label}`}
                        </Button>
                        <FormControl>
                            <Input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function LoanCreationForm() {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = React.useState(0)
    
    // User search state
    const [allUsers, setAllUsers] = React.useState<AppUser[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState<AppUser | null>(null);

    // Repayment schedule state
    const [repaymentSchedule, setRepaymentSchedule] = React.useState<{date: string, amount: string}[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            loanAmount: 0,
            interestRate: 0,
            term: 0,
            make: "",
            model: "",
            year: new Date().getFullYear(),
            registrationNumber: "",
            guarantorName: "",
            guarantorPhone: "",
            guarantorWhatsapp: "",
            guarantorAddress: "",
            frequency: "",
        },
    })

    const { loanAmount, interestRate, term, frequency, startDate } = form.watch();

    React.useEffect(() => {
        if (loanAmount > 0 && interestRate > 0 && term > 0 && frequency && startDate) {
             calculateRepayment();
        }
    }, [loanAmount, interestRate, term, frequency, startDate]);

    const calculateRepayment = () => {
        const principal = loanAmount;
        const monthlyInterestRate = interestRate / 100 / 12;
        
        const emi = principal * monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, term) / (Math.pow(1 + monthlyInterestRate, term) - 1));

        if (isNaN(emi) || !isFinite(emi)) {
            setRepaymentSchedule([]);
            return;
        }

        const schedule: {date: string, amount: string}[] = [];
        let currentDate = new Date(startDate);

        for (let i = 0; i < term; i++) {
            schedule.push({
                date: format(currentDate, 'PPP'),
                amount: emi.toFixed(2),
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setRepaymentSchedule(schedule);
    };


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
        form.setValue("fullName", user.fullName);
        form.setValue("email", user.email);
        form.setValue("phone", user.phone);
        form.setValue("address", user.address);
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
        console.log("Form submitted:", values);
        toast({
            title: "Loan Application Submitted!",
            description: `The loan for ${selectedUser?.fullName} has been created.`,
        })
        form.reset();
        setSelectedUser(null);
        setCurrentStep(0);
    }

    const progress = ((currentStep + 1) / (steps.length)) * 100
    const IconComponent = steps[currentStep].icon;

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
                    <div className="space-y-8 p-1 min-h-[400px]">
                        
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> Find Applicant</h3>
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
                                            <Button variant="link" onClick={() => { setSelectedUser(null); form.resetField("userId"); }}>Change</Button>
                                        </div>
                                    )}
                                    <FormField name="userId" control={form.control} render={() => (
                                        <FormItem><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField name="fullName" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField name="phone" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <p className="text-sm text-muted-foreground pt-2">Please verify the auto-filled applicant details are correct before proceeding.</p>
                            </div>
                        )}
                        
                        {currentStep === 2 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
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

                        {currentStep === 3 && (
                            <div className="space-y-4">
                               <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="make"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Vehicle Make</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a brand" />
                                                    </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {vehicleMakes.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField name="model" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Vehicle Model</FormLabel><FormControl><Input placeholder="e.g., Activa" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <div className="space-y-6">
                                         <FormField name="year" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2023" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                         <FormField name="registrationNumber" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Registration Number</FormLabel><FormControl><Input placeholder="e.g., MH 12 AB 1234" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <div className="md:col-span-2">
                                       <FileUploadWithPreview
                                            form={form}
                                            fieldName="vehiclePhoto"
                                            label="Vehicle Photo"
                                            icon={<Bike />}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 4 && (
                             <div className="space-y-6">
                               <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-medium">Guarantor Details</h4>
                                        <FormField name="guarantorName" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="guarantorPhone" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="guarantorWhatsapp" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>WhatsApp Number (Optional)</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="guarantorAddress" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Full Address</FormLabel><FormControl><Textarea placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <div className="space-y-4">
                                        <FileUploadWithPreview
                                            form={form}
                                            fieldName="guarantorPhoto"
                                            label="Guarantor Photo (Optional)"
                                            icon={<User />}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                         {currentStep === 5 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <FileUploadWithPreview
                                        form={form}
                                        fieldName="signature"
                                        label="User Signature"
                                        icon={<FileSignature />}
                                    />
                                    <FileUploadWithPreview
                                        form={form}
                                        fieldName="rcBook"
                                        label="RC Book Photo"
                                        icon={<BookImage />}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium flex items-center gap-2"><IconComponent /> {steps[currentStep].id}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField
                                        control={form.control}
                                        name="frequency"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Repayment Frequency</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="bi-weekly">Twice a Month (Bi-Weekly)</SelectItem>
                                                    <SelectItem value="quarterly">Once in 3 Months (Quarterly)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel>Payment Start Date</FormLabel>
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
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                    date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {repaymentSchedule.length > 0 && (
                                     <div className="space-y-2 pt-4">
                                        <h4 className="font-medium">Calculated Repayment Schedule</h4>
                                        <Card className="max-h-60 overflow-y-auto">
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Payment Date</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {repaymentSchedule.map((payment, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{payment.date}</TableCell>
                                                                <TableCell className="text-right">${payment.amount}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
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
                                <Button type="button" onClick={nextStep} disabled={!selectedUser && currentStep === 0}>
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

    