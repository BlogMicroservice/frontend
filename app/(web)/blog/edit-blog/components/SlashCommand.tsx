import { Extension, Editor, Range } from "@tiptap/core";
import Suggestion, {
  SuggestionOptions,
  SuggestionProps,
} from "@tiptap/suggestion";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: (props: SuggestionProps) => void;
}

type SlashCommandOptions = {
  suggestion: Partial<SuggestionOptions> & {
    items: (props: { query: string }) => SlashCommandItem[];
    command: (props: {
      editor: Editor;
      range: Range;
      props: SuggestionProps;
    }) => void;
  };
};

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        items: () => [],
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
