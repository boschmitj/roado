import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectSortingProps {
    setSelectedSorting: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectSorting({setSelectedSorting}: SelectSortingProps) {
    return (
        <>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Sort by</SelectLabel>
                        <SelectItem value="proximity" onClick={() => setSelectedSorting("proximity")}>Proximity</SelectItem>
                        <SelectItem value="name" onClick={() => setSelectedSorting("name")} >Name</SelectItem>
                        <SelectItem value="length" onClick={() => setSelectedSorting("length")}>Length</SelectItem>
                        <SelectItem value="duration" onClick={() => setSelectedSorting("duration")} >Duration</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}