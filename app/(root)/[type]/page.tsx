import React from 'react'
import Sort from "@/components/Sort";
import {getFiles} from "@/lib/actions/files.action";
import {Models} from "node-appwrite";
import Card from "@/components/Card";
import {getFileTypesParams} from "@/lib/utils";

const Page = async ({searchParams,params}:SearchParamProps) => {
    const type = ((await params))?.type as string || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

     const types = getFileTypesParams(type) as FileType[]
     const files = await getFiles({types,searchText,sort})
    return (
        <section className={'h-[90vh] relative   overflow-hidden'}>

         <div className={'p-3  flex flex-col relative'}>
            <h1 className={'text-3xl font-bold  uppercase'}>{type}</h1>

            <div className={'flex  items-center justify-between'}>
                <p className={'body-1'}>
                    Total:<span className={'text-brand'}> {files.total}</span>
                </p>

                <div className={'flex items-center gap-2'}>
                    <p className={'body-1 hidden sm:block text-light-200'}>Sort By:{" "}</p>
                    <Sort/>

            </div>
            </div>

            </div>
            <div className={'h-[80vh] overflow-auto no-scrollbar pb-30 pt-10'}>

            {files.total>0?<section className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 '}>
                {files.documents.map((file:Models.Document) => (
                    <Card key={file.$id} file={file}  />
                ))}
                </section>:
            <div className={'flex items-center justify-center '}>
                <h2 className={'text-2xl h-full font-bold text-brand'}>
                    No files found
                </h2>
            </div>}
            </div>
        </section>
    )
}
export default Page
