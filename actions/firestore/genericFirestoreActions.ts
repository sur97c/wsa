// actions/firestore/genericFirestoreActions.ts

import { BaseEntity } from '@models/BaseEntity'
import { CreateFirestoreAction } from './base/createAction'
import { ReadFirestoreAction } from './base/readAction'
import { UpdateFirestoreAction } from './base/updateAction'
import { DeleteFirestoreAction } from './base/deleteAction'
import { BatchFirestoreActions } from './base/batchActions'
import {
  FirestoreQuery,
  FirestoreResponse,
  FirestoreListResponse,
  BatchOperationResponse
} from './base/types'
import { PaginatedReadFirestoreAction, type PaginatedResult, type PaginationOptions } from './base/paginatedReadAction'

export class GenericFirestoreActions<T extends BaseEntity> {
  private createAction: CreateFirestoreAction<T>
  private readAction: ReadFirestoreAction<T>
  private updateAction: UpdateFirestoreAction<T>
  private deleteAction: DeleteFirestoreAction<T>
  private batchActions: BatchFirestoreActions<T>
  private paginatedReadAction: PaginatedReadFirestoreAction<T>

  constructor (private collectionName: string) {
    this.createAction = new CreateFirestoreAction<T>(collectionName)
    this.readAction = new ReadFirestoreAction<T>(collectionName)
    this.updateAction = new UpdateFirestoreAction<T>(collectionName)
    this.deleteAction = new DeleteFirestoreAction<T>(collectionName)
    this.batchActions = new BatchFirestoreActions<T>(collectionName)
    this.paginatedReadAction = new PaginatedReadFirestoreAction<T>(collectionName)
  }

  // Single Document Operations
  async create(data: Omit<T, 'id'>): Promise<FirestoreResponse<T>> {
    return this.createAction.execute(data)
  }

  async getById(id: string): Promise<FirestoreResponse<T>> {
    return this.readAction.getById(id)
  }

  async getList(query?: FirestoreQuery): Promise<FirestoreListResponse<T>> {
    return this.readAction.getList(query)
  }

  async update(id: string, data: Partial<T>): Promise<FirestoreResponse<T>> {
    return this.updateAction.execute(id, data)
  }

  async delete(id: string): Promise<FirestoreResponse<void>> {
    return this.deleteAction.execute(id)
  }

  // Batch Operations
  async batchCreate(items: Omit<T, 'id'>[]): Promise<FirestoreResponse<T[]>> {
    return this.batchActions.batchCreate(items)
  }

  async batchUpdate(updates: { id: string; data: Partial<T> }[]): Promise<BatchOperationResponse> {
    return this.batchActions.batchUpdate(updates)
  }

  async batchDelete(ids: string[]): Promise<BatchOperationResponse> {
    return this.batchActions.batchDelete(ids)
  }

  // Pagination Methods
  async getPaginated(options: PaginationOptions): Promise<FirestoreResponse<PaginatedResult<T>>> {
    return this.paginatedReadAction.getPaginated(options)
  }

  async getPaginatedWithSkip(
    page?: number,
    pageSize?: number,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<FirestoreResponse<{ data: T[]; total: number; pages: number }>> {
    return this.paginatedReadAction.getPaginatedWithSkip(page, pageSize, orderBy)
  }

  async getVirtualizedData(
    startIndex: number,
    stopIndex: number,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<FirestoreResponse<{ data: T[]; total: number }>> {
    return this.paginatedReadAction.getVirtualizedData(startIndex, stopIndex, orderBy)
  }
}

// Reexportar tipos útiles
export type {
  FirestoreQuery,
  FirestoreResponse,
  FirestoreListResponse,
  BatchOperationResponse,
  PaginationOptions,
  PaginatedResult
}

// Ejemplo de uso:
// export const usersActions = new GenericFirestoreActions<UserDocument>('users');
// export const tableViewsActions = new GenericFirestoreActions<TableView>('tableViews');
// Ejemplos de uso:

/* 
// 1. Paginación basada en cursor (recomendada para grandes conjuntos de datos)
const usersActions = new GenericFirestoreActions<UserDocument>('users');

// Primera página
const firstPage = await usersActions.getPaginated({
  limit: 10,
  orderBy: { field: 'createdAt', direction: 'desc' },
  filters: [
    { field: 'status', operator: 'eq', value: 'active' }
  ]
});

// Siguientes páginas usando el cursor
if (firstPage.data?.nextCursor) {
  const nextPage = await usersActions.getPaginated({
    limit: 10,
    orderBy: { field: 'createdAt', direction: 'desc' },
    cursor: firstPage.data.nextCursor
  });
}

// 2. Paginación tradicional con skip/limit
// Útil para tablas con paginación numérica
const page1 = await usersActions.getPaginatedWithSkip(1, 20, {
  field: 'lastName',
  direction: 'asc'
});
// Retorna: { data: UserDocument[], total: number, pages: number }

// Cambiar de página
const page2 = await usersActions.getPaginatedWithSkip(2, 20, {
  field: 'lastName',
  direction: 'asc'
});

// 3. Paginación para listas virtualizadas
// Ideal para scroll infinito o tablas virtualizadas
const virtualData = await usersActions.getVirtualizedData(0, 50, {
  field: 'createdAt',
  direction: 'desc'
});

// Cargar más datos al hacer scroll
const moreData = await usersActions.getVirtualizedData(51, 100, {
  field: 'createdAt',
  direction: 'desc'
});

// Ejemplo de uso en un componente React con scroll infinito:
const InfiniteUserList = () => {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const result = await usersActions.getPaginated({
        limit: 20,
        cursor,
        orderBy: { field: 'createdAt', direction: 'desc' }
      });

      if (result.success && result.data) {
        setUsers(prev => [...prev, ...result.data.data]);
        setCursor(result.data.nextCursor);
      }
    } finally {
      setLoading(false);
    }
  };

  // Usar con un IntersectionObserver o scroll event
  return (
    <div onScroll={handleScroll}>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
      {loading && <LoadingSpinner />}
    </div>
  );
};

// Ejemplo de uso en una tabla con paginación numérica:
const UserTable = () => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const loadPage = async (pageNum: number) => {
    const result = await usersActions.getPaginatedWithSkip(pageNum, 10, {
      field: 'lastName',
      direction: 'asc'
    });

    if (result.success && result.data) {
      setUsers(result.data.data);
      setTotalPages(result.data.pages);
    }
  };

  return (
    <>
      <table>
        <thead>...</thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>...</tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};
*/