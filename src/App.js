import * as download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { useState } from "react";
import "./App.css";
import SidebarItem from "./components/SidebarItem";
import Slider from "./components/Slider";

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200,
    },
    unit: "%",
  },
  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100,
    },
    unit: "%",
  },
  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360,
    },
    unit: "deg",
  },
  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20,
    },
    unit: "px",
  },
];

const App = () => {
  const [selectedIndex, SetSelectedIndex] = useState(0);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [image, setImage] = useState(null);
  const selectedOption = options[selectedIndex];

  const handleSliderChange = ({ target }) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedIndex) return option;
        return {
          ...option,
          value: target.value,
        };
      });
    });
  };

  const downloadImage = () => {
    htmlToImage.toPng(document.getElementById("image")).then((dataUrl) => {
      download(dataUrl, `${Date.now()}.png`);
      console.log(dataUrl);
    });
  };

  const handleImage = (event) => {
    const objectUrl = URL.createObjectURL(event.target.files[0]);
    setImage(objectUrl);
  };

  const applyFilters = () => {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });
    return {
      filter: filters.join(" "),
      backgroundImage: `url(${image})`,
    };
  };

  return (
    <div className="container">
      {image ? (
        <div className="main-image" style={applyFilters()} id="image" />
      ) : (
        <div className="upload-image">
          <h1>Editing Tool</h1>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
      )}

      <div className="sidebar">
        {options.map((option, index) => (
          <SidebarItem
            key={index}
            name={option.name}
            active={index === selectedIndex}
            handleClick={() => SetSelectedIndex(index)}
          />
        ))}
        <button onClick={downloadImage} className="download">
          Download
        </button>
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />
    </div>
  );
};

export default App;
