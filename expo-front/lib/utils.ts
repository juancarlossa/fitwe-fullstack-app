export function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Devuelve los 7 días (lun–dom) de la semana a la que pertenece baseDate */
export function getWeekDays(baseDate: Date) {
    const start = new Date(baseDate);
    const day = start.getDay();
    // Ajuste: lunes = 0 offset, domingo = -6 offset
    start.setDate(start.getDate() - ((day + 6) % 7));

    return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return {
            date,
            label: date.toLocaleDateString("es-ES", { weekday: "short" }),
            isSelected: date.toDateString() === baseDate.toDateString(),
        };
    });
}
/** Formatea una fecha como YYYY-MM-DD */
export function toISODate(date: Date) {
    return date.toISOString().split("T")[0];
}