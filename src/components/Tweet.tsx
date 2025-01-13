import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Link } from "react-router-dom";
import twitterLogo from "../assets/twitterLogo.avif";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";

export default function Tweet({
  name = "John Doe",
  username = "johndoe",
  content = "This is a sample tweet. It can contain #hashtags and @mentions.",
  likes = 42,
  comments = 10,
  retweets = 5,
}: {
  name?: string;
  username?: string;
  content?: string;
  likes?: number;
  comments?: number;
  retweets?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
  return (
    <Card className="max-w-xl mt-4 w-full">
      <CardHeader className="flex flex-row space-x-4 items-start p-4 pb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage alt={name} src={twitterLogo} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold">{name}</h3>
            <span className="text-muted-foreground">@{username}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{comments}</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 transition-colors">
          <Repeat2 className="h-5 w-5" />
          <span className="text-sm">{retweets}</span>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
          <span className="text-sm">{likes}</span>
        </div>
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger
              asChild
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
            >
              <Link target="_blank" to={twitterUrl} className="text-muted-foreground hover:text-primary transition-colors">
                <Share className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Post on X</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
