"use server"
import {createAdminClient} from "@/lib/appwrite";
import {InputFile} from "node-appwrite/file";
import {appwriteConfig} from "@/lib/appwrite/config";
import {ID, Models, Query} from "node-appwrite";
import {constructFileUrl, getFileType, parseStringify} from "@/lib/utils";
import {revalidatePath} from "next/cache";
import {getCurrentUser} from "@/lib/actions/user.action";

interface UploadFileProps {
    file: File
    ownerId: string
    accountId: string
    path: string
}
const handleError = (error:unknown,message:string) => {
    console.log(error,message);
    throw error;}

export const uploadFile = async ({file,ownerId,accountId,path}:UploadFileProps)=>{

    const {storage,databases} = await createAdminClient();





    try {
        const inputFile = InputFile.fromBuffer(file,file.name);


        const bucketFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            inputFile
        );

        const fileDocument = {
            type:getFileType(bucketFile.name).type,
            name:bucketFile.name,
            url:constructFileUrl(bucketFile.$id),
            extension:getFileType(bucketFile.name).extension,
            owner: ownerId,
            size:bucketFile.sizeOriginal,
            accountId,
            users:[],
            bucketFileId: bucketFile.$id
        }

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument,

        )
            .catch(async (error) => {
                await storage.deleteFile(appwriteConfig.storageId,bucketFile.$id);
                handleError(error, 'Failed to create file document');
            });
        revalidatePath(path);
        return parseStringify(newFile)
    }
    catch (error) {
        handleError(error, 'Failed to upload file');
    }

}
const createQueries = (currentUser:Models.Document,types:string[],searchText:string,sort:string,limit?:number) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
        ]),
    ];

    if (types && types.length > 0) queries.push(Query.equal("type", types));
    if (searchText) queries.push(Query.contains("name", searchText));
    if (limit) queries.push(Query.limit(limit));

    if(sort){
        const [sortBy, orderBy] = sort.split('-');

        queries.push(orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));
    }

    return queries;

}

export const getFiles = async ({types,searchText='',sort='$createdAt-desc',limit}:GetFilesProps) => {
    const {databases} = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not authenticated');

        const queries = createQueries(currentUser,types,searchText,sort,limit);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        );
        return parseStringify(files);
    }
    catch (e) {
        handleError(e, 'Failed to get files');
    }
}

export const renameFile = async ({
    fileId,
    name,
    extension,
    path}:RenameFileProps) => {
    const {databases} = await createAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName,
            }
        )
        revalidatePath(path);
        return parseStringify(updatedFile);
    }
    catch (e) {
        handleError(e,
            'Failed to rename file')
    }
}

export const updateFileUsers = async ({
                                     fileId,
                                     emails, path}:UpdateFileUsersProps) => {
    const {databases} = await createAdminClient();

    try {

        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails,
            }
        )
        revalidatePath(path);
        return parseStringify(updatedFile);
    }
    catch (e) {
        handleError(e,
            'Failed to update file')
    }
}

export const deleteFile = async ({
                                          fileId,
                                          bucketFileId, path}:DeleteFileProps) => {
    const {databases,storage} = await createAdminClient();

    try {

        const deleteFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,

        )
        if (deleteFile){
            await storage.deleteFile(appwriteConfig.storageId,bucketFileId);
        }
        revalidatePath(path);
        return parseStringify({ success: true });
    }
    catch (e) {
        handleError(e,
            'Failed to delete file')
    }
}