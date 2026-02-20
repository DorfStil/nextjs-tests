"use client";

import {
  type ButtonHTMLAttributes,
  type ComponentType,
  type FormEvent,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  useEffect,
  useMemo,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SCROLL_POSITION_STORAGE_KEY = "reviews_scroll_position";

const INPUT_BASE_CLASSNAME = "rounded border border-gray-300 px-3 py-2";
const FIELD_BASE_CLASSNAME = "flex flex-col gap-1 text-sm";

type FilterPatch = Record<string, string | null | undefined>;

export type ActiveFilterEntry = {
  key: string;
  value: string;
};

export type FilterController = {
  paramsStateKey: string;
  readParam: (key: string) => string;
  setValues: (values: FilterPatch) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  clearFilters: () => void;
  removeFilter: (key: string) => void;
  activeFilters: ActiveFilterEntry[];
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export function useFiltersController(managedParams: readonly string[]): FilterController {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsStateKey = searchParams.toString();

  const readParam = (key: string) => searchParams.get(key) ?? "";

  const pushWithParams = (next: URLSearchParams) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SCROLL_POSITION_STORAGE_KEY, String(window.scrollY));
    }

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem(SCROLL_POSITION_STORAGE_KEY);
    if (!saved) return;

    const nextY = Number(saved);
    if (Number.isNaN(nextY)) return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: nextY, left: 0, behavior: "auto" });
      sessionStorage.removeItem(SCROLL_POSITION_STORAGE_KEY);
    });
  }, [paramsStateKey]);

  const setValues = (values: FilterPatch) => {
    const next = new URLSearchParams(searchParams.toString());

    for (const [key, rawValue] of Object.entries(values)) {
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }

    pushWithParams(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const next = new URLSearchParams(searchParams.toString());

    for (const key of managedParams) {
      next.delete(key);
    }

    for (const key of managedParams) {
      const rawValue = formData.get(key);
      if (typeof rawValue !== "string") continue;

      const value = rawValue.trim();
      if (!value) continue;

      next.set(key, value);
    }

    pushWithParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    for (const key of managedParams) {
      next.delete(key);
    }
    pushWithParams(next);
  };

  const removeFilter = (key: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete(key);
    pushWithParams(next);
  };

  const activeFilters = useMemo(
    () =>
      managedParams
        .map((key) => ({ key, value: (searchParams.get(key) ?? "").trim() }))
        .filter((item) => item.value.length > 0),
    [managedParams, paramsStateKey, searchParams],
  );

  return {
    paramsStateKey,
    readParam,
    setValues,
    handleSubmit,
    clearFilters,
    removeFilter,
    activeFilters,
  };
}

type InputUi = ComponentType<InputHTMLAttributes<HTMLInputElement>>;
type SelectUi = ComponentType<SelectHTMLAttributes<HTMLSelectElement>>;
type ButtonUi = ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;

const DefaultInput: InputUi = ({ className, ...props }) => (
  <input {...props} className={cn(INPUT_BASE_CLASSNAME, className)} />
);

const DefaultSelect: SelectUi = ({ className, ...props }) => (
  <select {...props} className={cn(INPUT_BASE_CLASSNAME, className)} />
);

const DefaultButton: ButtonUi = ({ className, ...props }) => (
  <button {...props} className={className} />
);

type FieldLayoutProps = {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  children: React.ReactNode;
};

function FieldLayout({
  label,
  containerClassName,
  labelClassName,
  children,
}: FieldLayoutProps) {
  return (
    <label className={cn(FIELD_BASE_CLASSNAME, containerClassName, labelClassName)}>
      {label}
      {children}
    </label>
  );
}

export type SomeFilterProps = {
  name: string;
  label: string;
  value: string;
  ui?: InputUi;
  containerClassName?: string;
  inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue">;

export function SomeFilter({
  name,
  label,
  value,
  ui,
  containerClassName,
  inputClassName,
  className,
  ...props
}: SomeFilterProps) {
  const Input = ui ?? DefaultInput;

  return (
    <FieldLayout label={label} containerClassName={containerClassName}>
      <Input
        {...props}
        name={name}
        defaultValue={value}
        className={cn(className, inputClassName)}
      />
    </FieldLayout>
  );
}

export type FilterOption = {
  value: string;
  label: string;
};

export type SelectFilterProps = {
  name: string;
  label: string;
  value: string;
  options: FilterOption[];
  ui?: SelectUi;
  containerClassName?: string;
  selectClassName?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "defaultValue" | "children">;

export function SelectFilter({
  name,
  label,
  value,
  options,
  ui,
  containerClassName,
  selectClassName,
  className,
  ...props
}: SelectFilterProps) {
  const Select = ui ?? DefaultSelect;

  return (
    <FieldLayout label={label} containerClassName={containerClassName}>
      <Select
        {...props}
        name={name}
        defaultValue={value}
        className={cn(className, selectClassName)}
      >
        {options.map((option) => (
          <option key={option.value || "__empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldLayout>
  );
}

export type FilterButtonProps = {
  ui?: ButtonUi;
  variant?: "primary" | "secondary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function FilterButton({
  ui,
  variant = "secondary",
  className,
  type = "button",
  ...props
}: FilterButtonProps) {
  const Button = ui ?? DefaultButton;
  const variantClassName =
    variant === "primary"
      ? "rounded bg-black px-4 py-2 text-white hover:opacity-90"
      : variant === "ghost"
        ? "rounded border border-transparent px-3 py-1 text-sm hover:border-gray-200 hover:bg-gray-100"
        : "rounded border border-gray-300 px-4 py-2 hover:bg-gray-100";

  return <Button {...props} type={type} className={cn(variantClassName, className)} />;
}

type ActiveFiltersProps = {
  entries: ActiveFilterEntry[];
  labels?: Record<string, string>;
  onRemove: (key: string) => void;
  ui?: ButtonUi;
  emptyText?: string;
};

export function ActiveFilters({
  entries,
  labels,
  onRemove,
  ui,
  emptyText = "Фильтры не выбраны",
}: ActiveFiltersProps) {
  const Button = ui ?? DefaultButton;

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map((entry) => (
        <Button
          key={entry.key}
          type="button"
          onClick={() => onRemove(entry.key)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
          title="Удалить фильтр"
        >
          {(labels?.[entry.key] ?? entry.key) + ": " + entry.value + " ×"}
        </Button>
      ))}
    </div>
  );
}
