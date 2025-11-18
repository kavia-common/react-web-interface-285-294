import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

// PUBLIC_INTERFACE
const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      startIcon,
      endIcon,
      as = "button",
      href,
      type = "button",
      onClick,
      children,
      className = "",
      ...rest
    },
    ref
  ) => {
    /**
     * Advanced Button component supporting variants, sizes, icon slots, loading, accessibility, and as-prop rendering for "button" or "a".
     *
     * @param {string} variant 'primary'|'secondary'|'outline'|'ghost'|'danger'
     * @param {string} size 'sm'|'md'|'lg'
     * @param {boolean} loading Show spinner and disable interaction
     * @param {boolean} disabled Disable interaction
     * @param {boolean} fullWidth Expand to container width
     * @param {React.ReactNode} startIcon Icon at start of button
     * @param {React.ReactNode} endIcon Icon at end of button
     * @param {string} as 'button'|'a' - underlying element
     * @param {string} href Link target if 'as' is 'a'
     * @param {string} type Button type if 'as' is 'button'
     * @param {Function} onClick Click handler
     * @param {string} className Additional className
     * @param {React.ReactNode} children Button content
     */

    const isLink = as === "a";
    const isDisabled = disabled || loading;
    const ariaProps = {
      "aria-disabled": isDisabled,
      "aria-busy": loading || undefined,
    };

    // Compose className based on props
    const btnClass = [
      styles.button,
      styles[variant] || styles.primary,
      styles[size] || styles.md,
      fullWidth ? styles.fullWidth : "",
      isDisabled ? styles.disabled : "",
      loading ? styles.loading : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Keyboard accessible for links
    const commonProps = {
      ref,
      className: btnClass,
      tabIndex: isDisabled ? -1 : 0,
      ...ariaProps,
      ...rest,
      onClick: isDisabled
        ? (e) => e.preventDefault()
        : onClick,
      // Focus-visible is handled via :focus-visible in css
    };

    // Preserve icon space during loading
    const iconStyle = { display: "inline-flex", alignItems: "center", minWidth: 20, minHeight: 20 };

    const content = (
      <>
        {/* Start Icon */}
        {startIcon && (
          <span className={styles.startIcon} style={iconStyle} aria-hidden="true">
            {startIcon}
          </span>
        )}
        {/* Loading Spinner */}
        {loading && (
          <span className={styles.spinnerWrapper} style={iconStyle} aria-hidden="true">
            <span className={styles.spinner} />
          </span>
        )}
        {/* Children always shown (opacity reduced when loading) */}
        <span className={loading ? styles.loadingText : undefined} style={{ transition: "opacity 0.15s linear" }}>
          {children}
        </span>
        {/* End Icon */}
        {endIcon && (
          <span className={styles.endIcon} style={iconStyle} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </>
    );

    if (isLink) {
      return (
        <a
          {...commonProps}
          href={isDisabled ? undefined : href}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          draggable="false"
        >
          {content}
        </a>
      );
    }

    return (
      <button
        {...commonProps}
        type={type}
        disabled={isDisabled}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

// PUBLIC_INTERFACE
Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  as: PropTypes.oneOf(["button", "a"]),
  href: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
