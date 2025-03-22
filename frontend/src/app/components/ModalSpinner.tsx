import { Modal } from "react-bootstrap";

interface ModalSpinnerProps {
  show: boolean;
  showText?: boolean;
  text?: string;
}
export const ModalSpinner = ({
  show,
  showText = true,
  text = "Cargando...",
}: ModalSpinnerProps) => {
  return (
    <Modal show={show} centered>
      <Modal.Body className="text-center d-flex flex-column align-items-center gap-3 p-4">
        <div className="spinner-border" role="status"></div>
        {showText && (
          <span>
            <strong>{text}</strong>
          </span>
        )}
      </Modal.Body>
    </Modal>
  );
};
