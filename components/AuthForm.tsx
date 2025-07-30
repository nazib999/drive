"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {createAccount, signInUser} from "@/lib/actions/user.action";
import OtpModel from "@/components/OtpModel";

type formTypes = "sign-in" | "sign-up"

const authFormSchema =(formType:formTypes)=>{
    return z.object({
        fullName:formType==='sign-up'? z.string().min(3, "Fullname is required"):z.string().optional(),
        email: z.string().email("Invalid email address"),

    })
}


const AuthForm = ({type}:{type:formTypes}) => {
const formSchema =authFormSchema(type)

    const [loading, setLoading] = useState(false);
    const [accountId, setAccountId] = useState(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
           fullName: "",
            email: ""
        },
    })

    // 2. Define a submit handler.
   const onSubmit=async (values: z.infer<typeof formSchema>)=> {
        setLoading(true)

        try {
            const user =type==='sign-up'?await createAccount({fullName:values.fullName || "",email:values.email}):await signInUser({email:values.email});
            setAccountId(user.accountId)

        }
        catch (e:unknown) {
            console.log('Error submitting form:', e);

        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-6'}>

                <h1 className={'flex items-center justify-center mb-5 font-bold text-3xl'}>{type==='sign-in'?'Sign' +
                    ' In':'Sign Up'}</h1>
                {type==='sign-up' && <FormField
                    control={form.control}
                    name="fullName"
                    render={({field}) => (
                        <FormItem className={'shad-form-item '}>
                            <FormLabel className={'shad-form-label'}>Fullname</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter full name" {...field} className={'min-w-sm shad-input'}/>
                            </FormControl>
                             <FormMessage/>
                        </FormItem>
                    )}
                />}

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem className={'shad-form-item '}>
                            <FormLabel className={'shad-form-label'}>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email" {...field} className={'min-w-sm shad-input'}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} className={'w-full text-center py-7 !bg-brand rounded-4xl  '}>
                    {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    {
                        loading && <Image src={'/assets/icons/loader.svg'} alt={'loader'}
                                          width={24} height={24} className={'ml-2 animate-spin h-6 '}/>
                    }
                </Button>

                <div className={'body-2 flex justify-center'}>
                    <p>
                        {type === 'sign-in' ? 'Don\'t have an account?' : 'Already have an account?'}
                        <Link
                            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className={'text-brand font-semibold ml-1 cursor-pointer'}
                        >
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>

                    </p>
                </div>
            </form>
        </Form>
            <div className={'text-center'}>
                {accountId && <OtpModel accountId={accountId} email={form.getValues('email')}/>}
            </div>
        </>
    )
}
export default AuthForm
