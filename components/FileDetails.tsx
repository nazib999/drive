import React from 'react'
import {Models} from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import {convertFileSize} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({file}:{file:Models.Document})=>{
    return (
        <div className={'flex items-center justify-between'}>


         <Thumbnail name={file.name} type={file.type} extension={file.extension} url={file.url}/>


            <p className={'caption '}> {file.$createdAt.split("T").slice(0,1)}</p>

        </div>

    )
}
const DetailRow = ({label, value}:{label:string, value:string}) => {
    return (
        <div className={'flex items-center justify-between'}>
            <p className={'caption text-light-200'}>{label}</p>
            <p className={'body-1'}>{value}</p>
        </div>
    )
}

export const FileDetails = ({file}:{file:Models.Document}) => {
    return (
        <>
         <ImageThumbnail file={file}/>
            <DetailRow label={'Format'} value={file.extension}/>
            <DetailRow label={'Size'} value={convertFileSize(file.size)}/>
            <DetailRow label={'Owner'} value={file.owner.fullName}/>

        </>
    )
}

interface Props {
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email:string) => void;
    file: Models.Document;
}

export const ShareInput = ({onInputChange,onRemove,file}:Props)=>{
    return(
        <>
         <ImageThumbnail file={file}/>

            <div className={'flex flex-col gap-2'}>
                <p className={'subtitle-2'}>Share with</p>
                <input
                    type="email"
                    placeholder="Enter email addresses"
                    onChange={(e) => onInputChange(e.target.value.split(','))}
                    className={'shad-input'}
                />
                <div className={'pt-4'}>
                    <div className={'flex items-center justify-between'}>
                        <p className={'subtitle-2 text-light-100'}>Share with</p>
                        <p className={'subtitle-2 text-light-200'}>{file.users.length} users</p>
                    </div>

                    <ul className={'pt-2'}>
                        {file.users.map((email:string) => (
                            <li key={email} className={'flex items-center justify-between'}>
                                <p className={'subtitle-2'}>{email}</p>
                                <Button onClick={() => onRemove(email)}>
                                    <Image src={'/assets/icons/remove.svg'} alt={'remove'}
                                           width={24} height={24} className={'remove-icon'}/>
                                </Button>
                        </li>

                        ))}

                    </ul>
                </div>



            </div>
        </>
    )

}
