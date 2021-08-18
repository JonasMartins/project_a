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
