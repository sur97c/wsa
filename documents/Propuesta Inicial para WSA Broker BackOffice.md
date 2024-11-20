# Propuesta Inicial para WSA Broker BackOffice

## 1. Resumen del Proyecto

El objetivo es desarrollar una aplicación de BackOffice para WSA Broker utilizando tecnologías modernas y siguiendo las pautas de diseño establecidas en la página web existente (https://wsabrokers.mx/).

## 2. Stack Tecnológico

- NextJS 14
- Redux para gestión de estado
- Uso de Actions de NextJS 14 para consumir datos
- Firestore de Firebase para base de datos
- Autenticación de Firebase
- TailwindCSS para estilos base
- Sass para extensiones de CSS y estilos personalizados
- Typescript

## 3. Arquitectura Propuesta

Se seguirá la arquitectura base propuesta en los diagramas, con soporte para Firestore en tiempo real:

1. Capa de Presentación (UI)
2. Capa de Lógica de Negocio
3. Capa de Acceso a Datos
4. Firebase/Firestore

## 4. Guías de Desarrollo

- Uso de TypeScript en todo el proyecto
- Tipado fuerte y evitar el uso de "any"
- Creación de interfaces para modelar documentos de Firestore
- Uso de componentes genéricos "T" cuando sea posible
- Tipos concretos solo en las capas superiores (componentes)
- Implementación de Atomic Design para la creación de componentes
- Utilización de CSS Modules para encapsular estilos de componentes
- Extensión de las clases de Tailwind con Sass cuando sea necesario

## 5. Diseño y Experiencia de Usuario

- Seguir la estética y estilo de la página web actual (https://wsabrokers.mx/)
- Mantener consistencia en colores, tipografía, tamaños y otros elementos visuales
- Adaptar el diseño para una experiencia de usuario óptima en el BackOffice
- Implementar un diseño completamente responsivo
- Aplicar el enfoque "mobile-first" en el desarrollo de la interfaz
- Utilizar Sass para crear estilos modulares y reutilizables
- Combinar las clases de Tailwind con estilos personalizados usando CSS Modules para evitar conflictos

## 6. Funcionalidades Principales (a definir con más detalle)

1. Autenticación y gestión de usuarios
2. Dashboard principal con métricas clave
3. Gestión de clientes y/o brokers
4. Administración de pólizas, fianzas, reclamos, reportes y productos
5. Reportes y análisis

## 7. Funcionalidades Secundarias

1. Manejo de multilingual (Español y Ingles)
2. Manejo de Temas (Default, Obscuro, Naturaleza y Océano)
3. Efectos y transiciones suaves
4. Revisar la factibilidad de implementar notificaciones (revisar si podemos usar algo de firebase como notifications) 
5. Revisar si podemos almacenar los settings del perfil (lenguaje, Tema, etc) del usuario (Igual ver que podemos usar de Firebase)
6. Revisar si podemos mejorar la presentación de los datos en tiempo real (snapshots, de firestore o cosas asi)
7. Buscar motores de búsqueda como algolia, elasticsearch o algo asi que se pueda implementar en firebase para usarlo en la aplicación

## 8. Planificación Inicial

1. Configuración del proyecto y entorno de desarrollo
   - Incluir la configuración de Sass y CSS Modules
2. Implementación de la autenticación con Firebase
3. Creación de la estructura básica de la aplicación
   - Establecer la estructura de Atomic Design
4. Desarrollo de componentes principales
   - Comenzar con componentes atómicos y moleculares
5. Integración con Firestore para manejo de datos en tiempo real
6. Implementación de lógica de negocio
7. Diseño y desarrollo de la interfaz de usuario
   - Aplicar enfoque mobile-first y asegurar responsividad
8. Pruebas y optimización
   - Incluir pruebas de responsividad en diferentes dispositivos
9. Despliegue y configuración del entorno de producción

## 9. Próximos Pasos

1. Revisión y aprobación de esta propuesta inicial
2. Definición detallada de requisitos y funcionalidades
3. Creación de un backlog de tareas y priorización
4. Establecimiento de hitos y plazos del proyecto
5. Asignación de recursos y roles en el equipo de desarrollo
6. Definición de la estructura de Atomic Design para los componentes

Esta propuesta servirá como punto de partida para el desarrollo del proyecto WSA Broker BackOffice. Se recomienda revisarla en detalle y ajustarla según las necesidades específicas del negocio y cualquier requisito adicional no contemplado en esta versión inicial.