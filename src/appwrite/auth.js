import { handleErrors, handleSuccess } from '../components/func/AllFunc';
import conf from './config';
import { Databases, Client, Account, ID, Query } from "appwrite";

// Shared Appwrite Client — both AuthService and DBService use the same
// instance so that a session created by AuthService.login() is
// automatically available to DBService database calls.
const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

export class DBService {
    Databases;
    constructor() {
        this.Databases = new Databases(client);
    }

    // Read the active theme color from the CSS variable
    getCurrentThemeColor() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--theme-color-rgb').trim() || '244, 90, 87';
    }

    async AddData(user, data, title = '') {
        const Time = new Date().toLocaleTimeString();
        // Embed the current theme color and title into card data so they persist
        const enrichedData = {
            ...data,
            __cardTitle: title || 'Untitled Card',
            __themeColor: this.getCurrentThemeColor()
        };
        try {
            await this.Databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, ID.unique(), { 
                Name: user.name, 
                Email: user.email, 
                Data: JSON.stringify(enrichedData), 
                Time: Time, 
                UserID: user.$id 
            });
            window.location.href = conf.SiteUrl + '/dashboard';
        } catch (error) {

            handleErrors({ message: error.message })
        }
    }

    async fetchdata() {
        try {
            const promise = await this.Databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId);

            if (promise.total === 0) {
                return null;
            } else {
                return promise.documents;
            }
        } catch (error) {
            console.error('Failed to fetch data:', error.message);
            return null;
        }
    }
    async fetchOnedata(parameter) {
        try {
            let para = parameter.replace("?", "");
            const promise = await this.Databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId, [Query.equal('$id', [para])])

            if (promise.total === 0) {
                return null;
            } else {
                return promise.documents;
            }
        } catch (error) {
            console.error('Failed to fetch data:', error.message);
            return null;
        }
    }

    async deleteOneData(id) {
        const promise = await this.Databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, id);
        if (promise) {
            window.location.href = '/dashboard'
        }
    }
    async updateData(headers, user, data, title = '') {
        headers = headers.replace("?", "");
        const Time = new Date().toLocaleTimeString();
        // Embed the current theme color and title into card data so they persist
        const enrichedData = {
            ...data,
            __cardTitle: title || 'Untitled Card',
            __themeColor: this.getCurrentThemeColor()
        };
        const promise = await this.Databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, headers, { 
            Name: user.name, 
            Email: user.email, 
            Data: JSON.stringify(enrichedData), 
            Time: Time 
        });
        
        if (promise) {
            window.location.href = '/dashboard'
        }
    }
}
export class AuthService {
    account;

    constructor() {
        this.account = new Account(client);
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
    async createAccountAuth(name) {
        try {
            await this.account.createOAuth2Session(name, conf.SiteUrl + '/dashboard', conf.SiteUrl);
        } catch (error) {
            handleErrors({ message: error.message });
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