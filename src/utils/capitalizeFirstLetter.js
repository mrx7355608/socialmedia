export default function capitalizeFirstLetter(str) {
    const parts = str.split("");
    parts[0] = parts[0].toUpperCase();
    const capitalizedString = parts.join("");
    return capitalizedString;
}
