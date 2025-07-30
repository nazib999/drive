export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
    usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION || '',
    filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION || '',
    storageId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET || '',
    appwriteSecret: process.env.NEXT_APPWRITE_SECRET || '',
}