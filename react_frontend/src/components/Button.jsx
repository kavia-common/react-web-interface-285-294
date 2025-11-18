import React from "react";
import styles from "./Button.module.css";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
function Button({ variant = "primary", disabled = false, children, ...rest }) {
  /**
   * A theme button with variants and accessibility.
   * @param {string} variant - 'primary' | 'outline'
   * @param {boolean} disabled - disabled state
   * @param {React.ReactNode} children - button content
   */
  return (
    <button
      className={`${styles.button} ${styles[variant]}${disabled ? " " + styles.disabled : ""}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "outline"]),
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
