// dictionaries/en-translations.ts

import { Translation } from '../types/Translation'

export const enTranslations: Translation = {
    header: {
        title: "Welcome to WSA Broker portal",
        welcome: "Hello, {{name}}!",
        showLogin: "Sign in",
        closingSession: "Closing session...",
        closeLogin: "Close"
    },
    userMenu: {
        editProfile: "View and edit profile",
        setup: "Settings",
        dashboardsSettings: "Customize dashboards",
        notifications: "Notifications",
        language: "Language",
        spanishLanguage: "Spanish",
        englishLanguage: "English",
        theme: "Theme",
        showKPIsHome: "Show KPIs on home"
    },
    loginForm: {
        email: "Email",
        password: "Password",
        rememberMe: "Keep me signed in",
        recoveryAccess: "Recover access",
        recoveryAccessInfo: "Type the registered email, to reset access.",
        emailToRecoveryAccess: "Email",
        signingIn: "Signing session...",
        signIn: "Sign in",
        sendingEmail: "Sending email...",
        sendEmail: "Send email"
    },
    navigation: {
        title: "WSA Broker",
        home: "Home",
        quotes: "Quotes",
        policies: "Policies",
        claims: "Claims",
        payments: "Payments",
        clients: "Clients",
        management: "Management",
        reports: "Reports"
    },
    authStateListener: {
        title: "Inactivity detected",
        message: "Session is about to expire in {{timeLeft}} seconds.",
        extendSession: "Extend session",
        closeSession: "Close session"
    },
    home: {
        title: "Home"
    },
    quotes: {
        title: "Quotes"
    },
    policies: {
        title: "Policies"
    },
    claims: {
        title: "Claims"
    },
    payments: {
        title: "Payments"
    },
    clients: {
        title: "Clients"
    },
    management: {
        title: "Management",
        advancedTable: {
            users: {
                columns: {
                    id: "ID",
                    email: "Email",
                    emailVerified: "Verified",
                    displayName: "Display Name",
                    name: "Name",
                    lastName: "Last Name",
                    creationTime: "Creation Time",
                    lastSignInTime: "Last SignIn Time"
                },
                tableOptions: {
                    exportCsv: "Export to CSV"
                },
                rowOptions: {
                    edit: "Edit",
                    delete: "Delete"
                }
            }
        }
    },
    reports: {
        title: "Reports"
    },
    advancedTable: {
        searchPlaceholder: "Search...",
        loading: "Loading...",
        noResults: "No results found",
        addButton: "Add",
        showingResults: "Showing {{count}} results, page {{page}}",
        noMoreData: "No more data to load",
        loadingMore: "Loading more results...",
        page: "Page",
        actions: "Actions",
        addEditTitle: "Add/Edit User",
        save: "Save",
        cancel: "Cancel",
        filters: {
            selectColumn: "Select column",
            selectOperator: "Select operator",
            filterValue: "Filter value",
            operators: {
                eq: "Equals",
                neq: "Not equals",
                gt: "Greater than",
                gte: "Greater than or equal",
                lt: "Less than",
                lte: "Less than or equal",
                between: "Between",
                contains: "Contains"
            },
            minValue: "Min value",
            maxValue: "Max value",
            true: "True",
            false: "False",
            selectOption: "Select option",
            removeFilter: "Remove filter",
            dateFormat: "MM/dd/yyyy"
        },
        boolean: {
            true: "Yes",
            false: "No"
        }
    }
}