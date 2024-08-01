import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gpScriptInstance";
const script = 'app/api/run-script/story-book.gpt'

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json() //extract body of request

  const opts: RunOpts = {
    disableCache: true,
    input: `--story ${story} --pages ${pages} --path ${path}`, //arguments example cli commands: gpt-script ./story-book.gpt --story "A robot and a ..." --pages 5 --path ./stories
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await g.run(script, opts)

          run.on(RunEventType.Event, (data) => {
            controller.enqueue(encoder.encode( //creating stream
              `event ${JSON.stringify(data)} \n\n`
            ))
          })

          await run.text()
          controller.close()
        } catch (error) {
          console.error(error);
          console.log('Error', error);
        }
      }

    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({error: error}), {
      status: 500
    })
  }
}
