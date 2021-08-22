type GlobalContext = {
    loading: Boolean;
    userId: string;
    colorMode: "dark" | "light";
    setIsLoading: (isLoading: boolean) => void;
    setCurrentUserId: (currentUserId: string) => void;
    setTheme: (theme: "dark" | "light") => void;
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
