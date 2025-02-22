
import Tabs from "@/components/users/ProfileTabs";
import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
  return (
    <>
        <Tabs />
        <Outlet />
    </>
  )
}