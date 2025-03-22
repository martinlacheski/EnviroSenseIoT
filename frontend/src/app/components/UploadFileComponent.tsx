import { Button, Card, Image, Modal, Spinner } from "react-bootstrap";
import api from "../../api/api";
import { useEffect, useRef, useState } from "react";
import { SweetAlert2 } from "../utils";
interface S3File {
  path: string;
  is_image: boolean;
  originalname: string;
}

interface ExistingFile {
  endpoint: string;
  s3_file: S3File;
}

export const UploadFileComponent = ({ endpoint, s3_file }: ExistingFile) => {
  const [url, setUrl] = useState<string | undefined>(s3_file.path);
  const [isImage, setIsImage] = useState(s3_file.is_image);

  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  }, [file]);

  const handleSubmit = async () => {
    if (!file) {
      SweetAlert2.errorAlert("¡No se ha seleccionado ningún archivo válido!");
      return;
    }

    const message = "¿Estás seguro de subir el archivo seleccionado?";
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) {
      setFile(undefined);
      return;
    }

    try {
      setLoading(true);
      setFileLoading(true);
      const formData = new FormData();
      file && formData.append("file", file);

      const { data } = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SweetAlert2.successToast(
        data.message || "¡Archivo subido correctamente!"
      );
      setUrl(data.url);
      setIsImage(data.is_image);
    } catch (error) {
      console.error(error);
      SweetAlert2.errorAlert("¡Error al subir el archivo!");
    } finally {
      setFileLoading(false);
      setLoading(false);
      setFile(undefined);
    }
  };

  const handleDelete = async () => {
    const message = "¿Estás seguro de eliminar el archivo actual?";
    const confirmation = await SweetAlert2.confirm(message);
    if (!confirmation.isConfirmed) return;

    try {
      setLoading(true);
      const { data } = await api.delete(endpoint);
      SweetAlert2.successToast(
        data.message || "¡Archivo eliminado correctamente!"
      );
      setUrl("");
      setIsImage(false);
    } catch (error) {
      console.error(error);
      SweetAlert2.errorAlert("¡Error al eliminar el archivo!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileLoad = () => {
    setFileLoading(false);
  };

  const handleFileError = () => {
    setFileLoading(false);
    setUrl("");
  };

  const handleImageModal = () => {
    if (url) {
      if (isImage) {
        setShowImageModal(true);
      } else {
        window.open(url, "_blank");
      }
    }
  };

  return (
    <Card>
      <Card.Header>
        <i className="bi bi-file-earmark me-2"></i>
        <span>Documentación adjunta</span>
      </Card.Header>
      <Card.Body className="py-2 text-center">
        {url ? (
          <div className="d-flex flex-column gap-2">
            {isImage ? (
              <Image
                fluid
                src={url}
                thumbnail
                onError={handleFileError}
                onClick={handleImageModal}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center border rounded-1 p-2">
                <i className="bi bi-file-earmark-text fs-2"></i>
              </div>
            )}

            <Button
              variant="danger"
              size="sm"
              title="Eliminar archivo"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ) : (
          <div>
            {!fileLoading && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  className="px-3 my-2"
                  title="Subir archivo"
                  onClick={handleInputClick}
                >
                  <i className="bi bi-upload me-2"></i>
                  Subir archivo
                </Button>

                <input
                  type="file"
                  // accept={Array.from(extensions.keys()).join(", ")}
                  accept="image/*"
                  onChange={handleInputChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>
        )}

        {fileLoading && (
          <div className="p-3">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}

        <Modal show={loading} centered>
          <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
            <p className="text-muted mb-4">
              Se están guardando los cambios. Por favor, espera...
            </p>
            <span className="loader"></span>
          </Modal.Body>
        </Modal>

        {url && isImage && (
          <Modal
            show={showImageModal}
            size="lg"
            onHide={() => setShowImageModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Archivo</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Image
                src={url}
                thumbnail
                fluid
                style={{ maxHeight: "70vh" }}
                onError={handleFileError}
                onLoad={handleFileLoad}
              />
            </Modal.Body>
          </Modal>
        )}
      </Card.Body>
    </Card>
  );
};
