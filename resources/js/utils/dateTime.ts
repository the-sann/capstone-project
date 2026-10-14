// Convert 24-hour time to 12-hour AM/MP;

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = Number(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${String(formattedHour).padStart(2, '0')}:${minutes} ${period}`;
};
export const formatDate = (date: string) => {
    const dateOnly = date.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    ).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
