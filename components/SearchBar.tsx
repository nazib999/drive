"use client"
import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Models} from "node-appwrite";
import {getFiles} from "@/lib/actions/files.action";
import Thumbnail from "@/components/Thumbnail";
import { useDebounce } from 'use-debounce';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query') || '';
    const [results, setResults] = useState<Models.Document[]>([])
    const [open, setOpen] = useState(false);
    const router = useRouter()
    const path = usePathname();
    const [delayQuery] = useDebounce(query, 3000);


    useEffect(() => {
        const fetchFiles = async () => {
            if (delayQuery.length === 0) {
                setResults([]);
                setOpen(false);
                return router.push(path);
            }
            const files = await getFiles({types:[],searchText:delayQuery})
            setResults(files.documents);
            setOpen(true);
        }
        fetchFiles();
    }, [delayQuery]);


    useEffect(() => {
        if (searchQuery) {
            setQuery(searchQuery);
        }
        else {
            setQuery('');
        }

    }, [searchQuery]);

    const handleClickItem = (file: Models.Document) => {
        setOpen(false);
        setResults([]);

        router.push(
            `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
        );
    };

    return (
        <div className={'relative max-sm:w-full'}>
            <div className={'flex items-center gap-4 bg-white  rounded-lg p-2 shadow-sm'}>
                <Image src={'/assets/icons/search.svg'} alt={'Search Icon'} width={20} height={20} />
                <Input className={'shad-input'} type={'text'} value={query} onChange={(e)=>setQuery(e.target.value)}/>
            </div>
            {open && (
                <ul className="search-result">
                    {results.length > 0 ? (
                        results.map((file) => (
                            <li onClick={()=>handleClickItem(file)} key={file.$id} className=''>

                                <Thumbnail type={file.type} extension={file.extension} url={file.url} name={file.name}/>

                            </li>
                        ))
                    ) : (
                        <p className={'empty-result'}>No files found</p>
                    )}
                </ul>
            )}

        </div>
    )
}
