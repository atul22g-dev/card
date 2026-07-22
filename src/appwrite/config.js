const conf = {
    appwriteUrl: String(process.env.REACT_APP_APPWRITE_URL),
    appwriteProjectId: String(process.env.REACT_APP_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.REACT_APP_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(process.env.REACT_APP_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(process.env.REACT_APP_APPWRITE_BUCKET_ID),
    appwriteApiKey: process.env.REACT_APP_APPWRITE_API_KEY || '',
    SiteUrl: process.env.REACT_APP_SITE_URL || window.location.origin,
}

export default conf