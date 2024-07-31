'use client'

import { Button } from "./ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "./ui/select"
import { Textarea } from "./ui/textarea"

function StoryWriter() {
  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-purple-300 rounded-md p-10 space-y-2">
        <Textarea className="text-black" placeholder="Write a story about..." />
        <Select>
          <SelectTrigger className="text-black">
            <SelectValue placeholder="How many page should story be?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Array.from({length: 10}, (_, i) => (
              <SelectItem key={i} value={String(i+1)}>{i+1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full" size="lg">
          Generate story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5">

      </section>
    </div>
  )
}

export default StoryWriter
