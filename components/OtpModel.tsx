"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {useState} from "react";
import Image from "next/image";
import {sendEmailOtp, verifyOtp} from "@/lib/actions/user.action";
import {useRouter} from "next/navigation";

const OtpModel = ({accountId,email}:{accountId:string;email:string;}) => {

    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>) => {
       e.preventDefault();
        setIsLoading(true);

        try {
         const sessionId = await verifyOtp(accountId,password);
            if(sessionId) {
                router.push('/')
            }

        }
        catch (e){
            console.log('Error submitting OTP:', e);

        }
        finally {
            setIsLoading(false);
        }
    }

    const handleResendOtp=async ()=>{
        await sendEmailOtp(email)

    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

            <AlertDialogContent className={'shad-alert-dialog'}>
                <AlertDialogHeader className={'relative flex justify-center'}>
                    <AlertDialogTitle className={'h2 text-2xl mb-3 text-center'}>Enter Your OTP</AlertDialogTitle>
                    <AlertDialogDescription className={'subtitle-2 text-center text-light-100'}>
                        We have sent an otp to <span className={'pl-1 text-brand'}>{email || 'admin@dev.com'}</span>.<br/> Please enter it below to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className={'shad-otp'}>
                        <InputOTPSlot index={0} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                        <InputOTPSlot index={1} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                        <InputOTPSlot index={2} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                        <InputOTPSlot index={3} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                        <InputOTPSlot index={4} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                        <InputOTPSlot index={5} className={'shad-otp-slot !rounded-xl p-6 text-3xl'}/>
                    </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={'!bg-brand'} onClick={handleSubmit}>Submit {isLoading &&
                    <Image src={'/assets/icons/loader.svg'} alt={'loader'} width={20} height={20} className={'ml-2' +
                        ' animate-spin'}/>
                    }</AlertDialogAction>


                </AlertDialogFooter>
                <div className={'text-center subtitle-2 text-light-100 '}>
                    Didn&apos;t receive the OTP? <span onClick={handleResendOtp} className={'text-brand' +
                    ' cursor-pointer'}>Resend</span>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OtpModel
