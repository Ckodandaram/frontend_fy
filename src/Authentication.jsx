import React from "react";
import styles from "./authentication.module.css";
import AuthBox from "./Components/Authentication/AuthBox";


export default function Authentication() {
  return (
    <center className={styles.authentication}>
      <AuthBox />
    </center>
  );
}