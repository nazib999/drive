"use client"
import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Models} from "node-appwrite";
import {actionsDropdownItems} from "@/constants";
import Image from "next/image";
import Link from "next/link";
import {constructDownloadUrl} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {deleteFile, renameFile, updateFileUsers} from "@/lib/actions/files.action";
import {usePathname} from "next/navigation";
import {FileDetails,ShareInput} from "@/components/FileDetails";

const ActionDropdown = ({file}:{file:Models.Document}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState<string>(file.name);
    const [isLoading, setIsLoading] = useState(false);
    const path= usePathname();
    const [emails, setEmails] = useState<string[]>([]);
    
    const closeAllDialogs = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.name);
    }
    const  handleRemoveUser = async (email:string) => {
        const updatedEmails = emails.filter(e=>e!==email);

        const success = await updateFileUsers({fileId:file.$id,emails:updatedEmails,path});
        if(success) setEmails(updatedEmails);
        closeAllDialogs();

    }
    
    const handleAction = async () => {
        if (!action) return;
        setIsLoading(true);

        let success = false;

        const actions={
            rename:()=>renameFile({fileId:file.$id, name,extension:file.extension,path}),
            share:()=>updateFileUsers({fileId:file.$id,emails,path}), // Implement share functionality
            delete:()=>deleteFile({fileId:file.$id,path,bucketFileId:file.bucketFileId}), // Implement delete
            // functionality
        }

         success = await actions[action.value as keyof typeof actions]();

        setIsLoading(false);
        if (success) {
            closeAllDialogs();
        } else {
            // Handle error, e.g., show a toast notification
            console.error(`Failed to ${action.value} the file.`);
        }
    }

    const renderDialogContent = () => {
        if (!action) return null;
        const {value,label} = action;
        return (
            <DialogContent className={'shad-dialog button !md:max-w-[400px] '}>
                <DialogHeader className={'flex flex-col gap-3'}>
                    <DialogTitle  className={'text-center text-light-100'}>{label}</DialogTitle>
                    {value === 'rename' &&
                    <Input type={'text'} value={name} onChange={(e)=>{setName(e.target.value)}} />

                    }
                    {value === 'details' && <FileDetails file={file}/>}
                    {value === 'share' && <ShareInput file={file} onInputChange={setEmails}
                    onRemove={handleRemoveUser}/>}
                    {value === 'delete' && (
                        <p className={'text-center'}>
                            Are you sure you want to delete this file?
                        </p>
                    )}

                </DialogHeader>
                {['delete', 'rename', 'share'].includes(value) &&
                <DialogFooter className={'!flex !flex-col gap-3 !md:flex-row !md:justify-between !md:items-center '}>
                    <Button onClick={closeAllDialogs} className={'modal-cancel-button'}>Cancel</Button>
                    <Button className={'flex items-center gap-2 '} onClick={handleAction}>
                        <p className={'capitalize '}>{value}</p>
                        {isLoading && <Image src={'/assets/icons/loader.svg'} alt={'loading'} width={20} height={20}
                                className={'animate-spin'}/>}
                    </Button>
                </DialogFooter>
                }
            </DialogContent>
        )}
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className={'shad-no-focus'}>
                    <Image src={'/assets/icons/dots.svg'} alt={'dot'} width={24}
                           height={24}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className={'max-w-[200px] truncate'}>{file.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((item, index) => (
                        <DropdownMenuItem className={'shad-dropdown-item'}
                            key={index}
                        onClick={()=>{
                                setAction(item);

                                if(['delete', 'rename','share','details'].includes(item.value)) {
                                    setIsModalOpen(true);
                                }
                        }}
                        >
                            {item.value ==='download' ? (
                                <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name}
                                      className={'flex items-center gap-2'}>
                                    <Image src={item.icon} alt={item.label}
                                           width={30} height={30}   />
                                    {item.label}
                                </Link>
                            ):
                            <div className={'flex items-center gap-2'}>
                                <Image src={item.icon} alt={item.label}
                                       width={30} height={30} />
                                {item.label}
                            </div>}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                {renderDialogContent()}
            </DropdownMenu>
        </Dialog>
    )
}
export default ActionDropdown
