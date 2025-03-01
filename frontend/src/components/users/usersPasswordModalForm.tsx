import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { UpdateUserPasswordForm } from "@/types/index";
import UsersPasswordForm from "./usersPasswordForm";

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

export default function UsersPasswordModalForm({ open, setOpen, user }: { open: boolean; setOpen: (open: boolean) => void; user?: UpdateUserPasswordForm }) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                <UsersPasswordForm handleClose={() => setOpen(false)} user={user} />
            </Box>
        </Modal>
    );
}