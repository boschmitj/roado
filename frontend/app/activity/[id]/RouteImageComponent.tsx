interface RouteImageComponentProps {
    activityId: number
}

export function RouteImageComponent({ activityId } : RouteImageComponentProps) {
    return (
        <img 
            src={`http://localhost:8080/staticmap/getImage/${activityId}`}
            alt="Route Preview"
            className='aspect-video w-full object-cover'
        />
    )
}