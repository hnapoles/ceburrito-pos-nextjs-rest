'use client'

import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, 
//    PlusCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { UsersTableSimple } from './users-table-simple';
//import { AppUser } from '@prisma/client';
import { User } from '@/app/modules/settings/users/models/users.interface'
import { SearchInput } from './search-input';

interface IUserListProps {
    users: User[],
    offset: number | 10,
    pageNumber: number | 1,
    totalUsers: number | 1
}

const UsersMainPage: React.FC<IUserListProps> = ({ users, offset, pageNumber, totalUsers }) => {
    

    console.log('here in page ', users)
    
    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Disabled</TabsTrigger>
                    <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <SearchInput/>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                    {/* 
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add User
                        </span>
                    </Button>
                    */}
                    <Link
                        href="/dashboard/settings/users/create"
                        className="ml-5 px-2 h-8 lg:flex rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
                    >
                        Add New
                    </Link>
                </div>
            </div>
            <TabsContent value="all">
                <UsersTableSimple
                    users={users}
                    offset={offset}
                    pageNumber={Number(pageNumber)}
                    totalUsers={totalUsers}
                />
            </TabsContent>
        </Tabs>
    )
    
}

export default UsersMainPage