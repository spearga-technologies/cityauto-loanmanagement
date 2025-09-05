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
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is required."),
  photo: z.any().optional(),
})

export function AddAdminForm() {
    const { toast } = useToast()
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            username: "",
            password: "",
            phone: "",
            address: "",
        },
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
                form.setValue("photo", file)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Admin details:", values)
        // In a real application, you would handle the file upload and Firebase user creation here.
        return new Promise((resolve) => {
            setTimeout(() => {
                toast({
                    title: "Admin Created!",
                    description: `${values.fullName} has been added as an admin.`,
                })
                form.reset()
                setPhotoPreview(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                resolve(null)
            }, 1500)
        })
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Add New Administrator</CardTitle>
                        <CardDescription>Fill out the details below to create a new admin user.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Admin Profile */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Profile</h3>
                             <FormField
                                name="photo"
                                control={form.control}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Photo</FormLabel>
                                    <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={photoPreview || "https://picsum.photos/100/100"} data-ai-hint="person avatar" alt="Admin photo" />
                                        <AvatarFallback>{form.watch("fullName")?.charAt(0) || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2" />
                                        Upload Photo
                                    </Button>
                                    <FormControl>
                                        <Input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handlePhotoChange}
                                        accept="image/*"
                                        />
                                    </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField name="fullName" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="phone" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField name="address" control={form.control} render={({ field }) => (
                                     <FormItem className="md:col-span-2"><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                        <Separator />

                        {/* Account Credentials */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Credentials</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField name="username" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="john.doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="password" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormDescription>Must be at least 8 characters long.</FormDescription><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Admin
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
