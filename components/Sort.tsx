"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {usePathname, useRouter} from "next/navigation";
import {sortTypes} from "@/constants";

const Sort = () => {
    const path = usePathname();
    const router =useRouter();
    const handleChange = (value: string) => {
        router.push(`${path}?sort=${value}`);
    }
    return (
        <Select defaultValue={sortTypes[0].value} onValueChange={handleChange}>
            <SelectTrigger className="sort">
                <SelectValue placeholder="Sort by"  />
            </SelectTrigger>
            <SelectContent className={'sort-content'}>
                {sortTypes.map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}

            </SelectContent>
        </Select>
    )
}
export default Sort
