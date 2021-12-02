type GlobalContext = {
    loading: Boolean;
    userId: string;
    userName: string;
    userRole: string;
    expanded: Boolean;
    isLogged: Boolean;
    _setIsLogged: (isLogged: Boolean) => void;
    _setExpanded: (isExpanded: Boolean) => void;
    colorMode: "dark" | "light";
    setIsLoading: (isLoading: boolean) => void;
    setCurrentUserId: (currentUserId: string) => void;
    setTheme: (theme: "dark" | "light") => void;
    setCurrentUserName: (currentUserName: string) => void;
    setCurrentUserRole: (currentUserRole: string) => void;
};

interface Item {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    summary: string;
    description: string;
    reporter: User;
    responsible: User;
    approver: User;
    status: ItemStatus;
}

interface createNewsVariables {
    creator_id: string;
    description: string;
    usersRelated: string | [string];
    pathInfo: string;
}

interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    itemReporter: [Item];
    itemResponsible: [Item];
    itemRepporter: [Item];
}
enum enumItemPriority {
    HIGHEST = "HIGHEST",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    LOWEST = "LOWEST",
}

enum enumItemType {
    TASK = "TASK",
    BUG = "BUG",
    STORY = "STORY",
}

enum ItemStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    REOPENED = "REOPENED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    COMPLETED = "COMPLETED",
}
