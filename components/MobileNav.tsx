"use client";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import {signOut} from "@/lib/actions/user.action";


interface Props {
    $id: string;
    accountId: string;
    fullName: string;
    avatar: string;
    email: string;

}

const MobileNavigation = ({
                              $id: ownerId,
                              accountId,
                              fullName,
                              avatar,
                              email,
                          }: Props) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="mobile-header flex items-center justify-between px-4 py-2">
            <Image
                src="/assets/icons/logo-full-brand.svg"
                alt="Brand Logo"
                width={120}
                height={52}
                className="h-auto"
            />

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Image
                        src="/assets/icons/menu.svg"
                        alt="Menu Icon"
                        width={30}
                        height={30}
                    />
                </SheetTrigger>

                <SheetContent className="shad-sheet h-screen px-3 overflow-y-auto">
                    <SheetTitle>
                        <div className="header-user flex items-center gap-3">
                            <Image
                                src={avatar}
                                alt="User Avatar"
                                width={44}
                                height={44}
                                className="header-user-avatar rounded-full object-cover"
                            />
                            <div>
                                <p className="subtitle-2 capitalize">{fullName}</p>
                                <p className="caption">{email}</p>
                            </div>
                        </div>
                        <Separator className="mb-4 bg-light-200/20" />
                    </SheetTitle>

                    <nav className="mobile-nav">
                        <ul className="mobile-nav-list flex flex-col gap-2">
                            {navItems.map(({ url, name, icon }) => (
                                <li
                                    key={name}
                                    className={cn(
                                        "mobile-nav-item rounded-md p-2",
                                        pathname === url && "shad-active"
                                    )}
                                >
                                    <Link href={url} className="flex items-center gap-3">
                                        <Image
                                            src={icon}
                                            alt={`${name} Icon`}
                                            width={24}
                                            height={24}
                                            className={cn(
                                                "nav-icon",
                                                pathname === url && "nav-icon-active"
                                            )}
                                        />
                                        <p>{name}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <Separator className="my-5 bg-light-200/20" />

                    <div className="flex flex-col justify-between gap-5 pb-5">
                        <FileUploader ownerId={ownerId} accountId={accountId} />
                        <Button
                            type="button"
                            className="mobile-sign-out-button flex items-center gap-2"
                            onClick={async () => {
                                await signOut();
                                // Optional: redirect after logout
                                // router.push("/login");
                            }}
                        >
                            <Image
                                src="/assets/icons/logout.svg"
                                alt="Logout Icon"
                                width={24}
                                height={24}
                            />
                            <p>Logout</p>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
};

export default MobileNavigation;
