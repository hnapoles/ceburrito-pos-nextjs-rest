

import UsersMainPage from '@/app/modules/settings/users/views/users-page-main';

import { getAllUsersByPageService, getAllUsersService } from '@/app/modules/settings/users/services/users.service';
//import { AppUser } from '@prisma/client';
import { User } from '@/app/modules/settings/users/models/users.interface'

import { ShowErrorDialog } from '@/app/providers/show-error-dialog';
import { errorMonitor } from 'node:events';



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

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersByPageService({keyword: keyword, recordsPerPage: offset, pageNumber: pageNumber });
      console.log(' res data', response.data)
      const { data: users} = response.data
      return (
        <UsersMainPage users={response.data} offset={offset} pageNumber={pageNumber} totalUsers={totalUsers} />
      )
    } catch (err) {
      console.log(errorMonitor)
      return (
        <div>
            No users found!
        </div>
      )
    }
  };

  await fetchUsers();

  
}