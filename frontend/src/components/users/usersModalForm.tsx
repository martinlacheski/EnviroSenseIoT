import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { User } from "@/types/index";
import UsersForm from "./usersForm";

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

export default function UsersModalForm({ open, setOpen, user }: { open: boolean; setOpen: (open: boolean) => void; user?: User }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <UsersForm handleClose={() => setOpen(false)} user={user} />
            </Box>
        </Modal>
    );
}