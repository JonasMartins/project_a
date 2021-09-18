import React from "react";
import { Secondary } from "./../layout/ContainerShades";

interface StatusItemDraggableProps {}

const StatusItemDraggable: React.FC<StatusItemDraggableProps> = ({
    children,
}) => {
    return (
        <Secondary
            minH="150px"
            flexGrow={1}
            boxShadow="lg"
            flexDir="column"
            p={3}
            m="2em 2em 20em 0"
        >
            {children}
        </Secondary>
    );
};

export default StatusItemDraggable;
