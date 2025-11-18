import React, { forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

/**
 * PUBLIC_INTERFACE
 * Enhanced, accessible Button component for React.
 * Supports variants, sizes, link visual style, loading, disabled, loadingSpinnerOnly, fullWidth,
 * start/end icons with alignment, as/href/type prop logic, autoFocus, aria-label forwarding, tooltip, and all a11y.
 *
 * @param {string}  [variant="primary"]     "primary"|"secondary"|"outline"|"ghost"|"danger"|"link" (visual only)
 * @param {string}  [size="md"]             "sm"|"md"|"lg"|"compact"
 * @param {boolean} [loading]               Show spinner and disable interaction
 * @param {boolean} [loadingSpinnerOnly]    If true, only spinner is shown and text visually hidden
 * @param {boolean} [disabled]              Disable interaction
 * @param {boolean} [fullWidth]             Expand to container width
 * @param {React.ReactNode} [startIcon]     Icon at start of button
 * @param {React.ReactNode} [endIcon]       Icon at end of button
 * @param {React.ReactNode} [children]      Button content (text/element)
 * @param {string} [as="button"]            'button' or 'a' (anchor)
 * @param {string} [href]                   Link target if as='a'
 * @param {string} [type="button"]          Button type if as='button' (button|submit|reset)
 * @param {Function} [onClick]              Click handler
 * @param {string} [className]              Additional className
 * @param {string} ["aria-label"]           aria-label for accessibility; forwarded to root
 * @param {boolean} [autoFocus]             If true, autofocuses button on mount
 * @param {string} [tooltip]                Optional tooltip (title/aria-describedby for accessibility)
 *
 * Usage notes:
 *  - aria-label is forwarded so users can label icon-only or ambiguous buttons.
 *  - autoFocus prop will focus button/link on mount (when not loading/disabled).
 *  - Use tooltip for visible+accessible tooltips. Adds title/aria-describedby.
 *  - type defaults to "button" for <button> to avoid accidental submits.
 */

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    loadingSpinnerOnly = false,
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
    tooltip,
    ...rest
  },
  forwardedRef
) {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;

  // Handle autoFocus prop on mount (focus if not disabled/loading)
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

  // Internal state checks
  const isLink = as === "a";
  const isCompact = size === "compact";
  const isLinkVisual = variant === "link";
  const isDisabled = !!disabled || !!loading;
  const showSpinnerOnly = !!loading && !!loadingSpinnerOnly;
  const showSpinner = !!loading;

  // Merge aria-label
  const mergedAriaLabel = ariaLabel || rest["ariaLabel"] || undefined;

  // Tooltip support: use title & aria-describedby on content
  const tooltipId = tooltip ? "button-tooltip-" + Math.random().toString(36).slice(2, 10) : undefined;

  // Data attributes for easier styling hooks
  const dataAttrs = {
    "data-variant": variant,
    "data-size": size,
    "data-loading": !!loading ? "true" : undefined,
    "data-disabled": isDisabled ? "true" : undefined,
    "data-state":
      isDisabled
        ? "disabled"
        : loading
        ? "loading"
        : undefined,
  };

  // ARIA props set
  const ariaProps = {
    "aria-label": mergedAriaLabel,
    "aria-disabled": isDisabled ? true : undefined,
    "aria-busy": loading ? true : undefined,
    ...(showSpinnerOnly && { "aria-live": "polite" }),
    ...(tooltip
      ? {
          "aria-describedby": tooltipId,
        }
      : {}),
  };

  // Compose CSS class tokens, compact/visual mapping
  const btnClass = [
    styles.button,
    styles[isLinkVisual ? "link" : variant] || styles.primary,
    isCompact ? styles.compact : styles[size] || styles.md,
    fullWidth ? styles.fullWidth : "",
    isDisabled ? styles.disabled : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Click handler: disables when loading/disabled
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
    // Note: autoFocus is not passed to element because we handle it manually for links.
    onClick: handleClick,
    ...(tooltip ? { title: tooltip } : {}),
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
    commonProps.tabIndex = isDisabled ? -1 : rest.tabIndex ?? 0;
    // Keyboard a11y for disabled anchor: block
    commonProps.onKeyDown = (e) => {
      if (isDisabled) {
        e.preventDefault();
        return false;
      }
      if (typeof rest.onKeyDown === "function") rest.onKeyDown(e);
    };
  }

  // Icon sizing: always align, scale with size tokens
  const iconSizeMap = { sm: 16, md: 20, lg: 24, compact: 14 };
  const iconEmMap = { sm: "1.15em", md: "1.28em", lg: "1.4em", compact: "1em" };
  const finalIconSize = iconSizeMap[size] || 20;
  const finalIconEm = iconEmMap[size] || "1.28em";
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
    lineHeight: "1em",
  };

  // Compose accessible text span, properly visually hide if spinnerOnly
  const LabelContent = (
    <span
      className={
        (loading ? styles.loadingText : "") +
        (showSpinnerOnly ? " " + styles.visuallyHidden : "")
      }
      data-slot="label"
      id={tooltipId}
      style={{
        transition: "opacity 0.15s linear",
        ...(showSpinnerOnly
          ? {
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clip: "rect(1px, 1px, 1px, 1px)",
              whiteSpace: "nowrap",
              padding: 0,
              border: 0,
            }
          : {}),
      }}
      aria-live={showSpinnerOnly ? "polite" : undefined}
      aria-atomic={showSpinnerOnly ? "true" : undefined}
    >
      {children}
    </span>
  );

  // Compose children with icon/label slots & loading spinner
  const content = (
    <>
      {startIcon && !showSpinnerOnly && (
        <span
          className={styles.startIcon}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="start"
        >
          {React.cloneElement(startIcon, {
            width: startIcon.props.width || finalIconSize,
            height: startIcon.props.height || finalIconSize,
            focusable: "false",
            "aria-hidden": "true",
          })}
        </span>
      )}
      {showSpinner && (
        <span
          className={styles.spinnerWrapper}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="spinner"
        >
          <span className={styles.spinner} />
        </span>
      )}
      {LabelContent}
      {endIcon && !showSpinnerOnly && (
        <span
          className={styles.endIcon}
          style={iconSlotStyle}
          aria-hidden="true"
          data-slot="end"
        >
          {React.cloneElement(endIcon, {
            width: endIcon.props.width || finalIconSize,
            height: endIcon.props.height || finalIconSize,
            focusable: "false",
            "aria-hidden": "true",
          })}
        </span>
      )}
    </>
  );

  // Render as <a> (anchor) or <button>
  if (isLink) {
    return <a {...commonProps}>{content}</a>;
  }
  // type always defaults to 'button' unless overridden
  return (
    <button
      {...commonProps}
      type={type || "button"}
      disabled={isDisabled}
    >
      {content}
    </button>
  );
});

// PUBLIC_INTERFACE
Button.displayName = "Button";

/**
 * PUBLIC_INTERFACE
 * Button prop types and documentation.
 */
Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "link"
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg", "compact"]),
  loading: PropTypes.bool,
  loadingSpinnerOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  as: PropTypes.oneOf(["button", "a"]),
  href: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  "aria-label": PropTypes.string,
  autoFocus: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default Button;
