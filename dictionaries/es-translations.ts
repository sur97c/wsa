// dictionaries/es-translations.ts

import { Translation } from '../types/Translation'

export const esTranslations: Translation = {
    header: {
        title: "Bienvenido a WSA Broker portal",
        welcome: "Hola, {{name}}!",
        showLogin: "Iniciar sesión",
        closingSession: "Cerrando sesión...",
        closeLogin: "Cerrar"
    },
    userMenu: {
        editProfile: "Ver y editar perfil",
        setup: "Configuración",
        dashboardsSettings: "Personalizar dashboards",
        notifications: "Notificaciones",
        language: "Idioma",
        spanishLanguage: "Español",
        englishLanguage: "Inglés",
        theme: "Tema",
        showKPIsHome: "Mostrar KPIs en inicio"
    },
    loginForm: {
        email: "Correo electrónico",
        password: "Contraseña",
        rememberMe: "Mantener la sesión",
        recoveryAccess: "Recuperar acceso",
        recoveryAccessInfo: "Capture su email registrado, para restablecer el acceso.",
        emailToRecoveryAccess: "Correo electrónico",
        signingIn: "Iniciando sesión...",
        signIn: "Iniciar sesión",
        sendingEmail: "Enviando email...",
        sendEmail: "Enviar email"
    },
    navigation: {
        title: "WSA Broker",
        home: "Inicio",
        quotes: "Cotizaciones",
        policies: "Pólizas",
        claims: "Reclamaciones",
        payments: "Pagos",
        clients: "Clientes",
        management: "Administración",
        reports: "Reportes"
    },
    authStateListener: {
        title: "Se detecto inactividad",
        message: "La sesión está por expirar en {{timeLeft}} segundos.",
        extendSession: "Extender sesión",
        closeSession: "Cerrar sesión"
    },
    home: {
        title: "Inicio"
    },
    quotes: {
        title: "Cotizaciones"
    },
    policies: {
        title: "Pólizas"
    },
    claims: {
        title: "Reclamaciones"
    },
    payments: {
        title: "Pagos"
    },
    clients: {
        title: "Clientes"
    },
    management: {
        title: "Administración",
        advancedTable: {
            users: {
                columns: {
                    id: "ID",
                    email: "Correo electrónico",
                    emailVerified: "Verificado",
                    displayName: "Mostrar Nombre",
                    name: "Nombre",
                    lastName: "Apellido",
                    creationTime: "Creado",
                    lastSignInTime: "Ultimo acceso"
                },
                tableOptions: {
                    exportCsv: "Exportar a CSV"
                },
                rowOptions: {
                    edit: "Editar",
                    delete: "Eliminar"
                }
            }
        }
    },
    reports: {
        title: "Reportes"
    },
    advancedTable: {
        searchPlaceholder: "Buscar...",
        loading: "Cargando...",
        noResults: "No se encontraron resultados",
        addButton: "Agregar",
        showingResults: "Mostrando {{count}} resultados, página {{page}}",
        noMoreData: "No hay más datos para cargar",
        loadingMore: "Cargando más resultados...",
        page: "Página",
        actions: "Acciones",
        addEditTitle: "Agregar/Editar Usuario",
        save: "Salvar",
        cancel: "Cancelar",
        filters: {
            selectColumn: "Filtrar por",
            selectOperator: "Operador",
            filterValue: "Valor del filtro",
            operators: {
                eq: "Igual a",
                neq: "Diferente a",
                gt: "Mayor que",
                gte: "Mayor o igual a",
                lt: "Menor que",
                lte: "Menor o igual a",
                between: "Entre",
                contains: "Contiene"
            },
            minValue: "Valor mínimo",
            maxValue: "Valor máximo",
            true: "Verdadero",
            false: "Falso",
            selectOption: "Seleccionar opción",
            removeFilter: "Eliminar filtro",
            dateFormat: "dd/MM/yyyy"
        },
        boolean: {
            true: "Sí",
            false: "No"
        }
    }
}