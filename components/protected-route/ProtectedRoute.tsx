// components/protected-route/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from 'react'
import { useAuthState } from "@components/auth-state-listener/AuthStateListener"
import { useSafeRouter } from "@hooks/useSafeRouter"
import { RoleKey } from '@utils/rolesDefinition'

interface ProtectedRouteProps {
    children: ReactNode
    allowedRoles?: RoleKey[]
    skeletonType?: RoleKey
}

// Dummy components for illustration. Replace with your actual components.
const LoadingSpinner = () => <div>Loading...</div>
const SkeletonManagementPage = () => <div>Management Skeleton</div>
const SkeletonQuotesPage = () => <div>Quotes Skeleton</div>
const SkeletonPoliciesPage = () => <div>Policies Skeleton</div>

const skeletonComponents: Record<RoleKey, React.ComponentType> = {
    management: SkeletonManagementPage,
    quotes: SkeletonQuotesPage,
    policies: SkeletonPoliciesPage,
    home: LoadingSpinner,
    claims: LoadingSpinner,
    payments: LoadingSpinner,
    clients: LoadingSpinner,
    reports: LoadingSpinner,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [], skeletonType }) => {
    const [isLoading, setIsLoading] = useState(true)
    const { safeNavigate } = useSafeRouter()
    const auth = useAuthState()

    useEffect(() => {
        const checkAuth = async () => {
            if (auth === null || !auth.isAuthenticated) {
                safeNavigate('/', true)
            } else if (allowedRoles.length > 0 && !hasRequiredRole(auth.customClaims?.roles, allowedRoles)) {
                safeNavigate('/unauthorized', true)
            } else {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [auth, safeNavigate, allowedRoles])

    const hasRequiredRole = (userRoles: RoleKey[] | undefined, requiredRoles: RoleKey[]): boolean => {
        if (!userRoles) return false
        return userRoles.some(role => requiredRoles.includes(role))
    }

    if (isLoading) {
        if (skeletonType && skeletonComponents[skeletonType]) {
            const SkeletonComponent = skeletonComponents[skeletonType];
            return <SkeletonComponent />;
        }
        return <LoadingSpinner />;
    }

    return <>{children}</>
}

export default ProtectedRoute