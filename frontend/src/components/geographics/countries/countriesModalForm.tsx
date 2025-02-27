import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TypesForm from "./countriesForm";
import { Country } from "@/types/geographics/countries";

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

export default function CountriesModalForm({ open, setOpen, country }: { open: boolean; setOpen: (open: boolean) => void; country?: Country }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <TypesForm handleClose={() => setOpen(false)} country={country} />
            </Box>
        </Modal>
    );
}