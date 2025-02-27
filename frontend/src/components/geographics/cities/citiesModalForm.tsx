import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { City } from "@/types/index";
import CitiesForm from "./citiesForm";

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

export default function CitiesModalForm({ open, setOpen, city, countries }: { open: boolean; setOpen: (open: boolean) => void; city?: City; countries: any[] }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <CitiesForm handleClose={() => setOpen(false)} city={city} countries={countries} />
            </Box>
        </Modal>
    );
}