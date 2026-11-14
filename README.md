# Da'im stoppage cost calculator

A free marketing page. A factory owner answers a few questions and sees what machine stoppages cost per month and per year. It opens in English and has an Arabic button.

There is nothing to install or build. The whole thing is three files:

| File | What it is |
| --- | --- |
| `index.html` | The calculator: the page, its look, the wording in both languages and the maths |
| `tour.js` | The guided demo: the story script at the top, the player below it |
| `tour.css` | The demo's look |

## Settings

Near the top of the script in `index.html`:

- `CONFIG.whatsappNumber`: the WhatsApp number the green button messages, digits only in international format (for example `201001234567`). While it is empty, the button lets the visitor share the result with any contact.

## The guided demo

Press **Run demo** in the top bar. It plays by itself for about two and a half minutes, on top of the real page. The visitor's own numbers are put aside while it plays and put back when it closes.

| Chapter | What it shows |
| --- | --- |
| 1. Welcome | What the story is about |
| 2. Hassan's guess | The owner answers from memory: two breakdowns a month |
| 3. The bill nobody sends | The yearly cost, the month board, and where the money goes |
| 4. Karim is not so sure | The "I don't know my numbers" path: the supervisor times a real stoppage with two taps |
| 5. One week later | Eight days of logging replace the guess with a measured figure |
| 6. What it is worth | The savings slider and the WhatsApp button |
| 7. Your turn | "Use my own numbers" or "Watch again" |

Controls: pause, back, next, close, and one bar per chapter (click to jump). On a keyboard: arrow keys step, Space pauses, Escape closes.

To change the wording, edit `BEATS` in `tour.js`. Each line has an `en` and an `ar` version. Words in `{curly brackets}` are filled in from the calculator's live result, so the story's numbers always match the screen.

## Preview on this computer

Use the `daim-calculator` entry in the workspace `.claude/launch.json`.
