// components/page-wrapper/PageWrapper.tsx

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  transitionVariants,
  TransitionType,
  transitionTypes,
} from "@components/transitions/pageTransitions";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  transitionType?: TransitionType;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = "",
  transitionType = "default",
}) => {
  const validTransitionType = transitionTypes.includes(transitionType)
    ? transitionType
    : "default";

  return (
    <motion.div
      variants={transitionVariants[validTransitionType]}
      initial="initial"
      animate="enter"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

// HOC con soporte para tipo de transición
export function withPageWrapper<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    className?: string;
    transitionType?: TransitionType;
  }
) {
  return function WithPageWrapperComponent(props: P) {
    return (
      <PageWrapper
        className={options?.className}
        transitionType={options?.transitionType}
      >
        <WrappedComponent {...props} />
      </PageWrapper>
    );
  };
}

export default PageWrapper;
