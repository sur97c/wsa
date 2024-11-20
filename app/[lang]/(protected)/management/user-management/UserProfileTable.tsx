// app/[lang]/(protected)/management/user-management/UserProfileTable.tsx

import React, { useState } from "react";
import {
  Column,
  RowOption,
  TableOption,
  type Filter,
} from "@components/advanced-table/advancedTableDefinition";
import { IUser } from "@models/IUser";
import { IProfile } from "@models/IProfile";
import AdvancedTable from "@components/advanced-table/AdvancedTable";
import { useAdvancedTableTranslations } from "@components/advanced-table/useAdvancedTableTranslations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { setEntityMockConfig } from "@lib/redux/slices/mockConfigSlice";
import { createGenericFirestoreSlice } from "@lib/redux/slices/genericFirestoreSlice";
import type { TableRecord } from "../../../../../types/table";
import TruncatedText from "@components/truncated-text/TruncatedText";
import EditUserForm from "./EditUserForm";

// Tipo para los usuarios que combina IUser e IProfile
type UserWithProfile = IUser & IProfile;
type UserTableRecord = TableRecord<UserWithProfile>;

// Crear el slice para usuarios
const userSlice = createGenericFirestoreSlice<"users", UserWithProfile>(
  "users",
  "users"
);

const UserProfileTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    UserWithProfile | undefined
  >();

  // Selectors
  const isMockEnabled = useAppSelector(
    (state) =>
      state.mockConfig.useMockData && state.mockConfig.mockEntities.users
  );

  const {
    tableTranslations,
    translateColumns,
    translateTableOptions,
    translateRowOptions,
  } = useAdvancedTableTranslations<UserTableRecord>({
    module: "management",
    entity: "users",
  });

  const columns: Column<UserTableRecord>[] = [
    {
      key: "uid",
      label: "ID",
      type: "string",
      width: "5%",
      align: "center",
      render: (value) => (
        <TruncatedText value={value} maxLength={5} tooltipPosition="bottom" />
      ),
    },
    {
      key: "email",
      label: "Email",
      type: "string",
      width: "20%",
      align: "center",
    },
    {
      key: "emailVerified",
      label: "Email Verificado",
      type: "boolean",
      width: "10%",
      align: "center",
      render: (value) => (
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded-full ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <FontAwesomeIcon
            icon={value ? faCheckCircle : faTimesCircle}
            className="mr-1"
          />
          <span>
            {value
              ? tableTranslations.boolean.true
              : tableTranslations.boolean.false}
          </span>
        </div>
      ),
    },
    {
      key: "displayName",
      label: "Nombre Completo",
      type: "string",
      width: "15%",
      align: "center",
    },
    {
      key: "name",
      label: "Nombre",
      type: "string",
      width: "12%",
      align: "center",
    },
    {
      key: "lastName",
      label: "Apellido",
      type: "string",
      width: "12%",
      align: "center",
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      type: "date",
      width: "13%",
      align: "center",
      render: (value) =>
        value ? new Date(value as string).toLocaleString() : "-",
    },
    {
      key: "lastSignInTime",
      label: "Último Acceso",
      type: "date",
      width: "13%",
      align: "center",
      render: (value) =>
        value ? new Date(value as string).toLocaleString() : "-",
    },
  ];

  const rowOptions: RowOption<UserTableRecord>[] = [
    {
      key: "edit",
      label: "Editar",
      action: (item) => {
        console.log("Editar", item);
        setSelectedUser(item);
        setIsEditing(true);
      },
    },
    {
      key: "delete",
      label: "Eliminar",
      action: (item) => {
        console.log("Eliminar", item);
      },
    },
  ];

  const tableOptions: TableOption[] = [
    {
      key: "source",
      label: isMockEnabled ? "Cambiar a datos reales" : "Cambiar a datos mock",
      action: () =>
        dispatch(
          setEntityMockConfig({
            entity: "users",
            useMock: !isMockEnabled,
          })
        ),
    },
    {
      key: "exportCsv",
      label: "Exportar CSV",
      action: () => console.log("Exportando CSV..."),
    },
  ];

  const handleSaveUser = async (userData: Partial<UserWithProfile>) => {
    try {
      if (selectedUser) {
        // Actualizar usuario existente
        await dispatch(
          userSlice.thunks.updateFirestoreDocument({
            id: selectedUser.id,
            update: userData,
          })
        ).unwrap();
      } else {
        // Aquí iría la lógica para crear un nuevo usuario
        // await dispatch(userSlice.thunks.createFirestoreDocument(userData)).unwrap();
      }

      // Recargar los datos
      dispatch(userSlice.thunks.getFirestoreDocuments());

      setIsEditing(false);
      setSelectedUser(undefined);
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Re-lanzar para que el formulario pueda manejarlo
    }
  };

  const EditComponent = () => (
    <EditUserForm
      user={selectedUser}
      onClose={() => {
        setIsEditing(false);
        setSelectedUser(undefined);
      }}
      onSave={handleSaveUser}
    />
  );

  const translations = {
    columns: translateColumns(columns),
    tableOptions: translateTableOptions(tableOptions),
    rowOptions: translateRowOptions(rowOptions),
    tableTranslations,
  };

  const fetchData = async (
    page: number,
    itemsPerPage: number,
    searchTerm: string,
    sortColumn: string | null,
    sortDirection: "asc" | "desc",
    filters: Filter<UserTableRecord>[]
  ): Promise<UserTableRecord[]> => {
    try {
      const result = await dispatch(
        userSlice.thunks.getFirestoreDocuments()
      ).unwrap();
      console.log(page);
      console.log(itemsPerPage);
      console.log(searchTerm);
      console.log(sortColumn);
      console.log(sortDirection);
      console.log(filters);
      // Aquí podrías implementar la lógica de paginación, filtrado y ordenamiento
      // Por ahora, retornamos todos los datos
      return result.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  return (
    <div>
      {/* <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
        Usando datos {isMockEnabled ? "mock" : "reales"}
      </div> */}
      <AdvancedTable<UserTableRecord>
        columns={columns}
        fetchData={fetchData}
        itemsPerPage={10}
        enableFilters={true}
        isEditing={isEditing}
        editComponent={<EditComponent />}
        onCloseEdit={() => setIsEditing(false)}
        onAdd={() => {
          setSelectedUser(undefined);
          setIsEditing(true);
        }}
        translations={translations}
        tableOptions={tableOptions}
        rowOptions={rowOptions}
      />
    </div>
  );
};

export default UserProfileTable;
