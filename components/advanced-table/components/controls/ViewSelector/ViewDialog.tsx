// components/advanced-table/components/controls/ViewSelector/ViewDialog.tsx

import React from 'react';
import { Dialog } from '@components/ui/dialog/Dialog';
import { ViewConfig } from '@components/advanced-table/types/view.types';
import { DataItem } from '@components/advanced-table/types/table.types';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@components/ui/alert/Alert';
import { Loader } from 'lucide-react';

interface ViewFormData {
  name: string;
  description?: string;
  isDefault: boolean;
}

interface ViewDialogProps<T extends DataItem> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ViewFormData) => Promise<void>;
  currentConfig?: Partial<ViewConfig<T>>;
  editingView?: {
    name: string;
    description?: string;
    isDefault: boolean;
  };
  loading?: boolean;
  translations: {
    title: string;
    viewName: string;
    viewDescription: string;
    defaultView: string;
    save: string;
    cancel: string;
  };
}

const ViewDialog = <T extends DataItem>({
  isOpen,
  onClose,
  onSave,
  editingView,
  loading = false,
  translations
}: ViewDialogProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ViewFormData>({
    defaultValues: editingView || {
      name: '',
      description: '',
      isDefault: false
    }
  });

  // Reset form when the dialog closes or when editing a different view
  React.useEffect(() => {
    if (isOpen) {
      reset(editingView || {
        name: '',
        description: '',
        isDefault: false
      });
    }
  }, [isOpen, editingView, reset]);

  const onSubmit = async (data: ViewFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving view:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                {translations.title}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.viewName}
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 3,
                        message: 'El nombre debe tener al menos 3 caracteres'
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                    disabled={loading}
                  />
                  {errors.name && (
                    <Alert variant="destructive" className="mt-1">
                      <AlertDescription>
                        {errors.name.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {translations.viewDescription}
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isDefault')}
                    id="isDefault"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    disabled={loading}
                  />
                  <label
                    htmlFor="isDefault"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {translations.defaultView}
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    {translations.cancel}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {translations.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewDialog;