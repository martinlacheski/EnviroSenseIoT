export interface NombreBasic {
    id: string;
    nombre: string;
}

export interface CarpetaInterface {
    id: string;
    nombre: string;
    total_files: number;
    total_size: number;
    updatedAt: string;
}

export interface Archivo {
    id: string,
    originalname: string,
    fileUrl: string,
    image: boolean,
    user: string,
    createdAt: string
}

export interface CarpetaArchivosInterface {
    carpeta: CarpetaInterface;
    archivos: Archivo[];
}
