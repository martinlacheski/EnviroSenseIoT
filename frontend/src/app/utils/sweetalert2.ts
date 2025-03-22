import Swal, { SweetAlertIcon } from 'sweetalert2';
import './styles.css';

export class SweetAlert2 {
    static successToast(message: string) {
        Swal.mixin({
            icon: "success",
            title: "¡Operación exitosa!",
            text: message,
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
                icon: "fs-5",
                title: "fs-title",
            },
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire();
    }

    static errorAlert(message: string) {
        Swal.fire({
            icon: "error",
            title: "¡Algo salió mal!",
            text: message,
            customClass: {
                icon: "fs-7",
                title: "fs-title",
                closeButton: "fs-3",
            },
            showCloseButton: true,
            showConfirmButton: false,
        });
    }

    static successAlert(message: string) {
        Swal.fire({
            icon: "success",
            title: "¡Operación exitosa!",
            text: message,
            customClass: {
                icon: "fs-7",
                title: "fs-title",
                closeButton: "fs-3",
            },
            showCloseButton: true,
            showConfirmButton: false,
        });
    }

    static customDialog(icon: SweetAlertIcon = 'success', text: string, autoclose: boolean = true,) {

        return Swal.fire({
            position: "center",
            icon,
            text,
            showConfirmButton: !autoclose,
            timer: autoclose ? 1500 : undefined,
        });

    }

    static confirm(message: string = "¿Desea confirmar esta acción?", iconReceived: SweetAlertIcon = "question") {
        return Swal.fire({
            title: "Confirme la operación",
            text: message,
            icon: iconReceived,
            showCancelButton: true,
            // confirmButtonColor: "#157347",
            confirmButtonColor: "#0C2950",
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#DC2626',
            cancelButtonText: 'Cancelar',
            customClass: {
                icon: "fs-7 mt-3",
                title: "fs-title",
                actions: "mt-2",
                confirmButton: "py-2 px-4",
                cancelButton: "py-2 px-4",
            },
        });
    }

    static inputDialog(message: string, iconReceived: SweetAlertIcon = "question") {
        return Swal.fire({
            title: message,
            // text: message,
            icon: iconReceived,
            input: 'text',
            allowEscapeKey: true,
            showCancelButton: true,
            confirmButtonColor: "#157347",
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#DC2626',
            cancelButtonText: 'Cancelar',
            customClass: {
                icon: "fs-7 mt-3",
                title: "fs-title",
                actions: "mt-2",
            },
        });
    }

    static imagePreviewConfirm(imageUrl: string) {
        return Swal.fire({
            title: "Confirme la operación",
            text: "¿Desea subir la imagen seleccionada?",
            imageUrl,
            imageHeight: 200,
            imageAlt: "Imagen seleccionada",
            allowEscapeKey: true,
            showCancelButton: true,
            confirmButtonColor: "#157347",
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#DC2626',
            cancelButtonText: 'Cancelar',
            customClass: {
                icon: "fs-7 mt-3",
                title: "fs-title",
                actions: "mt-2",
            },
        });
    }

}