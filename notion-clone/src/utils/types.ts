export type NodeType = "text" | "image" | "list" | "page" | "heaading1" | "heading2" | "heading3" 

export type NodeData = {
    id: string;
    type: NodeType;
    value: string;
}

export type Page = {
    id: string;
    slug: string;
    title: string;
    nodes: NodeData[];
    cover:string;
}