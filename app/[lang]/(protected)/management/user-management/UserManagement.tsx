// app/[lang]/(protected)/management/user-management/UserManagement.tsx

import UserProfileTable from "./UserProfileTable";

export const dynamic = 'force-dynamic';

const UserManagement = () => {
    return (
        <>
            <div className='h-38'>
                <UserProfileTable />
            </div>
        </>
    );
};

export default UserManagement;
