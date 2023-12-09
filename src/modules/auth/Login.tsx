import { FC, useEffect } from "react";
import { UserRole } from "@objects";
import { useNavigate } from "react-router-dom";
import { alertService, login } from "@services";
import { useAppDispatch } from "src/store/hooks";
import { LoginForm, LinkText } from "@components";
import { authLogin } from "src/store/slices/auth";
import { setClient } from "src/store/slices/client";
import logo from "../../assets/images/pa-ca-icon.png";
import { setBusiness } from "src/store/slices/business";
import { Carousel, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

    dispatch(
      authLogin({
        logged: true,
        token: response.data?.token,
        refresh: response.data?.refresh,
        user: {
          email,
          verified: false,
          id: response.data.id,
          role: response.data?.role,
        },
      })
    );

    if (response.data.role === UserRole.CLIENT) {
      dispatch(setClient(response.data.client!));
      navigate("/home");
    } else {
      dispatch(setBusiness(response.data.business!));
      navigate("/business");
    }
  };

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
          <img
            src="https://th.bing.com/th/id/R.0dd2e89abaafdedb2553d215359b4237?rik=6abZ%2bYNGczRriQ&riu=http%3a%2f%2fwww.trbimg.com%2fimg-5b8f2874%2fturbine%2fsd-et-dining-inside-out-20180801&ehk=8MSHG4Zn4vWV8BV0%2fUY7%2bhHvDgUHF3rrJ%2bGoaYvH8Qg%3d&risl=&pid=ImgRaw&r=0"
            alt="image 1"
            className="h-full w-full object-cover"
          />
          <img
            src="https://th.bing.com/th/id/R.8609a0e548432f55343dea90b7a30ca3?rik=UtoLG409Pt2%2btQ&pid=ImgRaw&r=0"
            alt="image 2"
            className="h-full w-full object-cover"
          />
          <img
            src="https://nbcconferencecentre.com/content/uploads/sites/2/2018/02/2017121400120-RubenMay-_RU18490.jpg"
            alt="image 3"
            className="h-full w-full object-cover"
          />
          <img
            src="https://th.bing.com/th/id/R.63fd2fb897e2be052f18f0e4d2aeae90?rik=LkXVO5j%2fFYU4tw&riu=http%3a%2f%2fwww.frogpondvillage.com%2fwp-content%2fuploads%2f2019%2f06%2f155.jpg&ehk=JZmlD1dxG3D7bHojY3SwgkWW3WC8jKL%2b0G2HRBL2vaM%3d&risl=&pid=ImgRaw&r=0"
            alt="image 4"
            className="h-full w-full object-cover"
          />
          <img
            src="https://thearchitectsdiary.com/wp-content/uploads/2018/06/Best-Restaurant-Interior-Design-In-India-4.jpg"
            alt="image 5"
            className="h-full w-full object-cover"
          />
        </Carousel>
      </div>
    </div>
  );
};

export default Login;
