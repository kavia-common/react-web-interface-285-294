import React, { forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

/**
 * PUBLIC_INTERFACE
 * Enhanced, accessible Button component for React.
 * Supports: variants, sizes, compact tokens, icon alignment, link visual style, improved focus, aria-label forwarding, autoFocus,
 * safe anchor handling, aria-busy when loading, disabled/loading distinction, data-state attributes, and backward-compatible API.
 *
 * @param {string} variant - 'primary'|'secondary'|'outline'|'ghost'|'danger'|'link' (visual only) - default: "primary"
 * @param {string} size - 'sm'|'md'|'lg'|'compact'
 * @param {boolean} loading - Show spinner and disable interaction
 * @param {boolean} disabled - Disable interaction
 * @param {boolean} fullWidth - Expand to container width
 * @param {React.ReactNode} startIcon - Icon at start of button
 * @param {React.ReactNode} endIcon - Icon at end of button
 * @param {string} as - 'button'|'a'
 * @param {string} href - Link target if as='a'
 * @param {string} type - Button type if as='button' (button|submit|reset)
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional className
 * @param {React.ReactNode} children - Button content
 * @param {string} ariaLabel - aria-label for accessibility; forwarded to root
 * @param {boolean} autoFocus - If true, autofocuses button on mount
 *
 * Usage notes:
 * - aria-label is forwarded so users can label icon-only or ambiguous buttons
 * - autoFocus prop will focus button/link on mount (when not loading/disabled)
 * - Use variant="link" for a button matching link style (does not affect semantics)
 */

const Button = forwardRef(function Button(
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
    "aria-label": ariaLabel,
    autoFocus = false,
    ...rest
  },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;

  // Handle autoFocus prop
  useEffect(() => {
    if (
      autoFocus &&
      ref &&
      typeof ref === "object" &&
      ref.current &&
      !(disabled || loading)
    ) {
      ref.current.focus();
    }
  }, [autoFocus, ref, disabled, loading]);

  const isLink = as === "a";
  const isCompact = size === "compact";
  // 'link' variant: visual only, semantics do NOT change (button by default)
  const isLinkVisual = variant === "link";
  const isDisabled = !!disabled || !!loading;

  // Accessible label
  const mergedAriaLabel = ariaLabel || rest["ariaLabel"];
  // Set data-state and data-loading for finer CSS hooks
  const dataAttrs = {
    "data-variant": variant,
    "data-size": size,
    "data-loading": !!loading ? "true" : undefined,
    "data-disabled": isDisabled ? "true" : undefined,
    "data-state": isDisabled
      ? "disabled"
      : loading
      ? "loading"
      : undefined,
  };

  // ARIA attributes: always set role=button for links; aria-busy during loading
  const ariaProps = {
    "aria-label": mergedAriaLabel,
    "aria-disabled": isDisabled ? true : undefined,
    "aria-busy": loading ? true : undefined,
  };

  // Compose CSS class tokens, compact/visual mapping
  const btnClass = [
    styles.button,
    styles[isLinkVisual ? "link" : variant] || styles.primary, // treat unknown as primary
    isCompact ? styles.compact : styles[size] || styles.md,
    fullWidth ? styles.fullWidth : "",
    isDisabled ? styles.disabled : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Shared handler: prevents interaction if disabled or loading
  function handleClick(e) {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      return;
    }
    if (typeof onClick === "function") onClick(e);
  }

  // Forward tabIndex: anchor needs -1 if disabled/loading for a11y
  const computedTabIndex = isDisabled ? -1 : rest.tabIndex ?? 0;

  // Safer external link handling for as='a' and target='_blank'
  let relProp = rest.rel;
  if (isLink && rest.target === "_blank") {
    relProp = relProp || "noopener noreferrer";
  }

  // Forward relevant props
  const commonProps = {
    ref,
    className: btnClass,
    tabIndex: computedTabIndex,
    ...ariaProps,
    ...dataAttrs,
    ...rest,
    "aria-disabled": isDisabled, // always reflect computed disabled
    // Note: autoFocus is not passed to element because we handle it manually for links.
    onClick: handleClick,
  };
  if (mergedAriaLabel) {
    commonProps["aria-label"] = mergedAriaLabel;
  }

  // Ensure role="button" for links for accessibility
  if (isLink) {
    commonProps.role = "button";
    commonProps.href = isDisabled ? undefined : href;
    commonProps.draggable = false;
    commonProps.rel = relProp;
    if (rest.target) {
      commonProps.target = rest.target;
    }
    // When anchor is disabled or loading, prevent tab focus
    commonProps.tabIndex = isDisabled ? -1 : rest.tabIndex ?? 0;
    // Also set onKeyDown: ENTER/SPACE fire click unless disabled
    commonProps.onKeyDown = (e) => {
      if (isDisabled) {
        e.preventDefault();
        return false;
      }
      // Let browser handle
      if (typeof rest.onKeyDown === "function") rest.onKeyDown(e);
    };
  }

  // Icon sizing map (align consistently with button height)
  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    compact: 14,
  };
  const iconEmMap = {
    sm: "1.15em",
    md: "1.28em",
    lg: "1.4em",
    compact: "1em",
  };
  const finalIconSize = iconSizeMap[size] || 20;
  const finalIconEm = iconEmMap[size] || "1.28em";

  // Styling for icon slot: always center, align, auto-size
  const iconSlotStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: finalIconEm,
    height: finalIconEm,
    minWidth: finalIconEm,
    minHeight: finalIconEm,
    fontSize: finalIconEm,
    verticalAlign: "middle",
    pointerEvents: "none",
  };

  // Compose children with icon slots (icon always present in space for alignment)
  const content = (
    <>
      {/* Start Icon */}
      {startIcon && (
        <span
          className={styles.startIcon}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="start"
        >
          {React.cloneElement(
            startIcon,
            {
              width: startIcon.props.width || finalIconSize,
              height: startIcon.props.height || finalIconSize,
              focusable: "false",
              "aria-hidden": "true",
            }
          )}
        </span>
      )}
      {/* Loading Spinner */}
      {loading && (
        <span
          className={styles.spinnerWrapper}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="spinner"
        >
          <span className={styles.spinner} />
        </span>
      )}
      {/* Children always shown; opacity is reduced when loading */}
      <span
        className={loading ? styles.loadingText : undefined}
        data-slot="label"
        style={{ transition: "opacity 0.15s linear" }}
      >
        {children}
      </span>
      {/* End Icon */}
      {endIcon && (
        <span
          className={styles.endIcon}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="end"
        >
          {React.cloneElement(
            endIcon,
            {
              width: endIcon.props.width || finalIconSize,
              height: endIcon.props.height || finalIconSize,
              focusable: "false",
              "aria-hidden": "true",
            }
          )}
        </span>
      )}
    </>
  );

  // Render as anchor (link) or button
  if (isLink) {
    return (
      <a {...commonProps}>{content}</a>
    );
  }
  // Button: disabled attribute set only if native <button>
  return (
    <button
      {...commonProps}
      type={type}
      disabled={isDisabled}
      // tabIndex, aria-label, autoFocus, etc., all handled above
    >
      {content}
    </button>
  );
});

// PUBLIC_INTERFACE
Button.displayName = "Button";

// PUBLIC_INTERFACE
Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "link", // link (inherited from html <a>)
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "compact"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.element, // now expect React element for better sizing
  endIcon: PropTypes.element,
  as: PropTypes.oneOf(["button", "a"]),
  href: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  "aria-label": PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default Button;
