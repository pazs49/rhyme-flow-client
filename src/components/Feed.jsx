import { useQuery } from "@tanstack/react-query";
import { getAllLyrics } from "@/api/lyric";
import LyricCard from "./LyricCard";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";

function Items({ currentItems }) {
  // console.log("currentItemns", currentItems);
  return (
    <>
      {currentItems &&
        currentItems.map((lyric) => (
          <LyricCard
            key={lyric.id}
            lyricId={lyric.id}
            author={lyric.user?.email || "Anonymous"}
            likers={lyric.likers}
            createdAt={lyric.created_at}
            lyricPublic={lyric.public}
            likersCount={lyric.likers.length}
            commentsCount={lyric.comments.length}
            title={lyric.title}
            lyrics={lyric.body}
            mood={lyric.mood}
            genre={lyric.genre}
            comments={lyric.comments}
            isTrashed={lyric.trashed}
          />
        ))}
    </>
  );
}

const Feed = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: lyrics, isLoading } = useQuery({
    queryKey: ["AllCreations", currentPage],
    queryFn: async () => {
      const response = await getAllLyrics(currentPage, 10);
      return response;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const currentItems = lyrics ? lyrics.data : [];
  const pageCount = lyrics ? lyrics.meta.total_pages : 0;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
    console.log("new page ", event.selected + 1);
  };

  if (isLoading) return "Loading...";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-sm:justify-self-center max-sm:self-center sm:justify-self-center sm:self-center">
        <Items currentItems={currentItems} />
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        forcePage={currentPage - 1}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="Previous"
        renderOnZeroPageCount={null}
        className="flex justify-center items-center gap-2 w-full"
        // Page number buttons
        pageClassName="bg-slate-500 rounded-md"
        pageLinkClassName="block w-full h-full px-4 py-2 text-center cursor-pointer select-none"
        activeLinkClassName="bg-green-600 text-white rounded-md"
        // Prev/Next buttons
        previousClassName="bg-slate-500 rounded-md"
        previousLinkClassName="block w-full h-full px-4 py-2 text-center cursor-pointer select-none"
        nextClassName="bg-slate-500 rounded-md"
        nextLinkClassName="block w-full h-full px-4 py-2 text-center cursor-pointer select-none"
      />
    </>
  );
};
export default Feed;
