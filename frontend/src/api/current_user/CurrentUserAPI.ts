import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "@/types/index";
import api from "@/services/api.service";

export async function updateProfile(formData: UserProfileForm) {
    try {
        const { data } = await api.patch<string>('/users', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function changeCurrentPassword(formData: UpdateCurrentUserPasswordForm) {
    try {
        const { data } = await api.patch<string>('/users/change/password', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.detail)
        }
    }
}
