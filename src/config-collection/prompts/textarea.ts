import chalk from "chalk";

type TextareaConfig = {
  message: string;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
};

const PASTE_START = "\x1b[200~";
const PASTE_END = "\x1b[201~";
// Shift+Enter in CSI u encoding (kitty keyboard protocol)
const SHIFT_ENTER_CSI_U = "\x1b[13;2u";
// Shift+Enter in some terminals
const SHIFT_ENTER_MOD = "\x1b[27;2;13~";

export async function textarea(config: TextareaConfig): Promise<string> {
  const { message, validate = () => true } = config;

  return new Promise<string>((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();

    const lines: string[] = [""];
    let cursorLine = 0;
    let cursorCol = 0;
    let isPasting = false;
    let errorMsg: string | undefined;
    let renderedLineCount = 0;

    // Enable bracketed paste mode
    stdout.write("\x1b[?2004h");

    function cleanup() {
      stdout.write("\x1b[?2004l");
      stdin.setRawMode(wasRaw ?? false);
      stdin.removeListener("data", onData);
      stdin.pause();
    }

    function clearRendered() {
      // Move cursor to start of rendered area and clear
      if (renderedLineCount > 0) {
        // Move up to the first rendered line
        if (renderedLineCount > 1) {
          stdout.write(`\x1b[${renderedLineCount - 1}A`);
        }
        stdout.write("\r");
        // Clear from cursor to end of screen
        stdout.write("\x1b[J");
      }
    }

    function render() {
      clearRendered();

      const prefix = chalk.green("?");
      const hint = chalk.dim("(Shift+Enter for new line)");
      const header = `${prefix} ${chalk.bold(message)} ${hint}`;

      const contentLines = lines.map((line) => `  ${line}`);

      const output = [header, ...contentLines];
      if (errorMsg) {
        output.push(chalk.red(`> ${errorMsg}`));
      }

      stdout.write(output.join("\n"));
      renderedLineCount = output.length;

      // Position cursor on the active line
      // The cursor should be at line (1 + cursorLine) from the header, col (2 + cursorCol) for the indent
      const linesFromBottom = contentLines.length - 1 - cursorLine + (errorMsg ? 1 : 0);
      if (linesFromBottom > 0) {
        stdout.write(`\x1b[${linesFromBottom}A`);
      }
      stdout.write(`\r\x1b[${2 + cursorCol}C`);
    }

    function renderDone(value: string) {
      clearRendered();
      const prefix = chalk.green("✔");
      const displayLines = value.split("\n");
      const summary =
        displayLines.length > 1
          ? `${displayLines[0]} ${chalk.dim(`(+${displayLines.length - 1} more lines)`)}`
          : displayLines[0];
      stdout.write(`${prefix} ${chalk.bold(message)} ${chalk.cyan(summary ?? "")}\n`);
    }

    function insertText(text: string) {
      for (const ch of text) {
        if (ch === "\n" || ch === "\r") {
          // Split current line at cursor
          const before = lines[cursorLine]!.slice(0, cursorCol);
          const after = lines[cursorLine]!.slice(cursorCol);
          lines[cursorLine] = before;
          lines.splice(cursorLine + 1, 0, after);
          cursorLine++;
          cursorCol = 0;
        } else if (ch >= " ") {
          // Insert character at cursor position
          const line = lines[cursorLine]!;
          lines[cursorLine] = line.slice(0, cursorCol) + ch + line.slice(cursorCol);
          cursorCol++;
        }
      }
    }

    function handleBackspace() {
      if (cursorCol > 0) {
        const line = lines[cursorLine]!;
        lines[cursorLine] = line.slice(0, cursorCol - 1) + line.slice(cursorCol);
        cursorCol--;
      } else if (cursorLine > 0) {
        // Merge with previous line
        const currentContent = lines[cursorLine]!;
        lines.splice(cursorLine, 1);
        cursorLine--;
        cursorCol = lines[cursorLine]!.length;
        lines[cursorLine] += currentContent;
      }
    }

    function handleDelete() {
      const line = lines[cursorLine]!;
      if (cursorCol < line.length) {
        lines[cursorLine] = line.slice(0, cursorCol) + line.slice(cursorCol + 1);
      } else if (cursorLine < lines.length - 1) {
        // Merge next line into current
        lines[cursorLine] += lines[cursorLine + 1]!;
        lines.splice(cursorLine + 1, 1);
      }
    }

    async function submit() {
      const value = lines.join("\n");
      const isValid = await validate(value);
      if (isValid === true) {
        cleanup();
        renderDone(value);
        resolve(value);
      } else {
        errorMsg =
          typeof isValid === "string"
            ? isValid
            : "You must provide a valid value";
        render();
      }
    }

    function onData(data: Buffer) {
      const str = data.toString();
      errorMsg = undefined;

      let i = 0;
      while (i < str.length) {
        // Bracketed paste start
        if (str.startsWith(PASTE_START, i)) {
          isPasting = true;
          i += PASTE_START.length;
          continue;
        }
        // Bracketed paste end
        if (str.startsWith(PASTE_END, i)) {
          isPasting = false;
          i += PASTE_END.length;
          continue;
        }
        // Shift+Enter (CSI u / kitty protocol)
        if (str.startsWith(SHIFT_ENTER_CSI_U, i)) {
          insertText("\n");
          i += SHIFT_ENTER_CSI_U.length;
          continue;
        }
        // Shift+Enter (modified key format)
        if (str.startsWith(SHIFT_ENTER_MOD, i)) {
          insertText("\n");
          i += SHIFT_ENTER_MOD.length;
          continue;
        }
        // Arrow keys and other CSI sequences
        if (str.startsWith("\x1b[", i)) {
          // eslint-disable-next-line no-control-regex
          const seqMatch = str.slice(i).match(/^\x1b\[[0-9;]*[A-Za-z~]/);
          if (seqMatch) {
            const seq = seqMatch[0];
            const code = seq[seq.length - 1];
            if (code === "A") {
              // Up arrow
              if (cursorLine > 0) {
                cursorLine--;
                cursorCol = Math.min(cursorCol, lines[cursorLine]!.length);
              }
            } else if (code === "B") {
              // Down arrow
              if (cursorLine < lines.length - 1) {
                cursorLine++;
                cursorCol = Math.min(cursorCol, lines[cursorLine]!.length);
              }
            } else if (code === "C") {
              // Right arrow
              if (cursorCol < lines[cursorLine]!.length) {
                cursorCol++;
              } else if (cursorLine < lines.length - 1) {
                cursorLine++;
                cursorCol = 0;
              }
            } else if (code === "D") {
              // Left arrow
              if (cursorCol > 0) {
                cursorCol--;
              } else if (cursorLine > 0) {
                cursorLine--;
                cursorCol = lines[cursorLine]!.length;
              }
            } else if (code === "H") {
              // Home
              cursorCol = 0;
            } else if (code === "F") {
              // End
              cursorCol = lines[cursorLine]!.length;
            } else if (seq === "\x1b[3~") {
              // Delete key
              handleDelete();
            }
            i += seq.length;
            continue;
          }
        }
        // Skip other escape sequences
        if (str[i] === "\x1b") {
          i++;
          continue;
        }

        const ch = str[i]!;

        if (ch === "\r") {
          if (isPasting) {
            insertText("\n");
          } else {
            // Enter (\r) = submit
            render();
            void submit();
            return;
          }
        } else if (ch === "\n") {
          // Shift+Enter (\n) or newline during paste
          insertText("\n");
        } else if (ch === "\x7f" || ch === "\x08") {
          // Backspace
          handleBackspace();
        } else if (ch === "\x03") {
          // Ctrl+C
          cleanup();
          reject(new Error("User aborted"));
          return;
        } else if (ch >= " ") {
          insertText(ch);
        }

        i++;
      }

      render();
    }

    stdin.on("data", onData);
    render();
  });
}
