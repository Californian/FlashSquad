import { Anchor, Code, Text, Title, TitleOrder } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { Language } from "prism-react-renderer";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FlashSquadMarkdownProps {
  body: string;
}

const FlashSquadMarkdown: React.FC<FlashSquadMarkdownProps> = ({ body }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      disallowedElements={["img"]}
      unwrapDisallowed
      components={{
        h1: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        h2: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        h3: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        h4: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        h5: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        h6: ({ node, level, ...props }) => (
          <Title order={level as TitleOrder | undefined} {...props} />
        ),
        p: ({ node, ...props }) => <Text {...props} />,
        a: ({ node, href, title, ...props }) => (
          <Anchor
            component={Link}
            href={href ?? ""}
            target="_blank"
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          return inline ? (
            <Code {...props}>{children.toString()}</Code>
          ) : (
            <Prism
              language={
                (className ?? "").replace(/^language-/i, "") as Language
              }
              {...props}
            >
              {children.toString()}
            </Prism>
          );
        },
      }}
    >
      {body}
    </ReactMarkdown>
  );
};

export { FlashSquadMarkdown };
