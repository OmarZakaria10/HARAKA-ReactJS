import React from "react";
import LoadingWave from "./LoadingWave";

/**
 * Higher-Order Component for adding loading states to any component
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} loadingConfig - Configuration for the loading state
 * @returns {React.Component} - Component with loading state
 */
const withLoading = (WrappedComponent, loadingConfig = {}) => {
  const {
    size = "md",
    color = "#1C64F2",
    message = "جاري التحميل...",
    overlayClassName = "",
    loadingClassName = "",
  } = loadingConfig;

  const WithLoadingComponent = (props) => {
    const { isLoading, ...restProps } = props;

    return (
      <div className="relative">
        {isLoading && (
          <div
            className={`absolute inset-0 bg-white dark:bg-slate-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center ${overlayClassName}`}
          >
            <LoadingWave
              size={size}
              color={color}
              message={message}
              className={loadingClassName}
            />
          </div>
        )}
        <WrappedComponent {...restProps} />
      </div>
    );
  };

  WithLoadingComponent.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithLoadingComponent;
};

/**
 * Hook for managing loading states
 * @param {boolean} initialState - Initial loading state
 * @returns {Array} - [isLoading, setLoading, withLoadingWrapper]
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const setLoading = React.useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const withLoadingWrapper = React.useCallback(
    (asyncFunction) => {
      return async (...args) => {
        try {
          setLoading(true);
          return await asyncFunction(...args);
        } finally {
          setLoading(false);
        }
      };
    },
    [setLoading]
  );

  return [isLoading, setLoading, withLoadingWrapper];
};

export default withLoading;
