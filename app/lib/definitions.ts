export type User = {
    id: string;
    name: string;
    email: string;
    created_time: Date;
    password: string;
}

export type TagField = {
    id: number,
    title: string,
}

export type TodoField = {
    id: string,
    author_id: string,
    tag: string, 
    is_active: boolean,
    title: string,
    text: string,
    due_time: string,
    created_time: string,
}
