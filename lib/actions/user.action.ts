"use server"

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {cookies} from "next/headers";
import {avatarPlaceholderUrl} from "@/constants";
import {redirect} from "next/navigation";

const getUserByEmail = async (email:string) => {

    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email',[email])])

    return result.total>0?result.documents[0]:null;
}

const handleError = (error:any,message:string) => {
    console.log(error,message)

    throw error;
}

export const sendEmailOtp = async (email:string) => {
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(),email)
        return session.userId
    }
    catch (error) {
        handleError(error,
            'Failed to send email otp')
    }


}

export const createAccount = async ({fullName,email}:{fullName:string;email:string}) => {
    const existingUser =  await getUserByEmail(email);

    const accountId = await sendEmailOtp(email);
    if(!accountId) throw new Error('Failed to send an otp to the user')

    if (!existingUser){
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId
            }
        )

    }
    return parseStringify({accountId})
}

export const verifyOtp = async (accountId:string,password:string) => {
    const {account} = await createAdminClient();

    const session  = await account.createSession(accountId,password);

    (await cookies()).set('appwrite_session', session.secret, {
        path:'/',
        httpOnly:true,
        sameSite:'strict',
        secure:true,
    })

    return parseStringify({sessionId:session.$id})
}

export const getCurrentUser=async ()=>{
    const {databases,account} =await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId',result.$id)]
    );

    if(user.total<=0) return null;

    return parseStringify(user.documents[0])
}

export const signOut = async () => {
    const {account} = await createSessionClient();

    try {
        await account.deleteSession('current');
        (await cookies()).delete('appwrite_session')
    }
    catch (error) {
        handleError(error, 'Failed to sign out user')
    }
    finally {
        redirect('/sign-in');
    }
}

export const signInUser = async ({email}:{email:string}) => {
    try {
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            await sendEmailOtp(email);
            return parseStringify({accountId:existingUser.accountId});
        }
        return parseStringify({accountId:null,error:'User not found'});
    }
    catch (error) {
        handleError(error, 'Failed to sign in user');
    }
}