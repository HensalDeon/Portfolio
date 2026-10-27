"use client";

import emailjs from "@emailjs/browser";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const config = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please add your name.";
  if (!values.email.trim()) errors.email = "Please add your email.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "That email looks off.";
  if (!values.message.trim()) errors.message = "Please add a short message.";
  return errors;
}

const fieldClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-foreground placeholder:text-foreground/45 transition-[border-color,box-shadow] focus:border-foreground focus:shadow-[inset_0_-1px_0_var(--foreground)] focus:outline-none aria-[invalid=true]:border-danger";

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: Field) => (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.currentTarget.value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blur = (field: Field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(nextErrors).length > 0) return;

    if (!config.serviceId || !config.templateId || !config.publicKey) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: values.name.trim(),
          from_email: values.email.trim(),
          message: values.message.trim(),
          to_name: site.name,
        },
        { publicKey: config.publicKey },
      );
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
      setTouched({});
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const showError = (field: Field) => touched[field] && errors[field];

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <FieldWrapper id="name" label="Name" error={showError("name")}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onInput={update("name")}
            onBlur={blur("name")}
            aria-invalid={Boolean(showError("name"))}
            aria-describedby={showError("name") ? "name-error" : undefined}
            className={fieldClass}
          />
        </FieldWrapper>
        <FieldWrapper id="email" label="Email" error={showError("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onInput={update("email")}
            onBlur={blur("email")}
            aria-invalid={Boolean(showError("email"))}
            aria-describedby={showError("email") ? "email-error" : undefined}
            className={fieldClass}
          />
        </FieldWrapper>
      </div>
      <FieldWrapper id="message" label="Message" error={showError("message")}>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="What are you working on?"
          value={values.message}
          onInput={update("message")}
          onBlur={blur("message")}
          aria-invalid={Boolean(showError("message"))}
          aria-describedby={showError("message") ? "message-error" : undefined}
          className={cn(fieldClass, "resize-y")}
        />
      </FieldWrapper>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Magnetic>
          <Button type="submit" disabled={status === "sending"} size="lg">
            {status === "sending" ? "Sending…" : "Send message"}
          </Button>
        </Magnetic>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "sent" && "Thanks, your message is on its way."}
          {status === "error" && (
            <span className="font-medium text-danger">
              Something went wrong. Message me on LinkedIn instead.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function FieldWrapper({
  id,
  label,
  error,
  children,
}: {
  id: Field;
  label: string;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-eyebrow">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
