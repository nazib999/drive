"use client"
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Button} from "@/components/ui/button";
import {cn, convertFileToUrl, getFileType} from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import {MAX_FILE_SIZE} from "@/constants";
import { toast } from "sonner"
import {uploadFile} from "@/lib/actions/files.action";
import {usePathname} from "next/navigation";

interface Props  {
    ownerId: string,
    accountId: string,
    className?: string
}

const FileUploader = ({ownerId,accountId,className}:Props) => {
    const path = usePathname()
    const [files,setFiles] = useState<File[]>([])
    const onDrop = useCallback(async (acceptedFiles:File[]) => {
        setFiles(acceptedFiles);

        const uploadPromises = acceptedFiles.map(async (file) => {
            if(file.size>MAX_FILE_SIZE){
                setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

                toast.error(`File ${file.name} exceeds the maximum size of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
            }

            return uploadFile({file,ownerId,accountId,path}).then((res) => {
                if(res){
                    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
                    toast.success(`File ${file.name} uploaded successfully!`);
                }
            })
        })
        await Promise.all(uploadPromises)
    }, [ownerId,accountId,path])


    const {getRootProps, getInputProps} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} className={'cursor-pointer'}>
            <input {...getInputProps()} />
            <Button type={'button'} className={cn('uploader-button',className)}>
                <Image src={'/assets/icons/upload.svg'} alt={'upload icon'} width={24} height={24} />{" "}
                <p>Upload</p>
            </Button>
            {files.length > 0 && (
                <ul className={'absolute right-30 bottom-20 '}>
                    <h4 className={'h4 text-light-100'}>Uploading</h4>
                    {files.map((file, index) => {
                        const {type,extension} = getFileType(file.name)

                        return(<li key={index} className={'p-5 relative bg-blue-200 my-2 rounded-2xl'}>
                            <div className={'flex flex-col gap-3'}>
                                <Thumbnail
                                    name={file.name}
                                type={type}
                                extension={extension}
                                url={convertFileToUrl(file)}
                                />
                                <Image src={'/assets/icons/file-loader.gif'} alt={'loading icon'} width={80} height={24}/>
                            </div>
                            <Image src={'/assets/icons/remove.svg'} alt={'remove'}
                                   width={24} height={24}
                                   className={'absolute top-2 right-3 cursor-pointer z-10'}
                                   onClick={(e:React.MouseEvent<HTMLImageElement, MouseEvent>)  => {
                                       e.stopPropagation();
                                       setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
                                   }}/>
                        </li>)
                    })}
                </ul>
            )}

        </div>
    )
}
export default FileUploader
