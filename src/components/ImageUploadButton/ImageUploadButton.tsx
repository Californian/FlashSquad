import { useEffect, useInsertionEffect, useMemo, useState } from "react";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, BackgroundImage, Box } from "@mantine/core";
import { useId } from "@mantine/hooks";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import ImageEditor from "@uppy/image-editor";
import Compressor from "@uppy/compressor";
import Transloadit from "@uppy/transloadit";

import { useColorSchemeSwitcher } from "color-scheme-switcher";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/screen-capture/dist/style.min.css";
import "@uppy/audio/dist/style.min.css";

interface ImageUploadButtonProps {
  url: string;
  buttonId: string;
  handleSelect: (url: string, fileName: string) => void;
  minHeight: string;
  maxHeight: string;
  aspectRatio: string;
  borderRadius: string;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  url,
  buttonId,
  handleSelect,
  minHeight,
  maxHeight,
  aspectRatio,
  borderRadius,
}) => {
  const uploaderModalTriggerId = useId(buttonId);
  const { colorSchemeIsLight } = useColorSchemeSwitcher();
  const [uppy, setUppy] = useState<Uppy | undefined>();

  useEffect(() => {
    if (uppy) {
      uppy.close({ reason: "unmount" });
    }

    const newUppy = new Uppy({
      restrictions: { allowedFileTypes: ["image/*"], maxNumberOfFiles: 1 },
    })
      .use(Dashboard, {
        trigger: `#${uploaderModalTriggerId}`,
        closeModalOnClickOutside: true,
        theme: colorSchemeIsLight ? "light" : "dark",
        proudlyDisplayPoweredByUppy: false,
      })
      .use(ImageEditor, { target: Dashboard })
      .use(Compressor)
      .use(Transloadit, {
        assemblyOptions: {
          params: {
            auth: { key: process.env.NEXT_PUBLIC_TRANSLOADIT_API_KEY ?? "" },
            template_id: process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID,
          },
        },
        waitForEncoding: true,
      });

    newUppy.on("transloadit:complete", ({ results }) => {
      const uploadUrl = results?.compress_image[0]?.ssl_url;
      const uploadName = results?.compress_image[0]?.original_name;
      handleSelect(uploadUrl, uploadName);
    });

    setUppy(newUppy);
  }, [uploaderModalTriggerId, colorSchemeIsLight]);

  return (
    <>
      <BackgroundImage
        src={url || ""}
        sx={{
          minHeight,
          maxHeight,
          aspectRatio,
          width: "auto",
          borderRadius,
        }}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius,
            height: "100%",
            width: "100%",
          })}
        >
          <ActionIcon
            id={uploaderModalTriggerId}
            sx={{
              minHeight,
              maxHeight,
              aspectRatio,
              width: "auto",
              borderRadius,
            }}
          >
            <FontAwesomeIcon icon={faFileUpload} />
          </ActionIcon>
        </Box>
      </BackgroundImage>
    </>
  );
};

export { ImageUploadButton };
