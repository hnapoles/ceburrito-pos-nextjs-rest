import { notFound } from 'next/navigation';

import { getUserByIdService } from '@/app/modules/settings/users/services/users.service';
import  EditFormUser from '@/app/modules/settings/users/views/users-edit-form'


export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;

    const [user] = await Promise.all([
       getUserByIdService(id),
      ]);

      if (!user) {
        notFound();
      }

    return (
            <div>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                   <EditFormUser user={user} />
                </div>
            </div>
        )
}