import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

export class DateFormatter {
    constructor() { }

    static toDDmmYYYY(date: string): string {      
        return dayjs(date).format('DD/MM/YYYY');
    }

    static toDDmmYYYYhhMM(date: string): string {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
    }

    static toDDmmString(date: string): string {
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date, 'DD-MMM').format('DD [de] MMMM');
    }

    // 13 ago 2021
    static toDDMMMYYYY(date: string): string {
        dayjs.extend(updateLocale);
        dayjs.updateLocale('en', {
            months: [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ]
        });
        return dayjs(date).format('DD MMM YYYY');
    }

    static toDateString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatted;
    }

    static toDateYearString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatted;
    }

    static toDatetimeString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
        return formatted;
    }

    static toMonthYearString(date: Date): string {
        const new_date = new Date(date);
        const formatted = new_date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
        return formatted;
    }

}