// types/Translation.ts

import { TableTranslations } from "@components/advanced-table/advancedTableDefinition";

export interface TableTranslationBase {
    columns: {
        [key: string]: string;
    };
    rowOptions?: {
        [key: string]: string;
    };
    tableOptions?: {
        [key: string]: string;
    };
}

export interface ModuleTableEntities {
    [entityName: string]: TableTranslationBase;
}

export interface ModuleWithTable {
    title: string;
    advancedTable: ModuleTableEntities;
}

export type ModuleWithTableKey =
    | "management"
// | "clients"
// | "policies"
// | "quotes"
// | "claims"
// | "payments"
// | "reports";

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
        brokerDashboard: {
            title: string;
            kpis: {
                monthlyCommissions: {
                    title: string;
                    trend: string;
                };
                activeClients: {
                    title: string;
                    trend: string;
                };
                activePolicies: {
                    title: string;
                    trend: string;
                };
                renewalRate: {
                    title: string;
                    trend: string;
                };
            };
            gauges: {
                satisfaction: {
                    name: string;
                    description: string;
                };
                retention: {
                    name: string;
                    description: string;
                };
                claims: {
                    name: string;
                    description: string;
                };
                quotes: {
                    name: string;
                    description: string;
                };
            };
            charts: {
                monthlyCommissions: {
                    title: string;
                    tooltip: string;
                };
                policyDistribution: {
                    title: string;
                    types: {
                        auto: string;
                        life: string;
                        home: string;
                        health: string;
                    };
                };
            };
            common: {
                vsLastMonth: string;
                months: {
                    jan: string;
                    feb: string;
                    mar: string;
                    apr: string;
                    may: string;
                    jun: string;
                    jul: string;
                    aug: string;
                    sep: string;
                    oct: string;
                    nov: string;
                    dec: string;
                };
                weekdays: {
                    mon: string;
                    tue: string;
                    wed: string;
                    thu: string;
                    fri: string;
                    sat: string;
                    sun: string;
                };
            };
            userActivity: {
                title: string;
                subtitle: string;
                activeUsers: string;
            };
            userStats: {
                verifiedUsers: {
                    title: string;
                    description: string;
                };
                newUsers: {
                    title: string;
                    description: string;
                };
                activeRegions: {
                    title: string;
                    description: string;
                };
                userEngagement: {
                    title: string;
                    description: string;
                    lastLogin: string;
                    verified: string;
                    unverified: string;
                };
                profileCompletion: {
                    title: string;
                    description: string;
                };
            };
        }
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
    management: ModuleWithTable,
    reports: {
        title: string;
    },
    advancedTable: TableTranslations
}