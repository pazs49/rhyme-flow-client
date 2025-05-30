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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ThumbsUp,
  MessageCircle,
  Send,
  Lock,
  Ellipsis,
  Check,
  X,
  Trash,
  Pencil,
} from "lucide-react";
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
import { submitEditLyric } from "@/api/lyric";
import { trashLyric, deleteLyric } from "@/api/lyric";

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
  createdAt,
  isTrashed,
}) => {
  const { currentUserInfo } = useCurrentUserInfo();
  const queryClient = useQueryClient();
  const commentOnLyricMutation = useMutation({
    mutationFn: async (lyricId, comment) => {
      // console.log(lyricId);
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
      // console.log(lyricId);
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

  const [isLyricEdit, setIsLyricEdit] = useState(false);
  const [lyricsBody, setLyricsBody] = useState(lyrics);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isPublic, setIsPublic] = useState(lyricPublic);

  dayjs.extend(relativeTime);

  const cancelEditLyric = () => {
    setIsLyricEdit(false);
    setLyricsBody(lyrics);
  };

  const editLyricMutation = useMutation({
    mutationFn: async (lyric) => {
      await submitEditLyric(lyric);
    },
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries(["creations"]);
      toast.success("Lyric edited!");
    },
    onError: () => {
      toast.error("Error editing lyric!");
    },
    onSettled: () => {
      setIsLyricEdit(false);
      setLyricsBody(lyrics);
    },
  });

  const trashLyricMutation = useMutation({
    mutationFn: async ({ lyricId }) => {
      const data = await trashLyric(lyricId);
      return data;
    },
    onMutate: () => {},
    onSuccess: ({ message }) => {
      // console.log(message);
      queryClient.invalidateQueries(["creations"]);
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: () => {
      setIsDialogOpen(false);
    },
  });

  const deleteLyricMutation = useMutation({
    mutationFn: async ({ lyricId }) => {
      const data = await deleteLyric(lyricId);
      return data;
    },
    onMutate: () => {},
    onSuccess: ({ message }) => {
      // console.log(message);
      queryClient.invalidateQueries(["creations"]);
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    onSettled: () => {
      setIsDialogOpen(false);
    },
  });

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Card
            className={`max-w-[400px] shadow-lg cursor-pointer hover:bg-gray-800/50 ${
              author === currentUserInfo.email && "shadow-md shadow-green-500"
            } ${
              author === currentUserInfo.email &&
              isTrashed &&
              "shadow-md shadow-red-500"
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
            <CardContent className={"flex gap-2 justify-between items-center"}>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    likeLyricMutation.mutate({ lyricId });
                    // console.log("like");
                  }}
                  variant={"primary"}
                  className={`flex ${
                    likers.some(
                      (liker) => liker.email === currentUserInfo.email
                    )
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
              </div>
              <div>{dayjs(createdAt).fromNow()}</div>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Modal */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={
                "text-center font-bold text-2xl flex gap-2 justify-between items-center"
              }
            >
              {author !== currentUserInfo.email && (
                <div className="flex w-full justify-center">{title}</div>
              )}

              {author === currentUserInfo.email && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"primary"}>
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <div
                        className="flex gap-2 w-full"
                        onClick={() => {
                          setIsLyricEdit(true);
                        }}
                      >
                        <Pencil />
                        Edit
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        className="flex gap-2 w-full"
                        onClick={() => {
                          // console.log("moved to trash");
                          trashLyricMutation.mutate({ lyricId });
                        }}
                      >
                        <Trash />
                        <div>{isTrashed ? "Untrash" : "Trash"}</div>
                      </div>
                    </DropdownMenuItem>
                    {isTrashed && (
                      <DropdownMenuItem className={"bg-red-500"}>
                        <div
                          className="flex gap-2 w-full"
                          onClick={() => {
                            // console.log("moved to trash");
                            deleteLyricMutation.mutate({ lyricId });
                          }}
                        >
                          DELETE FOREVER
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                  {title}
                  <p></p>
                </DropdownMenu>
              )}
            </DialogTitle>
            <DialogDescription className={"text-center flex justify-center"}>
              {author}
            </DialogDescription>
            <Separator />
            <div className="prose text-white max-h-[29rem] overflow-y-scroll">
              {isLyricEdit ? (
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        id="public"
                        checked={isPublic}
                        onCheckedChange={() => {
                          // console.log("click");
                          setIsPublic(!isPublic);
                        }}
                      />
                      <label htmlFor="public">Public</label>
                    </div>
                    <div className="flex gap-2 justify-end pb-1 pr-1">
                      <Button
                        variant={"primary"}
                        onClick={() => {
                          console.log({
                            body: lyricsBody,
                            public: lyricPublic,
                            genre: genre,
                            mood: mood,
                            title: title,
                          });
                          editLyricMutation.mutate({
                            lyricId,
                            lyric: {
                              body: lyricsBody,
                              public: isPublic,
                              genre: genre,
                              mood: mood,
                              title: title,
                            },
                          });
                        }}
                      >
                        <Check />
                      </Button>
                      <Button onClick={cancelEditLyric} variant={"destructive"}>
                        <X />
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    value={lyricsBody}
                    onChange={(e) => setLyricsBody(e.target.value)}
                  />
                </div>
              ) : (
                <ReactMarkdown>{lyrics}</ReactMarkdown>
              )}
            </div>
            <Separator />

            {/* Comments section */}
            <div className="space-y-2 max-h-[20rem] overflow-y-scroll">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-600 p-2 rounded-md">
                  <div className="flex gap-2 justify-between items-center">
                    <div className="font-bold">
                      {comment.user ? comment.user.email : "Unknown user"}
                    </div>
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
                  // console.log("Before mutation, comment:", comment);
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
