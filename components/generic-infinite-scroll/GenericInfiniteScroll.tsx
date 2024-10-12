// components/generic-infinite-scroll/GenericInfiniteScroll.tsx

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getPaginatedFirestoreData } from '@actions/getPaginatedFirestoreData'
import { DocumentData } from 'firebase-admin/firestore'

interface GenericInfiniteScrollProps<T extends DocumentData> {
    collectionName: string;
    pageSize?: number;
    orderBy: { field: string; direction: 'asc' | 'desc' };
    renderItem: (item: T & { id: string }) => React.ReactNode;
}

export default function GenericInfiniteScroll<T extends DocumentData>({
    collectionName,
    pageSize = 10,
    orderBy,
    renderItem
}: GenericInfiniteScrollProps<T>) {
    const [items, setItems] = useState<(T & { id: string })[]>([])
    const [loading, setLoading] = useState(false)
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const initialLoadDone = useRef(false)

    const loadMoreItems = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            const result = await getPaginatedFirestoreData<T>(
                collectionName,
                pageSize,
                orderBy,
                cursor
            )
            console.log(result.data)
            setItems(prevItems => {
                const newItems = result.data.filter(newItem => 
                    !prevItems.some(existingItem => existingItem.id === newItem.id)
                )
                return [...prevItems, ...newItems]
            })
            setCursor(result.nextCursor)
            setHasMore(!!result.nextCursor)
        } catch (error) {
            console.error(`Error loading items from ${collectionName}:`, error)
        } finally {
            setLoading(false)
        }
    }, [collectionName, cursor, loading, hasMore, orderBy, pageSize])

    useEffect(() => {
        if (!initialLoadDone.current) {
            loadMoreItems()
            initialLoadDone.current = true
        }
    }, [loadMoreItems])

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 100
            && !loading
            && hasMore
        ) {
            loadMoreItems()
        }
    }, [loadMoreItems, loading, hasMore])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <div>
            {items.map(item => renderItem(item))}
            {loading && <p>Loading...</p>}
            {!hasMore && <p>No more items to load.</p>}
        </div>
    )
}

// Ejemplo de uso:
// interface UserProfile extends DocumentData {
//   name: string;
//   email: string;
// }
//
// export function UserList() {
//   return (
//     <GenericInfiniteScroll<UserProfile>
//       collectionName="users"
//       orderBy={{ field: 'name', direction: 'asc' }}
//       renderItem={(user) => (
//         <div key={user.id}>
//           <h2>{user.name}</h2>
//           <p>{user.email}</p>
//         </div>
//       )}
//     />
//   );
// }