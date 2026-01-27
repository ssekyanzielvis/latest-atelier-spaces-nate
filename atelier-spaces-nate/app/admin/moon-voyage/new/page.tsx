import MoonVoyageForm from '@/components/admin/MoonVoyageForm'

export default function NewMoonVoyagePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Moon Voyage Content</h1>
                <p className="text-gray-600 mt-1">Add new Moon Voyage page content</p>
            </div>

            <MoonVoyageForm mode="create" />
        </div>
    )
}
