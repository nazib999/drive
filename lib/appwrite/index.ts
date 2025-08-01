"use server"
import {Account, Avatars, Client, Databases, Storage} from "node-appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export const createSessionClient = async () => {
    const client= new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId);

    const session = (await cookies()).get('appwrite_session');

    if(!session || !session.value) {
        redirect('/sign-in');
        throw new Error('No session found')
    }

    client.setSession(session.value);

    return{
        get account(){
            return new Account(client)
        },
        get databases() {
            return new Databases(client)
        }
    }
}

export const createAdminClient = async () => {
    const client= new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.appwriteSecret);



    return{
        get account(){
            return new Account(client)
        },
        get databases() {
            return new Databases(client)
        },
        get storage() {
            return new Storage(client)
        },
        get avatars() {

            return new Avatars(client)
        }
    }
}