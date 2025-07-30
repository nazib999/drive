import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import Image from "next/image";




export const metadata: Metadata = {
  title: "Authentication - StoreIt",
  description: "Sign in or sign up to StoreIt - A simple and secure file storage solution",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

     <div className={'flex min-h-screen'}>
       <section className={'bg-brand p-10 hidden lg:flex items-center justify-center w-1/2 xl:w-2/5'}>
         <div className={'flex flex-col space-y-12 justify-center max-w-[430px] max-h-[800px '}>

           <Image src={'/assets/icons/logo-full.svg'} alt={'logo'} width={224} height={82} className={'h-auto'}/>

           <div className={'space-y-5 text-white'}>
             <h1 className={'h1'}>Manage your files  the best way</h1>
             <p className={'body-1'}>
               This is the place where you can securely store and manage your files with ease.
             </p>
           </div>

           <Image src={'/assets/images/files.png'} alt={'file'} width={342} height={342} className={'transition-all' +
               ' hover:scale-105 hover:rotate-2  h-auto'}/>
         </div>
       </section>

       <section className={'flex flex-col flex-1 items-center lg:justify-center bg-white p-4 py-10 lg:p-10 lg:py-0'}>
         <div className={'mb-16 lg:hidden'}>
           <Image src={'/assets/icons/logo-full-brand.svg'} alt={'logo'} width={224} height={82} className={'h-auto' +
               ' w-[200px] lg:w-[250px]'}/>
         </div>

       {children}
       </section>

     </div>

  );
}