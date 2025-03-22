
export class NumberFormatter {
    constructor() { }

    /** 1234567.89 => 1.234.567,89 */
    static toDecimal(value: number, digits: number = 2): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: digits
        }).format(value);

        return num;
    }

    /** 1234567.89 => + 1.234.567,89, -1234567.89 => - 1.234.567,89 */
    static toDecimalFullsigned(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return value < 0 ? `- ${num}` : `+ ${num}`;
    }

    /** 1234567.89 => $1.234.567,89 */
    static toDecimalMoney(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return `$${num}`;
    }

    /** 1234567.89 => + $1.234.567,89, -1234567.89 => - $1.234.567,89 */
    static toDecimalMoneyFullsigned(value: number): string {
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(value);

        return value < 0 ? `- $${num}` : `+ $${num}`;
    }

    /**
     * Example: formatSignedCurrency(true, 1234567.89) => + $1.234.567,89
     * @param is_monetary indicates if the value is monetary
     * @param value represents the number to format
     * @returns formatted string
     */
    static formatSignedCurrency(is_monetary: boolean = true, value: number): string {
        if (value == 0) { return `${is_monetary ? '$' : ''}0,00`; }
        const sign = value < 0 ? '-' : '';
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(Math.abs(value));

        return `${sign}${is_monetary ? '$' : ''}${num}`;
    }

    /**
     * Example: formatNotsignedCurrency(true, 1234567.89) => $1.234.567,89
     * @param is_monetary indicates if the value is monetary
     * @param value represents the number to format
     * @returns formatted string
     */
    static formatNotsignedCurrency(is_monetary: boolean = true, value: number): string {
        if (value == 0) { return `${is_monetary ? '$' : ''}0,00`; }
        const num = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2
        }).format(Math.abs(value));

        return `${is_monetary ? '$' : ''}${num}`;
    }

    // Redondea un número a 2 decimales
    static formatBytes(bytes: number): string {
        // return kB, MB or GB
        if (bytes < 1024) { return bytes + ' B'; }
        if (bytes < 1048576) { return Math.round(bytes / 1024) + ' kB'; }
        if (bytes < 1073741824) { return Math.round(bytes / 1048576) + ' MB'; }
        return Math.round(bytes / 1073741824) + ' GB';
    }

}