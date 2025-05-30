import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import ReactMarkdown from "react-markdown";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLyric } from "@/api/lyric";

import { toast } from "sonner";
// import { rubyHashToJson } from "@/lib/helper";

const genreOptions = [
  "Pop",
  "Rock",
  "Hip-hop",
  "R&B",
  "Country",
  "Electronic",
  "Jazz",
  "Other",
];

const moodOptions = [
  "Happy",
  "Sad",
  "Romantic",
  "Angry",
  "Chill",
  "Inspirational",
  "Other",
];

const lyricSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  mood: z.string().min(1, "Mood is required"),
  public: z.boolean().default(false),
  user_specific_prompts: z.string().optional(),
});

export default function LyricCreate() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hasLyric, setHasLyric] = useState(false);
  const [lyricInfo, setLyricInfo] = useState({});

  const mutation = useMutation({
    mutationFn: createLyric,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["creations"]);
      console.log("generated lyric", data);
      setLyricInfo(data);
      setHasLyric(true);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lyricSchema),
    defaultValues: {
      public: false,
    },
  });

  const [customGenre, setCustomGenre] = useState("");
  const [customMood, setCustomMood] = useState("");

  const selectedGenre = watch("genre") || "";
  const selectedMood = watch("mood") || "";

  const handleFormSubmit = (data) => {
    if (data.genre === "Other") data.genre = customGenre;
    if (data.mood === "Other") data.mood = customMood;
    console.log("handleFormGenerateLyric:", data);
    mutation.mutate({ lyricInfo: data });
  };

  return (
    <div>
      <section className="lg:w-1/2 lg:mx-auto ">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6  mx-auto"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select
              value={selectedGenre}
              onValueChange={(val) =>
                setValue("genre", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genreOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "Other" ? "Other (specify)" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedGenre === "Other" && (
              <Input
                className="mt-2"
                placeholder="Specify your genre"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
              />
            )}
            {errors.genre && (
              <p className="text-sm text-red-500">{errors.genre.message}</p>
            )}
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Mood</Label>
            <Select
              value={selectedMood}
              onValueChange={(val) =>
                setValue("mood", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "Other" ? "Other (specify)" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedMood === "Other" && (
              <Input
                className="mt-2"
                placeholder="Specify your mood"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
              />
            )}
            {errors.mood && (
              <p className="text-sm text-red-500">{errors.mood.message}</p>
            )}
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="user_specific_prompts">
              Custom Prompt (Optional)
            </Label>
            <Textarea
              id="user_specific_prompts"
              placeholder="Include any ideas, phrases, or theme you want in the lyrics..."
              {...register("user_specific_prompts")}
            />
          </div>

          {/* Public */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="public"
              checked={watch("public")}
              onCheckedChange={(checked) => {
                setValue("public", !!checked);
              }}
            />
            <Label htmlFor="public">Make Public</Label>
          </div>

          <Button variant={"primary"} type="submit" className="w-full">
            Generate Lyrics
          </Button>
        </form>
      </section>

      <div>
        {isLoading && (
          <div className="flex justify-center items-center h-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {hasLyric && (
        <section className="flex flex-col gap-3 mx-auto w-1/2 max-sm:w-full sm:w-full lg:w-1/2">
          <h1 className="text-2xl font-bold">{lyricInfo.title}</h1>
          <div className="flex gap-2">
            <Badge className={"bg-green-600"}>{lyricInfo.genre}</Badge>
            <Badge className={"bg-green-600"}>{lyricInfo.mood}</Badge>
          </div>
          <ReactMarkdown>{lyricInfo.body}</ReactMarkdown>
          <Button
            onClick={() => {
              toast.success("Lyrics copied to clipboard!");
              navigator.clipboard.writeText(
                lyricInfo.title + "\n\n" + lyricInfo.body
              );
            }}
          >
            Copy Lyrics
          </Button>
        </section>
      )}
    </div>
  );
}
