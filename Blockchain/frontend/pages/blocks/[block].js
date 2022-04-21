import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import read from "../../../Backend/database/read";
import connect from "../../../Backend/database/dbtest";
export default function Block({ block }) {
  const { Height, BlockSize, TxCount, Transactions } = block[0];
  const { bits, timestamp, nonce, merkleroot, prevBlockHash } =
    block[0].blockHeader;
  const router = useRouter();

  const { blockhash } = router.query;

  return (
    <div className="bg-black min-h-screen pt-[4em]">
      <div className="bg-gradient-to-r  from-indigo-700 to-sky-600 rounded-2xl mx-[5em] ">
        <div className=" grid grid-cols-[30%_70%] text-white px-[6em]">
          {/* Populate Block Numner*/}
          <div className=" flex items-center col-span-2 h-[3em]  text-3xl font-bold pl-[1em]">
            Block #{Height}
          </div>
          {/* Block Header*/}

          <div className="flex items-center col-span-2 h-[3em] ml-[1.2em] text-2xl font-bold border-b-[1px] ">
            {blockhash}
          </div>

          {/* Block Field Names*/}
          <div className=" pl-[2em] pb-[4em]">
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Previous Block Hash </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Merkle Root </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Timestamp </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Nonce </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Number of Transactions </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Bits </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> Blocksize </h1>
            </div>
          </div>
          {/* Populate Block Data*/}
          <div className="">
            <Link href={`/blocks/block?blockhash=` + prevBlockHash}>
              <div className="flex items-center h-[3em] text-lg border-b-[1px] cursor-pointer underline">
                <h1> {prevBlockHash} </h1>
              </div>
            </Link>

            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {merkleroot} </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {timestamp} </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {nonce} </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {TxCount} </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {bits} </h1>
            </div>
            <div className="flex items-center h-[3em] text-lg border-b-[1px]">
              <h1> {BlockSize} </h1>
            </div>
          </div>
        </div>
      </div>

      <div
        className="text-white bg-gradient-to-r  from-indigo-700 to-sky-600 rounded-2xl mx-[5em] 
      mt-[2em] min-h-[15em] grid grid-rows-[3em_1fr]"
      >
        <div className="flex items-center pl-[1em] text-2xl font-bold">
          Transactions
        </div>
        <div className="flex justify-center items-center">{Transactions}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { blockhash } = context.query;
  const filter = { "blockHeader.blockhash": blockhash };
  const connection = await connect();
  const block = JSON.parse(JSON.stringify(await read.main(false, filter)));
  console.log("block", block);
  return {
    props: { block },
  };
}
