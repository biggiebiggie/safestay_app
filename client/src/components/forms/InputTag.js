import React, { Component } from "react";
import classnames from "classnames";

// Styles
import styles from "./InputTag.module.css";

export default class InputTag extends Component {
  state = {
    inputID: "input-" + Math.floor(Math.random() * 100000)
  };

  render() {
    const {
      props: {
        label,
        name,
        name2,
        type,
        onChange,
        value,
        checked
      },
      state: {
        inputID
      }
    } = this;

    const containerClasses = classnames(
      name2 && styles.doubleInput,
      styles.inputContainer
    );

    return (
      <div className={containerClasses}>
        <label className={styles.label} htmlFor={inputID}>
          {label}
        </label>
        <input
          className={styles.input}
          type={type}
          id={inputID}
          name={name}
          value={value}
          checked={checked}
          onChange={event => (onChange ? onChange(event) : null)}
        />
        {name2 &&
          <input
            className={styles.input}
            type={type}
            name={name2}
            onChange={event => (onChange ? onChange(event) : null)}
          />}
      </div>
    );
  }
}

export class TextareaTag extends Component {
  state = {
    textareaID: "textarea-" + Math.floor(Math.random() * 100000)
  };
  render() {
    const { props: { label, name }, state: { textareaID } } = this;

    const containerClasses = classnames(styles.inputContainer, styles.tall);

    return (
      <div className={containerClasses}>
        <label className={styles.label} htmlFor={textareaID}>
          {label}
        </label>
        <textarea className={styles.input} id={textareaID} name={name} />
      </div>
    );
  }
}
