import  CreateFormUser from '@/app/modules/settings/users/views/users-create-form'


export default async function Page() {
    return (
            <div>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                   <CreateFormUser />
                </div>
            </div>
        )
}