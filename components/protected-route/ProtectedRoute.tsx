// components/protected-route/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "@components/auth-state-listener/AuthStateListener";
import { useSafeRouter } from "@hooks/useSafeRouter";
import { RoleKey } from "@utils/rolesDefinition";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationLoader } from "@components/navigation-loader/NavigationLoader";
import {
//   pageVariants,
  skeletonVariants,
  TransitionType,
  transitionVariants,
  transitionTypes,
} from "@components/transitions/pageTransitions";
import React from "react";
import SkeletonManagementPage from "@components/skeletons/SkeletonManagementPage";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: RoleKey[];
  skeletonType?: RoleKey;
  transitionType?: TransitionType;
}

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
            <span className="text-primary font-medium">Loading...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// const SkeletonManagementPage = () => <div>Management Skeleton</div>;
const SkeletonQuotesPage = () => <div>Quotes Skeleton</div>;
const SkeletonPoliciesPage = () => <div>Policies Skeleton</div>;
const SkeletonHomePage = () => <div>Home Skeleton</div>;
const SkeletonClaimsPage = () => <div>Claims Skeleton</div>;
const SkeletonPaymentsPage = () => <div>Payments Skeleton</div>;
const SkeletonClientsPage = () => <div>Clients Skeleton</div>;
const SkeletonReportsPage = () => <div>Reports Skeleton</div>;

const skeletonComponents: Record<RoleKey, React.ComponentType> = {
  management: SkeletonManagementPage,
  quotes: SkeletonQuotesPage,
  policies: SkeletonPoliciesPage,
  home: SkeletonHomePage,
  claims: SkeletonClaimsPage,
  payments: SkeletonPaymentsPage,
  clients: SkeletonClientsPage,
  reports: SkeletonReportsPage,
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  skeletonType,
  transitionType = "default",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { safeNavigate } = useSafeRouter();
  const auth = useAuthState();
  const { setIsNavigating } = useNavigationLoader();

  useEffect(() => {
    const checkAuth = async () => {
      if (auth === null || !auth.isAuthenticated) {
        setIsNavigating(true);
        safeNavigate("/", true);
      } else if (
        allowedRoles.length > 0 &&
        !hasRequiredRole(auth.customClaims?.roles, allowedRoles)
      ) {
        setIsNavigating(true);
        safeNavigate("/unauthorized", true);
      } else {
        // Simular un pequeño delay para mostrar el skeleton
        setTimeout(() => {
          setShowSkeleton(false);
          setTimeout(() => {
            setIsLoading(false);
            setIsNavigating(false);
          }, 300);
        }, 800);
      }
    };

    checkAuth();
  }, [auth, safeNavigate, allowedRoles, setIsNavigating]);

  const hasRequiredRole = (
    userRoles: RoleKey[] | undefined,
    requiredRoles: RoleKey[]
  ): boolean => {
    if (!userRoles) return false;
    return userRoles.some((role) => requiredRoles.includes(role));
  };

  const validTransitionType = transitionTypes.includes(transitionType)
    ? transitionType
    : "default";

  return (
    <>
      {/* <LoadingSpinner isLoading={isLoading && !showSkeleton} /> */}
      <AnimatePresence mode="wait" initial={false}>
        {showSkeleton && skeletonType ? (
          <motion.div
            key="skeleton"
            variants={skeletonVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full"
          >
            {React.createElement(skeletonComponents[skeletonType])}
          </motion.div>
        ) : !isLoading ? (
          <motion.div
            key="content"
            variants={transitionVariants[validTransitionType]}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default ProtectedRoute;
