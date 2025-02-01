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
    message: string,
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
        updatedBy: string,
        imageUrl: string | null,
    }
}

type GetAllUsersResponse = {
    success: boolean,
    message: string,
    data: [{
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
    }]
}

interface DeleteUserResponse extends GetUsersResponse {
}


export async function getAllUsersByPageService(p: IGetAllUsersByPageService) {

    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return null;
    }
    const accessToken = session.accessToken
    //const skip = (p.pageNumber - 1) * p.recordsPerPage;

    const { data: response, error, status }
        = await fetchApi<GetAllUsersResponse>(`${HOST_API_URL}/users?page=${p.pageNumber}&limit=${p.recordsPerPage}&keyword=${p.keyword}`,
            { token: accessToken })

    console.log('server error ', error)
    console.log('new data', response);

    if (!response || !response.data || error) return null;

    const { data: users } = response;

    return users;
    
    
    
}

export async function deleteUserByIdService(id: string) {

    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return { success: false, message: "Not logged in", data: [] };
    }
    const accessToken = session.accessToken
   
    const { data: response, error, status } 
        = await fetchApi<DeleteUserResponse>(`${HOST_API_URL}/users/${id}`, 
            { token : accessToken, method: 'DELETE' } )
    
    if (!response || !response.success || error) return { success: false, message: response?.message, data: [] };

    return { success: true, message: response?.message, data: response?.data };
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


    /*
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
    */

    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return null;
    }
    const accessToken = session.accessToken
   
    const { data: response, error, status }
        = await fetchApi<GetUsersResponse>(`${HOST_API_URL}/users/${id}`,
            { token: accessToken })

    console.log('server error ', error)
    console.log('new data', response);

    if (!response || !response.data || !response.success || error) return null;

    const { data: user } = response;

    return user;
    
    
}

export async function checkEmailExistsService(email: string): Promise<boolean> {
    const user = await prisma.appUser.findUnique({
      where: { email },
    })
    return !!user
}