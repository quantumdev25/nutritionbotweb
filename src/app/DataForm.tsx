"use client";

import {
  Button,
  Checkbox,
  Input,
  Menu,
  Option,
  Radio,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { GiAges, GiClockwork, GiPencilRuler, GiWeight } from "react-icons/gi";
import { GrUser } from "react-icons/gr";

import { fetchDiet, fetchSaveDietPost } from "./api/api";
import { useDietContext } from "./context/usediet";
import DialogInfo from "./dialogInfo";
import ModalLoading from "@/components/ModalLoading";
interface Menu {
  desayuno: string;
  media_manana: string;
  almuerzo: string;
  media_tarde: string;
  cena: string;
  antes_de_dormir: string;
}

const menu: Menu = {
  almuerzo:
    "1. Opci\u00f3n 1: Pechuga de pollo a la plancha con ensalada de espinacas, tomates, pepinos y aderezo de vinagreta ligera.\n2. Opci\u00f3n 2: Salm\u00f3n a la parrilla con esp\u00e1rragos al vapor y quinoa.\n3. Opci\u00f3n 3: Ensalada de at\u00fan con lechuga, tomates, aguacate y aderezo bajo en grasa.",
  antes_de_dormir:
    "1. Opci\u00f3n 1: Un pu\u00f1ado de almendras.\n2. Opci\u00f3n 2: Un yogur griego bajo en grasa.\n3. Opci\u00f3n 3: Una porci\u00f3n de queso cottage bajo en grasa.\n\nRecuerda que es importante mantenerse hidratado durante todo el d\u00eda, as\u00ed que no olvides beber suficiente agua. Adem\u00e1s, consulta con un profesional de la salud antes de comenzar cualquier dieta o programa de ejercicio para asegurarte de que sea adecuado para ti.",
  cena: "1. Opci\u00f3n 1: Filete de ternera a la parrilla con esp\u00e1rragos y batatas al horno.\n2. Opci\u00f3n 2: Pechuga de pollo al horno con br\u00f3coli y arroz integral.\n3. Opci\u00f3n 3: Salm\u00f3n al horno con esp\u00e1rragos y quinoa.",
  desayuno:
    "1. Opci\u00f3n 1: Omelette de claras de huevo con espinacas y tomates cherry.\n2. Opci\u00f3n 2: Yogur griego bajo en grasa con frutas frescas y granola sin az\u00facar.\n3. Opci\u00f3n 3: Batido de prote\u00ednas con leche baja en grasa, pl\u00e1tano y mantequilla de almendras.",
  media_manana:
    "1. Opci\u00f3n 1: Una porci\u00f3n de frutas frescas (por ejemplo, una manzana o una naranja).\n2. Opci\u00f3n 2: Un pu\u00f1ado de frutos secos (como almendras o nueces).\n3. Opci\u00f3n 3: Un yogur griego bajo en grasa con una cucharada de miel.",
  media_tarde:
    "1. Opci\u00f3n 1: Un pu\u00f1ado de zanahorias baby con hummus.\n2. Opci\u00f3n 2: Palitos de apio con mantequilla de man\u00ed.\n3. Opci\u00f3n 3: Batido de prote\u00ednas con leche baja en grasa y frutas congeladas.",
};

const DataForm = () => {
  const { data: session } = useSession();

  const [activityCheck, setActivityCheck] = useState(false);
  const [diseaseCheck, setDiseaseCheck] = useState(false);
  const [medicinesCheck, setMedicinesCheck] = useState(false);
  const [restrictionsCheck, setRestrictionsCheck] = useState(false);

  const [dietName, setDietName] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [activityHours, setActivityHours] = useState("");
  const [physicalActivity, setPhysicalActivity] = useState("");
  const [activityDescription, setActivityDescription] = useState("");

  const [objective, setObjective] = useState("");
  const [medicines, setMedicines] = useState("");
  const [diseases, setDiseases] = useState("");
  const [restrictions, setRestrictions] = useState("");

  const [loading, setLoading] = useState(false);
  const [promptData, setPrompt] = useState("");

  const [inputErrors, setInputErrors] = useState({
    name: false,
    age: false,
    weight: false,
    height: false,
    activityHours: false,
    physicalActivity: false,
    objective: false,
    diseases: false,
    medicines: false,
    activityDescription: false,
    restrictions: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ title: "", message: "" });

  const { diet, setDiet } = useDietContext();

  const userData = {
    name,
    age,
    weight,
    height,
    activityHours,
    physicalActivity,
    objective,
    diseases,
    medicines,
    activityDescription,
    restrictions,
  };

  const validateInputsFilled = () => {
    let allFieldsFilled = true;
    console.log("Validation Inputs Filled")
    console.log(userData)
    const notRequired = ["diseases", "medicines", "activityDescription", "restrictions"]
    Object.entries(userData).forEach(([key, value]) => {
      if (value === "" && !notRequired.includes(key)) {
        console.log("Error:", key)
        setInputErrors((prevState) => ({ ...prevState, [key]: true }));
        allFieldsFilled = false;
      }
    });

    return allFieldsFilled;
  };

  const handleGenereteDietClick = async () => {
    // Algunos pueden ser false
   /* const areNoErrors = Object.values(inputErrors).every(
      (value) => value === false
    );*/

    const areNoErrors = true
    const areInputsFilled = validateInputsFilled();
    setLoading(true);

    if (!areInputsFilled) {
      setOpenDialog(true);
      setDialogInfo({
        title: "Información incompleta",
        message: "Verifica que hayas llenado todos los campos previamente",
      });
      return;
    }

    if (!areNoErrors) {
      setOpenDialog(true);
      setDialogInfo({
        title: "Información incorrecta",
        message: "Algunos campos no son válidos, verifica antes de continuar",
      });
      return;
    }

    try {
      console.log(`Se genero la peticion con:`);

      const url = "https://chatbotapi-n32d.onrender.com/api/generate/diet";

      /*       41const postData = {
              name: "Hola mi nombre es Luis, actualmente peso 87 kg y mido 172 cm y deseo hacer una dieta para perder peso sin necesidad sin perder masa muscular. Actualmente por mis actividades y compromisos solo puedo realizar 3 horas de actividad física por semana  el tipo de actividad fisica que realizo es Boxeo y suelo correr algunos días, mi objetivo es tener salud y energía durante el día, No tengo enfermedades actualmente, restricciones alimentarias no tengo. Puedes ayudarme a dar un ejemplo de una dieta que necesito para lograr mi objetivo, por favor utiliza el siguiente formato: Desayuno, media mañana, almuerzo, media tarde, cena y antes de dormir con 3 opciones en cada comida por favor.",
              time: "Wed, 21 Oct 2015 18:27:50 GMT",
            }; */
      const promptText =
        `Hola, me llamo ${userData.name}. Tengo ${userData.age} años. Mi peso es de ${userData.weight} kg y mi altura es de ${userData.height} cm. Mi objetivo con esta dieta es ${userData.objective}. Mi nivel de actividad fisica es ${userData.physicalActivity}, dedicando aproximadamente ${userData.activityHours} horas semanales a la actividad física. Entre mis actividades se encuentran ${userData.activityDescription ? userData.activityDescription : 'ninguna en particular'}. En cuanto a mi salud, ${userData.diseases ? userData.diseases : 'No tengo ningnua enfermedad'} y de medicinas consumo: ${userData.medicines ? userData.medicines : 'no estoy tomando nigún medicamento'}. Es importante tener en cuenta que ${userData.restrictions ? userData.restrictions : 'no tengo restricciones alimentarias'}. Puedes en base a mis datos generar un plan alimenticio con las siguientes comidas desayuno, almuerzo, comida, merienda y cena. Y por favor 3 opciones en cada comida, responde esto en un objeto json. ejemplo {desayuno: {opcion1:””, opcion2:””, opcion3: “”}, almuerzo:  {opcion1:””, opcion2:””, opcion3: “”}, …}. Responde solo el objeto json por favor sin ningun texto extra o algún otro dato`;
      setPrompt(promptText);
      const postData = {
        name: "",
        email: session?.user?.email!,
        prompt: promptText,
        time: "Wed, 21 Oct 2015 18:27:50 GMT",
      };

      console.log(postData);

      //******************************************************
      //Valor quemado hasta que se tenga la API
      console.log(diet);
      handleChangeLoading()

      const result = await fetchDiet(url, postData);

      if (result.success) {
        setLoadingModal(false)
        console.log("Se recibio resultado ");
        console.log(result.data.data);
        setDiet(result.data.data);
      } else {
        setLoadingModal(false);
        setOpenDialog(true);
        setDialogInfo({
          title: "¡Has generado muchas dietas!",
          message:
            "Has alcanzado el límite de peticiones para la generación de dietas. Intenta de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    dispatch: React.Dispatch<React.SetStateAction<string>>
  ) => {
    dispatch(event.target.value);
  };

  const isInputValid = (
    event: React.ChangeEvent<HTMLInputElement>, //InputEvent
    dispatch: React.Dispatch<React.SetStateAction<string>>, //React update function
    regex: RegExp, //Regular expression
    stateName: string //State Name
  ) => {
    if (!regex.test(event.target.value)) {
      setInputErrors((prevErrors) => ({ ...prevErrors, [stateName]: true }));
    } else {
      handleChange(event, dispatch);
      setInputErrors((prevErrors) => ({ ...prevErrors, [stateName]: false }));
    }
  };

  const isValueValid = (
    value: string | undefined, //Select value
    dispatch: React.Dispatch<React.SetStateAction<string>>, //React update function
    stateName: string //State Name
  ) => {
    setInputErrors((prevErrors) => ({ ...prevErrors, [stateName]: false }));
    if (value == undefined) {
      dispatch("");
    } else {
      dispatch(value);
    }
  };

  const handleClickGuardar = async () => {
    try {
      const url =
        "https://chatbotapi-n32d.onrender.com/api/post/save/diet/user";
      const document = {
        name: dietName,
        prompt: promptData,
        email: session?.user?.email!,
        diet: diet,
      };

      const result = await fetchSaveDietPost(url, document);

      if (result.success) {
        setOpenDialog(true);
        setDialogInfo({
          title: "Dieta Guardad Exitosamente",
          message: "Ha logrado alamacenar una dieta más",
        });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setConditions: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const condition = event.target.value;
    if (event.target.checked) {
      // Agregar la condición al estado si se selecciona
      setConditions((prevConditions) =>
        prevConditions ? prevConditions + `, ${condition}` : condition
      );
    } else {
      // Eliminar la condición del estado si se deselecciona
      setConditions((prevConditions) =>
        prevConditions
          .split(', ')
          .filter((c) => c !== condition)
          .join(', ')
      );
    }
  };

  const [loadingModal, setLoadingModal] = useState(false)
  const handleChangeLoading = () => {
    setLoadingModal(!loadingModal)
  }


  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col items-center px-4 pt-10 pb-5">
      {session?.user ? (
        <>
        <ModalLoading handleOpenLoading={()=>{}} openValue={loadingModal}/>
          <div className="my-5 w-full mx-10">
            <div className="flex items-center justify-center">
              <Typography
                variant="h1"
                className="leading-[45px] mb-4 !text-gray-900 "
              >
                Formulario
              </Typography>
            </div>
            <div className="flex items-center justify-center">
              <Typography
                variant="h6"
                className="leading-[45px] mb-4 !text-gray-900 "
              >
                Llena el siguiente formulario con tu información personal para
                generar un dieta perzonalizada.
              </Typography>
            </div>

            <form className="w-full mx-auto max-w-3xl">
              <Typography
                variant="h4"
                className="leading-[45px] mb-4 !text-gray-900 "
              >
                Nombre:
              </Typography>
              <Input
                variant="static"
                label="Nombre"
                placeholder=""
                onChange={(e) =>
                  isInputValid(
                    e,
                    setName,
                    /^[a-zA-ZñÑÇçáéíóúÁÉÍÓÚüÜ ]{2,20}$/,
                    "name"
                  )
                }
                crossOrigin={undefined}
                icon={<GrUser />}
                error={inputErrors.name}
              />

              <div className="w-full grid mt-3 grid-cols-1">
                <div className="w-auto mx-1 grid grid-cols-1 sm:grid-cols-2">
                  <div className="w-full sm:max-w-60">
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-4 !text-gray-900"
                    >
                      Edad:
                    </Typography>
                    <Input
                      variant="outlined"
                      label="Edad"
                      placeholder=""
                      icon={<GiAges />}
                      onChange={(e) =>
                        isInputValid(e, setAge, /^(100|[1-9]?[0-9])$/, "age")
                      }
                      error={inputErrors.age}
                      crossOrigin={undefined}
                    />
                  </div>

                  <div className="w-full sm:max-w-60">
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-4 !text-gray-900 "
                    >
                      Estatura (cm):
                    </Typography>
                    <Input
                      variant="outlined"
                      label="Estatura"
                      placeholder=""
                      icon={<GiPencilRuler />}
                      onChange={(e) =>
                        isInputValid(
                          e,
                          setHeight,
                          /^([1-9]\d{0,2}|0)$/,
                          "height"
                        )
                      }
                      error={inputErrors.height}
                      crossOrigin={undefined}
                    />
                  </div>
                </div>

                <div className="w-auto mx-1 grid grid-cols-1 sm:grid-cols-2">
                  <div className="w-full sm:max-w-60">
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-4 !text-gray-900 "
                    >
                      Peso (kg):
                    </Typography>
                    <Input
                      variant="outlined"
                      label="Peso"
                      placeholder=""
                      icon={<GiWeight />}
                      onChange={(e) =>
                        isInputValid(
                          e,
                          setWeight,
                          /^([1-9]\d{0,2}|0)$/,
                          "weight"
                        )
                      }
                      error={inputErrors.weight}
                      crossOrigin={undefined}
                    />
                  </div>

                  <div className="w-full sm:max-w-60">
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-4 !text-gray-900 "
                    >
                      Horas actividad física:
                    </Typography>
                    <Input
                      variant="outlined"
                      label="Horas actividad por semana"
                      icon={<GiClockwork />}
                      placeholder=""
                      onChange={(e) =>
                        isInputValid(
                          e,
                          setActivityHours,
                          /^(0?|1?\d|2[0-4])$/,
                          "activityHours"
                        )
                      }
                      error={inputErrors.activityHours}
                      crossOrigin={undefined}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Typography
                  variant="h6"
                  className="leading-[45px] mb-0 !text-gray-900 mt-3"
                >
                  El nivel de actividad física que realizas:
                </Typography>
                <Select
                  variant="static"
                  onChange={(e) =>
                    isValueValid(e, setPhysicalActivity, "physicalActivity")
                  }
                  name="nivel_actividad_fisica"
                  error={inputErrors.physicalActivity}
                >
                  <Option value="sedentario">
                    Sedentario (poco o ningún ejercicio)
                  </Option>
                  <Option value="ligero">
                    Ligero (actividad ligera o caminar ligero)
                  </Option>
                  <Option value="moderado">
                    Moderado (ejercicio moderado o deportes ligeros)
                  </Option>
                  <Option value="activo">
                    Activo (actividad física regular o deportes intensos)
                  </Option>
                  <Option value="muy activo">
                    Muy Activo (actividad física intensa o entrenamiento diario)
                  </Option>
                </Select>
              </div>

              <div className="w-full">
                <Typography
                  variant="h6"
                  className="leading-[45px] mb-0 !text-gray-900 mt-3"
                >
                  ¿Quieres describir la actividad fisica que realizas?
                </Typography>
                <Radio
                  crossOrigin={undefined}
                  name="Activity"
                  label={'Si'}
                  onChange={() => {
                    setActivityDescription('');
                    setActivityCheck(true);
                  }}
                />
                <Radio
                  crossOrigin={undefined}
                  name="Activity"
                  label={'No'}
                  onChange={() => {
                    setActivityDescription('');
                    setActivityCheck(false);
                  }}
                  defaultChecked
                />
              </div>
              {activityCheck ? (
                <div>
                  <Typography
                    variant="h6"
                    className="leading-[45px] mb-0 !text-gray-900 mt-3"
                  >
                    Describe tu actividad fisica:
                  </Typography>
                  <Textarea
                    onChange={(e) =>
                      isValueValid(
                        e.target.value,
                        setActivityDescription,
                        "activityDescription"
                      )
                    }
                  />
                </div>
              ) : (
                <></>
              )}
              <div>
                <Typography
                  variant="h6"
                  className="leading-[45px] mb-0 !text-gray-900 mt-3"
                >
                  Describe tu objetivo de la dieta:
                </Typography>
                <Select
                  variant="static"
                  onChange={(e) => isValueValid(e, setObjective, "objective")}
                  name="objetivo"
                  error={inputErrors.objective}
                >
                  <Option value="perder peso">Perder peso</Option>
                  <Option value="mantener peso">Mantener mi peso</Option>
                  <Option value="ganar peso">Ganar peso</Option>
                  <Option value="tonificar musculos">Tonificar músculos</Option>
                  <Option value="mejorar salud general">
                    Mejorar mi salud general
                  </Option>
                  <Option value="aumentar masa muscular">
                    Aumentar masa muscular
                  </Option>
                  <Option value="controlar diabetes">
                    Controlar la diabetes
                  </Option>
                  <Option value="mejorar rendimiento deportivo">
                    Mejorar rendimiento deportivo
                  </Option>
                  <Option value="otra">Otra</Option>
                  {/* Agrega más opciones según sea necesario */}
                </Select>
              </div>
              {objective == "otra" ? (
                <div>
                  <Typography
                    variant="h6"
                    className="leading-[45px] mb-0 !text-gray-900 mt-3"
                  >
                    Describe tu objetivo de la dieta:
                  </Typography>
                  <Textarea
                    onChange={(e) =>
                      isValueValid(
                        e.target.value,
                        setObjective,
                        "objective"
                      )
                    }
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="w-full grid grid-cols-1 md:grid-cols-1 md:gap-8">
                <div>
                  <div className="w-full">
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-0 !text-gray-900 mt-3"
                    >
                      ¿Tienes Algún Padecimiento Médico?
                    </Typography>
                    <Radio
                      crossOrigin={undefined}
                      name="Disease"
                      label={'Si'}
                      onChange={() => {
                        setDiseases('');
                        setDiseaseCheck(true);
                      }}
                    />
                    <Radio
                      crossOrigin={undefined}
                      name="Disease"
                      label={'No'}
                      onChange={() => {
                        setDiseases('no tengo Ningún Padecimiento');
                        setDiseaseCheck(false)
                      }}
                      defaultChecked
                    />
                  </div>
                  {diseaseCheck ? (
                    <div>
                      <Typography
                        variant="h6"
                        className="leading-[45px] mb-0 !text-gray-900 mt-3"
                      >
                        Selecciona el tipo de padecimiento que presentas:
                      </Typography>
                      <div className="w-full flex justify-evenly flex-wrap">
                        <Checkbox
                          crossOrigin={undefined}
                          value="Tengo diabetes"
                          label="Diabetes"
                          onChange={e => handleCheckboxChange(e, setDiseases)}
                        />
                        <Checkbox
                          crossOrigin={undefined}
                          value="Tengo hipertensión"
                          label="Hipertensión"
                          onChange={e => handleCheckboxChange(e, setDiseases)}
                        />
                        <Checkbox
                          crossOrigin={undefined}
                          value="Tengo colesterol alto"
                          label="Colesterol alto"
                          onChange={e => handleCheckboxChange(e, setDiseases)}
                        />
                        <Checkbox
                          crossOrigin={undefined}
                          value="Tengo enfermedad cardíaca"
                          label="Engermedad cardiaca"
                          onChange={e => handleCheckboxChange(e, setDiseases)}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                </div>

              </div>
              <div className="w-full">
                <Typography
                  variant="h6"
                  className="leading-[45px] mb-0 !text-gray-900 mt-3"
                >
                  ¿Consumes algún medicamento?
                </Typography>
                <Radio
                  crossOrigin={undefined}
                  name="Medicine"
                  label={'Si'}
                  onChange={() => {
                    setMedicines('');
                    setMedicinesCheck(true);
                  }}
                />
                <Radio
                  crossOrigin={undefined}
                  name="Medicine"
                  label={'No'}
                  onChange={() => {
                    setMedicines('no estoy tomando ningún medicamento');
                    setMedicinesCheck(false);
                  }}
                  defaultChecked
                />
              </div>
              {medicinesCheck ? (
                <div>
                  <Typography
                    variant="h6"
                    className="leading-[45px] mb-0 !text-gray-900 mt-3"
                  >
                    Escribe a continuación cuales son los medicamentos que
                    consumes y bajo que fin:
                  </Typography>
                  <Textarea
                    onChange={(e) =>
                      isValueValid(
                        e.target.value,
                        setMedicines,
                        "medicines"
                      )
                    }
                  />
                </div>
              ) : (
                <></>
              )}

              <div className="w-full">
                <Typography
                  variant="h6"
                  className="leading-[45px] mb-0 !text-gray-900 mt-3"
                >
                  ¿Tienes alguna restricción alimentaria?
                </Typography>
                <Radio
                  crossOrigin={undefined}
                  name="Restrictions"
                  label={'Si'}
                  onChange={() => {
                    setRestrictions('');
                    setRestrictionsCheck(true)
                  }} />
                <Radio
                  crossOrigin={undefined}
                  name="Restrictions"
                  label={'No'}
                  onChange={() => {
                    setRestrictions('no tengo restricciones alimentarias');
                    setRestrictionsCheck(false)
                  }}
                  defaultChecked />
              </div>
              {
                restrictionsCheck
                  ? <div>
                    <Typography
                      variant="h6"
                      className="leading-[45px] mb-0 !text-gray-900 mt-3"
                    >
                      Restricciones alimenticias:
                    </Typography>

                    <div className="w-full flex justify-evenly flex-wrap">
                      <Checkbox
                        crossOrigin={undefined}
                        label="Gluten"
                        id="Gluten"
                        value="No puedo consumir gluten"
                        onChange={e => handleCheckboxChange(e, setRestrictions)}
                      />
                      <Checkbox
                        crossOrigin={undefined}
                        label="Lacteos"
                        id="Lacteos"
                        value="No puedo consumir Lacteos"
                        onChange={e => handleCheckboxChange(e, setRestrictions)}
                      />
                      <Checkbox
                        crossOrigin={undefined}
                        label="Frutos secos"
                        value="No puedo consumir frutos secos"
                        onChange={e => handleCheckboxChange(e, setRestrictions)}
                      />
                      <Checkbox
                        crossOrigin={undefined}
                        label="Mariscos"
                        value="No puedo consumir mariscos"
                        onChange={e => handleCheckboxChange(e, setRestrictions)}
                      />
                      <Checkbox
                        crossOrigin={undefined}
                        label="Carne"
                        value="No puedo consumir carne"
                        onChange={e => handleCheckboxChange(e, setRestrictions)}
                      />
                    </div>
                  </div>
                  : <></>
              }

            </form>
          </div>

          <Button
            color="gray"
            className="mb-3"
            size="sm"
            onClick={() => {
              handleGenereteDietClick();
            }}
          >
            <Typography variant="h5" className="text-center" color="white">
              Generar
            </Typography>
          </Button>

          <Button
            color="gray"
            className="mb-3 hidden"
            size="sm"
            onClick={() => {

              const prompt =
                `Hola, me llamo ${userData.name}. Tengo ${userData.age} años. Mi peso es de ${userData.weight} kg y mi altura es de ${userData.height} cm.

              Mi objetivo con esta dieta es ${userData.objective}. Mi nivel de actividad fisica es ${userData.physicalActivity}, dedicando aproximadamente ${userData.activityHours} horas semanales a la actividad física. Entre mis actividades se encuentran ${userData.activityDescription ? userData.activityDescription : 'ninguna en particular'}.
              
              En cuanto a mi salud, ${userData.diseases ? userData.diseases : 'No tengo ningnua enfermedad'} y de medicinas consumo: ${userData.medicines ? userData.medicines : 'no estoy tomando nigún medicamento'}. Es importante tener en cuenta que ${userData.restrictions ? userData.restrictions : 'no tengo restricciones alimentarias'}.
              
              ¿Puedes en base a mis datos generar un plan alimenticio con las siguientes comidas desayuno, media mañana, comida, merienda y cena? Por favor 3 opciones en cada comida, responde esto en un objeto json. ejemplo {desayuno: {opcion1:””, opcion2:””, opcion3: “”}, almuerzo: {opcion1:””, opcion2:””, opcion3: “”}, ...}`;
              console.log(userData);
              console.log(prompt);
            }}
          >
            <Typography variant="h5" className="text-center" color="white">
              Debuger
            </Typography>
          </Button>
          {loading ? (
            <>
              <Typography variant="h5" className="text-center" color="blue">
                Su plan alimenticio esta generandoce por favor espere, esto
                puede tardar unos minutos
              </Typography>
            </>
          ) : (
            <>
              {promptData ? (
                <>
                  <Typography
                    variant="h5"
                    className="text-center"
                    color="green"
                  >
                    Si desea almacenar su plan alimenticio generado para
                    consultarlo más tarde por favor
                  </Typography>
                  <div className="flex mt-10 p-10 w-full items-center content-center">
                    <Input
                      className=" mx-auto "
                      variant="static"
                      label="Nombre Plan Alimenticio"
                      placeholder=""
                      onChange={(e) =>
                        isInputValid(
                          e,
                          setDietName,
                          /^[a-zA-ZñÑÇçáéíóúÁÉÍÓÚüÜ ]{2,20}$/,
                          "name"
                        )
                      }
                      crossOrigin={undefined}
                      error={inputErrors.name}
                    />
                    <Button
                      color="gray"
                      className="mb-3"
                      size="sm"
                      onClick={() => {
                        handleClickGuardar();
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}

          {diet.desayuno.opcion1 != "" ? (
            <Typography variant="h3" className="text-center" color="blue-gray">
              Plan Alimenticio
            </Typography>
          ) : (
            <></>
          )}

          <DialogInfo
            dialogInfo={dialogInfo}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          />
        </>
      ) : (
        <></>
      )}
    </section>
  );
};

export default DataForm;
