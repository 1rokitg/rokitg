"use client";

import { useActionState } from "react";
import { authenticateInternal } from "@/app/(internal)/actions";
import styles from "./InternalLoginForm.module.scss";

export function InternalLoginForm() {
  const [state, formAction, pending] = useActionState(authenticateInternal, undefined);

  return (
    <div className={styles.wrap}>
      <form className={styles.card} action={formAction}>
        <span className={styles.badge}>Internal</span>
        <h1 className={styles.title}>RokitG internal dashboard</h1>
        <p className={styles.body}>This area is restricted to the team. Enter the password to continue.</p>
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          required
        />
        {state?.error && <span className={styles.error}>{state.error}</span>}
        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
