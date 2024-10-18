// components/user-management/UserList.tsx

'use client'

import React, { useState } from 'react'
import { DocumentData } from 'firebase-admin/firestore'
import GenericInfiniteScroll from '@components/generic-infinite-scroll/GenericInfiniteScroll'
import LoadingButton from '@components/loading-button/LoadingButton'
// import { setUserClaims } from '@actions/authActions'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
// import { IUserClaims } from '@models/IUserClaims'
// import { RoleKeys } from '@utils/rolesDefinition'

interface UserProfile extends DocumentData {
    name: string;
    lastName: string;
    email: string;
    // ... otros campos
}

export function UserList() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <GenericInfiniteScroll<UserProfile>
                collectionName="users"
                orderBy={{ field: 'name', direction: 'asc' }}
                renderItem={(user) => (
                    <div key={user.id} className='flex flex-row items-center justify-between m-2'>
                        <p>{user.name}</p>
                        <p>{user.lastName}</p>
                        <p>{user.email}</p>
                        <LoadingButton
                            type="button"
                            onClick={
                                async (e) => {
                                    e.preventDefault()
                                    // const form = e.target as HTMLFormElement
                                    // const rolesInput = form.elements.namedItem('roles') as HTMLInputElement
                                    // const roles = rolesInput.value.split(',')
                                    // assignRoles(user.uid, roles)
                                    setLoading(true)
                                    setError(null)
                                    try {
                                        // Usar la action para asignar roles como claims
                                        console.log(user.id) //3iZRskbuZIO5WiO81mS7gtJ0uFm2
                                        // await setUserClaims(user.id, userClaims)
                                        // fetchUsers()
                                    } catch (err) {
                                        console.error(err)
                                        setError('Error assigning roles')
                                    } finally {
                                        setLoading(false)
                                    }
                                }

                            }
                            aria-label={loading ? "Asignando roles..." : "Asignar roles"}
                            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover hover:font-bold w-full md:w-auto flex items-center justify-center"
                            faIcon={faUsers}
                            loading={loading}
                        />
                    </ div>
                )}
            />
        </div>
    );
}