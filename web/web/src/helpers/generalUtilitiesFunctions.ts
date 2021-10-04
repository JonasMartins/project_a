export const getPastOrFutureDate = (
    countingDate: Date,
    numberOfDays: number,
    time: "past" | "future"
): Date => {
    const futureOrPastDate = new Date();

    if (time === "past") {
        futureOrPastDate.setDate(countingDate.getDate() - numberOfDays);
    } else {
        futureOrPastDate.setDate(countingDate.getDate() + numberOfDays);
    }

    return futureOrPastDate;
};

export const truncateString = (value: string, limit: number): string => {
    if (value.length > limit) {
        return value.substr(0, limit) + "...";
    } else {
        return value;
    }
};

export const compareTwoStrings = (str1: string, str2: string): boolean => {
    return (
        str1.toLocaleLowerCase().replace(/ /g, "") ===
        str2.toLocaleLowerCase().replace(/ /g, "")
    );
};
