import { EnvironmentalSensor } from "@/types/index";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import NutrientSolutionSensorForm from "./NutrientSolutionSensorForm";


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

export default function NutrientSolutionSensorModalForm({ open, setOpen, sensor }: {
    open: boolean; setOpen: (open: boolean) =>
        void; sensor?: EnvironmentalSensor
}) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <NutrientSolutionSensorForm handleClose={() => setOpen(false)} sensor={sensor} />
            </Box>
        </Modal>
    );
}