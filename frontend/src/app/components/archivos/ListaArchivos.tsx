import { Dropdown, Image, Modal } from "react-bootstrap";
import { Archivo } from "./interfaces";
import { DateFormatter } from "../../helpers";
import { useEffect, useState } from "react";
import "./archivos.styles.css";

interface Props {
  archivos: Archivo[];
  handleDelete: (id: string) => void;
  deleting?: boolean;
  handleDownload: (fileUrl: string) => void;
  downloading?: boolean;
}

export const ListaArchivos = ({
  archivos,
  handleDelete,
  deleting,
  handleDownload,
  downloading,
}: Props) => {
  const [imagenes, setImagenes] = useState<Archivo[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!archivos) return;
    setImagenes(archivos.filter((file) => file.image));
  }, [archivos]);

  const handleClick = (idFile: string) => {
    const image = imagenes.find((file) => file.id === idFile);
    if (!image) return;
    setImageUrl(image.fileUrl);
    setShowCarousel(true);
  };

  return (
    <div className="px-2">
      {archivos.length === 0 ? (
        <p className="text-muted text-center mt-4">
          <i className="bi bi-exclamation-circle me-2"></i>
          Esta carpeta no tiene ningún archivo o documento adjunto. ¡Sube
          archivos para visualizarlos aquí!
        </p>
      ) : (
        <>
          <p className="mb-0 fw-bold text-muted">Listado de archivos</p>
          <p className="text-muted lh-sm mb-3" style={{ fontSize: "14px" }}>
            Aquí puedes ver los archivos y documentos adjuntos a esta carpeta.
            Haz clic en la imagen o en el nombre del archivo para verlo en
            tamaño completo.
          </p>
          {archivos.map((archivo) => (
            <div
              className="file-div"
              style={{ fontSize: "14px" }}
              key={archivo.id}
            >
              <div className="w-50 d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 custom-file">
                <Image
                  width={50}
                  src={
                    archivo.image ? archivo.fileUrl : "/images/no-image.webp"
                  }
                  thumbnail
                  alt={archivo.originalname}
                />
                <span
                  className="fw-bold"
                  onClick={() => handleClick(archivo.id)}
                >
                  {archivo.originalname}
                </span>
              </div>
              <div className="w-25 d-flex flex-column flex-lg-row">
                <small className="text-muted w-50">
                  <i className="bi bi-clock-history me-1"></i>
                  {DateFormatter.toDDmmYYYYhhMM(archivo.createdAt)}
                </small>
                <small className="text-muted w-50">
                  <i className="bi bi-person me-1"></i>
                  {archivo.user ? archivo.user : "No disponible"}
                </small>
              </div>
              <div className="w-25 d-flex align-items-center justify-content-end gap-2">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="transparent"
                    id="dropdown-basic"
                    className="text-muted custom-dropdown"
                  >
                    <i className="bi bi-three-dots"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleDownload(archivo.fileUrl)}
                    >
                      <i className="bi bi-download me-2"></i> Descargar
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDelete(archivo.id)}
                      disabled={deleting}
                    >
                      <i className="bi bi-trash me-2"></i> Eliminar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))}
        </>
      )}

      <Modal show={deleting || downloading} centered>
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
          <p className="text-muted mb-4">
            {deleting
              ? "Eliminando archivo..."
              : downloading
              ? "Descargando archivo..."
              : ""}
          </p>
          <span className="loader"></span>
        </Modal.Body>
      </Modal>

      <Modal show={showCarousel} onHide={() => setShowCarousel(false)} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <Image
            src={imageUrl}
            fluid
            thumbnail
            className="text-center"
            style={{
              maxHeight: "75vh",
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
