import React, { useCallback, useEffect, useRef, useState } from "react";
import { HexColorInput, HexColorPicker, RgbStringColorPicker } from "react-colorful";
import useClickOutside from "./hooks/useClickOutside";
import { classInput } from "./MainConfig";
import { useDebounce } from "@uidotdev/usehooks";
function getContrastingColor(rgbString) {
    // Remove the "rgb(" prefix and the closing ")" character
    rgbString = rgbString.replace("rgb(", "").replace(")", "");

    // Split the RGB values into an array
    const rgbArray = rgbString.split(",");

    // Extract the individual R, G, and B values
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    if (luminance > 128) {
        return "black"; // Use black text on light backgrounds
    } else {
        return "white"; // Use white text on dark backgrounds
    }
}
export const ColorPicker = ({ color, onChange, text = (lang == "th_th" ? "เลือกสี" : "Choose Color")}) => {
    // console.log("ColorPicker:",color);
    const popover = useRef();
    const [isOpen, toggle] = useState(false);
    const [value, setValue] = useState(color);
  
    // Use debouncedValue to debounce changes
    const debouncedValue = useDebounce(value, 200);
  
    // Close the popover when clicking outside
    const close = useCallback(() => toggle(false), []);
    
    // Handle value changes and call the onChange callback
    useEffect(() => {
      onChange(debouncedValue);
    }, [debouncedValue, onChange]);
  
    // Handle clicks outside the popover
    useClickOutside(popover, close);
    // console.log(value);
    return (
      <div className="relative">
        <div
          className={`w-full justify-center flex px-3 py-1 font-bold rounded-lg border-[1px]
          ${getContrastingColor(value) === "black" ? "text-black" : "text-white"} 
          border-white shadow-black shadow-md translate-y-3 cursor-pointer tracking-tighter`}
          style={{ backgroundColor: value }}
          onClick={() => toggle(true)}
        >
          {text}
        </div>
        {isOpen && (
          <div className="z-110 absolute top-[calc(100%+2px)] left-0 rounded-lg shadow-black shadow-md" ref={popover}>
            <RgbStringColorPicker color={value} onChange={setValue} />
          </div>
        )}
      </div>
    );
  };