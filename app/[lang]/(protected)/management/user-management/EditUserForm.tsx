// app/[lang]/(protected)/management/user-management/EditUserForm.tsx

import { Check, X } from "lucide-react"
import { useTranslations } from "@hooks/useTranslations"
import { IUser } from "@models/IUser"
import { IProfile } from "@models/IProfile"
import type { FormConfig } from "@components/dynamic-form/forms"
import DynamicForm from "@components/dynamic-form/DynamicForm"

interface EditUserFormProps {
  user?: IUser & IProfile
  onClose: () => void
  onSave: (userData: Partial<IUser & IProfile>) => Promise<void>
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const { t, translations } = useTranslations()

  const formConfig: FormConfig = {
    fields: [
      {
        name: "email",
        label: t(
          translations.management.advancedTable.users.editCreate.fields.email
        ),
        type: "email",
        grid: { column: 1 },
        validations: [
          {
            type: "required",
            message: t(translations.validation.required),
          },
          {
            type: "email",
            message: t(translations.validation.invalidEmail),
          },
        ],
        rightElement: user && (
          <div className="text-xs text-gray-400 flex items-center gap-1">
            {user.emailVerified ? (
              <>
                <Check className="h-3 w-3" />
                {t(
                  translations.management.advancedTable.users.editCreate.fields
                    .emailVerified
                )}
              </>
            ) : (
              <>
                <X className="h-3 w-3" />
                {t(
                  translations.management.advancedTable.users.editCreate.fields
                    .emailNotVerified
                )}
              </>
            )}
          </div>
        ),
      },
      {
        name: "displayName",
        label: t(
          translations.management.advancedTable.users.editCreate.fields
            .displayName
        ),
        type: "text",
        grid: { column: 2 },
      },
      {
        name: "status",
        label: t(
          translations.management.advancedTable.users.editCreate.fields.status
        ),
        type: "select",
        grid: { column: 3 },
        options: [
          {
            label: t(
              translations.management.advancedTable.users.editCreate.dropDowns
                .status.active
            ),
            value: "active",
          },
          {
            label: t(
              translations.management.advancedTable.users.editCreate.dropDowns
                .status.inactive
            ),
            value: "inactive",
          },
        ],
      },
      {
        name: "name",
        label: t(
          translations.management.advancedTable.users.editCreate.fields.name
        ),
        type: "text",
        grid: { column: 1 },
        validations: [
          {
            type: "required",
            message: t(translations.validation.required),
          },
        ],
      },
      {
        name: "lastName",
        label: t(
          translations.management.advancedTable.users.editCreate.fields.lastName
        ),
        type: "text",
        grid: { column: 2 },
        validations: [
          {
            type: "required",
            message: t(translations.validation.required),
          },
        ],
      },
    ],
    grid: {
      columns: 3,
      gap: "1rem",
    },
  }

  return (
    <DynamicForm
      config={formConfig}
      initialData={user}
      onSubmit={onSave}
      onClose={onClose}
      title={t(
        user
          ? translations.management.advancedTable.users.editCreate.edit.title
          : translations.management.advancedTable.users.editCreate.create.title
      )}
      cancelButton={t(
        translations.management.advancedTable.users.editCreate.buttons.cancel
      )}
      saveButton={t(
        translations.management.advancedTable.users.editCreate.buttons.save
      )}
      successMessage={t(
        user
          ? translations.management.advancedTable.users.editCreate.edit
              .successMessage
          : translations.management.advancedTable.users.editCreate.create
              .successMessage
      )}
      errorMessage={t(
        user
          ? translations.management.advancedTable.users.editCreate.edit
              .errorMessage
          : translations.management.advancedTable.users.editCreate.create
              .errorMessage
      )}
    />
  )
}

export default EditUserForm
