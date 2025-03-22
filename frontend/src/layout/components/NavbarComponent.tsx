import { Button, Container, Navbar } from "react-bootstrap";
import { useAuthStore } from "../../hooks";

interface NavbarComponentProps {
  handleSidebarCollapse: () => void;
}

export const NavbarComponent = ({
  handleSidebarCollapse,
}: NavbarComponentProps) => {
  const { startLogout } = useAuthStore();

  const handleLogout = () => {
    startLogout();
  };

  return (
    <Navbar
      className="bg-light border-bottom"
      style={{ width: "100%", height: "40px" }}
    >
      <Container fluid>
        <Button
          title="Mostrar/ocultar menú"
          variant="light"
          className="border-0 py-0 px-2"
          onClick={handleSidebarCollapse}
        >
          <i className="bi bi-list fs-5"></i>
        </Button>

        <div className="d-flex align-items-center">
          <Button
            title="Cerrar sesión"
            variant="light"
            className="border-0 py-0 px-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-in-right fs-5"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};
