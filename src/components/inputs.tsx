"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { FormProvider, useForm, UseFormRegister } from "react-hook-form";

interface InputProps {
  register: UseFormRegister<FormData>;
  error?: string;
  name: keyof FormData;
}

const CheckboxInput = React.memo(({ register, error, name }: InputProps) => {
  return (
    <div className="mb-4">
      <label
        className="flex items-center space-x-2 text-gray-700"
        htmlFor="agree"
      >
        <input
          id={``}
          type="checkbox"
          // ? Should be dynamic.
          {...register("agree")}
          className={clsx(
            "h-4 w-4 rounded border-gray-300 text-blue-600",
            error && "border-red-500",
          )}
        />
        <span>Agree to terms</span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});
CheckboxInput.displayName = "CheckboxInput";

const TextInput = React.memo(({ register, error }: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="text" className="mb-1 block text-gray-700">
        Your text
      </label>
      <input
        id="text"
        // ? Should be dynamic.
        {...register("text")}
        type="text"
        className={clsx(
          "w-full rounded border px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
        )}
      />
      {error && <p className="w-100 mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});
TextInput.displayName = "TextInput";

const createSchema = (minLength: number) =>
  z.object({
    agree: z.boolean(),
    text: z
      .string()
      .min(1, "Text is required")
      // Here we use the dynamic minLength prop
      .min(minLength, `Text must be at least ${minLength} characters long`)
      .refine(
        (val) =>
          // Example: if minLength is high, maybe you also impose a pattern
          /^.*(?=.{5,})(?=.*[A-Z])(?=.*\d).*$/g.test(val),
        `Text must include at least one uppercase letter and one number`,
      ),
  });

export type FormData = z.infer<ReturnType<typeof createSchema>>;

// todo: Try superRefine.
// todo: Try validation on props.
export const FormComponent: React.FC = () => {
  const schema = createSchema(5);
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      agree: false,
      text: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    console.log("Form Data:", data);
  });

  return (
    <div className="mx-auto w-full max-w-md rounded bg-white p-6 shadow">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <CheckboxInput name= register={register} error={errors.agree?.message} />
          <TextInput register={register} error={errors.text?.message} />
          <button
            type="submit"
            className={clsx(
              "mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
            )}
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
