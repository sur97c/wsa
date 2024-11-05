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
        title: "Inicio",
        brokerDashboard: {
            title: "Indicadores clave de desempeño",
            kpis: {
                monthlyCommissions: {
                    title: "Comisiones Mensuales",
                    trend: "vs mes anterior"
                },
                activeClients: {
                    title: "Clientes Activos",
                    trend: "vs mes anterior"
                },
                activePolicies: {
                    title: "Pólizas Vigentes",
                    trend: "vs mes anterior"
                },
                renewalRate: {
                    title: "Tasa de Renovación",
                    trend: "vs mes anterior"
                }
            },
            gauges: {
                satisfaction: {
                    name: "Satisfacción",
                    description: "Satisfacción de clientes"
                },
                retention: {
                    name: "Retención",
                    description: "Tasa de retención de clientes"
                },
                claims: {
                    name: "Reclamos",
                    description: "Tasa de reclamos"
                },
                quotes: {
                    name: "Cotizaciones",
                    description: "Conversión de cotizaciones"
                }
            },
            charts: {
                monthlyCommissions: {
                    title: "Comisiones Mensuales",
                    tooltip: "Comisiones"
                },
                policyDistribution: {
                    title: "Distribución de Pólizas",
                    types: {
                        auto: "Auto",
                        life: "Vida",
                        home: "Hogar",
                        health: "Salud"
                    }
                }
            },
            common: {
                vsLastMonth: "vs mes anterior",
                months: {
                    jan: "Ene",
                    feb: "Feb",
                    mar: "Mar",
                    apr: "Abr",
                    may: "May",
                    jun: "Jun",
                    jul: "Jul",
                    aug: "Ago",
                    sep: "Sep",
                    oct: "Oct",
                    nov: "Nov",
                    dec: "Dic"
                },
                weekdays: {
                    mon: "Lun",
                    tue: "Mar",
                    wed: "Mié",
                    thu: "Jue",
                    fri: "Vie",
                    sat: "Sáb",
                    sun: "Dom"
                }
            },
            userActivity: {
                title: "Actividad de Usuarios",
                subtitle: "Usuarios activos por día",
                activeUsers: "Usuarios activos"
            },
            userStats: {
                verifiedUsers: {
                    title: "Usuarios Verificados",
                    description: "Porcentaje de usuarios con email verificado"
                },
                newUsers: {
                    title: "Usuarios Nuevos",
                    description: "Registrados en los últimos 30 días"
                },
                activeRegions: {
                    title: "Regiones Activas",
                    description: "Distribución geográfica de usuarios"
                },
                userEngagement: {
                    title: "Engagement de Usuarios",
                    description: "Métricas de participación",
                    lastLogin: "Último acceso",
                    verified: "Verificados",
                    unverified: "No verificados"
                },
                profileCompletion: {
                  title: "Perfiles Completos",
                  description: "Usuarios con perfil completado"
                }
            }
        }
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