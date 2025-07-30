"use client"
import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {avatarPlaceholderUrl, navItems} from "@/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

interface Props {
    fullName:string;
    avatar:string;
    email:string;
}

const Sidebar = ({fullName,avatar,email}:Props) => {
    const pathname = usePathname()
    return (
        <aside className={'p-4 hidden md:block'}>
        <Link href={'/'}>
            <Image src={'/assets/icons/logo-full-brand.svg'} alt={'logo'}
                   width={160}
                   height={50}
                   className={'hidden lg:block h-auto'}/>
            <Image src={'/assets/icons/logo-brand.svg'} alt={'logo'}
                   width={52}
                   height={52}
                   className={'block lg:hidden h-auto'}/>
        </Link>
            <nav className={'mt-10'}>
                <ul className={'flex flex-1 flex-col gap-5'}>
                    {navItems.map(({url,name,icon})=>(
                        <Link href={url}  key={name} className={'lg:h-full'}>
                            <li className={cn('flex items-center gap-3 rounded-2xl p-4 py-3',pathname===url && 'bg-brand')}>
                                <Image src={icon} alt={name} width={24} height={24} className={' nav-icon'}/>
                                <p className={'hidden lg:block'}>{name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>

            </nav>

            <Image src={'/assets/images/files-2.png'} alt={'file'}
                   width={100}
                     height={100}

                   className={'mt-8 w-18 h-18 lg:w-55 lg:h-50'}/>

            <div className={'flex justify-center gap-2 mt-10'}>
                <Image src={avatar} alt={'avatar'}
                          width={40}
                          height={40}
                          className={'rounded-full'}/>
                <div className={'hidden lg:block'}>
                    <p className={'subtitle-2 uppercase'}>{fullName}</p>
                    <p className={'caption'}>{email}</p>
                </div>
            </div>
        </aside>
    )
}
export default Sidebar
