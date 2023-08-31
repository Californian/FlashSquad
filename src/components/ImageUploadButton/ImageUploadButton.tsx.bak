import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, BackgroundImage, Box } from "@mantine/core";
import { PickerOverlay } from "filestack-react";
import { useState } from "react";

interface ImageUploadButtonProps {
  url: string;
  handleSelect: (url: string, fileName: string) => void;
  minHeight: string;
  maxHeight: string;
  aspectRatio: string;
  borderRadius: string;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  url,
  handleSelect,
  minHeight,
  maxHeight,
  aspectRatio,
  borderRadius,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <PickerOverlay
          apikey={process.env.NEXT_PUBLIC_FILESTACK_API_KEY ?? ""}
          pickerOptions={{ accept: "image/*", maxSize: 20000000 }}
          onUploadDone={({ filesUploaded: [{ url, filename }] }: any) => {
            handleSelect(url, filename);
            setIsOpen(false);
          }}
        />
      ) : (
        <></>
      )}
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
            sx={{
              minHeight,
              maxHeight,
              aspectRatio,
              width: "auto",
              borderRadius,
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <FontAwesomeIcon icon={faFileUpload} />
          </ActionIcon>
        </Box>
      </BackgroundImage>
    </>
  );
};

export { ImageUploadButton };
