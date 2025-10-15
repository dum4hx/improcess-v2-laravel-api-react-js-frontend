import type React from "react";

export default function Button({
    text,
    onClick,
}: {
    text: string;
    children?: React.ReactNode;
    onClick: () => Promise<void>;
}) {
    return (
        <>
            <button className="hover:cursor-pointer" onClick={() => onClick()}>
                {text}
            </button>
        </>
    );
}
