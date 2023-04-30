import { useState } from "react";
import Modal from "./components/modal";

const App = () => {
  const [images, setImages] = useState(null);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const surpriseOptions = [
    "A panda eating bamboo",
    "A purple rhino hiking in a jungle",
    "A monkey studying in a cave with a human",
  ];

  const surpriseMe = () => {
    setImages(null);
    const randomVal =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];

    setInput(randomVal);
  };

  const handleGenerateImage = async () => {
    setImages(null);

    if (input === "") {
      alert("Must have an input");
    }

    const config = {
      method: "POST",
      body: JSON.stringify({
        message: input,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch("http://localhost:8000/images", config);
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadImage = async (e) => {
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = "";

    const config = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch("http://localhost:8000/upload", config);

      const data = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const generateVariations = async () => {
    setImages(null);
    if (selectedImage === null) {
      alert("Please select an image");
      setModalOpen(false);
      return;
    }
    const config = {
      method: "POST",
    };

    try {
      const response = await fetch("http://localhost:8000/variations", config);
      const data = await response.json();
      setImages(data);
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start with a detailed description{" "}
          <span className="surprise" onClick={surpriseMe}>
            Surprise me!
          </span>
        </p>
        <div className="input-container">
          <input
            value={input}
            placeholder="A perfect sunny morning on top of a hill"
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleGenerateImage}>Generate</button>
        </div>
        <p className="extra-info">
          Or
          <span>
            <label htmlFor="files"> upload an image </label>
            <input
              onChange={handleUploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            />
            to edit.
          </span>
        </p>
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`AI-Generated ${input}`} />
        ))}
      </section>
    </div>
  );
};

export default App;
