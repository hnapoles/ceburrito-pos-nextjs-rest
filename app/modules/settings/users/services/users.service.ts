'use server';
//import { revalidatePath } from 'next/cache';
//import { redirect } from 'next/navigation';

import { auth } from "@/app/modules/auth/services/auth";

import { IGetAllUsersByPageService, IUpdateUserByIdService } from "@/app/modules/settings/users/models/users.interface";

import { PrismaClient, Prisma } from "@prisma/client"
const prisma = new PrismaClient()

import { fetchApi } from '@/lib/api-utils';

const HOST_API_URL = process.env.HOST_API_URL || "http://172.104.117.139:3000/api/v1";

export async function getAllUsersService() {
   
    try {
        const users = await prisma.appUser.findMany();
        
        return { success: true, message: "Got data", data: users };
    } catch (err) {
        console.log(err);
        return { success: false, message: "Db error", data: [] };
    }

}

type GetUsersResponse = {
    success: boolean,
    messsage: string,
    data: {
        id: string,
        username: string,
        email: string,
        primaryRole: string
        isVerified: boolean,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        createdBy: string,
        updatedBy: string
    }
  }

export async function getAllUsersByPageService(p: IGetAllUsersByPageService) {

    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return null;
    }

    const accessToken = session.accessToken
    //const skip = (p.pageNumber - 1) * p.recordsPerPage;

    const { data: response, error, status } = await fetchApi<GetUsersResponse>(`${HOST_API_URL}/users?page=${p.pageNumber}&limit=${p.recordsPerPage}&keyword=${p.keyword}`, 
        { token : accessToken })

    console.log('auth server error ', error)
          console.log('new data', response);

          if (!response || !response.data || error) return null;
          
          const { data : users } = response;

          return users;
    
    
    
}

export async function deleteUserByIdService(id: string) {

    try {
        const users = await prisma.appUser.delete({
            where: {
                id: id
            }
        });
        
        return { success: true, message: "Got data", data: users };
    } catch (err) {
        console.log(err);
        return { success: false, message: "Db error", data: [] };
    }
    
}

export async function createUserService(newUser: IUpdateUserByIdService) {
    const newRecord = {...newUser, createdBy: 'boboy', updatedBy: 'boboy', password: '123'}
    if (!newRecord) {
        return { success: false, message: 'Invalid data parameters sent', data: {} };
    }
    try {
        const user = await prisma.appUser.create({
            data: newRecord
        });
        //revalidatePath('/dashboard/settings/users');
        //redirect('/dashboard/settings/users');
        return { success: true, message: "User data saved.", data: user };

    } catch (err) {
        console.error(err);
        var message = "Database error";
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
              case "P2002":
                message = "Duplicate entry.";
              case "P2025":
                message = "Record not found.";
              default:
                message = "Database error.";
            }
          }
        return { success: false, message: message, data: {} };
    } 

}

export async function updateUserByIdService(id: string, newUser: IUpdateUserByIdService ) {
    try {
        const user = await prisma.appUser.update({
            where: {
                id: id
            },
            data: newUser
        });
        return { success: true, message: "User data saved.", data: user };

    } catch (err) {
        console.log(err);
        return { success: false, message: "Db error", data: {} };
    }
    //revalidatePath('/dashboard/settings/users');
    //redirect('/dashboard/settings/users');

}

export async function getUserByIdService(id: string) {

    try {
        const user = await prisma.appUser.findUnique({
            where: {
                id: id
            }
        });
        return user
    } catch (err) {
        console.error(err);
        return null
    }
    
}

/*
export async function checkEmailExistService(email: string) {

    try {
        const user = await prisma.appUser.findUnique({
            where: {
                email: email
            }
        });
        if (user) return true
        return false
    } catch (err) {
        console.error(err);
        return true
    }
    
}
*/

export async function checkEmailExistsService(email: string): Promise<boolean> {
    const user = await prisma.appUser.findUnique({
      where: { email },
    })
    return !!user
}