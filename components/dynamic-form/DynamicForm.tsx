// components/dynamic-form/DynamicForm.tsx

import React, { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@components/ui/alert/Alert"
import { Loader } from "lucide-react"
import { useTranslations } from "@hooks/useTranslations"
import { useToast } from "@components/ui/toast"
import type { DynamicFormProps, FieldValue, FormFieldConfig } from "./forms"
import { useMobile } from "@hooks/useMobile"

const DynamicForm = <T extends Record<string, FieldValue>>({
  config,
  initialData,
  onSubmit,
  onClose,
  title,
  cancelButton,
  saveButton,
  successMessage,
  errorMessage,
}: DynamicFormProps<T>) => {
  const { t } = useTranslations()
  const { toast } = useToast()
  const [formData, setFormData] = useState<T>(
    () => (initialData as T) || ({} as T)
  )
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const isMobile = useMobile()

  useEffect(() => {
    if (initialData) {
      setFormData(initialData as T)
    } else {
      const defaultValues = config.fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.defaultValue || "",
        }),
        {}
      )
      setFormData(defaultValues as T)
    }
  }, [initialData, config.fields])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateField = (field: FormFieldConfig): string | null => {
    const value = formData[field.name as keyof T]
    if (!field.validations) return null

    for (const rule of field.validations) {
      switch (rule.type) {
        case "required":
          if (
            value === null ||
            value === undefined ||
            (typeof value === "string" && !value.trim())
          ) {
            return rule.message
          }
          break
        case "email":
          if (
            value &&
            typeof value === "string" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            return rule.message
          }
          break
        case "pattern":
          if (
            value &&
            typeof value === "string" &&
            rule.value &&
            !new RegExp(rule.value.toString()).test(value)
          ) {
            return rule.message
          }
          break
        case "custom":
          if (rule.validator && !rule.validator(value)) {
            return rule.message
          }
          break
      }
    }
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    config.fields.forEach((field) => {
      const error = validateField(field)
      if (error) {
        newErrors[field.name as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsLoading(true)
        await onSubmit(formData)
        toast({
          variant: "success",
          title: t(successMessage),
        })
        onClose()
      } catch (error) {
        console.error(error)
        toast({
          variant: "destructive",
          title: t(errorMessage),
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      name: field.name,
      value: (formData[field.name as keyof T] ?? "") as string,
      onChange: handleChange,
      disabled: isLoading || field.disabled,
      placeholder: field.placeholder,
      className: `w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
        errors[field.name as keyof T] ? "border-red-500" : "border-gray-300"
      } ${isLoading || field.disabled ? "bg-gray-100" : ""}`,
    }
    return (
      <div
        key={field.name}
        className={`
          ${isMobile ? "w-full mb-4" : ""}
        `}
        style={
          !isMobile
            ? {
                gridColumn: field.grid?.colSpan
                  ? `span ${field.grid.colSpan} / span ${field.grid.colSpan}`
                  : `${field.grid?.column} / span 1`,
                gridRow: field.grid?.rowSpan
                  ? `span ${field.grid.rowSpan} / span ${field.grid.rowSpan}`
                  : field.grid?.row
                  ? `${field.grid.row} / span 1`
                  : "auto",
              }
            : undefined
        }
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
        <div className="relative">
          {field.type === "select" ? (
            <select {...commonProps}>
              <option value="">{t("common.select")}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input type={field.type} {...commonProps} />
          )}
          {field.rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {field.rightElement}
            </div>
          )}
        </div>
        {errors[field.name as keyof T] && (
          <Alert
            variant="destructive"
            className="mt-1 min-h-0 flex items-center gap-1 text-xs pr-2"
          >
            <AlertDescription className="pl-0 text-xs">
              {errors[field.name as keyof T]}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${isMobile ? "mx-4" : ""}`}>
      {title && (
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          className={`
            ${isMobile ? "flex flex-col space-y-4 p-4" : "grid p-4"}
          `}
          style={
            !isMobile
              ? {
                  gridTemplateColumns: `repeat(${config.grid.columns}, 1fr)`,
                  gap: config.grid.gap,
                }
              : undefined
          }
        >
          {config.fields.map(renderField)}
        </div>

        <div
          className={`
            flex border-t mt-4 p-4
            ${isMobile ? "flex-col space-y-3" : "justify-end space-x-3"}
          `}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`
              px-4 py-2 text-sm font-medium text-gray-700 bg-white 
              border border-gray-300 rounded-md shadow-sm 
              hover:bg-gray-50 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-primary 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMobile ? "w-full" : ""}
            `}
          >
            {cancelButton}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`
              inline-flex items-center justify-center px-4 py-2 
              text-sm font-medium text-white bg-primary 
              border border-transparent rounded-md shadow-sm 
              hover:bg-primary-dark focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-primary 
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isMobile ? "w-full" : ""}
            `}
          >
            {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {saveButton}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DynamicForm
