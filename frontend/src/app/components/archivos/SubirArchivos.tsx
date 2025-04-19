import { useCallback, useMemo, useState } from "react";
import { Button, Card, Row, ButtonGroup, Modal } from "react-bootstrap";
import { SweetAlert2 } from "../../utils";
import { useDropzone } from "react-dropzone";
import api from "../../../api/api";
import { Archivo } from "./interfaces";

interface Props {
  endpoint: string;
  id_carpeta: number | string;
  updateFiles: (files: Archivo[]) => void;
  setKey?: React.Dispatch<React.SetStateAction<string>>;
}

export const SubirArchivos = ({
  endpoint,
  id_carpeta,
  updateFiles,
  setKey,
}: Props) => {
  const [maxCount] = useState(10);
  const [maxNameLength] = useState(200);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      SweetAlert2.errorAlert("¡No hay archivos seleccionados!");
      return;
    }

    const confirmation = await SweetAlert2.confirm(
      "¿Estás seguro de subir los archivos seleccionados?"
    );
    if (!confirmation.isConfirmed) return;

    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("id_carpeta", id_carpeta.toString());

      const { data } = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      SweetAlert2.successToast(data.message || "¡Archivos subidos!");
      updateFiles(data.archivos);
      setFiles([]);
      setKey && setKey("archivos");
    } catch (error) {
      console.log(error);
      SweetAlert2.errorAlert("¡Algo salió mal! Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxCount) {
        SweetAlert2.errorAlert(
          `¡Solo puedes subir hasta ${maxCount} archivos!`
        );
        return;
      }
      const names_ok = acceptedFiles.every(
        (file) => file.name.length <= maxNameLength
      );
      if (!names_ok) {
        SweetAlert2.errorAlert(
          `¡El nombre de los archivos no puede superar los ${maxNameLength} caracteres!`
        );
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    [files, maxCount, maxNameLength]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: maxCount,
    noClick: true,
    noKeyboard: true,
  });

  const baseStyle = {
    marginTop: 10,
    padding: "10px",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DEE2E6",
    borderStyle: "dashed",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  const reset = () => {
    setFiles([]);
  };

  return (
    <div className="px-2">
      <form className="mx-auto" onSubmit={handleSubmit}>
        <p className="mb-0 fw-bold text-muted">Subir archivos</p>
        <p className="text-muted lh-sm mb-0" style={{ fontSize: "14px" }}>
          Arrastra y suelta los archivos que deseas subir en el recuadro
          inferior, o{" "}
          <button
            type="button"
            className="btn btn-sm p-0 btn-link"
            onClick={open}
            title="Seleccionar archivos desde el explorador"
          >
            haz clic aquí
          </button>{" "}
          para seleccionarlos (máximo {maxCount} archivos).
        </p>

        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {files.length === 0 && (
            <button
              type="button"
              className="btn btn-light w-100"
              onClick={open}
            >
              <p className="mb-0 text-center text-muted">
                <i className="bi bi-cloud-upload fs-2"></i>
                <br />
                Arrastra y suelta los archivos aquí
              </p>
            </button>
          )}
          {files.length > 0 && (
            <Row xs={1} sm={2} md={3} xl={4} className="g-2">
              {files.map((file, index) => (
                <div key={index}>
                  <Card title={file.name}>
                    <Card.Header className="ps-2 pe-1 py-1 d-flex align-items-center justify-content-between gap-2">
                      <span
                        className="text-truncate text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        <i className="bi bi-file-earmark-text me-1"></i>
                        {file.name}
                      </span>
                      <Button
                        size="sm"
                        className="py-0 px-1"
                        variant="outline-transparent"
                        onClick={() => removeFile(file)}
                        title="Descartar archivo"
                        disabled={uploading}
                      >
                        <i className="bi bi-x-lg fw-bold"></i>
                      </Button>
                    </Card.Header>
                    <Card.Body className="p-0" style={{ height: "150px" }}>
                      {isImage(file) ? (
                        <Card.Img
                          src={URL.createObjectURL(file)}
                          height="100%"
                          className="rounded rounded-top-0"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="h-100 d-flex align-items-center text-center justify-content-center px-3">
                          <i className="bi bi-file-earmark fs-3"></i>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Row>
          )}
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <ButtonGroup>
            <Button
              size="sm"
              variant="secondary"
              onClick={reset}
              disabled={files.length === 0 || uploading}
            >
              <i className="bi bi-eraser ms-1 me-2"></i>
              Limpiar selección
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={files.length === 0 || uploading}
            >
              <i className="bi bi-cloud-arrow-up ms-1 me-2"></i>
              Subir archivos seleccionados
            </Button>
          </ButtonGroup>
        </div>

        <Modal show={uploading} centered>
          <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
            <p className="text-muted mb-4">
              Se están subiendo los archivos. Por favor, espera...
            </p>
            <span className="loader"></span>
          </Modal.Body>
        </Modal>
      </form>
    </div>
  );
};
