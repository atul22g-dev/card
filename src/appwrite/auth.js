import { handleErrors, handleSuccess } from '../components/func/AllFunc';
import conf from './config';
import { Databases, Client, Account, ID, Query } from "appwrite";



export class DBService {
    client = new Client();
    Databases;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.Databases = new Databases(this.client);
    }

    // Read the active theme color from the CSS variable
    getCurrentThemeColor() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--theme-color-rgb').trim() || '244, 90, 87';
    }

    async AddData(user, data) {
        const Time = new Date().toLocaleTimeString();
        // Embed the current theme color into card data so it persists
        const cardWithColor = { ...data, __themeColor: this.getCurrentThemeColor() };
        try {
            await this.Databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, ID.unique(), { Name: user.name, Email: user.email, Data: JSON.stringify(cardWithColor), Time: Time, UserID: user.$id });
            console.log("Data Add Successfully");
            window.location.href = conf.SiteUrl + '/dashboard';
        } catch (error) {
            console.log("Data Not Add " + error);
            handleErrors({ message: error.message })
        }
    }

    async fetchdata() {
        const promise = await this.Databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId);

        if (promise.total === 0) {
            return null;
        } else {
            return promise.documents;
        }
    }
    async fetchOnedata(parameter) {
        let para = parameter.replace("?", "");
        const promise = await this.Databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, [Query.equal('$id', [para])])

        if (promise.total === 0) {
            return null;
        } else {
            return promise.documents;
        }
    }

    async deleteOneData(id) {
        const promise = await this.Databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, id);
        if (promise) {
            window.location.href = '/dashboard'
        }
    }
    async updateData(headers,user, data) {
        headers = headers.replace("?", "");
        const Time = new Date().toLocaleTimeString();
        // Embed the current theme color into card data so it persists
        const cardWithColor = { ...data, __themeColor: this.getCurrentThemeColor() };
        const promise = await this.Databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, headers, { Name: user.name, Email: user.email, Data: JSON.stringify(cardWithColor), Time: Time });
        
        if (promise) {
            window.location.href = '/dashboard'
        }
    }
}
export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);

    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            handleErrors({ message: error.message });
        }
    }
    createAccountAuth(name) {
        try {
            this.account.createOAuth2Session(name, conf.SiteUrl + '/dashboard', conf.SiteUrl);
        } catch (error) {
            handleErrors({ message: error.messsage });
        }
    }

    async login({ email, password }) {
        try {
            const userData = await this.account.createEmailSession(email, password);
            handleSuccess("Your are Successfully Login")
            if (userData) {
                return await authService.getCurrentUser()
            }
        } catch (error) {
            handleErrors({ message: error.message });
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            handleErrors({ message: error.message });
        }
    }
}

const authService = new AuthService();
const dbService = new DBService();

export { authService, dbService }