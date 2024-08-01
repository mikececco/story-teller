'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Frame } from "@gptscript-ai/gptscript"

function StoryWriter() {

  const [story, setStory] = useState<string>("")
  const [pages, setPages] = useState<number>()
  const [progress, setProgress] = useState<string>()
  const [runStarted, setRunStarted] = useState<boolean>(false)
  const [runFinished, setRunFinished] = useState<boolean | null>(null)
  const [currentTool, setCurrentTool] = useState<boolean | null>(null)
  const [event, setEvents] = useState<Frame[]>([])

  console.log(story);

  const storiesPath = 'public/stories' //instead of a database

  async function runScript() {
    setRunStarted(true)
    setRunFinished(false)

    const response  = await fetch('/api/run-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story, pages, path: storiesPath })
    })

    if (response.ok && response.body) {
      //handle stream on API

      console.log('Streaming started');

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      handleStream(reader, decoder)

    } else {
      setRunStarted(false)
      setRunFinished(true)
      console.error('Failed');
    }
  }

  async function handleStream(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
    //Manage stream from API

    while (true) {
      const { done, value } = await reader.read()

      if (done) break //breaks infinity loop

      const chunk = decoder.decode(value, { stream: true})

      const eventData: string[] = chunk
      .split("\n\n")
      .filter((line) => line.startsWith("event: "))
      .map((line) => line.replace(/^event: /, ""));

      //Parse the JSON data and update state
      eventData.forEach(data => {
        try {
          const parsedData = JSON.parse(data)
          if (parsedData.type === "callProgress") {
            setProgress(
              parsedData.output[parsedData.output.length-1].content
            )
            setCurrentTool(parsedData.tool?.description || "")
          } else if (parsedData.type === "callStart") {
              setCurrentTool(parsedData.tool?.description || "")
          } else if (parsedData.type === "runFinish") {
            setRunStarted(false)
            setRunFinished(true)
          } else {
            setEvents((prevEvents) => [...prevEvents, parsedData]) //appending newevents
          }
        } catch (error) {
          console.error('Failed to parse JSON', error);
        }
      })
    }
  }


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
        <Button
          disabled={!story || !pages || runStarted} className="w-full" size="lg"
          onClick={runScript}
        >
          Generate story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-auto">
          {/* flex-col-reverse to scroll down like chat interface */}
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5">Waiting...</p>
                <br />
              </>
            )}
            <span className="mr-5 text-gray-200">{">>"}</span>
            {progress}
          </div>

          {currentTool && (
            <div className="py-18">
              <span className="mr-5">{"---Current Tool---"}</span>
              {currentTool}
            </div>
          )}

          {runStarted && (
            <div>
              <span className="animate-in mr-5">
                {"---StoryTeller started---"}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default StoryWriter
