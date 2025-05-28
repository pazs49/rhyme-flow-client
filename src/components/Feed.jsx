import { useQuery } from "@tanstack/react-query";
import { getAllLyrics } from "@/api/lyric";
import LyricCard from "./LyricCard";

const Feed = () => {
  const {
    data: lyrics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AllCreations"],
    queryFn: getAllLyrics,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {lyrics?.map((lyric) => (
        <LyricCard
          key={lyric.id}
          lyricId={lyric.id}
          author={lyric.user.email}
          likers={lyric.likers}
          lyricPublic={lyric.public}
          likersCount={lyric.likers.length}
          commentsCount={lyric.comments.length}
          title={lyric.title}
          lyrics={lyric.body}
          mood={lyric.mood}
          genre={lyric.genre}
          comments={lyric.comments}
        />
      ))}
    </div>
  );
};
export default Feed;
