import { Page, NodeData, NodeType } from "../utils/types";
import { useImmer } from "use-immer";
import { arrayMove } from "@dnd-kit/sortable";

export const usePageState = (initialState: Page) => {
    const [page, setPage] = useImmer<Page>(initialState);

    const addNode = (node: NodeData, index: number) => {
        console.log("1: Adding node at index", index);
        setPage((draft) => {
            draft.nodes.splice(index, 0, node);
            console.log("2: Node added");
        });
    };

    const removeNodeByIndex = (nodeIndex: number) => {
        console.log("3: Removing node at index", nodeIndex);
        setPage(draft => {
            draft.nodes.splice(nodeIndex, 1);
            console.log("4: Node removed");
        });
    };

    const changeNodeValue = (nodeIndex: number, value: string) => {
        console.log("5: Changing node value at index", nodeIndex);
        setPage(draft => {
            draft.nodes[nodeIndex].value = value;
            console.log("6: Node value changed to", value);
        });
    };

    const changeNodeType = (nodeIndex: number, type: NodeType) => {
        console.log("7: Changing node type at index", nodeIndex);
        setPage(draft => {
            draft.nodes[nodeIndex].type = type;
            draft.nodes[nodeIndex].value = "";
            console.log("8: Node type changed to", type, "and value cleared");
        });
    };

    const setNodes = (nodes: NodeData[]) => {
        console.log("9: Setting new nodes array");
        setPage(draft => {
            draft.nodes = nodes;
            console.log("10: Nodes array updated");
        });
    };

    const setTitle = (title: string) => {
        console.log("11: Setting title");
        setPage(draft => {
            draft.title = title;
            console.log("12: Title set to", title);
        });
    };

    const setCoverImage = (coverImage: string) => {
        console.log("13: Setting cover image");
        setPage(draft => {
            draft.cover = coverImage;
            console.log("14: Cover image set to", coverImage);
        });
    };

    const recordNodes = (id1: string, id2: string) => {
        setPage((draft) => {
            const index1 = draft.nodes.findIndex(node => node.id === id1);
            const index2 = draft.nodes.findIndex(node => node.id === id2);

            draft.nodes = arrayMove(draft.nodes, index1, index2);
        })
    }

    return {
        nodes: page.nodes,
        title: page.title,
        cover: page.cover,
        addNode,
        removeNodeByIndex,
        changeNodeValue,
        changeNodeType,
        setTitle,
        setCoverImage,
        setNodes,
        recordNodes
    };
};
