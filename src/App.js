import { useState } from "react";

const App = () => {
  const [images, setImages] = useState(null);
  const [input, setInput] = useState("");

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
