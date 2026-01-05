interface RecordedOnComponentProps {
    startedAt: Date,
    endedAt: Date,
}

export default function RecordedOnComponent({startedAt, endedAt} : RecordedOnComponentProps) {
    console.log("Started at: " + startedAt);
    console.log("Ended at: " + endedAt);
    const startDate = new Date(startedAt);
    const endDate = new Date(endedAt);
    const startTime = `${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    return (
        <div className="text-sm text-zinc-600">
            Recorded on {startTime} - {endTime}
        </div>
    )
}