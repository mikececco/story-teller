'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "./ui/select"
import { Textarea } from "./ui/textarea"

function StoryWriter() {

  const [story, setStory] = useState<string>("")
  const [pages, setPages] = useState<number>()

  console.log(story);


  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="text-black flex-1" placeholder="Write a story about..."
          />
        <Select onValueChange={value => setPages(parseInt(value))}>
          <SelectTrigger className="text-black">
            <SelectValue placeholder="How many page should story be?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Array.from({length: 10}, (_, i) => (
              <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={!story || !pages} className="w-full" size="lg">
          Generate story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-scroll">

        </div>
      </section>
    </div>
  )
}

export default StoryWriter
