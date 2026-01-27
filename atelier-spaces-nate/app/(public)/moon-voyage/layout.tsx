import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'The Omweso Moon Voyage | Atelier Spaces Nate',
    description: 'Join us on the First Kinsman Challenge - recording the first-ever Omweso match at Margherita Peak, the highest point in Uganda.',
}

export default function MoonVoyageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
