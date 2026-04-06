import { useState, useRef, useEffect } from 'react';

export const useProfilePosts = () => {
    const dropdownRef = useRef(null);

    const [isOpenSort, setIsOpenSort] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Gần đây nhất");
    const sortOptions = ["Gần đây nhất", "Cũ nhất", "Phổ biến nhất"];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenSort(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedSort(option);
        setIsOpenSort(false);
    };

    return {
        dropdownRef,
        isOpenSort,
        selectedSort,
        sortOptions,
        handleSelect,
        setIsOpenSort
    }
}
