import { Snackbar, Alert, Slide } from '@mui/material';
import {type Dispatch, type SetStateAction, useState} from "react";
interface ErrorModalProps {
    setTextModal: Dispatch<SetStateAction<{
        text: string;
        status: "error" | "success";
        isOpen: boolean;
    } | null>>
    text: string;
    status: 'success' | 'error';
}
const ErrorModal = ({ text, status, setTextModal }: ErrorModalProps) => {
    const [open, setOpen] = useState(true);
    return (
        <Snackbar
            open={open}
            autoHideDuration={3200}
            TransitionComponent={Slide}
            onClose={() => {
                setOpen(false)
                setTextModal(null)
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                severity={status}
                variant="filled"
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 18px 36px rgba(0,0,0,0.28)',
                }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
};

export default ErrorModal;
