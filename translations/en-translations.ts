// translations/en-translations.ts

import { Translation } from './Translation'

export const enTranslations: Translation = {
  common: {
    loading: "Loading...",
    error: "Error"
  },
  header: {
    title: "Welcome to WSA Broker portal",
    menu: {
      about: "About Us",
      services: "Services",
      contact: "Contact"
    },
    welcome: "Hello, {{name}}!",
    showLogin: "Sign in",
    closingSession: "Closing session...",
    closeLogin: "Close",
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
    dashboard: "Indicators",
    quotes: "Quotes",
    policies: "Policies",
    claims: "Claims",
    payments: "Payments",
    clients: "Clients",
    management: "Users",
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
    spanish: "Spanish",
    english: "English",
    welcome: "Welcome to WSA Brokers",
    message: "Your trusted platform for managing insurance policies and surety bonds",
    login: "Sign in",
    cards: [
      {
        title: "Comprehensive Protection",
        description: "Expert management of insurance and surety bonds tailored to your needs"
      },
      {
        title: "Risk Management",
        description: "Strategic advice and solutions to safeguard your assets and operations"
      },
      {
        title: "Personalized Service",
        description: "Dedicated support from experienced brokers with industry expertise"
      }
    ]
  },
  dashboard: {
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
        editCreate: {
          fields: {
            uid: "ID",
            email: "Email",
            emailVerified: "Verified",
            emailNotVerified: "Not verified",
            displayName: "Display name",
            name: "Name",
            lastName: "Last name",
            createdAt: "Creation at",
            lastSignInTime: "Last access",
            status: "Status"
          },
          dropDowns: {
            status: {
              active: "Active",
              inactive: "Inactive"
            }
          },
          edit: {
            title: "Edit User",
            successMessage: "User updated successfully",
            errorMessage: "Error updating user"
          },
          create: {
            title: "Create User",
            successMessage: "User created successfully",
            errorMessage: "Error creating user"
          },
          buttons: {
            save: "Save",
            cancel: "Cancel"
          }
        },
        columns: {
          uid: "ID",
          email: "Email",
          emailVerified: "Verified",
          displayName: "Display Name",
          name: "Name",
          lastName: "Last Name",
          createdAt: "Created At",
          lastSignInTime: "Last SignIn Time"
        },
        tableOptions: {
          source: "Change Source",
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
    addEditTitle: "Add/Edit",
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
    },
    columnVisibility: {
      title: "Column Visibility",
      selectAll: "Show All",
      deselectAll: "Hide All",
      defaultSelection: "Reset to Default",
      buttonTitle: "Columns"
    }
  },
  validation: {
    required: "This field is required",
    invalidEmail: "Email address is not valid",
    minLength: "Must be at least {{count}} characters",
    maxLength: "Must not exceed {{count}} characters",
    invalidFormat: "Invalid format",
    passwordMismatch: "Passwords do not match",
    uniqueValue: "This value already exists",
    invalidNumber: "Must be a valid number",
    invalidDate: "Invalid date",
    futureDate: "Date must be in the future",
    pastDate: "Date must be in the past"
  },
  errors: {
    notFound: {
      title: '404 - Page Not Found',
      message: 'Sorry, the page you are looking for does not exist or has been moved.'
    },
    genericError: {
      title: "Error",
      message: "Something went wrong. Please try again."
    },
    systemError: {
      title: "System Error",
      message: "A critical error occurred. Please try again later."
    },
    back: 'Go Back',
    home: 'Go Home'
  }
}