// types/Translation.ts

export interface Translation {
    header: {
        title: string;
        welcome: string;
        showLogin: string;
        closingSession: string;
        closeLogin: string;
    };
    userMenu: {
        editProfile: string;
        setup: string;
        dashboardsSettings: string;
        notifications: string;
        language: string;
        spanishLanguage: string;
        englishLanguage: string;
        theme: string;
        showKPIsHome: string;
    };
    loginForm: {
        email: string;
        password: string;
        rememberMe: string;
        recoveryAccess: string;
        recoveryAccessInfo: string;
        emailToRecoveryAccess: string;
        signingIn: string;
        signIn: string;
        sendingEmail: string;
        sendEmail: string;
    };
    navigation: {
        title: string;
        home: string;
        quotes: string;
        policies: string;
        claims: string;
        payments: string;
        clients: string;
        management: string;
        reports: string;
    };
    authStateListener: {
        title: string;
        message: string;
        extendSession: string;
        closeSession: string;
    },
    home: {
        title: string;
    },
    quotes: {
        title: string;
    },
    policies: {
        title: string;
    },
    claims: {
        title: string;
    },
    payments: {
        title: string;
    },
    clients: {
        title: string;
    },
    management: {
        title: string;
    },
    reports: {
        title: string;
    }
}