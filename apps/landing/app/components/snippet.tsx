import confetti from "canvas-confetti";
import { useState } from "react";
import CheckCopyIcon from "./icons/checkCopy";
import CopyIcon from "./icons/copy";

export default function Snippet() {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-gray-500 bg-secondary p-2 text-white">
      <span className="font-mono font-semibold">
        npm install @snpm-io/cli -g
      </span>
      <button
        className={isCopied ? "ml-2 text-green-400" : "ml-2 text-gray-400"}
        onClick={() => {
          navigator.clipboard.writeText("npm install @snpm-io/cli -g");
          setIsCopied(true);
          confetti({
            particleCount: 100,
            gravity: 0.2,
            disableForReducedMotion: true,
            origin: {
              x: 0.58,
              y: 0.65,
            },
          });
        }}
      >
        {isCopied ? <CheckCopyIcon className="text-green-700" /> : <CopyIcon />}
      </button>
    </div>
  );
}
