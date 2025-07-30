import React from 'react'
import Link from "next/link";
import {Models} from "node-appwrite";
import {convertFileSize, formatDateTime} from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail";
import ActionDropdown from "@/components/ActionDropdown";

const Card = ({file}:{file:Models.Document}) => {
    return (
        <Link href={file.url} target={'_blank'} className={'bg-gradient-to-br from-white to-red-100  p-5 rounded-2xl'}>
            <div className={'flex gap-3 items-center justify-between'}>
                <Thumbnail name={file.name} type={file.type} extension={file.extension} url={file.url}/>
                <div className={'flex flex-col justify-between items-end'}>
                    <ActionDropdown file={file}/>

            </div>
            </div>
            <div className={'flex items-center justify-between mt-7 text-sm text-gray-600 font-light font-sans'}>

               <div>
                   <p>{formatDateTime(file.$createdAt)}</p>
                   <p>{file.owner.fullName}</p>
               </div>
            <p className={'body-1'}>{convertFileSize(file.size)}</p>
            </div>
        </Link>
    )
}
export default Card
