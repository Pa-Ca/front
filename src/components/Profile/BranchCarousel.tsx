import { FC, useEffect, useMemo, useState } from "react";
import { useFetch } from "@hooks";
import classNames from "classnames";
import { Modal } from "../Atoms/Modal";
import { useAppSelector } from "src/store/hooks";
import { FormFile } from "../FormInputs/FormFile";
import defaultImage from "../../assets/images/restaurant.png";
import { Carousel, IconButton } from "@material-tailwind/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PrimaryButton, SecondaryButton } from "../FormInputs/Buttons";
import {
  addBranchImage,
  alertService,
  deleteBranchImage,
  getBranchImages,
} from "@services";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export const BranchCarousel: FC = () => {
  const fetch = useFetch();
  const branch = useAppSelector((state) => state.branches.selected);

  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [carouselKey, setCarouselKey] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const imageUrls = useMemo(() => {
    return images
      .filter((image) => image.type.includes("image"))
      .map((image) => URL.createObjectURL(image));
  }, [images]);

  const handleSelectImage = (file?: File) => {
    if (!file) {
      setError("");
      setFile(undefined);
      return;
    }

    // Verify if the file is an image
    if (!file.type.startsWith("image")) {
      setError("El archivo seleccionado no es una imagen.");
      return;
    }

    // Verify if the file is too big
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo seleccionado es demasiado grande.");
      return;
    }

    setError("");
    setFile(file);
  };

  const handleAddImage = async () => {
    if (!file || !branch?.id) return;

    fetch((token: string) => addBranchImage(branch.id, file, token)).then((response) => {
      if (response.isError) {
        alertService.error("No se pudo agregar la imagen.", "Intenta de nuevo.");
        return;
      }

      setImages([...images, file]);
      setOpenAddModal(false);
      setFile(undefined);
    });
  };

  const handleDeleteImage = async () => {
    if (!branch?.id) return;

    const file = images[index];

    fetch((token: string) => deleteBranchImage(branch.id, file, token)).then(
      (response) => {
        if (response.isError) {
          alertService.error("No se pudo eliminar la imagen.", "Intenta de nuevo.");
          return;
        }

        setImages(images.filter((_, i) => i !== index));
        setIndex(Math.max(0, index - 1));
      }
    );
  };

  useEffect(() => {
    setCarouselKey(Math.random().toString());
    if (!branch?.id) return;

    fetch((token: string) => getBranchImages(branch.id, token)).then((response) => {
      setLoading(false);

      if (response.isError || !response.data) return;

      setCarouselKey(Math.random().toString());
      setImages(response.data.images);
    });
  }, [branch?.id, fetch]);

  return (
    <div className="flex relative w-full">
      <Carousel
        key={carouselKey}
        transition={{ duration: 1 }}
        className={classNames(
          "flex-1 h-[25rem] sm:h-auto rounded-xl",
          (loading || imageUrls.length === 0) && "hidden"
        )}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer w-4 h-4 rounded-2xl transition-all bg-white content-[''] ${
                  activeIndex !== i && "opacity-50"
                }`}
                onClick={() => {
                  setIndex(i);
                  setActiveIndex(i);
                }}
              />
            ))}
          </div>
        )}
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={() => {
              handlePrev();
              setIndex(Math.max(0, index - 1));
            }}
            className="!absolute !bg-orange-700 !bg-opacity-50 hover:!bg-opacity-75 top-2/4 left-4 -translate-y-2/4"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={() => {
              handleNext();
              setIndex(Math.min(imageUrls.length - 1, index + 1));
            }}
            className="!absolute !bg-orange-700 !bg-opacity-50 hover:!bg-opacity-75 top-2/4 !right-4 -translate-y-2/4"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </IconButton>
        )}
      >
        {imageUrls.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`image-${index}`}
            className="h-full w-full object-cover"
          />
        ))}
      </Carousel>

      {!loading && imageUrls.length === 0 && (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <img
            src={defaultImage}
            alt="Image not found"
            className="w-full h-[70%] object-cover opacity-[0.5]"
          />

          <p className="text-xl text-center font-light text-gray-500 mt-6 mx-8">
            Parece que no hay imágenes de tu sucursal aún. Agrega algunas dando click en
            el botón de arriba!
          </p>
        </div>
      )}

      <div
        onClick={() => setOpenAddModal(true)}
        className={classNames(
          "absolute top-4 right-4 p-2 bg-orange-700 rounded-lg cursor-pointer shadow-lg hover:bg-orange-500",
          loading && "hidden"
        )}
      >
        <PlusIcon className="h-5 w-5 text-white" />
      </div>

      <div
        onClick={() => setOpenDeleteModal(true)}
        className={classNames(
          "absolute top-4 left-4 p-2 bg-red-500 rounded-lg cursor-pointer shadow-lg hover:bg-red-400",
          (loading || imageUrls.length === 0) && "hidden"
        )}
      >
        <TrashIcon className="h-5 w-5 text-white" />
      </div>

      <Modal
        open={openAddModal}
        setOpen={() => setOpenAddModal(false)}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <FormFile
          error={error}
          selected={file}
          id="profile-image-file"
          name="profile-image-file"
          label="Por favor seleccione la imagen que desea subir."
          description="Archivos admitidos: .jpg, .jpeg, .png, .gif, .svg. Tamaño máximo: 5MB."
          onSelectFile={handleSelectImage}
        />

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenAddModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={handleAddImage}
            type="submit"
            className="w-full sm:w-40"
          >
            Aceptar
          </PrimaryButton>
        </div>
      </Modal>

      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        className="w-full m-6 md:m-8 max-w-[25rem]"
      >
        <p className="text-xl font-light mb-4">Eliminar imagen</p>

        <p className="mb-4 text-center">
          ¿Estás seguro que deseas eliminar esta imagen? Esta acción no se puede deshacer.
        </p>

        <div className="flex flex-col-reverse sm:flex-row w-full mt-4 gap-2 justify-between">
          <SecondaryButton
            type="button"
            className="w-full sm:w-40"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton
            onClick={() => {
              handleDeleteImage();
              setOpenDeleteModal(false);
            }}
            type="submit"
            className="w-full sm:w-40"
          >
            Eliminar
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
