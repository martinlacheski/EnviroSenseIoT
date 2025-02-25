import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TypesForm from "./TypesForm";
import { Type } from "../types";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function ModalForm({ open, setOpen, type }: { open: boolean; setOpen: (open: boolean) => void; type?: Type }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <TypesForm handleClose={() => setOpen(false)} type={type} />
            </Box>
        </Modal>
    );
}