import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ProvincesForm from "./provincesForm";
import { Province } from "@/types/index";


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

export default function ProvincesModalForm({ open, setOpen, province }: { open: boolean; setOpen: (open: boolean) => void; province?: Province }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <ProvincesForm handleClose={() => setOpen(false)} province={province} />
            </Box>
        </Modal>
    );
}