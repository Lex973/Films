import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, ms: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, ms);

        return () => clearTimeout(timer);
    }, [value, ms]);

    return debouncedValue;
};

export default useDebounce;