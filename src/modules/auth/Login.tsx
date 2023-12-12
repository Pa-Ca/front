import { FC, useEffect, useState } from "react";
import { UserRole } from "@objects";
import { randomImages } from "@utils";
import { useNavigate } from "react-router-dom";
import { getBusinessBranches } from "@services";
import { alertService, login } from "@services";
import { useAppDispatch } from "src/store/hooks";
import { LoginForm, LinkText } from "@components";
import { authLogin } from "src/store/slices/auth";
import { setClient } from "src/store/slices/client";
import logo from "../../assets/images/pa-ca-icon.png";
import { setBusiness } from "src/store/slices/business";
import { setBranches } from "src/store/slices/branches";
import { Carousel, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<string[]>([]);

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);

    if (response.isError || !response.data) {
      alertService.error(
        "Error al iniciar sesión",
        response.error?.message ?? response.exception?.message,
        { autoClose: false }
      );
      return;
    }

    const auth = {
      logged: true,
      token: response.data?.token,
      refresh: response.data?.refresh,
      user: {
        email,
        verified: false,
        id: response.data.id,
        role: response.data?.role,
      },
    };

    // User is a client
    if (response.data.role === UserRole.CLIENT) {
      dispatch(authLogin(auth));
      dispatch(setClient(response.data.client!));
      navigate("/home");
    }

    // User is a business
    else {
      // Get business branches
      const branchesResponse = await getBusinessBranches(
        response.data.business!.id,
        response.data.token
      );
      if (branchesResponse.isError || !branchesResponse.data) {
        alertService.error(
          "Error al obtener sucursales",
          branchesResponse.error?.message ?? branchesResponse.exception?.message,
          { autoClose: false }
        );
        return;
      }

      dispatch(authLogin(auth));
      dispatch(setBusiness(response.data.business!));
      dispatch(setBranches(branchesResponse.data.branches));
      navigate("/business");
    }
  };

  useEffect(() => {
    setImages(randomImages());
  }, []);

  useEffect(() => {
    document.title = "Iniciar Sesión - Pa'ca";
  }, []);

  return (
    <div className="flex h-screen w-screen md:h-full md:w-full items-center justify-center p-4 sm:p-8 md:p-16">
      <div
        className="flex flex-1 items-stretch gap-8 h-full max-h-128"
        style={{ maxWidth: "60rem" }}
      >
        <div className="flex flex-1 flex-col justify-evenly">
          <div>
            <img src={logo} alt="Pa'ca logo" width="75" height="75" />
            <h1
              style={{ fontSize: "2.3rem" }}
              className="font-bold text-start text-gray-900"
            >
              ¡Bienvenido!
            </h1>
          </div>

          <LoginForm onSubmit={(values) => handleLogin(values.email, values.password)} />

          <span className="text-sm w-full text-center mt-2">
            ¿No tienes una cuenta?{" "}
            <LinkText text="Regístrate" onClick={() => navigate("/signup")} />
          </span>
        </div>

        <Carousel
          loop
          autoplay
          transition={{ duration: 2 }}
          autoplayDelay={10000}
          className="flex-1 h-full rounded-xl hidden md:flex"
          prevArrow={({ handlePrev }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handlePrev}
              className="!absolute !bg-white !bg-opacity-50 hover:!bg-opacity-75 top-2/4 left-4 -translate-y-2/4"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handleNext}
              className="!absolute !bg-white !bg-opacity-50 hover:!bg-opacity-75 top-2/4 !right-4 -translate-y-2/4"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </IconButton>
          )}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`image-${index}`}
              className="h-full w-full object-cover"
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Login;
