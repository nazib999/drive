import React from 'react';
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

import MobileNav from "@/components/MobileNav";



const Layout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/sign-in");
    else {
    return (

            <main className="flex h-screen">
                <Sidebar {...currentUser} />
                <section className="flex h-full flex-1 flex-col">
                     <MobileNav {...currentUser}/>
                    <Header userId={currentUser.$id} accountId={currentUser.accountId} />
                    <div className="main-content bg-gray-100 no-scrollbar">{children}</div>
                </section>
            </main>

    );}
};

export default Layout;
