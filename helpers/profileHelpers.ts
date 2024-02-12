export const getInitials = (name) => {
    const nameParts = name.split(" ");
    const firstInitial =
        nameParts.length > 0 ? nameParts[0].charAt(0).toUpperCase() : "";
    const secondInitial =
        nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstInitial + secondInitial;
};
