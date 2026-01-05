import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectSortingProps {
    setSelectedSorting: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectSorting({setSelectedSorting}: SelectSortingProps) {
    return (
        <Select onValueChange={setSelectedSorting}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="proximity">Closest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}