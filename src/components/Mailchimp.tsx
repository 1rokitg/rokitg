"use client";

import { mailchimp, newsletter } from "@/resources";
import { trackWhopEvent, WHOP_EVENTS } from "@/lib/whop";
import {
  Button,
  Heading,
  Input,
  Text,
  Background,
  Column,
  Row,
} from "@once-ui-system/core";
import { Opacity as opacity, SpacingToken } from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";
import { EmbeddedCheckout } from "./checkout";

export interface VisitorData {
  identifier: string;
  email: string;
  timestamp: string;
  userAgent: string;
  language: string;
  languages: string;
  platform: string;
  screen: string;
  ip: string;
  referrer: string;
  page: string;
  timezone: string;
}

export interface Lead {
  identifier: string;
  email: string;
  timestamp: string;
  userAgent: string;
  language: string;
  languages: string[];
  platform: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

function validateEmail(value: string): boolean {
  const email = normalizeEmail(value);

  return email.length > 0 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

export const Mailchimp: React.FC<React.ComponentProps<typeof Column>> = ({
  ...flex
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // This data belongs to the checkout attempt, so it must survive
  // React re-renders.
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    setEmail(nextValue);

    if (isTouched) {
      const normalized = normalizeEmail(nextValue);

      if (!normalized) {
        setError("Please enter your email address.");
      } else if (!validateEmail(normalized)) {
        setError("Please enter a valid email address.");
      } else {
        setError("");
      }
    }
  };

  const handleEmailBlur = () => {
    setIsTouched(true);

    const normalized = normalizeEmail(email);

    if (!normalized) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
  };

  const handleCloseCheckout = () => {
    setIsCheckingOut(false);

    // Keep the validated email and visitor data in state so that
    // reopening checkout can use the same canonical submission.
    //
    // We intentionally don't clear visitorData here.
    // The next successful submission will replace it.
  };

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isCheckingOut) {
      return;
    }

    setIsTouched(true);

    const submittedEmail = normalizeEmail(email);

    // Keep the visible input canonical.
    setEmail(submittedEmail);

    if (!submittedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(submittedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const newVisitorData: VisitorData = {
        identifier: crypto.randomUUID(),
        email: submittedEmail,
        timestamp: new Date().toISOString(),

        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        languages: window.navigator.languages.join(","),
        platform: window.navigator.platform,

        screen: JSON.stringify({
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
        }),

        ip: "",
        referrer: document.referrer,
        page: window.location.href,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead: newVisitorData,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to push lead: ${response.status} ${response.statusText}`,
        );
      }

      /*
       * IMPORTANT:
       *
       * Store the exact visitor data that was successfully submitted.
       * This survives the React re-render caused by setIsCheckingOut().
       */
      setVisitorData(newVisitorData);
      trackWhopEvent(WHOP_EVENTS.newsletterSubmitted, {
        source: "newsletter", submission_id: newVisitorData.identifier, interaction: "submit",
      });

      setIsCheckingOut(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.error("Lead submission failed:", err);

      setError("Something went wrong. Please check your email and try again.");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      setIsSubmitting(false);
    }
  };

  if (newsletter.display === false) {
    return null;
  }

  return (
    <>
      <Column
        id="contact-form"
        style={{
          scrollMarginTop: "100px",
        }}
        overflow="hidden"
        fillWidth
        padding="xl"
        radius="l"
        marginBottom="m"
        horizontal="center"
        align="center"
        background="surface"
        border="neutral-alpha-weak"
        {...flex}
      >
        <Background
          top="0"
          position="absolute"
          mask={{
            x: mailchimp.effects.mask.x,
            y: mailchimp.effects.mask.y,
            radius: mailchimp.effects.mask.radius,
            cursor: mailchimp.effects.mask.cursor,
          }}
          gradient={{
            display: mailchimp.effects.gradient.display,
            opacity: mailchimp.effects.gradient.opacity as opacity,
            x: mailchimp.effects.gradient.x,
            y: mailchimp.effects.gradient.y,
            width: mailchimp.effects.gradient.width,
            height: mailchimp.effects.gradient.height,
            tilt: mailchimp.effects.gradient.tilt,
            colorStart: mailchimp.effects.gradient.colorStart,
            colorEnd: mailchimp.effects.gradient.colorEnd,
          }}
          dots={{
            display: mailchimp.effects.dots.display,
            opacity: mailchimp.effects.dots.opacity as opacity,
            size: mailchimp.effects.dots.size as SpacingToken,
            color: mailchimp.effects.dots.color,
          }}
          grid={{
            display: mailchimp.effects.grid.display,
            opacity: mailchimp.effects.grid.opacity as opacity,
            color: mailchimp.effects.grid.color,
            width: mailchimp.effects.grid.width,
            height: mailchimp.effects.grid.height,
          }}
          lines={{
            display: mailchimp.effects.lines.display,
            opacity: mailchimp.effects.lines.opacity as opacity,
            size: mailchimp.effects.lines.size as SpacingToken,
            thickness: mailchimp.effects.lines.thickness,
            angle: mailchimp.effects.lines.angle,
            color: mailchimp.effects.lines.color,
          }}
        />

        <Column maxWidth="xs" horizontal="center">
          <Heading marginBottom="s" variant="display-strong-xs">
            {newsletter.title}
          </Heading>

          <Text
            wrap="balance"
            marginBottom="l"
            variant="body-default-l"
            onBackground="neutral-weak"
          >
            {newsletter.description}
          </Text>
        </Column>

        <form
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted");
          }}
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          noValidate
        >
          <Row
            id="mc_embed_signup_scroll"
            fillWidth
            maxWidth={24}
            s={{ direction: "column" }}
            gap="8"
          >
            <Input
              id="mce-EMAIL"
              name="EMAIL"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              errorMessage={error}
              disabled={isSubmitting || isCheckingOut}
            />

            <div style={{ display: "none" }}>
              <input
                type="checkbox"
                readOnly
                name="group[3492][1]"
                id="mce-group[3492]-3492-0"
                value=""
                checked
              />
            </div>

            <div id="mce-responses" className="clearfalse">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              />

              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              />
            </div>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-5000px",
              }}
            >
              <input
                type="text"
                readOnly
                name="b_c1a5a210340eb6c7bff33b2ba_0462d244aa"
                tabIndex={-1}
                value=""
              />
            </div>

            <div className="clear">
              <Row height="48" vertical="center">
                <Button
                  id="mc-embedded-subscribe"
                  value="Subscribe"
                  type="submit"
                  disabled={isSubmitting || isCheckingOut}
                  size="m"
                  fillWidth
                >
                  {isSubmitting ? "Continue..." : "Subscribe"}
                </Button>
              </Row>
            </div>
          </Row>
        </form>
      </Column>

      {isCheckingOut && (
        <EmbeddedCheckout open={true} onClose={handleCloseCheckout} />
      )}
    </>
  );
};
