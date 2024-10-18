// components/user-management/UserRoleManager.tsx

'use client'

import { useState } from 'react'
import { setUserClaims } from '@actions/authActions'
import { IUserClaims } from '@models/IUserClaims'
import { RoleKey, RoleKeys } from '@utils/rolesDefinition'

export default function UserRoleManager({ userId }: { userId: string }) {
    const [message, setMessage] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<RoleKey[]>([])

    const handleRoleToggle = (role: RoleKey) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    const handleSetClaims = async () => {
        const newClaims: IUserClaims = {
            roles: selectedRoles
        }

        try {
            const result = await setUserClaims(userId, newClaims)
            if (result.success) {
                setMessage(result.message)
            } else {
                setMessage(`Error: ${result.message}`)
            }
        } catch (error) {
            console.error(error)
            setMessage('Error al actualizar los claims del usuario')
        }
    }

    return (
        <div>
            <div>
                {RoleKeys.map(role => (
                    <label key={role}>
                        <input
                            type="checkbox"
                            checked={selectedRoles.includes(role)}
                            onChange={() => handleRoleToggle(role)}
                        />
                        {role}
                    </label>
                ))}
            </div>
            <button onClick={handleSetClaims}>Establecer Claims de Usuario</button>
            {message && <p>{message}</p>}
        </div>
    )
}