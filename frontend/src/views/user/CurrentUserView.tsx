import ProfileForm from "@/components/users/ProfileForm"
import { useAuth } from "@/hooks/useAuth"

export default function CurrentUserView() {

    const { data, isLoading } = useAuth()
    if(isLoading) return 'Cargando...'
    if(data) return <ProfileForm data={data} />
}
