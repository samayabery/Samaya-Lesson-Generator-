import React, { useState, useEffect } from "react";
import { InfiniteMovingCards } from "../src/components/ui/infinite-moving-cards";
import MyComponent from "./Background";

export default function Home() {
  
  const [count, setCount] = useState(-2);

  const increment = () => {

    setCount(count + count ); // Update count
  };

  const increment2 = () => {

    setCount(count - 1); // Update count
  };

  return ( 
    <>
    <MyComponent/>
    <div className="flex justify-center items-center text-4xl pb-[15vh] pt-[25vh]"> 
      Counter...
    </div>
    <div className="flex gap-10 item-center justify-center h-screen">
    <button onClick={increment2}
    className="flex items-center justify-center h-[12vh] w-[12vh] text-black text-5xl rounded-xl border-2 border-purple-400">
      -
    </button>
    <div className="flex items-center justify-center h-[12vh] w-[12vh] text-black text-7xl">
      {count}
    </div>
    <button onClick={increment}
    className="flex items-center justify-center h-[12vh] w-[12vh] text-black text-5xl rounded-xl border-2 border-purple-400">
      +
    </button>
    </div>
    </>
  );
}




