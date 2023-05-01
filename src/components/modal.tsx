import { useState, useRef, SetStateAction } from "react";

interface ModalProps {
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<SetStateAction<File | null>>; // Allow for null value
  selectedImage: File | null; // Allow for null value
  generateVariations: () => Promise<void>;
}

const Modal = ({
  setModalOpen,
  setSelectedImage,
  selectedImage,
  generateVariations,
}: ModalProps) => {
  const [error, setError] = useState<string | null>(null);

  const ref = useRef<HTMLImageElement>(null);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleCheckSize = () => {
    if (ref.current?.width === 256 && ref.current?.height === 256) {
      generateVariations();
    } else {
      setError(`Error uploading Image! Please use 256 x 256 size`);
    }
  };

  return (
    <div className="modal">
      <div onClick={closeModal}>X</div>
      <div className="img-container">
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            ref={ref}
            alt="your-img"
          />
        )}
      </div>
      <p>{error || "* Image must be 256 x 256"}</p>
      {!error && <button onClick={handleCheckSize}>Generate</button>}
      {error && <button onClick={closeModal}>Close</button>}
    </div>
  );
};
export default Modal;
