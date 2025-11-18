import React from "react";
import styles from "./Card.module.css";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
function Card({ children, as = "section", tabIndex = 0, ...rest }) {
  /**
   * A visual card container with shadow and hover.
   * @param {React.ReactNode} children - card content
   * @param {string} as - HTML tag to use, defaults to 'section'
   * @param {number} tabIndex - tab order, default 0 for accessibility
   */
  const Component = as;
  return (
    <Component className={styles.card} tabIndex={tabIndex} {...rest}>
      {children}
    </Component>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  tabIndex: PropTypes.number,
};

export default Card;
