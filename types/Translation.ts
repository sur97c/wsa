// types/Translation.ts

import { TableTranslations } from "@components/advanced-table/advancedTableDefinition";

// Definiciones base para tablas
export interface TableTranslationBase {
  columns: Record<string, string>;
  editCreate: {
    fields: Record<string, string>;
    edit: {
      title: string;
      success: string;
      error: string;
    };
    create: {
      title: string;
      success: string;
      error: string;
    };
    status: Record<string, string>;
  };
  rowOptions?: Record<string, string>;
  tableOptions?: Record<string, string>;
}

// Definición específica para el módulo de gestión
interface ManagementTranslations {
  title: string;
  advancedTable: {
    users: TableTranslationBase;
    [key: string]: TableTranslationBase;
  };
}

export type ModuleWithTableKey = 'management';

// Interfaces para otras secciones
interface CommonTranslations {
  loading: string;
  error: string;
}

interface HeaderTranslations {
  title: string;
  menu: Record<string, string>;
  welcome: string;
  showLogin: string;
  closingSession: string;
  closeLogin: string;
}

interface UserMenuTranslations {
  editProfile: string;
  setup: string;
  dashboardsSettings: string;
  notifications: string;
  language: string;
  spanishLanguage: string;
  englishLanguage: string;
  theme: string;
  showKPIsHome: string;
}

interface LoginFormTranslations {
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
}

interface NavigationTranslations {
  title: string;
  home: string;
  quotes: string;
  policies: string;
  claims: string;
  payments: string;
  clients: string;
  management: string;
  reports: string;
}

interface AuthStateListenerTranslations {
  title: string;
  message: string;
  extendSession: string;
  closeSession: string;
}

interface HomeTranslations {
  title: string;
  spanish: string;
  english: string;
  welcome: string;
  message: string;
  login: string;
  cards: Array<{
    title: string;
    description: string;
  }>;
}

interface DashboardTranslations {
  title: string;
  kpis: Record<string, {
    title: string;
    trend: string;
  }>;
  gauges: Record<string, {
    name: string;
    description: string;
  }>;
  charts: Record<string, {
    title: string;
    tooltip?: string;
    types?: Record<string, string>;
  }>;
  common: {
    vsLastMonth: string;
    months: Record<string, string>;
    weekdays: Record<string, string>;
  };
  userActivity: {
    title: string;
    subtitle: string;
    activeUsers: string;
  };
  userStats: Record<string, {
    title: string;
    description: string;
    [key: string]: string;
  }>;
}

interface ValidationTranslations {
  required: string;
  invalidEmail: string;
  minLength: string;
  maxLength: string;
  invalidFormat: string;
  passwordMismatch: string;
  uniqueValue: string;
  invalidNumber: string;
  invalidDate: string;
  futureDate: string;
  pastDate: string;
}

interface ErrorTranslations {
  notFound: {
    title: string;
    message: string;
  };
  generic: {
    title: string;
    message: string;
    retry: string;
  };
}

// Interfaz principal de traducción
export interface Translation {
  common: CommonTranslations;
  header: HeaderTranslations;
  userMenu: UserMenuTranslations;
  loginForm: LoginFormTranslations;
  navigation: NavigationTranslations;
  authStateListener: AuthStateListenerTranslations;
  home: HomeTranslations;
  dashboard: DashboardTranslations;
  quotes: { title: string };
  policies: { title: string };
  claims: { title: string };
  payments: { title: string };
  clients: { title: string };
  management: ManagementTranslations;
  reports: { title: string };
  advancedTable: TableTranslations;
  validation: ValidationTranslations;
  errors: ErrorTranslations;
  [key: string]: any;
}