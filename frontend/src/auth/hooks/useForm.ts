import { useState, ChangeEvent } from "react";

export const useForm = <T>(initState: T) => {

    const [formData, setFormData] = useState(initState);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const resetForm = () => {
        setFormData({ ...initState });
    }

    return {
        ...formData,
        formData,
        onChange,
        resetForm,
    }
}