export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export function sortUsersByNewest(users: readonly User[]): User[] {
    return [...users].sort((left: User, right: User) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}
