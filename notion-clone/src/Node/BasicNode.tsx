import {NodeData, NodeType} from "../utils/types"
import styles from "./Node.module.css"
import {useRef, useEffect, FormEventHandler, KeyboardEventHandler} from "react"
import {nanoid} from "nanoid"
import { useAppState } from "../state/AppStateContext"
import { CommandPanel } from "./CommandPanel"
import cx from "classnames"


type BasicNodeProps = {
    node: NodeData;
    updateFocusedIndex(index: number): void;
    isFocused: boolean;
    index: number;
};

export const BasicNode = ({
    node,
    updateFocusedIndex,
    isFocused,
    index,
}: BasicNodeProps) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    const { changeNodeValue, changeNodeType, removeNodeByIndex, addNode } = useAppState();

    const showCommandPanel = isFocused && node?.value?.match(/^\//);

    useEffect(() => {
        console.log("1: useEffect for setting textContent and focus state");
        if (nodeRef.current && document.activeElement !== nodeRef.current) {
            nodeRef.current.textContent = node.value;
            console.log("2: Text content set for node");
        }
        if (isFocused) {
            nodeRef.current?.focus();
            console.log("3: Node is focused");
        } else {
            nodeRef.current?.blur();
            console.log("4: Node is blurred");
        }
    }, [node, isFocused]);

    const parseCommand = (nodeType: NodeType) => {
        console.log("5: Parsing command to change node type");
        if (nodeRef.current) {
            changeNodeType(index, nodeType);
            nodeRef.current.textContent = "";
            console.log("6: Node type changed and content cleared");
        }
    };

    const handleInput: FormEventHandler<HTMLDivElement> = ({ currentTarget }) => {
        console.log("7: Handling input");
        const { textContent } = currentTarget;
        changeNodeValue(index, textContent || "");
        console.log("8: Node value changed");
    };

    const handleClick = () => {
        console.log("9: Node clicked, updating focus index");
        updateFocusedIndex(index);
    };

    const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
        console.log("10: Key down event");
        const target = event.target as HTMLDivElement;
        if (event.key === "Enter") {
            event.preventDefault();
            if (target.textContent?.[0] === "/") {
                console.log("11: Enter key pressed but command mode detected, no action taken");
                return;
            }
            addNode({ type: node.type, value: "", id: nanoid() }, index + 1);
            updateFocusedIndex(index + 1);
            console.log("12: Enter key processed, new node added");
        }
        if (event.key === "Backspace") {
            if (target.textContent?.length === 0) {
                event.preventDefault();
                removeNodeByIndex(index);
                updateFocusedIndex(index - 1);
                console.log("13: Backspace key processed, node removed");
            } else if (window?.getSelection()?.anchorOffset === 0) {
                event.preventDefault();
                removeNodeByIndex(index - 1);
                updateFocusedIndex(index - 1);
                console.log("14: Backspace at start of node, previous node removed");
            }
        }
    };

    return (
        <>
            {showCommandPanel && (
                <CommandPanel selectItem={parseCommand} nodeText={node.value} />
            )}
            <div
                onInput={handleInput}
                onClick={handleClick}
                onKeyDown={onKeyDown}
                ref={nodeRef}
                contentEditable
                suppressContentEditableWarning
                className={cx(styles.node, styles[node.type])}
            />
        </>
    );
};
