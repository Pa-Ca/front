import { FC, useState } from "react";
import { useFetch } from "@hooks";
import { useAppSelector } from "src/store/hooks";
import { FormText } from "../FormInputs/FormText";
import { PrimaryButton } from "../FormInputs/Buttons";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/solid";
import { addBranchImage, alertService, deleteBranchImage } from "@services";
import { IconButton, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { FormSelect } from "../FormInputs/FormSelect";

interface BranchImagesProps {
  images: string[];
  setImages: (images: string[]) => void;
}
export const BranchImages: FC<BranchImagesProps> = ({ images, setImages }) => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [newImage, setNewImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddImage = () => {
    if (!branch?.id || !newImage) return;

    fetch((token: string) => addBranchImage(branch.id, newImage, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          alertService.error(
            "No se pudo agregar la imagen",
            response.error?.message ?? response.exception?.message
          );
          return;
        }

        setSelectedImage(images.length);
        setImages([...images, newImage]);
        setNewImage("");
      }
    );
  };

  const handleDeleteImage = () => {
    if (!branch?.id || images.length === 0) return;

    fetch((token: string) => deleteBranchImage(branch.id, selectedImage, token)).then(
      (response) => {
        if (response.isError || !response.data) {
          alertService.error(
            "No se pudo eliminar la imagen",
            response.error?.message ?? response.exception?.message
          );
          return;
        }

        const newImages = [...images];
        newImages.splice(selectedImage, 1);
        setImages(newImages);
        setSelectedImage(Math.min(selectedImage, newImages.length - 1));
      }
    );
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-6">
      <div className="flex flex-col sm:flex-row w-full sm:items-center gap-2 sm:gap-4">
        <FormText
          id="newImage"
          name="newImage"
          autoComplete="off"
          label=""
          placeholder="URL de la nueva imagen"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          containerClassName="flex-1"
        />

        <PrimaryButton onClick={handleAddImage}>Agregar</PrimaryButton>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-2">
        <div className="sm:hidden">
          <FormSelect
            label=""
            id="branches"
            name="branches"
            selected={{
              value: selectedImage,
              name: `Imagen ${selectedImage}`,
              id: selectedImage.toString(),
            }}
            options={images.map((_, index) => ({
              value: index,
              name: `Imagen ${index}`,
              id: index.toString(),
            }))}
            onChange={(image) => setSelectedImage(image)}
          />
        </div>

        <List
          style={{ scrollbarGutter: "auto" }}
          className="hidden sm:flex flex-col min-w-0 h-[45vh] overflow-y-auto overflow-x-hidden text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        >
          {images.map((_, index) => (
            <ListItem
              key={index}
              className="!min-h-[3rem] px-1 sm:px-3 !w-40 overflow-hidden"
              selected={index === selectedImage}
              onClick={() => setSelectedImage(index)}
            >
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>

              <p>Imagen {index}</p>
            </ListItem>
          ))}
        </List>

        <div className="relative flex flex-1 rounded-lg overflow-hidden h-[45vh]">
          <img src={images[selectedImage]} className="h-full w-full object-cover" />

          <IconButton
            variant="text"
            color="red"
            className="!absolute p-2 top-2 right-2 bg-white hover:bg-red-100"
            onClick={handleDeleteImage}
          >
            <TrashIcon className="h-6 w-6 text-red-500" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
