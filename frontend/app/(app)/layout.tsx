import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01"


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const navigationData = [
        {
        title: 'Home',
        href: 'home'
        },
        {
        title: 'New Route',
        href: 'build-route'
        },
        {
        title: 'Routes',
        href: 'routes'
        },
        {
        title: 'Activities',
        href: '#'
        }
    ];
    return (
    <>
        <Navbar navigationData={navigationData}/>
        {children}        
    </>
    )
}