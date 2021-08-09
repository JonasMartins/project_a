type GlobalContext = {
    loading: Boolean;
    userId: string;
    setIsLoading: (isLoading: boolean) => void;
    setCurrentUserId: (currentUserId: string) => void;
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
