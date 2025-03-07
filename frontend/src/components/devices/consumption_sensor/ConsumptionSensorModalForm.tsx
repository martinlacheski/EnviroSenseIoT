import { ConsumptionSensor } from "@/types/index";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ConsumptionSensorForm from "./ConsumptionSensorForm";


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

export default function ConsumptionSensorModalForm({ open, setOpen, sensor }: {
    open: boolean; setOpen: (open: boolean) =>
        void; sensor?: ConsumptionSensor
}) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <ConsumptionSensorForm handleClose={() => setOpen(false)} sensor={sensor} />
            </Box>
        </Modal>
    );
}