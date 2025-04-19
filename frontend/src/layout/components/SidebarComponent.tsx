import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useAuthStore } from "../../hooks";
import { sidebarItems, MenuItemData } from "./sidebarItems";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Image } from "react-bootstrap";

interface SidebarComponentProps {
  collapsed: boolean;
}

const hasRole = (roles: string[], requiredRoles: string[]) => {
  return requiredRoles.some(role => roles.includes(role));
};

export const SidebarComponent = ({ collapsed }: SidebarComponentProps) => {
  const { startLogout } = useAuthStore();
  const { user, roles } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    startLogout();
  };

  const renderMenuItems = (items: MenuItemData[], isSubItem = false) => {
    return items.map((item, index) => {
      if (item.subItems) {
        return (
          <SubMenu
            key={index}
            style={{
              height: "36px",
            }}
            prefix={
              <>
                <i className={`${item.icon} me-2 fs-6`}></i>
                {item.title}
              </>
            }
            hidden={hasRole(roles, item.requiredRoles) ? false : true}
          >
            {renderMenuItems(item.subItems, true)}
          </SubMenu>
        );
      }

      return (
        <MenuItem
          key={index}
          component={item.link ? <Link to={item.link} /> : undefined}
          title={item.title}
          style={{
            height: "36px",
            fontSize: isSubItem ? "12px" : "14px", // Ajuste de fontSize
            marginLeft: isSubItem ? "5px" : "0px", // Ajuste de marginLeft
            ...item.style,
          }}
          hidden={hasRole(roles, item.requiredRoles) ? false : true}
        >
          {item.icon && <i className={`${item.icon} me-2 fs-6`}></i>}
          {item.title}
        </MenuItem>
      );
    });
  };

  return (
    <Sidebar
      width="230px"
      collapsed={collapsed}
      collapsedWidth="0px"
      style={{
        backgroundColor: "#F8F9FA",
        height: "100vh",
      }}
    >
      <Menu style={{ fontSize: "14px" }}>
        <MenuItem
          title="EnviroSense"
          className="text-center"
          style={{ height: "150px" }}
          component={<Link to="/" />}
        >
          <Image src="/logo-sidebar.png" alt="EnviroSense" height={125} />
        </MenuItem>
        <MenuItem
          component={<Link to="/" />}
          title="Inicio"
          style={{ height: "36px" }}
        >
          <i className="bi bi-house me-2 fs-6"></i>
          Inicio
        </MenuItem>

        {renderMenuItems(sidebarItems)}

        <SubMenu
          title="Sesión activa"
          prefix={
            <i>
              <i className="bi bi-record-fill text-success px-1 me-1 small"></i>
              {user?.username}
            </i>
          }
          style={{ height: "36px" }}
        >
          <MenuItem
            component={<Link to="/panel-usuario" />}
            title="Panel de usuario"
            style={{ height: "36px", marginLeft: "14px" }}
          >
            <small>Panel de usuario</small>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{ height: "36px", marginLeft: "14px" }}
          >
            <small>Cerrar sesión</small>
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};