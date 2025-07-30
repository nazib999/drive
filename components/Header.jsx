import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {SearchBar} from "@/components/SearchBar";
import FileUploader from "@/components/FileUploader";
import {signOut} from "@/lib/actions/user.action";


export const Header = ({
                           userId,
                           accountId
                       }) => {
    return (
        <header className={'flex  items-center justify-between px-4 py-4'}>
         <SearchBar/>
            <div className={'flex items-center gap-2 max-sm:hidden'}>
                <FileUploader ownerId={userId} accountId={accountId}/>
                <form action={async ()=>
                {
                    "use server";
                    await signOut()
                }}>
                    <Button className={'!bg-white'} type={"submit"}>
                        <Image src={'/assets/icons/logout.svg'} alt={'logout'}
                               width={24} height={24} className={'w-6'}/>
                    </Button>
                </form>

            </div>
        </header>
    )
}
