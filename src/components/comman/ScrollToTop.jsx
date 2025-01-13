import React, { useState, useEffect } from "react";
const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    // Show the button when the user scrolls down
    const handleScroll = () => {
        if (window.scrollY > 150) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };
    // Scroll to top when the button is clicked
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    useEffect(() => {
        // Attach the scroll event listener when the component mounts
        window.addEventListener("scroll", handleScroll);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <div className="psoition-realtive">
            {isVisible && (
                <button
                    className="position-fixed scroll_top rounded-circle btn-primary btn p-2 rounded-full"
                    onClick={scrollToTop}
                >
                    <i className="ri-corner-right-up-line fs-18 align-middle inline-block"></i>
                </button>
            )}
        </div>
    );
};
export default ScrollToTop;