// UserProfileTable.tsx

import React, { useState } from "react";
import { IUser } from "@models/IUser";
import { IProfile } from "@models/IProfile";
import { v4 as uuidv4 } from "uuid";
import {
  CellValue,
  Column,
  DataItem,
  RowOption,
  TableOption,
} from "@components/advanced-table/advancedTableDefinition";
import AdvancedTable from "@components/advanced-table/AdvancedTable";

type CellValueRecord<T> = {
  [K in keyof T]: T[K] extends CellValue ? T[K] : CellValue;
};
type UserProfile = CellValueRecord<IUser & Partial<IProfile>>;
type UserProfileWithId = DataItem<UserProfile, string>;

const fetchUserProfiles = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortColumn: keyof UserProfileWithId | null,
  sortDirection: "asc" | "desc"
): Promise<UserProfileWithId[]> => {
  function generateRandomDate(start: Date, end: Date): string {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toISOString();
  }

  function generateRandomName(): { firstName: string; lastName: string } {
    const firstNames = [
      "John",
      "Jane",
      "Mike",
      "Emily",
      "David",
      "Sarah",
      "Chris",
      "Laura",
      "Tom",
      "Emma",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];

    return {
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    };
  }

  // Generar un conjunto total de datos para simular una base de datos
  const totalMockData = Array.from({ length: 100 }, (_, index) => {
    const { firstName, lastName } = generateRandomName();
    const creationTime = generateRandomDate(new Date(2020, 0, 1), new Date());
    const lastSignInTime = generateRandomDate(
      new Date(creationTime),
      new Date()
    );

    return {
      id: `${index}`,
      uid: uuidv4(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      emailVerified: Math.random() > 0.2,
      displayName: `${firstName} ${lastName}`,
      name: firstName,
      lastName: lastName,
      creationTime: creationTime,
      lastSignInTime: lastSignInTime,
    };
  });

  const filteredData = totalMockData.filter(
    (user) =>
      !searchTerm ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortColumn) {
    filteredData.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if ((aValue || 0) < (bValue || 0))
        return sortDirection === "asc" ? -1 : 1;
      if ((aValue || 0) > (bValue || 0))
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  return filteredData.slice(startIndex, endIndex);
};

const UserProfileTable: React.FC = () => {
  // Definimos las columnas
  const columns: Column<UserProfileWithId>[] = [
    { key: "id", label: "ID", align: "center", type: "string", width: "5%" },
    {
      key: "email",
      label: "Email",
      align: "center",
      type: "string",
      width: "20%",
    },
    {
      key: "emailVerified",
      label: "Verified",
      align: "center",
      render: (value: string | boolean | undefined) => (value ? "Yes" : "No"),
      type: "boolean",
      width: "8%",
    },
    {
      key: "displayName",
      label: "Display Name",
      align: "center",
      type: "string",
      width: "15%",
    },
    {
      key: "name",
      label: "First Name",
      align: "center",
      type: "string",
      width: "12%",
    },
    {
      key: "lastName",
      label: "Last Name",
      align: "center",
      type: "string",
      width: "12%",
    },
    {
      key: "creationTime",
      label: "Created At",
      align: "center",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleString(),
      type: "date",
      width: "14%",
    },
    {
      key: "lastSignInTime",
      label: "Last Sign In",
      align: "center",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleString(),
      type: "date",
      width: "14%",
    },
  ];

  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    setIsEditing(true);
  };

  const EditComponent = () => (
    <div className="p-6 bg-white w-full">
      <h2 className="font-semibold mb-4">Agregar/Editar Usuario</h2>
      {/* Tus campos de formulario aquí */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          onClick={() => setIsEditing(false)}
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          onClick={() => {
            // Lógica para guardar
            setIsEditing(false);
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );

  // Definimos las opciones de fila
  const rowOptions: RowOption<UserProfileWithId>[] = [
    {
      label: "Edit",
      action: (item: UserProfileWithId) => console.log("Edit", item),
    },
    {
      label: "Delete",
      action: (item: UserProfileWithId) => console.log("Delete", item),
    },
  ];

  // Definimos las opciones de tabla
  const tableOptions: TableOption[] = [
    {
      label: "Export CSV",
      action: () => console.log("Exporting CSV..."),
    },
  ];

  return (
    <AdvancedTable<UserProfileWithId>
      columns={columns}
      fetchData={fetchUserProfiles}
      itemsPerPage={10}
      searchPlaceholder="Search users..."
      tableOptions={tableOptions}
      rowOptions={rowOptions}
      enableFilters={true}
      isEditing={isEditing}
      editComponent={<EditComponent />}
      onCloseEdit={() => setIsEditing(false)}
      onAdd={handleAdd}
    />
  );
};

export default UserProfileTable;
