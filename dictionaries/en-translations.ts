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
        title: "Home",
        brokerDashboard: {
            title: "Key Performance Indicators",
            kpis: {
                monthlyCommissions: {
                    title: "Monthly Commissions",
                    trend: "vs last month"
                },
                activeClients: {
                    title: "Active Clients",
                    trend: "vs last month"
                },
                activePolicies: {
                    title: "Active Policies",
                    trend: "vs last month"
                },
                renewalRate: {
                    title: "Renewal Rate",
                    trend: "vs last month"
                }
            },
            gauges: {
                satisfaction: {
                    name: "Satisfaction",
                    description: "Customer satisfaction"
                },
                retention: {
                    name: "Retention",
                    description: "Customer retention rate"
                },
                claims: {
                    name: "Claims",
                    description: "Claims rate"
                },
                quotes: {
                    name: "Quotes",
                    description: "Quote conversion"
                }
            },
            charts: {
                monthlyCommissions: {
                    title: "Monthly Commissions",
                    tooltip: "Commissions"
                },
                policyDistribution: {
                    title: "Policy Distribution",
                    types: {
                        auto: "Auto",
                        life: "Life",
                        home: "Home",
                        health: "Health"
                    }
                }
            },
            common: {
                vsLastMonth: "vs last month",
                months: {
                    jan: "Jan",
                    feb: "Feb",
                    mar: "Mar",
                    apr: "Apr",
                    may: "May",
                    jun: "Jun",
                    jul: "Jul",
                    aug: "Aug",
                    sep: "Sep",
                    oct: "Oct",
                    nov: "Nov",
                    dec: "Dec"
                },
                weekdays: {
                    mon: "Mon",
                    tue: "Tue",
                    wed: "Wed",
                    thu: "Thu",
                    fri: "Fri",
                    sat: "Sat",
                    sun: "Sun"
                }
            },
            userActivity: {
                title: "User Activity",
                subtitle: "Active users per day",
                activeUsers: "Active users"
            },
            userStats: {
                verifiedUsers: {
                    title: "Verified Users",
                    description: "Percentage of email-verified users"
                },
                newUsers: {
                    title: "New Users",
                    description: "Registered in the last 30 days"
                },
                activeRegions: {
                    title: "Active Regions",
                    description: "Geographical user distribution"
                },
                userEngagement: {
                    title: "User Engagement",
                    description: "Engagement metrics",
                    lastLogin: "Last login",
                    verified: "Verified",
                    unverified: "Unverified"
                },
                profileCompletion: {
                    title: "Complete Profiles",
                    description: "Users with completed profiles"
                }
            }
        }
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