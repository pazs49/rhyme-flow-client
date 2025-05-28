import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ThumbsUp, MessageCircle, Send, Lock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import ReactMarkdown from "react-markdown";

import { truncate } from "lodash";
import { useState } from "react";
import { commentOnLyric, likeLyric } from "@/api/lyric";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useCurrentUserInfo from "@/stores/currentUserInfo";

const LyricCard = ({
  title,
  lyrics,
  mood,
  genre,
  author,
  likers,
  lyricPublic,
  likersCount,
  commentsCount,
  comments,
  lyricId,
}) => {
  const { currentUserInfo } = useCurrentUserInfo();
  const queryClient = useQueryClient();
  const commentOnLyricMutation = useMutation({
    mutationFn: async (lyricId, comment) => {
      console.log(lyricId);
      await commentOnLyric(lyricId, comment);
    },
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["creations"]);
      toast.success("Comment added!");
    },
    onError: () => {
      toast.error("Error adding comment!");
    },
    onSettled: () => {
      setComment("");
    },
  });
  const likeLyricMutation = useMutation({
    mutationFn: async (lyricId) => {
      console.log(lyricId);
      await likeLyric(lyricId);
    },
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["creations"]);
    },
    onError: () => {},
    onSettled: () => {
      setComment("");
    },
  });
  const [comment, setComment] = useState("");
  dayjs.extend(relativeTime);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className={`max-w-[400px] shadow-lg cursor-pointer  ${
              author === currentUserInfo.email && "shadow-md shadow-green-500"
            }`}
          >
            <CardHeader>
              <CardTitle className={"flex flex-col font-bold"}>
                <div className="flex justify-between">
                  <span>{truncate(title, { length: 20 })}</span>
                  <span className="text-xs">
                    {!lyricPublic && (
                      <span className="flex gap-1 items-center">
                        Private <Lock />
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-xs">By {author}</span>
                <div className="flex gap-2 mt-2">
                  <Badge className={"bg-green-600"}>{genre}</Badge>
                  <Badge className={"bg-green-600"}>{mood}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{truncate(lyrics, { length: 100 })}</p>
            </CardContent>
            <CardContent className={"flex gap-2"}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  likeLyricMutation.mutate({ lyricId });
                  console.log("like");
                }}
                variant={"primary"}
                className={`flex ${
                  likers.some((liker) => liker.email === currentUserInfo.email)
                    ? "bg-blue-600"
                    : "bg-green-600"
                }`}
              >
                <ThumbsUp />
                <span>{likersCount}</span>
              </Button>
              <Button variant={"primary"} className={"flex"}>
                <MessageCircle />
                <span>{commentsCount}</span>
              </Button>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="fixed inset-0 m-auto w-fit h-fit">
          <DialogHeader>
            <DialogTitle className={"text-center font-bold text-2xl"}>
              {title}
            </DialogTitle>
            <DialogDescription className={"text-center"}>
              {author}
            </DialogDescription>
            <Separator />
            <div className="prose text-white max-h-[29rem] overflow-y-scroll">
              <ReactMarkdown>{lyrics}</ReactMarkdown>
            </div>
            <Separator />

            {/* Comments section */}
            <div className="space-y-2 max-h-[20rem] overflow-y-scroll">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-600 p-2 rounded-md">
                  <div className="flex gap-2 justify-between items-center">
                    <div className="font-bold">{comment.user.email}</div>
                    <div className="text-xs">
                      {dayjs(comment.created_at).fromNow()}
                    </div>
                  </div>
                  <div>{comment.body}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Comment"
              />
              <Button
                onClick={() => {
                  console.log("Before mutation, comment:", comment);
                  commentOnLyricMutation.mutate({ lyricId, comment });
                }}
                variant={"primary"}
              >
                <Send />
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default LyricCard;
