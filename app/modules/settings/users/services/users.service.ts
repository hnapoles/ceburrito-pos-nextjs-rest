'use server';
//import { revalidatePath } from 'next/cache';
//import { redirect } from 'next/navigation';

import { auth } from "@/app/modules/auth/services/auth";

import { IGetAllUsersByPageService, IUpdateUserByIdService, ICreateUserService } from "@/app/modules/settings/users/models/users.interface";

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
    //console.log('new data', response);

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



export async function createUserService(newUser: ICreateUserService) {
    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return { success: false, message: "Not logged in", data: [] };
    }
    const accessToken = session.accessToken

    console.log('json stringify newUser', JSON.stringify(newUser));
   
    const { data: response, error, status } 
        = await fetchApi<DeleteUserResponse>(`${HOST_API_URL}/users/`, 
            { token : accessToken, method: 'POST', body: JSON.stringify(newUser) } )
    
    if (!response || !response.success || error) return { success: false, message: response?.message, data: [] };

    return { success: true, message: response?.message, data: response?.data };

}

export async function updateUserByIdService(id: string, newUser: IUpdateUserByIdService ) {

    const session = await auth();
    if (!session) {
        console.log("Please log in first");
        return { success: false, message: "Not logged in", data: [] };
    }
    const accessToken = session.accessToken

    console.log('json stringify newUser', JSON.stringify(newUser));
   
    const { data: response, error, status } 
        = await fetchApi<DeleteUserResponse>(`${HOST_API_URL}/users/${id}`, 
            { token : accessToken, method: 'PUT', body: JSON.stringify(newUser) } )
    
    if (!response || !response.success || error) return { success: false, message: response?.message, data: [] };

    return { success: true, message: response?.message, data: response?.data };
    

}

export async function getUserByIdService(id: string) {

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
    //console.log('new data', response);

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