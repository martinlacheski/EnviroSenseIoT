import { Actuator } from "@/types/index";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ActuatorForm from "./ActuatorForm";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function ActuatorModalForm({ open, setOpen, actuator }: {
    open: boolean; setOpen: (open: boolean) =>
        void; actuator?: Actuator
}) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <ActuatorForm handleClose={() => setOpen(false)} actuator={actuator} />
            </Box>
        </Modal>
    );
}