import Link from "next/link";
import connect from "../../Backend/database/dbtest";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Blocks({ data }) {
  const [blocks, setBlocks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const HeightRef = useRef();
  const LatestBlockHeight = useRef();
  const isLoading = useRef(false);

  const MINUTE_MS = 1000;

  const loadOnScroll = async () => {
    isLoading.current = true;

    const res = await fetch(
      `http://localhost:3000/api/fetchBlocks?blockHeight=${HeightRef.current}`
    );
    const newBlocks = await res.json();

    HeightRef.current = newBlocks[newBlocks.length - 1].Height;
    setBlocks((prevBlocks) => [...prevBlocks, ...newBlocks]);
    isLoading.current = false;
  };

  const loadLatestBlocks = async () => {
    const res = await fetch(
      `http://localhost:3000/api/fetchBlocks?blockHeight=${LatestBlockHeight.current}&latest=1`
    );

    const newBlocks = await res.json();

    if (
      newBlocks.length > 0 &&
      newBlocks[0].Height > LatestBlockHeight.current
    ) {
      setBlocks((prevBlocks) => [...new Set([...newBlocks, ...prevBlocks])]);
      LatestBlockHeight.current = newBlocks[0].Height;
    }
  };

  const observer = useRef();
  const lastBlockRef = useCallback(
    (node) => {
      if (isLoading.current) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading.current]
  );

  useEffect(() => {
    setBlocks(data);
    HeightRef.current = data[data.length - 1].Height;
    LatestBlockHeight.current = data[0].Height;
  }, []);

  useEffect(() => {
    loadOnScroll();
    console.log("loadscroll calleed");
  }, [pageNumber]);

  useEffect(() => {
    const interval = setInterval(async () => {
      loadLatestBlocks();
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (
    <div className="bg-black flex justify-center pt-[2em]">
      <div className="w-full h-full bg-gradient-to-r from-indigo-700 to-sky-600 rounded-2xl  text-white grid grid-rows-[4em_1fr] mx-[6em]">
        <div className=" text-4xl font-bold pl-[1em] pt-[1em]">
          Latest Blocks
        </div>
        <div className="pt-[2em]">
          <div className="grid grid-cols-[1fr_3fr_1fr_1fr] font-bold h-[3em] text-xl border-b-2">
            <div className="flex justify-center"> Block Height </div>
            <div className="flex justify-center">Block Header</div>
            <div className="flex justify-center"> Transactions </div>
            <div className="flex justify-center"> Block Size </div>
          </div>
          {blocks.map((block, index) => {
            if (blocks.length === index + 1) {
              return (
                <div
                  ref={lastBlockRef}
                  key={block.blockHeader.blockhash}
                  className="cursor-pointer grid grid-cols-[1fr_3fr_1fr_1fr] border-b-[1px] h-[4em] pt-[1em] hover:bg-gradient-to-r  from-purple-600 to-blue-400 rounded-2xl"
                >
                  <div className="flex justify-center"> {block.Height} </div>
                  <Link
                    href={
                      `/blocks/block?blockhash=` + block.blockHeader.blockhash
                    }
                  >
                    <div className=" ">
                      <div className="flex justify-start px-[2em]">
                        {block.blockHeader.blockhash}
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-center"> {block.TxCount} </div>
                  <div className="flex justify-center"> {block.BlockSize} </div>
                </div>
              );
            } else {
              return (
                <div
                  key={block.blockHeader.blockhash}
                  className="cursor-pointer grid grid-cols-[1fr_3fr_1fr_1fr] border-b-[1px] h-[4em] pt-[1em] hover:bg-gradient-to-r  from-purple-600 to-blue-400 rounded-2xl"
                >
                  <div className="flex justify-center"> {block.Height} </div>
                  <Link
                    href={
                      `/blocks/block?blockhash=` + block.blockHeader.blockhash
                    }
                  >
                    <div className=" ">
                      <div className="flex justify-start px-[2em]">
                        {block.blockHeader.blockhash}
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-center"> {block.TxCount} </div>
                  <div className="flex justify-center"> {block.BlockSize} </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const connection = await connect();
  // const blocks = JSON.parse(JSON.stringify(await read.main(false, false, 20)));
  const res = await fetch("http://localhost:3000/api/fetchBlocks");
  const data = await res.json();

  return {
    props: { data },
  };
}
