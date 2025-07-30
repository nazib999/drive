import React from 'react'
import Image from "next/image";
import {getFileIcon} from "@/lib/utils";

interface Props {
    type:string,
    extension:string,
    url:string,
    imageClassName?:string,
    className?:string,
    name:string
}
function shortenFileName(name:string, maxLength = 20) {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + '...';
}

const Thumbnail = ({name,type,extension,url='',imageClassName,className}:Props) => {
    const isImage = type === 'image' && extension!== 'svg';
    return (
        <figure className={'flex items-center gap-4 mt-2 '}>
            <Image src={isImage?url:getFileIcon(extension,type)} alt={'thumbnail'} width={100} height={100} className={' !rounded-full aspect-auto object-cover size-8'}/>
            <figcaption className={'text-center text-light-100'}>{shortenFileName(name)}</figcaption>
        </figure>
    )
}
export default Thumbnail
