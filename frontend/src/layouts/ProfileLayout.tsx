
import Tabs from "@/components/user_profile/ProfileTabs";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <>
        <Tabs />
        <Outlet />
    </>
  )
}