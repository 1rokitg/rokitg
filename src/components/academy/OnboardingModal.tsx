"use client";

import { useState } from "react";
import { useLogin } from "@privy-io/react-auth";
import { FiCheck } from "react-icons/fi";
import styles from "./OnboardingModal.module.scss";

const ONBOARDED_KEY = "rokitg:academy:onboarded:v1";
const INTERESTS_KEY = "rokitg:academy:onboarding-interests:v1";

const INTEREST_OPTIONS = [
  { id: "fundamentos", label: "Fundamentos y primeros pasos" },
  { id: "metodo", label: "Método y organización" },
  { id: "trading", label: "Trading" },
  { id: "automatizaciones", label: "Automatizaciones" },
  { id: "comunidad", label: "Comunidad y networking" },
];

const STEP_COUNT = 3;

/**
 * A Discord-server-onboarding-style wizard shown once, right after a genuine
 * Privy signup (not on returning-user logins) — `isNewUser` is Privy's own
 * signal for that, so no backend flag is needed.
 */
export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useLogin({
    onComplete: ({ isNewUser }) => {
      if (!isNewUser) return;
      try {
        if (localStorage.getItem(ONBOARDED_KEY)) return;
      } catch {
        /* Storage can be unavailable. */
      }
      setStep(0);
      setSelected(new Set());
      setOpen(true);
    },
  });

  function finish() {
    setOpen(false);
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
      localStorage.setItem(INTERESTS_KEY, JSON.stringify([...selected]));
    } catch {
      /* Storage can be unavailable. */
    }
  }

  function toggleInterest(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Bienvenida a RokitG Academy">
      <div className={styles.modal}>
        <div className={styles.dots}>
          {Array.from({ length: STEP_COUNT }).map((_, index) => (
            <span key={index} className={`${styles.dot} ${index <= step ? styles.dotActive : ""}`} />
          ))}
        </div>

        {step === 0 && (
          <div className={styles.step}>
            <span className={styles.badge}>R</span>
            <h2 className={styles.title}>¡Bienvenido a RokitG Academy!</h2>
            <p className={styles.body}>
              Te has unido a un espacio para aprender, practicar y avanzar a tu ritmo. Antes de entrar,
              cuéntanos un poco qué buscas para poder mostrarte lo más relevante.
            </p>
            <button type="button" className={styles.primaryButton} onClick={() => setStep(1)}>
              Empezar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className={styles.step}>
            <h2 className={styles.title}>¿Qué te interesa aprender?</h2>
            <p className={styles.body}>Elige todo lo que quieras — puedes cambiarlo más adelante.</p>
            <div className={styles.chipGrid}>
              {INTEREST_OPTIONS.map((option) => {
                const active = selected.has(option.id);
                return (
                  <button
                    type="button"
                    key={option.id}
                    className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                    onClick={() => toggleInterest(option.id)}
                    aria-pressed={active}
                  >
                    {active && <FiCheck aria-hidden="true" />}
                    {option.label}
                  </button>
                );
              })}
            </div>
            <button type="button" className={styles.primaryButton} onClick={() => setStep(2)}>
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <span className={styles.badge}>
              <FiCheck aria-hidden="true" />
            </span>
            <h2 className={styles.title}>Todo listo.</h2>
            <p className={styles.body}>
              Tu cuenta está creada y tu progreso ya se guarda de verdad. Explora los cursos y empieza
              cuando quieras.
            </p>
            <button type="button" className={styles.primaryButton} onClick={finish}>
              Entrar a la academia
            </button>
          </div>
        )}

        {step < 2 && (
          <button type="button" className={styles.skip} onClick={finish}>
            Saltar
          </button>
        )}
      </div>
    </div>
  );
}
