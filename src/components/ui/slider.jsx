import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(
  (
    {
      className,
      value = [0, 100],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      minStepsBetweenThumbs = 1,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragIndex, setDragIndex] = React.useState(null);
    const sliderRef = React.useRef(null);
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const getPercentage = (val) => ((val - min) / (max - min)) * 100;

    const getValueFromPosition = (clientX) => {
      if (!sliderRef.current) return min;
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    };

    const handleMouseDown = (e, index) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragIndex(index);

      const newValue = getValueFromPosition(e.clientX);
      const newValues = [...localValue];
      newValues[index] = Math.max(min, Math.min(max, newValue));

      // Ensure minStepsBetweenThumbs
      if (index === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(
          newValues[0],
          newValues[1] - minStepsBetweenThumbs * step
        );
      } else if (index === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(
          newValues[1],
          newValues[0] + minStepsBetweenThumbs * step
        );
      }

      setLocalValue(newValues);
      onValueChange?.(newValues);
    };

    const handleMouseMove = (e) => {
      if (!isDragging || dragIndex === null) return;

      const newValue = getValueFromPosition(e.clientX);
      const newValues = [...localValue];
      newValues[dragIndex] = Math.max(min, Math.min(max, newValue));

      // Ensure minStepsBetweenThumbs
      if (dragIndex === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(
          newValues[0],
          newValues[1] - minStepsBetweenThumbs * step
        );
      } else if (dragIndex === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(
          newValues[1],
          newValues[0] + minStepsBetweenThumbs * step
        );
      }

      setLocalValue(newValues);
      onValueChange?.(newValues);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragIndex(null);
    };

    // Touch support
    const handleTouchStart = (e, index) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      e.stopPropagation();
      setIsDragging(true);
      setDragIndex(index);

      const newValue = getValueFromPosition(touch.clientX);
      const newValues = [...localValue];
      newValues[index] = Math.max(min, Math.min(max, newValue));

      if (index === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(
          newValues[0],
          newValues[1] - minStepsBetweenThumbs * step
        );
      } else if (index === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(
          newValues[1],
          newValues[0] + minStepsBetweenThumbs * step
        );
      }

      setLocalValue(newValues);
      onValueChange?.(newValues);
    };

    const handleTouchMove = (e) => {
      if (!isDragging || dragIndex === null) return;
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];

      const newValue = getValueFromPosition(touch.clientX);
      const newValues = [...localValue];
      newValues[dragIndex] = Math.max(min, Math.min(max, newValue));

      if (dragIndex === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(
          newValues[0],
          newValues[1] - minStepsBetweenThumbs * step
        );
      } else if (dragIndex === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(
          newValues[1],
          newValues[0] + minStepsBetweenThumbs * step
        );
      }

      setLocalValue(newValues);
      onValueChange?.(newValues);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setDragIndex(null);
    };

    React.useEffect(() => {
      if (isDragging) {
        const mouseMoveHandler = (e) => handleMouseMove(e);
        const mouseUpHandler = () => handleMouseUp();
        const touchMoveHandler = (e) => handleTouchMove(e);
        const touchEndHandler = () => handleTouchEnd();

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        document.addEventListener("touchmove", touchMoveHandler);
        document.addEventListener("touchend", touchEndHandler);

        return () => {
          document.removeEventListener("mousemove", mouseMoveHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
          document.removeEventListener("touchmove", touchMoveHandler);
          document.removeEventListener("touchend", touchEndHandler);
        };
      }
    }, [isDragging, dragIndex, localValue]);

    const handleTrackClick = (e) => {
      if (isDragging) return;

      const clickValue = getValueFromPosition(e.clientX);
      const newValues = [...localValue];

      // Determine which thumb to move based on which is closer
      const distanceToFirst = Math.abs(clickValue - newValues[0]);
      const distanceToSecond =
        newValues[1] !== undefined
          ? Math.abs(clickValue - newValues[1])
          : Infinity;

      const targetIndex = distanceToFirst < distanceToSecond ? 0 : 1;
      newValues[targetIndex] = Math.max(min, Math.min(max, clickValue));

      // Ensure minStepsBetweenThumbs
      if (targetIndex === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(
          newValues[0],
          newValues[1] - minStepsBetweenThumbs * step
        );
      } else if (targetIndex === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(
          newValues[1],
          newValues[0] + minStepsBetweenThumbs * step
        );
      }

      setLocalValue(newValues);
      onValueChange?.(newValues);
    };

    return (
      <div
        ref={sliderRef}
        className={cn(
          "relative flex w-full items-center h-6 cursor-pointer select-none touch-none",
          className
        )}
        onClick={handleTrackClick}
        {...props}
      >
        {/* Track */}
        <div className="relative h-1.5 w-full bg-gray-200 rounded-full">
          {/* Range */}
          <div
            className="absolute h-full bg-black rounded-full"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${
                getPercentage(localValue[1] || localValue[0]) -
                getPercentage(localValue[0])
              }%`,
            }}
          />
        </div>

        {/* Thumbs */}
        {localValue.map((val, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full shadow cursor-grab active:cursor-grabbing hover:scale-110 transition-transform touch-none"
            style={{
              left: `calc(${getPercentage(val)}% - 8px)`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
          />
        ))}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
