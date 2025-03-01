import { Environment } from "@/types/environment/environment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EnvironmentForm from "./EnvironmentForm";



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

export default function EnvironmentModalForm({ open, setOpen, type }: { open: boolean; setOpen: (open: boolean) => void; type?: Environment }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <EnvironmentForm handleClose={() => setOpen(false)} type={type} />
            </Box>
        </Modal>
    );
}