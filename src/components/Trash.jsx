import { useQuery } from "@tanstack/react-query";
import { getTrashedLyrics } from "@/api/lyric";
import LyricCard from "./LyricCard";

const Trash = () => {
  const {
    data: lyrics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["TrashCreations"],
    queryFn: getTrashedLyrics,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-sm:justify-self-center max-sm:self-center sm:justify-self-center sm:self-center">
      {lyrics?.map((lyric) => (
        <LyricCard
          key={lyric.id}
          lyricId={lyric.id}
          author={lyric.user.email}
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
    </div>
  );
};
export default Trash;
