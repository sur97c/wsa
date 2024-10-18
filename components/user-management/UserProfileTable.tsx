// UserProfileTable.tsx

import React from 'react'
import AdvancedTable, { Column, RowOption, TableOption, DataItem, CellValue } from '@components/advanced-table/AdvancedTable'
import { IUser } from '@models/IUser'
import { IProfile } from '@models/IProfile'
import { v4 as uuidv4 } from 'uuid';

type CellValueRecord<T> = {
    [K in keyof T]: T[K] extends CellValue ? T[K] : CellValue
}
type UserProfile = CellValueRecord<IUser & Partial<IProfile>>
type UserProfileWithId = DataItem<UserProfile, string>

const fetchUserProfiles = async (
    page: number,
    itemsPerPage: number,
    searchTerm: string,
    sortColumn: keyof UserProfileWithId | null,
    sortDirection: 'asc' | 'desc'
): Promise<UserProfileWithId[]> => {

    function generateRandomDate(start: Date, end: Date): string {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
    }

    function generateRandomName(): { firstName: string; lastName: string } {
        const firstNames = ['John', 'Jane', 'Mike', 'Emily', 'David', 'Sarah', 'Chris', 'Laura', 'Tom', 'Emma'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

        return {
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
        };
    }

    const mockData = Array.from({ length: 100 }, (_, index) => {
        const { firstName, lastName } = generateRandomName();
        const creationTime = generateRandomDate(new Date(2020, 0, 1), new Date());
        const lastSignInTime = generateRandomDate(new Date(creationTime), new Date());

        return {
            id: `${index}`,
            uid: uuidv4(),
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            emailVerified: Math.random() > 0.2, // 80% chance of being verified
            displayName: `${firstName} ${lastName}`,
            name: firstName,
            lastName: lastName,
            creationTime: creationTime,
            lastSignInTime: lastSignInTime,
        }
    });

    const filteredData = mockData.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortColumn) {
        filteredData.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]
            if ((aValue || 0) < (bValue || 0)) return sortDirection === 'asc' ? -1 : 1
            if ((aValue || 0) > (bValue || 0)) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    console.log('fetchUserProfiles', { page, start, end });
    return filteredData.slice(start, end);
}

const UserProfileTable: React.FC = () => {
    // Definimos las columnas
    const columns: Column<UserProfileWithId>[] = [
        { key: 'id', label: 'ID', align: 'center', type: 'string', width: '5%' },
        { key: 'email', label: 'Email', align: 'center', type: 'string', width: '20%' },
        {
            key: 'emailVerified',
            label: 'Verified',
            align: 'center',
            render: (value: string | boolean | undefined) => value ? 'Yes' : 'No',
            type: 'boolean', width: '8%'
        },
        { key: 'displayName', label: 'Display Name', align: 'center', type: 'string', width: '15%'  },
        { key: 'name', label: 'First Name', align: 'center', type: 'string', width: '12%' },
        { key: 'lastName', label: 'Last Name', align: 'center', type: 'string' , width: '12%'},
        {
            key: 'creationTime',
            label: 'Created At',
            align: 'center',
            render: (value: string | boolean | undefined) => new Date(value as string).toLocaleString(),
            type: 'date', width: '14%'
        },
        {
            key: 'lastSignInTime',
            label: 'Last Sign In',
            align: 'center',
            render: (value: string | boolean | undefined) => new Date(value as string).toLocaleString(),
            type: 'date', width: '14%'
        },
    ]

    // Definimos las opciones de fila
    const rowOptions: RowOption<UserProfileWithId>[] = [
        {
            label: 'Edit',
            action: (item: UserProfileWithId) => console.log('Edit', item),
        },
        {
            label: 'Delete',
            action: (item: UserProfileWithId) => console.log('Delete', item),
        },
    ]

    // Definimos las opciones de tabla
    const tableOptions: TableOption[] = [
        {
            label: 'Export CSV',
            action: () => console.log('Exporting CSV...'),
        },
    ]

    return (
        <AdvancedTable<UserProfileWithId>
            columns={columns}
            fetchData={fetchUserProfiles}
            itemsPerPage={10}
            searchPlaceholder="Search users..."
            tableOptions={tableOptions}
            rowOptions={rowOptions}
            enableFilters={true}
        />
    )
}

export default UserProfileTable