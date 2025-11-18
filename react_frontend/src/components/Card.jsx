import React, { forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.css";

/**
 * PUBLIC_INTERFACE
 * Advanced Card component: supports variant, interactive, selectable (toggle), disabled, as-prop with tag, header/title/subtitle/footer/media/actions slots,
 * size (sm|md|lg), accessible roles/states, and robust keyboard/focus handling for buttons/links.
 *
 * @param {object} props
 * @param {string} [variant='default'] 'default' | 'outlined' | 'elevated' - Card visual style
 * @param {boolean} [interactive] - Renders as a clickable card with visual ring and keyboard support
 * @param {boolean} [selected] - Marks card as selected (aria-pressed for toggleable cards)
 * @param {boolean} [disabled] - Visually and functionally disables interaction
 * @param {string} [as='section'] - Underlying element: div, section, article, or 'a'
 * @param {string} [href] - Used when 'as' is 'a'
 * @param {string} [rel] - Rel attribute for 'a'
 * @param {string} [target] - Target attribute for 'a'
 * @param {string} [size='md'] - 'sm' | 'md' | 'lg', controls padding/font
 * @param {React.ReactNode} [header] - Slot for header/top content (overrides title/subtitle/actions if provided)
 * @param {string|React.ReactNode} [title] - Short card heading (in header slot if any)
 * @param {string|React.ReactNode} [subtitle] - Subtitle in header slot
 * @param {React.ReactNode} [actions] - Additional action(s) in header slot
 * @param {React.ReactNode} [media] - Top media (image, avatar, etc)
 * @param {React.ReactNode} [footer] - Footer content
 * @param {React.ReactNode} [children] - Card main content/body
 * @param {string} [className] - Additional style classes
 * @param {object} [rest] - Extra props
 */
const Card = forwardRef(function Card(props, ref) {
  const {
    children,
    variant = "default",
    interactive = false,
    selected = false,
    disabled = false,
    as = "section",
    href,
    rel,
    target,
    size = "md",
    header,
    title,
    subtitle,
    actions,
    media,
    footer,
    className = "",
    tabIndex,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  // Decide tag and role
  let Element = as;
  let isButtonLike = interactive || typeof onClick === "function";
  let isAnchor = as === "a" || (as === "div" && href);
  let isDisabled = !!disabled;
  let isSelectable = typeof selected === "boolean";
  let tabIndexProp = tabIndex;
  let ariaProps = {};

  // If anchor requested via href but as not set, coerce
  let finalHref = isAnchor ? href : undefined;
  if (finalHref && Element !== "a") Element = "a";

  // Accessibility role logic
  ariaProps["aria-disabled"] = isDisabled ? true : undefined;
  if (isSelectable) {
    ariaProps["aria-pressed"] = !!selected;
  }
  if (isButtonLike) ariaProps.role = "button";

  // Keyboard tabIndex: only include if interactive
  if (isDisabled) {
    tabIndexProp = -1;
  } else if (typeof tabIndex === "number") {
    tabIndexProp = tabIndex;
  } else if (isButtonLike || isAnchor) {
    tabIndexProp = 0;
  }

  // Compose card class list
  const cardClass = [
    styles.card,
    styles[`variant__${variant}`] || (variant !== "default" ? styles.variant__default : undefined),
    styles[`size__${size}`] || "",
    isButtonLike ? styles.interactive : "",
    isSelectable && selected ? styles.selected : "",
    isDisabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Click handler (no-op if disabled)
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (isButtonLike && typeof onClick === "function") {
      onClick(e);
    }
  };

  // Keyboard (Enter/Space fires click for button-like/anchor)
  const handleKeyDown = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (typeof onKeyDown === "function") onKeyDown(e);
    if (!isButtonLike && !isAnchor) return;
    if (
      (e.key === "Enter") ||
      (e.key === " " && isButtonLike)
    ) {
      e.preventDefault();
      if (ref && typeof ref.current?.click === "function") ref.current.click();
      else handleClick(e);
    }
  };

  // Prop composition for anchor tag
  let anchorSafeRel = rel;
  if (isAnchor && target === "_blank") {
    anchorSafeRel = rel || "noopener noreferrer";
  }

  // Final props to spread to the rendered element
  const elementProps = {
    ...rest,
    ref,
    className: cardClass,
    tabIndex: tabIndexProp,
    ...(isButtonLike ? { onClick: handleClick, onKeyDown: handleKeyDown } : {}),
    ...(isAnchor
      ? {
          href: isDisabled ? undefined : href,
          rel: anchorSafeRel,
          target: target,
          role: isButtonLike ? "button" : undefined,
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          draggable: false,
        }
      : {}),
    ...ariaProps,
    "aria-selected": isSelectable ? !!selected : undefined,
  };

  // --- Render: header/media/body/footer composition ---
  // If header slot is provided, render it fully
  const headerNode = header ? (
    <div className={styles.header}>{header}</div>
  ) : title || subtitle || actions ? (
    <div className={styles.header}>
      {title && <div className={styles.title}>{title}</div>}
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  ) : null;

  return (
    <Element {...elementProps} data-variant={variant} data-interactive={!!isButtonLike} data-disabled={!!isDisabled}>
      {media && <div className={styles.media}>{media}</div>}
      {headerNode}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Element>
  );
});

Card.displayName = "Card";

// PUBLIC_INTERFACE
Card.propTypes = {
  variant: PropTypes.oneOf(["default", "outlined", "elevated"]),
  interactive: PropTypes.bool,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  as: PropTypes.oneOf(["div", "section", "article", "a"]),
  href: PropTypes.string,
  rel: PropTypes.string,
  target: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  header: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  media: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default Card;
