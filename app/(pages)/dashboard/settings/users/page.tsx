import UsersMainPage from '@/app/modules/settings/users/views/users-page-main';

import { getAllUsersByPageService, getAllUsersService } from '@/app/modules/settings/users/services/users.service';
//import { AppUser } from '@prisma/client';
import { User } from '@/app/modules/settings/users/models/users.interface'

interface IUserList {
    users: User[],
    offset: number | 10,
    pageNumber: number | 1,
    totalUsers: number | 1
}

export default async function Page(
  props: {
    searchParams: Promise<{ keyword: string; pageNumber: number, offset: number }>;
  }
) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? '';
  const offset = searchParams.offset ?? 10;
  const pageNumber = searchParams.pageNumber ?? 1;

  //console.log('new keyword ', keyword)

  const totalUsers = 12;
  const users = await getAllUsersByPageService({keyword: keyword, recordsPerPage: offset, pageNumber: pageNumber });

  if (users) {
    return (
        <UsersMainPage users={users} offset={offset} pageNumber={pageNumber} totalUsers={totalUsers} />
    )
  }
  
  return (
    <div>
        No users found!
    </div>
  )

  
}