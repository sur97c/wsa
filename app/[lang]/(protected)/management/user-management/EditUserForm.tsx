// app/[lang]/(protected)/management/user-management/EditUserForm.tsx

import React, { useState, useEffect } from "react";
import { useTranslations } from "@hooks/useTranslations";
import { IUser } from "@models/IUser";
import { IProfile } from "@models/IProfile";
import { useToast } from "@components/ui/toast";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@components/ui/alert/Alert";
import { Loader } from "lucide-react";
import { isValidEmail } from "@utils/utils";

interface EditUserFormProps {
  user?: IUser & IProfile;
  onClose: () => void;
  onSave: (userData: Partial<IUser & IProfile>) => Promise<void>;
}

export const EditUserForm = ({ user, onClose, onSave }: EditUserFormProps) => {
  const { t, translations } = useTranslations();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    name: "",
    lastName: "",
    status: "active" as "active" | "inactive",
    emailVerified: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        displayName: user.displayName || "",
        name: user.name || "",
        lastName: user.lastName || "",
        status: user.status ? "active" : "inactive",
        emailVerified: user.emailVerified || false,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t(translations.validation.required);
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t(translations.validation.invalidEmail);
    }

    if (!formData.name) {
      newErrors.name = t(translations.validation.required);
    }

    if (!formData.lastName) {
      newErrors.lastName = t(translations.validation.required);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (validateForm()) {
      try {
        setIsLoading(true);
        await onSave(formData);
        toast({
          variant: "success",
          title: t(
            user
              ? translations.management.advancedTable.users.editCreate.edit
                  .success
              : translations.management.advancedTable.users.editCreate.create
                  .success
          ),
        });
        onClose();
      } catch (error) {
        console.error(error);
        const errorMessage = t(
          user
            ? translations.management.advancedTable.users.editCreate.edit.error
            : translations.management.advancedTable.users.editCreate.create
                .error
        );
        setSubmitError(errorMessage);
        toast({
          variant: "destructive",
          title: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSubmitError(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">
        {user
          ? t(translations.management.advancedTable.users.editCreate.edit.title)
          : t(
              translations.management.advancedTable.users.editCreate.create
                .title
            )}
      </h2>

      {submitError && (
        <Alert variant="destructive" className="mb-2">
          <AlertTitle>{t(translations.common.error)}</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .email
              )}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              } ${isLoading ? "bg-gray-100" : ""}`}
            />
            {errors.email && (
              <Alert
                variant="destructive"
                className="mt-1 min-h-0 flex items-center gap-1 text-xs pr-2"
              >
                <AlertDescription className="pl-0 text-xs">
                  {errors.email}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Display Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .displayName
              )}
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                isLoading ? "bg-gray-100" : ""
              }`}
            />
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .name
              )}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.name ? "border-red-500" : "border-gray-300"
              } ${isLoading ? "bg-gray-100" : ""}`}
            />
            {errors.name && (
              <Alert
                variant="destructive"
                className="mt-1 min-h-0 flex items-center gap-1 text-xs pr-2"
              >
                <AlertDescription className="pl-0 text-xs">
                  {errors.name}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .lastName
              )}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } ${isLoading ? "bg-gray-100" : ""}`}
            />
            {errors.lastName && (
              <Alert
                variant="destructive"
                className="mt-1 min-h-0 flex items-center gap-1 text-xs pr-2"
              >
                <AlertDescription className="pl-0 text-xs">
                  {errors.lastName}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .status
              )}
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${
                isLoading ? "bg-gray-100" : ""
              }`}
            >
              <option value="active">
                {t(
                  translations.management.advancedTable.users.editCreate.status
                    .active
                )}
              </option>
              <option value="inactive">
                {t(
                  translations.management.advancedTable.users.editCreate.status
                    .inactive
                )}
              </option>
            </select>
          </div>

          {/* Email Verified Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="emailVerified"
              checked={formData.emailVerified}
              onChange={handleChange}
              disabled={isLoading}
              className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                isLoading ? "bg-gray-100" : ""
              }`}
            />
            <label className="text-xs font-medium text-gray-700">
              {t(
                translations.management.advancedTable.users.editCreate.fields
                  .emailVerified
              )}
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 border-t mr-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t(translations.advancedTable.cancel)}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {t(translations.advancedTable.save)}
          </button>
        </div>
        <div style={{ height: "10px" }}></div>
      </form>
    </div>
  );
};

export default EditUserForm;
