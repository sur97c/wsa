// components/protected-route/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "@components/auth-state-listener/AuthStateListener";
import { useSafeRouter } from "@hooks/useSafeRouter";
import { RoleKey } from "@utils/rolesDefinition";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationLoader } from "@components/navigation-loader/NavigationLoader";
import {
  skeletonVariants,
  TransitionType,
  transitionVariants,
  transitionTypes,
} from "@components/transitions/pageTransitions";
import React from "react";
import SkeletonManagementPage from "@components/skeletons/SkeletonManagementPage";

interface ProtectedRouteProps {
  children: ReactNode;
  publicContent?: ReactNode;
  allowedRoles?: RoleKey[];
  skeletonType?: RoleKey;
  transitionType?: TransitionType;
  mode?: "redirect" | "dual";
  redirectPath?: string;
}

const LoadingSpinner: React.FC = () => {
  return (
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
  );
};

// interface LoadingSpinnerProps {
//   isLoading: boolean;
// }

// const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
//   return (
//     <AnimatePresence>
//       {isLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="flex items-center justify-center w-full h-screen fixed top-0 left-0 bg-white bg-opacity-80 z-50"
//         >
//           <div className="flex flex-col items-center gap-4">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//             />
//             <span className="text-primary font-medium">Loading...</span>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  publicContent,
  allowedRoles = [],
  skeletonType,
  transitionType = "default",
  mode = "redirect",
  redirectPath = "/",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { safeNavigate } = useSafeRouter();
  const auth = useAuthState();
  const { setIsNavigating } = useNavigationLoader();

  const hasRequiredRole = (
    userRoles: RoleKey[] | undefined,
    requiredRoles: RoleKey[]
  ): boolean => {
    if (!userRoles) return false;
    return requiredRoles.some((role) => requiredRoles.includes(role));
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (mode === "dual") {
        setTimeout(() => {
          setShowSkeleton(false);
          setTimeout(() => {
            setIsLoading(false);
            setIsNavigating(false);
          }, 300);
        }, 800);
        return;
      }
      
      if (!auth?.isAuthenticated) {
        setIsNavigating(true);
        safeNavigate(redirectPath);
      } else if (
        allowedRoles.length > 0 &&
        !hasRequiredRole(auth.customClaims?.roles, allowedRoles)
      ) {
        setIsNavigating(true);
        safeNavigate("/unauthorized");
      } else {
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
  }, [auth, safeNavigate, allowedRoles, setIsNavigating, mode, redirectPath]);

  const validTransitionType = transitionTypes.includes(transitionType)
    ? transitionType
    : "default";

  const renderContent = () => {
    if (mode === "dual") {
      return auth?.isAuthenticated ? children : publicContent;
    }
    return children;
  };

  // const loadingSpinner = () => {
  //   setShowSkeleton(false);
  //   return (
  //     <LoadingSpinner isLoading={true} />
  //   );
  // };

  const skeletonComponents: Record<RoleKey, React.ComponentType> = {
    dashboard: LoadingSpinner,
    management: SkeletonManagementPage,
    quotes: LoadingSpinner,
    policies: LoadingSpinner,
    home: LoadingSpinner,
    claims: LoadingSpinner,
    payments: LoadingSpinner,
    clients: LoadingSpinner,
    reports: LoadingSpinner,
  };

  return (
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
          {renderContent()}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ProtectedRoute;
