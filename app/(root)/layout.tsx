import React from 'react';
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { Poppins } from "next/font/google";
import MobileNav from "@/components/MobileNav";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
