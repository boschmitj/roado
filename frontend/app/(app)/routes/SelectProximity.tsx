import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectProximityProps {
    setSelectedProximity: React.Dispatch<React.SetStateAction<number>>;
}

export default function SelectProximity({setSelectedProximity}: SelectProximityProps) {
    return (
        <Select onValueChange={(value) => setSelectedProximity(Number(value))}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Distance to you" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Distance</SelectLabel>
                    <SelectItem value="1000">1 km</SelectItem>
                    <SelectItem value="5000">5 km</SelectItem>
                    <SelectItem value="10000">10 km</SelectItem>
                    <SelectItem value="20000">20 km</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
